import db
import os
from flask import Flask
from flask import json
from flask import redirect
from flask import request
from flask import Response
from flask import session
from flask import escape
from flask import url_for
import auctioneer as AUC
from collections import defaultdict


app = Flask(__name__)
app.secret_key = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'


def execute_auction(auction_id):
    '''Executes the Auction, writes results to the db'''
    def get_agent_info(auction_id):
        '''Returns {agent_id: [(item_id, bid_value)]} for agents in auction_id'''
        res = db.query_template("SELECT item_id, agent_id, value from bid where auction_id = %(a_id)s",
                                {'a_id': auction_id})
        master = defaultdict(lambda: [])
        for record in res:
            i_id, a_id, v = res
            master[a_id].append((i_id, v))
        return master

    def write_results(res):
        '''
        Transform the resolution table into group_id/result records for db.
        Then commite to db.
        '''
        # Results are in the form [[(item_id, user_id)]]
        def record_factory(item, agent, lot):
            return {'auction_id': auction_id, 'item_id': item,
                    'agent_id': agent, 'lot_id': lot}

        master = []
        for i, results in enumerate(res):
            for sub_record in results:
                item, agent = sub_record
                master.append(record_factory(item, agent, i))
        status = db.query_template("INSERT INTO results(auction_id, item_id, agent_id, lot_id) VALUES (%(auction_id)s, %(item_id)s, %(agent_id)s, %(lot_id)s)", master, many=True)
        return status

    agents = [AUC.Agent(k, v) for k, v in get_agent_info().iteritems()]
    Auction = AUC.Auction(auction_id, agents)
    resolution = AUC.unique_groups(i[0] for i in Auction.multi_resolve())
    return write_results(resolution)

@app.route('/')
def home():
    return "test"#redirect(url_for('static', filename='login.html'))

@app.route('/static/login.html', methods=['POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('static', filename='myAuctions.html'))

@app.route('/logout')
def logout():
    session.pop('userID', None)
    return redirect(url_for('static', filename='login.html'))

@app.route('/static/auction.html/requestAssets', methods=['POST'])
def getItems():
    # When auction is loaded request asset list
    if request.method == 'POST':# and request.headers['Content-Type'] == 'application/json':
        data = db.get_itemsJSON(escape(session['username']));
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

@app.route('/static/auction.html/submitBids', methods=['POST'])
def saveBids():
    # When user has completed rankings insert into database and return succesful
    if request.method == 'POST':
        res = json.dumps(request.json)
        # saveResult = db.save_Bids(res, escape(session['username']))
        return res
    return "error2"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
