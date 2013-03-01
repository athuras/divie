/*

Author: Brian Sinclair

Editted: Feb. 23, 2013

Description:
Create DB schema

Change log:

*/


/*Current auctions, and their state information
*/
DROP TABLE if exists auction;
CREATE TABLE auction (
	auction_id SERIAL NOT NULL,
	exec_id INT NOT NULL,
	auction_name varchar NOT NULL,
	description varchar NOT NULL,
	start_date INT NOT NULL,
	end_date INT NOT NULL
);

/*
Current bids
*/
DROP TABLE if exists bid;
CREATE TABLE bid (
	bid_id SERIAL NOT NULL,
	auction_id INT NOT NULL,
	item_id INT NOT NULL,
	agent_id INT NOT NULL,
	value float NULL,
	bid_time INT NOT NULL
);

/*
Implies who is linked to each auction
*/
DROP TABLE if exists relationship;
CREATE TABLE relationship (
	auction_id INT NULL,
	agent_id INT NULL
);

/*
Agent (not user, which is a keyword), the people doing the bidding
*/
DROP TABLE if exists agent;
CREATE TABLE agent (
	agent_id SERIAL NOT NULL,
	agent_name varchar NOT NULL
);

/*
The items to be bid on
*/
DROP TABLE if exists item;
CREATE TABLE item (
	item_id SERIAL NOT NULL,
	item_name varchar NULL,
	description varchar NULL,
	img_url varchar NULL,
	item_value float DEFAULT 0.00
);

/*
results from optimization
*/
DROP TABLE if exists results;
CREATE TABLE results (
	auction_id INT NULL,
	item_id INT NULL,
	agent_id INT NULL,
	lot_id INT NULL
);