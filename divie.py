import os
import json
import psycopg2

from flask import Flask
from flask import request

app = Flask(__name__)
conn = None


def db_init():
    '''Connects to the PostgreSQL Database'''
    global conn
    params = {
            'host': "'ec2-54-243-232-179.compute-1.amazonaws.com'",
            'dbname': "'d708fal6ch74uk'",
            'user': "'qbilqsbasxktlu'",
            'password': "'vEiXaha5nBimvRAxbjRqygZeSE'",
            'port': "'5432'"
            }
    con_string = ' '.join(k + '+' + v for k, v in params.iteritems())
    conn = psycopg2.connect(con_string)


@app.route('/')
def home():
    if conn is None:
        return 'The database connection failed'
    else:
        return str(conn)


if __name__ == '__main__':
    db_init()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
