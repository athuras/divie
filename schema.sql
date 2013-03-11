/* For example...*/

/*
Current auctions, and their state information
*/
DROP TABLE if exists auction;
CREATE TABLE auction (
	auction_id integer PRIMARY KEY AUTOINCREMENT,
	exec_id integer not null,
	name string not null,
	description string not null,
	start_date date,
	end_date date
)

/*
Current bids
*/
DROP TABLE if exists bid;
CREATE TABLE bid (
	bid_id integer primary,
	auction_id integer not null,
	item_id integer not null,
	agent_id integer not null,
	value float null,
	bid_time int not null
)

/*
Implies who is linked to each auction
*/
DROP TABLE if exists relationship;
CREATE TABLE relationship (
	auction_id integer null,
	agent_id integer null
)

/*
Agent (not user, which is a keyword), the people doing the bidding
*/
DROP TABLE if exists agent;
CREATE TABLE agent (
	agent_id integer PRIMARY KEY AUTOINCREMENT,
	name string not null,
	misc string null
)

/*
The items to be bid on
*/
DROP TABLE if exists item;
CREATE TABLE item (
	item_id integer PRIMARY KEY AUTOINCREMENT,
	name string null,
	description string null,
	img_url string null,
	value float 0
)

/*
Agent Preferences by Auction
*/
DROP TABLE if exists preference;
CREATE TABLE preference (
	auction_id integer not null,
	agent_id integer not null,
	lot_id integer not null
)

/*
Algorithm performance
*/
DROP TABLE if exists performance;
CREATE TABLE performance (
	auction_id integer not null
	lot_id integer not null,
	loss_mean float not null,
	loss_var float not null,
	full_mean float not null,
	full_var float not null,
	imba boolean not null
)

