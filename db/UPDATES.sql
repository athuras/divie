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
		('Antique Lamp', '' , 'antique-lamp.png', 0), 
		('Bike Painting', '' , 'bike-painting.png', 0),
		('Antique Clock', '' , 'antique-clock.png', 0),
		('Hand Wood Planer', '' , 'wood-planer.png', 0),
		('Cross-Country Skis', '' , 'xcountry-skis.png', 0),
		('Encyclopedia Britannica', '' , 'encyclopedia.png', 0),
		('Wood Stove', '' , 'wood-stove.png', 0),
		('Armoire', '' , 'armoire.png', 0),
		('Retro Radio', '' , 'radio.png', 0),
		('Kitting Needles', '' , 'knitting.png', 0),
		('Typewriter', '' , 'typewriter.png', 0),
		('Hand Carved Pipe', '' , 'pipe.png', 0),
		('Pyramid Painting', '' , 'pyramid-painting.png', 0),
		('Grandma''s Quilt', '' , 'quilt.png', 0),
		('CN-Tower Painting', '' , 'toronto-painting.png', 0),
		('Graffiti Print', '' , 'graffiti-print.png', 0);

ALTER TABLE auction
	ADD COLUMN lot_num int DEFAULT NULL;