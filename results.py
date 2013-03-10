def processResults(iterable, aucLots, auction_id=1):
	'''iterable = [(item, user, auction, lot)] sorted by <auction, user, item>'''
	'''aucLots = [array of all auctions]'''
	def checkLot(aux, lot):
		if (lot in aux):
			return 1
		else:
			return 0

	def addRes(row, aux, lots):
		auction, user, item = key
		lotres = [checkLot(aux, k) for k in lots]

		without_lot = {
						'auction_id': row['auction_id'],
						'agent_id': row['agent_id'],
						'item_id': row['item_id'],
						'img_url': row['img_url'],
						'item_name': row['item_name'],
						'lots': lotres
					}
		return without_lot

	results = []
	aux = []
	prev = None
	prevK = None
	for row in iterable:
		key = (row['auction_id'], row['agent_id'], row['item_id'])
		lot = row['lot_id']

		if prev is not None and key != prevK:
			results.append(addRes(prev, aux, aucLots))
			aux = []
			
		aux.append(lot)
		prev = row
		prevK = key

	if prev is not None and key == prevK:
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
# 		'item_id': 3, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 3},
# 		{'auction_id': 1, 
# 		'agent_id': 2, 
# 		'item_id': 1, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 2},
# 		{'auction_id': 1, 
# 		'agent_id': 2, 
# 		'item_id': 1, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 3},
# 		{'auction_id': 1, 
# 		'agent_id': 3, 
# 		'item_id': 1, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 3},{'auction_id': 1, 
# 		'agent_id': 3, 
# 		'item_id': 2, 
# 		'img_url': '11', 
# 		'item_name': "thing1", 
# 		'lot_id': 1}]

# print processResults(testvals, [1,2,3])
