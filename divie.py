import db
import os
import results
import prefs
from flask import Flask
from flask import json
from flask import redirect
from flask import request, Response
from flask import session, escape
from flask import url_for
import auctioneer as AUC
from collections import defaultdict


app = Flask(__name__)
app.secret_key = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'


def execute_auction(auction_id):
    '''Executes the Auction, writes results to the db'''
    def check_if_complete(auction_id):
        '''Checks if auction_status is not 2'''
        res = db.query_template("SELECT active from auction where auction_id = %s", (auction_id,))
        return res

    def get_agent_info(auction_id):
        '''Returns {agent_id: [(item_id, bid_value)]} for agents in auction_id'''
        res = db.query_template("SELECT item_id, agent_id, value from bid where auction_id = %(a_id)s", {'a_id': auction_id})
        master = defaultdict(lambda: [])
        for record in res:
            i_id, a_id, v = record
            master[a_id].append((i_id, v))
        return master

    def write_results(res):
        '''
        Transform the resolution table into group_id/result records for db.
        Then commite to db.
        '''
        def alloc_record_factory(item, agent, lot):
            return {'auction_id': auction_id, 'item_id': item,
                    'agent_id': agent, 'lot_id': lot}

        def perf_record_factory(perf, lot):
            return {'auction_id': auction_id, 'lot_id': lot,
                    'loss_mean': perf[0][0], 'loss_var': perf[0][1],
                    'full_mean': perf[1][0], 'full_var': perf[1][1],
                    'imba': perf[2]}

        master = []
        perf = []
        for i, results in enumerate(res):
            allocs, metrics = results[0], results[1]
            perf.append(perf_record_factory(metrics, i))
            for item, agent in allocs.iteritems():
                master.append(alloc_record_factory(item, agent, i))

        status1 = db.query_DelIns("INSERT INTO results (auction_id, item_id, agent_id, lot_id) " +
                                    "VALUES (%(auction_id)s, %(item_id)s, %(agent_id)s, %(lot_id)s)",
                                    master, many=True)
        status2 = db.query_DelIns("INSERT INTO performance (auction_id, lot_id, loss_mean, loss_var, full_mean, full_var, imba) " +
                                    "VALUES (%(auction_id)s, %(lot_id)s, %(loss_mean)s, %(loss_var)s, %(full_mean)s, %(full_var)s, %(imba)s)",
                                    perf, many=True)

        # get the motherfucking system preference
        # mean_loss, mean_full, var_loss, var_full, imba. all up in this bitch.
        ps = [(z, AUC.objective_function(i[0][0], i[1][0], i[0][1], i[1][1], i[2]))
                for z, i in enumerate(res)]
        pid = max(ps, key=lambda x: x[1])[0]

        db.query_DelIns("UPDATE auction SET active = 2, lot_num = %(lot_id)s WHERE auction_id = %(auction_id)s",
                {"auction_id": auction_id, "lot_id": pid})

        return status1, status2

    if check_if_complete(auction_id) == [(2,)]:
        return "AUCTION IS ALREADY COMPLETE"

    agents = [AUC.Agent(k, v) for k, v in get_agent_info(auction_id).iteritems()]
    Auction = AUC.Auction(auction_id, agents)
    resolution = Auction.multi_resolve()
    resolution = AUC.attempt_filter_imba(resolution)
    return write_results(resolution)

@app.route('/')
def home():
    return redirect(url_for('static', filename='login.html'))

@app.route('/static/login.html', methods=['POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('static', filename='myAuctions.html'))

@app.route('/logout')
def logout():
    session.pop('userID', None)
    return redirect(url_for('static', filename='login.html'))

@app.route('/requestAssets', methods=['POST'])
def getItems():
    # When auction is loaded request asset list
    if request.method == 'POST':
        data = db.get_itemsJSON(escape(session['username']));
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

@app.route('/requestAuctions', methods=['POST'])
def getAuctions():
    # When auction is loaded request asset list
    if request.method == 'POST':
        data = db.get_auctionsJSON(escape(session['username']));
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

@app.route('/submitBids', methods=['POST'])
def saveBids():
    # When user has completed rankings insert into database and return succesful
    if request.method == 'POST':
        res = request.json
        saveResult = db.save_Bids(res, escape(session['username']))
        return saveResult
    return "error2"

@app.route('/divieResults', methods=['POST'])
def divieResults():
    if request.method == 'POST':
        try:
            execute_auction(1)
        except Exception as e:
            return "Error: " + str(e)

    return "successful"

@app.route('/requestResults', methods=['POST'])
def popResults():
    if request.method == 'POST':
        res = db.get_resultsJSON(escape(session['username']),auction_id=1)
        lots = db.get_lots(auction_id=1)
        procRes = results.processResults(res, lots)
        js = json.dumps(procRes)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

@app.route('/resetAuction', methods=['POST'])
def resetAuction():
    if request.method == 'POST':
        res = db.reset_auction(auction_id=1)
        js = json.dumps(res)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

@app.route('/submitPackage', methods=['POST'])
def submitPack():
    if request.method == 'POST':
        js = request.json
        msg = db.save_package(js, auction_id=1)
        return msg

@app.route('/requestPrefs', methods=['POST'])
def requestPrefs():
    if request.method == 'POST':
        data = db.get_preferences(auction_id=1)
        lots = db.get_lots(auction_id=1)
        res = prefs.processPrefs(data, lots)
        js = json.dumps(res)
        resp = Response(js, status=200, mimetype='applicaiton/json')
        return resp

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
