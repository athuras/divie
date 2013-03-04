import db

class results:
	def __init__(self, itemID):
		self.itemID = itemID

def processResults(userID):
	results = db.get_resultsJSON(userID)

	for result in Results:
		# iterate over all items returned from result query