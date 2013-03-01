'''

Author: Brian Sinclair

Editted: Feb. 23, 2013

Description:
Connects to DB

Change log:

Version: Python 2.7


'''

import os
import psycopg2


def connect_db():
    conn = psycopg2.connect(**{
            'host': 'ec2-54-243-232-179.compute-1.amazonaws.com',
            'database': 'd708fal6ch74uk',
            'user': 'qbilqsbasxktlu',
            'password': 'vEiXaha5nBimvRAxbjRqygZeSE',
            'port': 5432
            })
    return conn


def home():
    return "Not Dead Yet ..."

def db_test():
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("DROP TABLE if exists test;")
        cur.execute("CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")
        cur.execute("INSERT INTO test (num, data) VALUES (%s, %s);", (31415, 'THISISATEST'))
        cur.execute("SELECT * FROM test;")
        vals = cur.fetchall()
        conn.commit()
    except psycopg2.Error as e:
        return 'DB Error: ' + str(e)

    finally:
        cur.close()
        conn.close()
    return 'SUCCESS!:\n' + str(vals)

def query_template(query, args=()):
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, args)
        vals = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in cur.fetchall()]
        conn.commit()
    except psycopg2.Error as e:
        return 'DB Error: ' + str(e)

    finally:
        cur.close()
        conn.close()
    return vals

def get_itemsJSON(userID):
    query = "SELECT item.item_id, item.item_name, item.description, item.img_url, coalesce(bid.value, 0)" \
        " as value FROM item LEFT JOIN bid ON item.item_id = bid.item_id AND bid.agent_id = " + userID + ";"
    vals = query_template(query)
    return vals

def get_items(): #gets item list, description, image url and value
    query = "SELECT * FROM item;"
    vals = query_template(query)
    return str(vals)

def get_auctionJSON():
    query = "SELECT * FROM auction;"
    vals = query_template(query)
    return vals

def get_auction(): #gets executor, auction name and start and end date
    query = "SELECT * FROM auction;"
    vals = query_template(query)
    return str(vals)

def get_usersJSON(): #gets users for given auction & their id for use to decide if executor
    query = "SELECT * FROM agent;"
    vals = query_template(query)
    return vals

def get_users(): #gets users for given auction & their id for use to decide if executor
    query = "SELECT * FROM agent;"
    vals = query_template(query)
    return str(vals)

def get_bidJSON(username):
    auction_id = 1
    query = "SELECT * FROM item WHERE auction_id = " + auction_id + "AND agent_id = " + username + ";"
    vals = to_dict(query_template(query))
    return vals

def get_bid():
    auction_id = 1
    query = "SELECT * FROM item WHERE auction_id = " + auction_id + ";"
    vals = query_template(query)
    return str(vals)

def user_auc_rel(): #find which users are associated with the current auction
    auction_id = 1
    query = "SELECT agent_id FROM item WHERE auction_id = " + auction_id + ";"
    vals = query_template(query)
    return str(vals)

def save_Bids(results, userID):
    auction_id = 1

    for curResult in results:
        return curResult
        # if int(curResult['rank']) != 0: #look for better way
        #     try:
        #         query = "INSERT INTO bid VALUES (%(aucID)s, %(itemID)s, %(uID)s, %(bidVal)s, %(dTime)s);" % \
        #             {"aucID": auction_id, "itemID": int(curResult['id']), "uID": userID, \
        #             "bidVal": int(curResult['rank']), "dTime": 1}
        #         vals = query_template(query)
        #     except psycopg2.Error:
        #         return vals;
    else:
        return "successful"

    #figure out what to do here
    return "successful"
