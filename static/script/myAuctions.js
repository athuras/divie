var AuctionList = [];
// AuctionList.push(new Auction(1, 1, 1,  "Grandma's Belongings", "Splittin her shit up", "February 23, 2013", "March 15, 2013", 3));
// AuctionList.push(new Auction(1, 1, 2, "Uncle Ken's Shit Needs Divie", "Splittin her shit up", "April 23, 2013", "April 30, 2013", 0));

var Status = {
	Inactive : {value: 0, txt: "Inactive.", txtExec: "Inactive."},
	Active : {value: 1, txt: "active now!", txtExec: "active now!"},
	AllocComplete : {value: 2, txt: "view results!", txtExec: "approve results!"},
	AuctionComplete : {value: 3, txt: "view your items!", txtExec: "complete!"}
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
		error: function(msg){
			console.log(msg)
			alert("failed to load auctions.")
		}
	})
};

function loadAuctions()
{
	loaded();

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
		var starting = AuctionList[i].startDate

		//var sdate = starting.substring(0,24);
		var newStartDateValue = document.createTextNode("Starts: " + starting);
		newStartDate.appendChild(newStartDateValue);

		var newEndDate = document.createElement("div");
		newEndDate.setAttribute("class", "date");
		newEndDate.setAttribute("id", "end");
		var newEndDateValue = document.createTextNode("Ends:  " + AuctionList[i].endDate);
		newEndDate.appendChild(newEndDateValue);

		newInfo.appendChild(newName);
		newInfo.appendChild(newStartDate);
		newInfo.appendChild(newEndDate);

		newAuc.appendChild(newInfo);

		if (AuctionList[i].status == Status.Active.value)
		{
			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");
			newActive.setAttribute("id", "active");

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
			newActive.setAttribute("id", "allocComplete");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");

			if(AuctionList[i].userId == AuctionList[i].execId)
				statLbl = Status.AllocComplete.txtExec;
			else
				statLbl = Status.AllocComplete.txt

			var newStatusValue = document.createTextNode(statLbl);
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
			newActive.setAttribute("id", "auctionComplete");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");

			if(AuctionList[i].userId == AuctionList[i].execId)
				statLbl = Status.AuctionComplete.txtExec;
			else
				statLbl = Status.AuctionComplete.txt

			var newStatusValue = document.createTextNode(statLbl);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			actInd = document.createElement("img");
			actInd.setAttribute("class", "activityIndicator");
			actInd.setAttribute("src", "img/chevron.png");

			newAuc.appendChild(newActive);
			newAuc.appendChild(actInd);
			newAuc.setAttribute("id", AuctionList[i].id);
		}
		else if (AuctionList[i].status == Status.Inactive.value) {

			var newActive = document.createElement("div");
			newActive.setAttribute("class", "statusBox");
			newActive.setAttribute("id", "inactive");

			var newStatusText = document.createElement("div");
			newStatusText.setAttribute("class", "statusText");

			if(AuctionList[i].userId == AuctionList[i].execId)
				statLbl = Status.Inactive.txtExec;
			else
				statLbl = Status.Inactive.txt

			var newStatusValue = document.createTextNode(statLbl);
			newStatusText.appendChild(newStatusValue);

			newActive.appendChild(newStatusText);

			newAuc.appendChild(newActive);
			newAuc.setAttribute("id", AuctionList[i].id);

			newAuc.setAttribute("id", "idle");
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
			if(Auction.status == Status.AllocComplete.value)
				window.location = 'http://divie.herokuapp.com/static/dashboard-final.html';
			else if (Auction.status == Status.Active.value)
				window.location = 'http://divie.herokuapp.com/static/dashboard.html';
			else if (Auction.status == Status.AuctionComplete.value)
				window.location = 'http://divie.herokuapp.com/static/dashboard.html';
		} else {
			if (Auction.status == Status.Active.value)
				window.location = 'http://divie.herokuapp.com/static/auction.html';
			else if (Auction.status == Status.AllocComplete.value)
				window.location = 'http://divie.herokuapp.com/static/results.html';
			else if (Auction.status == Status.AuctionComplete.value)
				window.location = 'http://divie.herokuapp.com/static/finalResults.html';
		}
	})
};

function Auction(id, userId, execId, name, desc, startDate, endDate, status){
	this.id = id;
	this.userId = userId;
	this.execId = execId;
	this.name = name;
	this.description = desc;
	this.startDate = Date(startDate).toString().substring(0, 15)
	this.endDate = Date(endDate).toString().substring(0, 15)
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
