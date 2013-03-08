def processResults(iterable, aucLots, auction_id=1):
	'''[(item, user, auction, lot)] sorted by <auction, user, item>'''
	# col_map = {0: 'item', 1: 'user', 2: 'auction', 3: 'lot'}
	# expected_lots = {0: 'lot0' 1: 'lot1', 2: 'lot2'}
	def checkLot(aux, lot):
		if (lot in aux):
			return 1
		else:
			return 0

	def addRes(row, aux, lots):
		auction, user, item = key
		lotres = [checkLot(aux, k) for k in lots]
		# (lotres.append(checkLot(aux, k)) for k in lots)
		without_lot = {
						'auction_id': row['auction_id'],
						'agent_id': row['agent_id'],
						'item_id': row['item_id'],
						'img_url': row['img_url'],
						'item_name': row['item_name'],
						'lots': lotres
					}
		# lot_dict = dict(("lot"+str(k), checkLot(aux[k], lots)) for k in lots)
		# without_lot.update(lot_dict)
		return without_lot

	results = []
	aux = []#set()
	prev = None
	for row in iterable:
		key = (row['auction_id'], row['agent_id'], row['item_id'])
		lot = row['lot_id']
		if prev is not None and key == prev:
			aux.append(lot)
		else:
			results.append(addRes(row, aux, aucLots))
			aux = []
		prev = key
	if prev is not None and prev != key:
		results.append(addRes(row, aux, aucLots))

	return results


# testvals = [{'auction_id': 1, 
# 		'agent_id': 1, 
# 		'item_id': 1, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 1},
# 		{'auction_id': 1, 
# 		'agent_id': 1, 
# 		'item_id': 1, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 2},
# 		{'auction_id': 1, 
# 		'agent_id': 1, 
# 		'item_id': 1, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 3}]
