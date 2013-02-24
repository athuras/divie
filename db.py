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

def get_itemsJSON():
    query = "SELECT * FROM item"#"SELECT item.item_id, item.name, item.description, item.img_url, ISNULL(bid.value, 0) FROM item LEFT JOIN bid ON item.item_id = bid.item_id WHERE bid.agent_id = " + userID + ";"
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
    vals = query_template(query)
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

# def save_Bids(results, userID):
#     # auction_id = 1

#     # for curResult in results:
#     #     if curResult.value != 0 #look for better way
#     #         query = "INSERT INTO bid VALUES ({0}, {1}, {2}, {3}, {4})".format(auction_id, curResult.item_id, userID, curResult.value, 1)
#     #         vals = query_template(query)

#     #figure out what to do here
#     return "successful"
