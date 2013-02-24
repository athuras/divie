import os
import psycopg2
import db
from flask import Flask, url_for, redirect, request, json, Response, jsonify, session, escape

app = Flask(__name__)
app.secret_key = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'

@app.route('/')
def home():
    return "test"#redirect(url_for('static', filename='login.html'))

@app.route('/static/login.html', methods=['POST'])
def login():
    if request.method == 'POST':
        # creates a new session for the user
        session['username'] = request.form['username']
        return redirect(url_for('static', filename='myAuctions.html'))

@app.route('/logout')
def logout():
    session.pop('userID', None)
    return redirect(url_for('static', filename='login.html'))

@app.route('/static/auction.html/requestAssets', methods=['POST'])
def getItems():
    # When auction is loaded request asset list
    if request.method == 'POST':
        data = db.get_itemsJSON(escape(session['username']));
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

@app.route('/static/auction.html/submitBids', methods=['POST'])
def saveBids():
    # When user has completed rankings insert into database and return succesful
    if request.method == 'POST':
        res = [{
            'id' : 1,
            'ranking': 0,
            'name': 'Sailboat Painting',
            'desc': 'this is a boat'
            'img': "img/sailboat.png"
        },{
            'id' : 2,
            'ranking': 10,
            'name': 'Car',
            'desc': 'this is a car'
            'img': "img/sailboat.png"
        },{
            'id' : 3,
            'ranking': 0,
            'name': 'Lamp',
            'desc': 'LAMPLAMPLAMPLAMP'
            'img': "img/sailboat.png"
        }]#request.json

        saveResult = db.save_Bids(res, escape(session['username']))
        return saveResult

    return "error2"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
