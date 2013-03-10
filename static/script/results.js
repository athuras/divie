// Initialization stuff ------------------------------------------------------------------------------

var ResultList = [];
// ResultList.push(new Result(101, "Sailboat Painting", "img/sailboat.png", [0,1,1]));
// ResultList.push(new Result(2, "Car", "img/car.jpg", [1,1,1]));
// ResultList.push(new Result(3, "Lamp", "img/sailboat.png", [0,1,1]));
// ResultList.push(new Result(4, "Lamp", "img/sailboat.png",[0,0,0]));
// ResultList.push(new Result(5, "Lamp", "img/sailboat.png",[0,1,0]));
// ResultList.push(new Result(6, "Lamp", "img/sailboat.png",[0,1,1]));
// ResultList.push(new Result(1031,"Lamp", "img/sailboat.png", [0,1,1]));
// ResultList.push(new Result(23,"Lamp", "img/sailboat.png", [0,1,1]));
// ResultList.push(new Result(33,"Lamp", "img/sailboat.png", [1,1,1]));
// ResultList.push(new Result(43,"Lamp", "img/sailboat.png", [1,1,1]));
// ResultList.push(new Result(53, "Lamp", "img/sailboat.png",[0,0,0]));
// ResultList.push(new Result(36,"Lamp", "img/sailboat.png", [0,0,1]));

function compare(a, b){
	if (a.max < b.max )
		return 1;
	if (a.max > b.max)
		return -1;
	return 0;
};

ResultList.sort(compare);

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

var NUM_OF_LOTS = 0;

var lotList = [];
for (var i = 0; i < NUM_OF_LOTS.length; i++) {
	lotList.push(false);	
};

function getNumOfLots(resultList) {
	if (resultList.length == 0)
		NUM_OF_LOTS = 0
	else
		NUM_OF_LOTS = resultList[0].lots.length;
};

function Result(id, name, img, lots)
{
	this.name = name;
	this.img = 'img/' + img;
	this.id = id;
	this.lots = lots;
	this.max = 0;
	for (var i = 0; i < lots.length; i++) {
		this.max += lots[i]
	};
};

function buildResultsTable()
{
	getNumOfLots(ResultList);

	var head = document.getElementById("head");

	for(var i=0;i<NUM_OF_LOTS+2;i++)
	{
		var newCol = document.createElement("th");
		newCol.setAttribute("scope", "col");

		var colTitleVal = "";
		if (i != 0 && i != 1)
		{
			colTitleVal = "Package " + (i - 1);
		}

		var colTitle = document.createTextNode(colTitleVal);
		
		if(i == NUM_OF_LOTS + 1)
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
		newAssetRow.appendChild(newImgCont);''

		var newAssetName = document.createElement("td");
		newAssetName.setAttribute("class", "assetName");
		var assetName = document.createTextNode(ResultList[i].name);	
		newAssetName.appendChild(assetName);

		newAssetRow.appendChild(newAssetName);

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
	
	for (var i = 0; i < NUM_OF_LOTS+2; i++) {

		var newTd = document.createElement("td");

		if (i != 0 && i != 1)
		{
			var newImg = document.createElement("div");
			newImg.setAttribute("class", "approveBtn");
			newImg.setAttribute("id", i-1);
			newImg.setAttribute("onclick", 'approve(' + (i-1) + ');');
			newTd.appendChild(newImg);
		}

		newRow.appendChild(newTd);
	};

	foot.appendChild(newRow);
};

function approve(lotNum){
	var approveBtn = document.getElementById(lotNum);
	
	if (!lotList[lotNum])
	{
		lotList[lotNum] = true;
		approveBtn.setAttribute("class", "approvePushed");
	}
	else
	{
		lotList[lotNum] = false;
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