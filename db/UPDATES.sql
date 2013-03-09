/*

Author: Brian Sinclair

Editted: Feb. 23, 2013

Description:
 - All db updates (ie add tables, or any changes to the db for that matter go here)
 - Pull and run this to update your local db

Change log:

*/

/*example agent/user inserts*/
INSERT INTO "agent" (agent_name)
	VALUES ('Scott Neil'), ('Riley Donelson'), ('Matt Chong'), ('Alex Huras');
	
/*example auction inserts*/
INSERT INTO "auction" (exec_id, auction_name, description, start_date, end_date)
	VALUES (1, 'Grandma''s Belongins', 'Good Stuff', 1361581200, 1362186000); /* 2013-02-23 01:00:00 to 2013-02-30 01:00:00*/

/*example relationship*/
INSERT INTO "relationship" (auction_id, agent_id)
	VALUES (1, 1),(1, 2),(1, 3),(1, 4),(1, 5);
	
/*status for if all bids are in*/
ALTER TABLE auction
	ADD COLUMN active integer DEFAULT 1;

/*status for if all bids are in*/
ALTER TABLE auction
	ADD COLUMN active integer DEFAULT 1;

/*if users rankings are complete status turns to 1. if users lot preference is complete status turns to 1*/
ALTER TABLE relationship
	ADD COLUMN rank_complete integer DEFAULT 0,
	ADD COLUMN lot_complete integer DEFAULT 0;

/*example item inserts*/
INSERT INTO "item" (item_name, description, img_url, item_value)
	VALUES ('Sailboat Painting', '' , 'sailboat.png', 0), 
		('Antique Lamp', '' , 'antique-lamp.jpg', 0), 
		('City Painting', '' , 'city-painting.jpg', 0),
		('Bike Painting', '' , 'bike-painting.jpg', 0),
		('Antique Clock', '' , 'antique-clock.jpg', 0),
		('Hand Wood Planer', '' , 'wood-planer.jpg', 0),
		('Cross-Country Skis', '' , 'xcountry-skis.jpg', 0),
		('Hunting Lodge', '' , 'hunting-lodge.jpg', 0),
		('Encyclopedia Britannica', '' , 'encyclopedia.jpg', 0),
		('Wood Stove', '' , 'wood-stove.jpg', 0),
		('Armoire', '' , 'armoire.jpg', 0),
		('Fur Coat', '' , 'fur-coat.jpg', 0),
		('Old Radio', '' , 'radio.jpg', 0),
		('Kitting Needles', '' , 'knitting.jpg', 0),
		('Typewriter', '' , 'typewriter.jpg', 0);

ALTER TABLE auction
	ADD COLUMN lot_num int DEFAULT NULL;