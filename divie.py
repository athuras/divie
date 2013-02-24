import os
import psycopg2
import db
from flask import Flask


app = Flask(__name__)

@app.route('/')
def home():
    return "Not Dead Yet ..." #db.home()

@app.route('/db_test')
def get_items():
    vals = db.get_items()
    return vals

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
