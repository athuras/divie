UserResults = [];
// UserResults.push(new UserResult(1, "Riley Donelson", "img/riley.jpg", [1,0,1]));
// UserResults.push(new UserResult(2, "Matthew Chong", "img/matt.jpg", [1,1,1]));
// UserResults.push(new UserResult(3, "Brian Sinclair", "img/brian.jpg", [1,0,0]));
// UserResults.push(new UserResult(4, "Scott Neil", "img/scott.jpg", [0,0,1]));
// UserResults.push(new UserResult(5, "Alex Huras", "img/alex.jpg", [1,1,0]));

var PREFERRED_DIVISION = -1;
var NUM_OF_LOTS = 0;
var sumOfLots = [];

var lotList = [];
	
function loaded()
{
	$.ajax({
		type: "POST",
		datatype: "json",
		url: 'http://divie.herokuapp.com/requestPrefs',
		async: false,
		success: function(data){ 
			$.each(data, function(k, v){
				UserResults.push(
					new UserResult(
						v.agent_id, 
						v.agent_name, 
						v.profile,
						v.prefs
					)
				);
			});
		},
		error: function(){
			alert("failed to load preferences.")
		}
	})
};

function diviePreference()
{
	$.ajax({
		type: "POST",
		datatype: "text",
		url: 'http://divie.herokuapp.com/requestDiviePref',
		async: false,
		success: function(data){
			console.log(data);
			PREFERRED_DIVISION = parseInt(data[0])+1; // auctions are 0-based, but front isn't
		},
		error: function(){
			alert("failed to load divie preference.")
		}
	})
};

$(document).ready(function(){
	$('.finalizeBtn').click(function(){
		$.ajax({
			type: "POST",
			datatype: "text",
			contentType: "application/json",
			url: 'http://divie.herokuapp.com/submitPackage',
			data: JSON.stringify(lotList),
			async: false,
			success: function(data){
				window.location = "http://divie.herokuapp.com/static/myAuctions.html";
			},
			error: function(msg){
				alert("failed to submit package. " + msg);
				console.log(msg);
			}
		})
	})
});

function getNumOfLots() {
	if (UserResults.length == 0)
		NUM_OF_LOTS = 0;
	else
		NUM_OF_LOTS = UserResults[0].results.length;
	for (var i = 0; i < NUM_OF_LOTS; i++) {
		lotList.push(false);
		sumOfLots.push(0);
	};
};

function UserResult(userId, name, img, result)
{
	this.id = userId;
	this.name = name;
	this.img = 'img/' + img;
	this.results = result;
};

function loadHeader()
{
	loaded();
	diviePreference()
	getNumOfLots();

	var head = document.getElementById("head");

	for (var i = 0; i < (NUM_OF_LOTS + 2) ; i++) {
		var newTh = document.createElement("th");
		if (i != 0 && i != 1)
		{	
			//		newTh.setAttribute("id", (i-1));
			var newThValue = document.createTextNode("Division " + (i-1));

			newTh.appendChild(newThValue);
		}
		head.appendChild(newTh);
	};	

	var width = 227;
	var widthOfImg = 100;
	$(".diviePref").css("right",((width * (NUM_OF_LOTS - PREFERRED_DIVISION)) + (width/2)) - widthOfImg + "px");

	loadResults();	

};

function loadResults()
{

	var body = document.getElementById("body");

	for (var i = 0; i < UserResults.length; i++) {
		var newAssetRow = document.createElement("tr");
		newAssetRow.setAttribute("class", "assetRow");

		var newProfilePic = document.createElement("td");
		newProfilePic.setAttribute("class", "actor");
		var newImg = document.createElement("img");
		newImg.setAttribute("class", "pic");
		newImg.setAttribute("src", UserResults[i].img);
		newProfilePic.appendChild(newImg);

		var newActor = document.createElement("td");
		newActor.setAttribute("class", "actor");
		var newActorName = document.createTextNode(UserResults[i].name);
		newActor.appendChild(newActorName);

		newAssetRow.appendChild(newProfilePic);
		newAssetRow.appendChild(newActor);

		for (var j = 0; j < NUM_OF_LOTS; j++) {
			var newIcon = document.createElement("td");
		
			if (UserResults[i].results[j] == "1")
			{
				sumOfLots[j] += 1;
				newIcon.setAttribute("class", "icon-checkmark");
			}

			newAssetRow.appendChild(newIcon);

		};

		body.appendChild(newAssetRow);
	};

	var newTotalRow = document.createElement("tr");
	newTotalRow.setAttribute("class", "assetRow");

	for (var i = 0; i < NUM_OF_LOTS+2; i++) {

		var newTd = document.createElement("td");

		if (i != 0)
		{
			var newTextNode;
			if (i == 1)
			{
				newTextNode = document.createTextNode("Total");
			}
			else
			{
				newTextNode = document.createTextNode(sumOfLots[i-2]);
			}
			newTd.appendChild(newTextNode);
		}

		newTotalRow.appendChild(newTd);
	};

	body.appendChild(newTotalRow);


	loadFooter();
};

function loadFooter()
{
	var foot = document.getElementById("foot");
	var newRow = document.createElement("tr");
	
	for (var i = 0; i < NUM_OF_LOTS+2; i++) {

		var newTd = document.createElement("td");

		if (i != 0 && i != 1)
		{
			var newImg = document.createElement("div");
			newImg.setAttribute("class", "selectBtn");
			newImg.setAttribute("id", i-2);
			newImg.setAttribute("onclick", 'approve(' + (i-2) + ');');
			newTd.appendChild(newImg);
		}

		newRow.appendChild(newTd);
	};

	foot.appendChild(newRow);
};

function approve(id){
		for (var i = 0; i < NUM_OF_LOTS; i++) {
			var approveBtn = document.getElementById(i);

			if(i == id)
			{
				if (!lotList[id])
				{
					lotList[id] = true;
					approveBtn.setAttribute("class", "selectPushed");
				}
				else
				{
					lotList[id] = false;
					approveBtn.setAttribute("class", "selectBtn")
				}	
			}
			else
			{
				var approveBtn = document.getElementById(i);
				lotList[i] = false;
				approveBtn.setAttribute("class", "selectBtn");
			}
		};
		
};
