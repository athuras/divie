import os
import psycopg2
import db
from flask import Flask, url_for, redirect, request, json, Response, jsonify, session, escape

app = Flask(__name__)
app.secret_key = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'

@app.route('/')
def home():
    return redirect(url_for('static', filename='login.html'))

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

@app.route('/submitBids', methods=['POST'])
def auction():
    # When user has completed rankings insert into database and return succesful
    if request.method == 'POST':
        result = response.data
        saveResult = db.save_Bids(result, escape(session['username']))
        # #TODO: Insert into BIds table
        # #TODO: redirect to myAuctions page if successful
        if saveResult == "successful"
            return "success"#redirect(url_for('static', filename='myAuctions.html'))
        else 
            return "ERROR"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
