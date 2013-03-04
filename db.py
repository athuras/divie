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

#--------------------
# DATABASE 
#--------------------

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

def to_dict(vals):
    retVals = [dict((cur.description[i][0], value) for i, value in enumerate(row)) for row in vals]
    return retVals

# def initConnection():
#     conn = connect_db()
#     cur = conn.cursor()

#     return conn, cur

# def closeConnection(conn, cur)
#     curr.close()
#     conn.close()

def query_DelIns(query, args={}):
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, args)
        conn.commit()
    except psycopg2.Error as e:
        return 'DB Error: ' + str(e)

    finally:
        cur.close()
        conn.close()
    return "Successful query"

def query_template(query, args={}):
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, args)
        vals = cur.fetchall()
        conn.commit()
    except psycopg2.Error as e:
        return 'DB Error: ' + str(e)

    finally:
        cur.close()
        conn.close()
    return vals

def query_template_dict(query, args={}):
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

#--------------------
# SELECT QUERIES
#--------------------

def get_itemsJSON(userID):
    query = ("SELECT item.item_id, item.item_name, item.description, item.img_url, coalesce(bid.value, 0)" +
        " as value FROM item LEFT JOIN bid ON item.item_id = bid.item_id AND bid.agent_id = %(userID)s;")
    data = {"userID": userID}
    vals = query_template_dict(query, data)
    return vals

def get_items(): #gets item list, description, image url and value
    query = "SELECT * FROM item;"
    vals = query_template(query)
    return str(vals)

def get_auctionsJSON(userID):
    query = "SELECT *, %(uID)s as agent_id FROM auction;" % {"uID": userID}
    vals = query_template_dict(query)
    return vals

def get_auctions(): #gets executor, auction name, start date, end date, status
    query = "SELECT * FROM auction;"
    vals = query_template(query)
    return str(vals)

def get_usersJSON(): #gets users for given auction & their id for use to decide if executor
    query = "SELECT * FROM agent;"
    vals = query_template_dict(query)
    return vals

def get_users(): #gets users for given auction & their id for use to decide if executor
    query = "SELECT * FROM agent;"
    vals = query_template(query)
    return str(vals)

def get_bidJSON(userID, auction_id=1):
    query = "SELECT * FROM bid WHERE agent_id = %(uID)s AND auction_id = %(aucID)s;"
    data =  {
                "uID": int(userID),
                "aucID": int(auction_id)
            }
    vals = query_template_dict(query, data)
    return vals

def get_bid(auction_id=1):
    query = "SELECT * FROM bid WHERE auction_id = %(aucID)s;"
    data =  {
                "aucID": int(auction_id)
            }
    vals = query_template(query, data)
    return str(vals)

def user_auc_rel(auction_id=1): #find which users are associated with the current auction
    query = ("SELECT agent_id FROM item WHERE auction_id = %(aucID)s;" %
            {
                "aucID": int(auction_id)
            })
    vals = query_template(query)
    return str(vals)

def get_resultsJSON(userID, auction_id=1):
    query = ("SELECT * FROM results WHERE agent_id = %(uID)s AND auction_id = %(aucID)s;")
    data =  {
                "uID": int(userID),
                "aucID": int(auction_id)
            }
    vals = query_template_dict(query, data)
    return vals

def get_results(userID, auction_id=1):
    query = ("SELECT * FROM results WHERE agent_id = %(uID)s AND auction_id = %(aucID)s;")
    data =  {
                "uID": int(userID),
                "aucID": int(auction_id)
            }
    vals = query_template(query, data)

    return vals

#--------------------
# SAVING QUERIES
#--------------------

def save_Bids(bids, userID, auction_id=1):
    # Clear bids for user and auction
    query = "DELETE FROM bid WHERE agent_id = %(uID)s AND auction_id = %(aucID)s;"
    data =  {
                "uID": int(userID),
                "aucID": int(auction_id)
            }
    msg1 = query_DelIns(query, data)

    for curBid in bids:
        if int(curBid['rank']) != 0:
            query = ("INSERT INTO bid (auction_id, item_id, agent_id, value, bid_time) " + 
                "VALUES (%(aucID)s, %(itemID)s, %(uID)s, %(bidVal)s, %(dTime)s);")
            data = {
                        "aucID": auction_id, 
                        "itemID": int(curBid['id']), 
                        "uID": userID, 
                        "bidVal": int(curBid['rank']), 
                        "dTime": 1
                    }
            msg2 = query_DelIns(query, data)

    # Update user-Auction Relationship table
    query = "UPDATE relationship SET rank_complete = 1 WHERE agent_id = %(uID)s AND auction_id = %(aucID)s;"
    data =  {
                "uID": int(userID),
                "aucID": int(auction_id)
            }
    msg3 = query_DelIns(query, data)

    return "Delete: " + msg1 + " || Insert: " + msg2 + " || Relationship: " + msg3

def reload_bids(auction_id=1):
    query = ("TRUNCATE TABLE bid RESTART IDENTITY CASCADE;" +
             "INSERT INTO bid (auction_id, item_id, agent_id, value, bid_time)" +
                "SELECT auction_id, item_id, agent_id, value, bid_time" +
                "FROM bid_base " +
                "WHERE auction_id = %(aucID)s;" % {"aucID": auction_id})
    query_template(query)

def save_results(results, userID, auction_id=1):
    for r in results:
        query = ("INSERT INTO results (auction_id, item_id, agent_id, lot_id) " + 
                 "VALUES (%(aucID)s, %(itemID)s, %(uID)s, %(lot)s);" % 
                    {"aucID": auction_id, 
                     "itemID": r['id'], 
                     "uID": userID,
                     "lot": r['lot']})
        query_template(query)
    return "Inserted"

def clear_results(auction=1):
    query = ("TRUNCATE TABLE results;")
    query_template(query)
