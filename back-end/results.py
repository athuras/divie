# import db

# def processResults(iterable, auction_id=1):
# 	'''[(item, user, auction, lot)] sorted by <auction, user, item>'''
# 	# col_map = {0: 'item', 1: 'user', 2: 'auction', 3: 'lot'}
# 	# expected_lots = {0: 'lot0' 1: 'lot1', 2: 'lot2'}
# 	def checkLot(lot, lots):
# 		if (lot in lots):
# 			return 1
# 		else:
# 			return 0

# 	def addRes(row, aux, lots):
# 		auction, user, item = key
# 		without_lot {
# 						'auction_id': row['auction_id'],
# 						'agent_id': row['agent_id'],
# 						'item_id': row['item_id'],
# 						'img_url': row['img_url'],
# 						'item_name': row['item_name']
# 						'lots': lots
# 					}
# 		# lot_dict = dict(("lot"+str(k), checkLot(aux[k], lots)) for k in lots)
# 		# without_lot.update(lot_dict)
# 		return without_lot

# 	lots = db.get_lots(auction_id)
# 	results = []
# 	aux = set()
# 	prev = None
# 	for row in iterable:
# 		key = (row['auction_id'], row['agent_id'], row['item_id'])
# 		lot = row['lot_id']
# 		if prev is not None and key == prev:
# 			aux.add(lot)
# 		else:
# 			results.append(addRes(row, aux, lots))
# 		prev = key
# 	is prev is not None:
# 		results.append(addRes(row, aux, lots))

# 	return results

