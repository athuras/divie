// Initialization stuff ------------------------------------------------------------------------------

var ResultList = [];
// ResultList.push(new Result(101, "Sailboat Painting", "img/sailboat.png", 30, [0,1,1]));
// ResultList.push(new Result(2, "Car", "img/car.jpg", 25, [1,1,1]));
// ResultList.push(new Result(3, "Lamp", "img/sailboat.png", 22, [0,1,1]));
// ResultList.push(new Result(4, "Lamp", "img/sailboat.png",21, [0,0,0]));
// ResultList.push(new Result(5, "Lamp", "img/sailboat.png", 10, [0,1,0]));
// ResultList.push(new Result(6, "Lamp", "img/sailboat.png", 8, [0,1,1]));
// ResultList.push(new Result(1031,"Lamp", "img/sailboat.png", 17,  [0,1,1]));
// ResultList.push(new Result(23,"Lamp", "img/sailboat.png", 15, [0,1,1]));
// ResultList.push(new Result(33,"Lamp", "img/sailboat.png", 2, [1,1,1]));
// ResultList.push(new Result(43,"Lamp", "img/sailboat.png", 7,  [1,1,1]));
// ResultList.push(new Result(53, "Lamp", "img/sailboat.png", 8, [0,0,1));
// ResultList.push(new Result(36,"Lamp", "img/sailboat.png", 45, [0,0,1]));

var POS_OF_FIRST_INDEX = 3;

function compare(a, b){
	if (a.bid < b.bid )
		return 1;
	if (a.bid > b.bid)
		return -1;
	return 0;
};


// Initialization stuff ------------------------------------------------------------------------------

function loaded()
{
	$.ajax({
		type: "POST",
		datatype: "json",
		url: 'http://divie.herokuapp.com/requestResults',
		async: false,
		success: function(data){ 
			$.each(data, function(k, v){
				ResultList.push(
					new Result(
						v.item_id, 
						v.item_name, 
						v.img_url,
						v.value,
						v.lots
					)
				);
			});
		},
		error: function(){
			alert("failed to load results.")
		}
	})
};

$(document).ready(function(){
	$('.submitBtn').click(function(){
		$.ajax({
			type: "POST",
			datatype: "text",
			contentType: "application/json",
			url: 'http://divie.herokuapp.com/submitPrefs',
			data: JSON.stringify(lotList),
			async: false,
			success: function(data){
				window.location = "http://divie.herokuapp.com/static/myAuctions.html";
			},
			error: function(msg){
				alert("failed to submit preferences. " + msg);
				console.log(msg);
			}
		})
	})
});

var NUM_OF_LOTS = 0;
var lotList = [];

function getNumOfLots(resultList) {
	if (resultList.length == 0)
		NUM_OF_LOTS = 0
	else
		NUM_OF_LOTS = resultList[0].lots.length;

	for (var i = 0; i < NUM_OF_LOTS; i++) {
		lotList.push(false);
	};
};

function Result(id, name, img, bid, lots)
{
	this.name = name;
	this.img = 'img/' + img;
	this.id = id;
	this.lots = lots;
	this.bid = bid;
	this.max = 0;
	for (var i = 0; i < lots.length; i++) {
		this.max += lots[i]
	};
};

function buildResultsTable()
{
	getNumOfLots(ResultList);
	ResultList.sort(compare);

	var head = document.getElementById("head");

	for(var i=0;i<NUM_OF_LOTS+POS_OF_FIRST_INDEX;i++)
	{
		var newCol = document.createElement("th");
		newCol.setAttribute("scope", "col");

		if (i == (POS_OF_FIRST_INDEX - 2))
		{
			newCol.setAttribute("style", "border-right: none;");
		}

		var colTitleVal = "";
		if (i >= POS_OF_FIRST_INDEX)
		{
			colTitleVal = "Package " + (i - 2);
		}

		var colTitle = document.createTextNode(colTitleVal);
		
		if(i == NUM_OF_LOTS + 2)
		{
			newCol.setAttribute("id", "right");
		}


		newCol.appendChild(colTitle);

		head.appendChild(newCol);
	};

	loadResults();
};

function loadResults()
{
	var body = document.getElementById("body");

	for (var i = 0; i < ResultList.length; i++) {

		var newAssetRow = document.createElement("tr");
		newAssetRow.setAttribute("class", "assetRow");

		var newImgCont = document.createElement("td");
		newImgCont.setAttribute("class","imgContainer")

		var newAssetImg = document.createElement("img");
		newAssetImg.setAttribute("class", "pic");
		newAssetImg.setAttribute("src", ResultList[i].img)

		newImgCont.appendChild(newAssetImg);
		newAssetRow.appendChild(newImgCont);

		var newAssetName = document.createElement("td");
		newAssetName.setAttribute("class", "assetName");
		var assetName = document.createTextNode(ResultList[i].name);
		newAssetName.appendChild(assetName);

		var newBidValue =document.createElement("td");
		newBidValue.setAttribute("class", "bidValue");
		var newHeart = document.createElement("img");
		newHeart.setAttribute("src", "img/heart-grey.png");
		var newValue = document.createTextNode(" " + ResultList[i].bid);

		newBidValue.appendChild(newHeart);
		newBidValue.appendChild(newValue);
		newAssetRow.appendChild(newAssetName);
		newAssetRow.appendChild(newBidValue);
		

		for (var j = 0; j < NUM_OF_LOTS; j++) {
			var newIcon = document.createElement("td");
			newIcon.setAttribute("class", getIcon(ResultList[i].lots[j]));

			newAssetRow.appendChild(newIcon);
		};

		body.appendChild(newAssetRow);
	};

	createFooter();
};

function createFooter(){
	var foot = document.getElementById("foot");
	var newRow = document.createElement("tr");
	
	for (var i = 0; i < NUM_OF_LOTS+POS_OF_FIRST_INDEX; i++) {

		var newTd = document.createElement("td");

		if (i == (POS_OF_FIRST_INDEX - 2))
		{
			newTd.setAttribute("style", "border-right: none;");
		}
		if (i >= POS_OF_FIRST_INDEX)
		{
			var newImg = document.createElement("div");
			newImg.setAttribute("class", "approveBtn");
			newImg.setAttribute("id", i-2);
			newImg.setAttribute("onclick", 'approve(' + (i-2) + ');');
			newTd.appendChild(newImg);
		}

		newRow.appendChild(newTd);
	};

	foot.appendChild(newRow);
};

function approve(lotNum){
	var approveBtn = document.getElementById(lotNum);
	
	if (!lotList[lotNum-1])
	{
		lotList[lotNum-1] = true;
		approveBtn.setAttribute("class", "approvePushed");
	}
	else
	{
		lotList[lotNum-1] = false;
		approveBtn.setAttribute("class", "approveBtn")
	}
};

function getIcon(value)
{
	if (value == 0)
		return "icon-cancel";
	else
		return "icon-checkmark";
};