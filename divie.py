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
    vals = db.db_test()
    return vals

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
