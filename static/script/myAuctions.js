var AuctionList = [];
// AuctionList.push(new Auction(1, 1, 1, "Grandma's Belongings", "Splittin her shit up", "February 23, 2013", "March 15, 2013", 1));
// AuctionList.push(new Auction(1, 1, 1, "Uncle Ken's Shit Needs Divie", "Splittin her shit up", "April 23, 2013", "April 30, 2013", 0));

var Status = {
	Inactive : {value: 0, txt: "Inactive.", txtExec: "Inactive."},
	Active : {value: 1, txt: "Active now!", txtExec: "Active now!"},
	AllocComplete : {value: 2, txt: "View results!", txtExec: "Approve results!"},
	AuctionComplete : {value: 3, txt: "View you items!", txtExec: "View results!"}
};

// Auction Information:
// -- Status --
//	1 = Active
//	2 = (user -> Ranking Complete -> results page) or (exec -> Dashboard and able to allocate)
//	3 = (user -> Summary page) or (exec -> choose allocation)

//this loads auctions from server
function loaded()
{
	$.ajax({
		type: "POST",
		datatype: "json",
		url: 'http://divie.herokuapp.com/requestAuctions',
		async: false,
		success: function(data){ 
			$.each(data, function(k, v){
				AuctionList.push(
					new Auction(
						v.auction_id, 
						v.agent_id, 
						v.exec_id,
						v.auction_name,
						v.description,
						v.start_date,
						v.end_date,
						v.active
					)
				);
			});
		},
		error: function(){
			alert("failed to load auctions.")
		}
	})
};

function loadAuctions()
{
	var panel = document.getElementById("panel");
	for(var i=0;i<AuctionList.length;i++)
	{

		var newAuc = document.createElement("div");
		newAuc.setAttribute("class", "Auction")
		
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

		if (AuctionList[i].status == Status.Active.value)
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");

			var newStatusValue = document.createTextNode(Status.Active.txt);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", AuctionList[i].id);
		} 
		else if (AuctionList[i].status == Status.AllocComplete.value)
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");
			
			var newStatusValue = document.createTextNode(Status.AllocComplete.txt);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", AuctionList[i].id);
		}
		else if (AuctionList[i].status == Status.AuctionComplete.value)
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");
			
			var newStatusValue = document.createTextNode(Status.AuctionComplete.txt);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", AuctionList[i].id);
		}
		// else if (AuctionList[i].status == "resultsCompleted")
		// {
		// 	var newStatusValue = document.createTextNode(StatusText.resultsCompleted);
		// 	newStatusText.appendChild(newStatusValue);

		// 	newActive.appendChild(newStatusText);
		// }
		else if (AuctionList[i].status == Status.Inactive.value) {
			newAuc.setAttribute("id", "idle");
			newAuc.setAttribute("class", "Inactive")
		}

		panel.appendChild(newAuc);
	}

	bindRedirections();
};

function bindRedirections(){
	// wait for document to be loaded before binding click event
	$('.Auction').click(function()
	{
		var Auction = AuctionList[findArrLoc(event.target.id)];
		console.log(event.target.id);
		//var dest = $(".statusText").html();
		if(Auction.userId == Auction.execId) {
			window.location = 'http://divie.herokuapp.com/static/admin.html';
		} else {
			if (Auction.status == Status.Active.value)
				window.location = 'http://divie.herokuapp.com/static/auction.html';
			else if (Auction.status == Status.AllocComplete.value)
				window.location = 'http://divie.herokuapp.com/static/results.html';
			else if (Auction.status == Status.AuctionComplete.value)
				// Is this right or will there be another results page?
				window.location = 'http://divie.herokuapp.com/static/results.html';
		}
	})	
};

function Auction(id, userId, execId, name, desc, startDate, endDate, status){
	this.id = id;
	this.userId = userId;
	this.execId = execId;
	this.name = name;
	this.description = desc;
	this.startDate = Date(startDate);
	this.endDate = Date(endDate);
	this.status = status;
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
	return -1;
};


