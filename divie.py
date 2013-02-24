import os
import psycopg2
import db
from flask import Flask, url_for, redirect, request, json, Response, jsonify


app = Flask(__name__)

@app.route('/')
def home():
    return "Not Dead Yet ..." #db.home()

@app.route('/db_test')
def get_items():
    vals = db.get_items()
    return vals

@app.route('/requesttest')
def requests():
    data = db.get_itemsJSON()
    js = json.dumps(data)
    resp = Response(js, status=200, mimetype='application/json')
    return resp

@app.route('/static/auction.html', methods=['POST'])
def auction():
    if request.method == 'POST':
        data = db.get_itemsJSON();
        # data = [{
        #     'id' : 1,
        #     'ranking': 0,
        #     'name': 'Sailboat Painting',
        #     'desc': 'this is a boat'
        # },{
        #     'id' : 2,
        #     'ranking': 10,
        #     'name': 'Car',
        #     'desc': 'this is a car'
        # },{
        #     'id' : 3,
        #     'ranking': 0,
        #     'name': 'Lamp',
        #     'desc': 'LAMPLAMPLAMPLAMP'
        # }]
        js = json.dumps(data)

        resp = Response(js, status=200, mimetype='application/json')
        return resp

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
