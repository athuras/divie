import os
import psycopg2
import db
from flask import Flask


app = Flask(__name__)
'''
def connect_db():
    conn = psycopg2.connect(**{
            'host': 'ec2-54-243-232-179.compute-1.amazonaws.com',
            'database': 'd708fal6ch74uk',
            'user': 'qbilqsbasxktlu',
            'password': 'vEiXaha5nBimvRAxbjRqygZeSE',
            'port': 5432
            })
    return conn
'''
@app.route('/')
def home():
    return "Not Dead Yet ..." #db.home()

@app.route('/db_test')
def get_items():
    #query = "SELECT * FROM item;"
    vals = db.get_items()
    return vals

@app.route('/static/auction.html', methods=['POST'])
def auction():
    if request.method == 'POST':
        data = [{
            'id' : 1,
            'ranking': 0,
            'name': 'Sailboat Painting',
            'desc': 'this is a boat'
        },{
            'id' : 2,
            'ranking': 10,
            'name': 'Car',
            'desc': 'this is a car'
        },{
            'id' : 3,
            'ranking': 0,
            'name': 'Lamp',
            'desc': 'LAMPLAMPLAMPLAMP'
        }]
        js = json.dumps(data)

        resp = Response(js, status=200, mimetype='application/json')
        return resp

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
