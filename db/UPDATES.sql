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
	
/*example item inserts*/
INSERT INTO "item" (item_name, description, img_url, item_value)
	VALUES ('Painting', 'Beautiful Sailboat' , 'here', 0), ('Antique Lamp', 'Magic Lamp' , 'here', 100), ('Family Portrait', 'the fam jam' , 'here', 0);