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
		('Encyclopedia', '' , 'encyclopedia.png', 0),
		('Wood Stove', '' , 'wood-stove.png', 0),
		('Armoire', '' , 'armoire.png', 0),
		('Retro Radio', '' , 'radio.png', 0),
		('Knitting Needles', '' , 'knitting.png', 0),
		('Typewriter', '' , 'typewriter.png', 0),
		('Hand Carved Pipe', '' , 'pipe.png', 0),
		('Pyramid Painting', '' , 'pyramid-painting.png', 0),
		('Grandma''s Quilt', '' , 'quilt.png', 0),
		('CN-Tower Painting', '' , 'toronto-painting.png', 0),
		('Graffiti Print', '' , 'graffiti-print.png', 0);

ALTER TABLE auction
	ADD COLUMN lot_num int DEFAULT NULL;

ALTER TABLE item ALTER COLUMN description TYPE text;

UPDATE item SET description = 'Grandma''s painting of the sailboat up at the family cottage from Sara''s bedroom.' WHERE item_name = 'Sailboat Painting';
UPDATE item SET description = 'The old typewriter from the study.' WHERE item_name = 'Typewriter';
UPDATE item SET description = 'The Encyclopedia Britannica in the study.' WHERE item_name = 'Encyclopedia';
UPDATE item SET description = 'Grandma''s painting of her favourite bike from childhood.' WHERE item_name = 'Bike Painting';
UPDATE item SET description = 'The cross-country skis from the garage that haven''t been used in years.' WHERE item_name = 'Cross-Country Skis';
UPDATE item SET description = 'The pipe Grandma carved when she was traveling around South America in the 60''s.' WHERE item_name = 'Hand Carved Pipe';
UPDATE item SET description = 'Grandma''s painting from Steven''s room that she painted after her trip to Egypt.' WHERE item_name = 'Pyramid Painting';
UPDATE item SET description = 'Grandma''s beloved knitting needles. Many a sweater was made with these.' WHERE item_name = 'Knitting Needles';
UPDATE item SET description = 'Grandma''s favourite hand planer. The dining room table and kitchen cabinets where made using this planer.' WHERE item_name = 'Hand Wood Planer';
UPDATE item SET description = 'The painting Grandma made of the Toronto skyline. This painting is from Sue''s bedroom and reminds us of the love she had for the city.' WHERE item_name = 'CN-Tower Painting';
UPDATE item SET description = 'The wood-stove from the log cabin. A great source of heat and a good thing for someone living in a cold climate.' WHERE item_name = 'Wood Stove';
UPDATE item SET description = 'A big, great antique from the main entrance of Grandma''s house. A little worse for wear but still great for coat storage.' WHERE item_name = 'Armoire';
UPDATE item SET description = 'The quilt Grandma had in her living room. Made to keep even the coldest people warm on a cold winter day.' WHERE item_name = 'Grandma''s Quilt';
UPDATE item SET description = 'Something Grandma only became interested in during her later years. A very interesting graffiti print by the artist Banksy.' WHERE item_name = 'Graffiti Print';
UPDATE item SET description = 'Grandma''s antique lamp with a lot of character. Something she had beside her chair in the living room that she used to knit beside.' WHERE item_name = 'Antique Lamp';
UPDATE item SET description = 'The antique clock Grandma had in her kitchen.' WHERE item_name = 'Antique Clock';
UPDATE item SET description = 'Grandma''s radio from when she was a kid. Not sure if it still works anymore, but an antique piece nonetheless.' WHERE item_name = 'Retro Radio';

INSERT INTO "agent" (agent_name, profile)
	VALUES ('Sara Miller', 'woman.png'), ('Jon Miller', 'men.png'), ('Steven Miller', 'men.png'), ('Joseph Miller', 'men.png'), ('Sue Miller', 'woman,png'), ('Executor', 'crown.png');

UPDATE item SET item_name = 'Encyclopedia' WHERE item_name = 'Encyclopedia Britannica';