var AuctionList = [];
AuctionList.push(new Auction(1, 1, "Grandma's Belongings", "Splittin her shit up", "February 23, 2013", "March 2, 2013"));
AuctionList.push(new Auction(1, 1, "Uncle Ken's Shit Needs Divie", "Splittin her shit up", "April 23, 2013", "April 30, 2013"));


function loaded(){
	// wait for document to be loaded before binding click event
	$('#gAuction').click(function()
	{
		window.location = 'http://divie.herokuapp.com/static/auction.html'
	})	
};

function loadAuctions()
{
	var panel = document.getElementById("panel");
	for(var i=0;i<AuctionList.length;i++)
	{

		var newAuc = document.createElement("div");
		newAuc.setAttribute("class", "row")
		
			var newInfo = document.createElement("div");
			newInfo.setAttribute("class", "info");

				var newName = document.createElement("div");
				newName.setAttribute("class", "auctName");
				var newNameValue = document.createTextNode(AuctionList[i].name);
				newName.appendChild(newNameValue);

				var newStartDate = document.createElement("div");
				newStartDate.setAttribute("class", "date");
				newStartDate.setAttribute("id", "start");
				var newStartDateValue = document.createTextNode("Starts: " + AuctionList[i].startDate);
				newStartDate.appendChild(newStartDateValue);

				var newEndDate = document.createElement("div");
				newEndDate.setAttribute("class", "date");
				newEndDate.setAttribute("id", "end");
				var newEndDateValue = document.createTextNode("Ends: " + AuctionList[i].endDate);
				newEndDate.appendChild(newEndDateValue);
			

			newInfo.appendChild(newName);
			newInfo.appendChild(newStartDate);
			newInfo.appendChild(newEndDate);

		newAuc.appendChild(newInfo);

		if (AuctionList[i].active)
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");
			var newStatusValue = document.createTextNode("active now!");
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", "gAuction");
		} 
		else
		{
			newAuc.setAttribute("id", "idle");
		}



		panel.appendChild(newAuc);

	}
};

function Auction(id, execId, name, desc, startDate, endDate){
	this.id = id;
	this.execId = execId;
	this.name = name;
	this.description = desc;
	this.startDate = startDate;
	this.endDate = endDate;
	var date = new Date();	
	var sDate = Date.parse(startDate);
	var eDate = Date.parse(endDate);
	var cDate = Date.parse(date);
	if ((cDate <= eDate && cDate >= sDate))
	{
		this.active = true;
	}
	else
	{
		this.active = false;
	}
};

function findArrLoc(idTag)
{
	for(var i=0; i<AuctionList.length;i++)
	{
		if (AuctionList[i].id == idTag)
		{
			return i;
		}
	}
};


