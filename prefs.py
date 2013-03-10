def processPrefs(prefs, aucLots):
	'''iterable = [(item, user, auction, lot)] sorted by <auction, user, item>'''
	'''aucLots = [array of all auctions]'''
	def checkLot(aux, lot):
		if (lot[0] in aux):
			return 1
		else:
			return 0

	def addRes(row, aux, lots):
		prefs = [checkLot(aux, k) for k in lots]

		without_lot = {
						'agent_id': row['agent_id'],
						'agent_name': row['agent_name'],
						'profile': row['profile'],
						'prefs': prefs
					}
		return without_lot

	res = []
	aux = []
	prev = None
	prevK = None
	for row in prefs:
		key = row['agent_id']
		lot = row['lot_id']

		if prev is not None and key != prevK:
			res.append(addRes(prev, aux, aucLots))
			aux = []
		
		print key
		print aux
		aux.append(lot)
		prev = row
		prevK = key

	if prev is not None and key == prevK:
		res.append(addRes(row, aux, aucLots))

	return res


# testvals = [{'agent_id': 1, 
# 		'agent_name': 'R', 
# 		'profile': '11', 
# 		'lot_id': 0},
# 		{'agent_id': 1, 
# 		'agent_name': 'R', 
# 		'profile': '11', 
# 		'lot_id': 1},
# 		{'agent_id': 1, 
# 		'agent_name': 'R', 
# 		'profile': '11', 
# 		'lot_id': 2}]
		

# print processPrefs(testvals, ((0,),(1,),(2,)))