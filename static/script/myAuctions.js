var AuctionList = [];
AuctionList.push(new Auction(1, 1, "Grandma's Belongings", "Splittin her shit up", "February 23, 2013", "March 15, 2013", "resultsCompleted"));
AuctionList.push(new Auction(1, 1, "Uncle Ken's Shit Needs Divie", "Splittin her shit up", "April 23, 2013", "April 30, 2013"));

var StatusText = {
	auctionCompleted: "view your items!",
	resultsCompleted: "view results!",
	active: "active now!",
	adminCompleted: "approve results!"
}

function loaded(){
	// wait for document to be loaded before binding click event
	$('#gAuction').click(function()
	{
		var dest = $(".statusText").html();
		if (dest == StatusText.active)
			window.location = 'http://divie.herokuapp.com/static/auction.html';
		else if (dest == StatusText.auctionCompleted)
			window.location = 'http://divie.herokuapp.com/static/results.html';
		else if (dest == StatusText.resultsCompleted)
			window.location = 'http://divie.herokuapp.com/static/results.html';
		else if (dest == StatusText.adminCompleted)
			window.location = 'http://divie.herokuapp.com/static/admin.html';
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

		if (AuctionList[i].status == "active")
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");
			var newStatusValue = document.createTextNode(StatusText.active);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", "gAuction");
		} 
		else if (AuctionList[i].status == "auctionCompleted")
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");
			var newStatusValue = document.createTextNode(StatusText.auctionCompleted);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", "gAuction");
		}
		else if (AuctionList[i].status == "adminCompleted")
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");
			var newStatusValue = document.createTextNode(StatusText.adminCompleted);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", "gAuction");
		}
		else if (AuctionList[i].status == "resultsCompleted")
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");
			var newStatusValue = document.createTextNode(StatusText.resultsCompleted);
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
			newAuc.setAttribute("id", "idle");



		panel.appendChild(newAuc);

	}
};

function Auction(id, execId, name, desc, startDate, endDate, status){
	this.id = id;
	this.execId = execId;
	this.name = name;
	this.description = desc;
	this.startDate = startDate;
	this.endDate = endDate;
	this.status = status;
	// var date = new Date();	
	// var sDate = Date.parse(startDate);
	// var eDate = Date.parse(endDate);
	// var cDate = Date.parse(date);
	// if ((cDate <= eDate && cDate >= sDate))
	// {
	// 	this.status = "active";
	// }
	// else
	// {
	// 	this.status = "inactive";
	// }
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


