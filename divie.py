import os
import psycopg2
import db
from flask import Flask, url_for, redirect, request, json, Response, jsonify, session, escape

app = Flask(__name__)
app.secret_key = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'

@app.route('/')
def home():
    return "Not Dead Yet ..." #db.home()

@app.route('/static/login.html', methods=['POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('static', filename='myAuctions.html'))

@app.route('/db_test')
def get_items():
    vals = db.get_items()
    return vals

@app.route('/static/auction.html/request', methods=['GET'])
def getItems():
    # When auction is loaded request asset list
    if request.method == 'GET' and request.headers['Content-Type'] == 'application/json':
        data = db.get_itemsJSON();
        js = json.dumps(data)
        resp = Response(js, status=200, mimetype='application/json')
        return resp

@app.route('/static/auction.html', methods=['POST'])
def auction():
    # When auction is loaded request asset list
    # if request.method == 'GET' and request.headers['Content-Type'] == 'application/json':
    #     data = db.get_itemsJSON();
    #     js = json.dumps(data)
    #     resp = Response(js, status=200, mimetype='application/json')
    #     return resp
    # When user has completed rankings insert into database and return succesful
    if request.method == 'POST':
        return request

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
