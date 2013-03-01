// Initialization stuff ------------------------------------------------------------------------------

var ResultList = [];
ResultList.push(new Result(101, "Sailboat Painting", "img/sailboat.png", [0,1,1]));
ResultList.push(new Result(2, "Car", "img/car.jpg", [1,1,1]));
ResultList.push(new Result(3, "Lamp", "img/sailboat.png", [0,1,1]));
ResultList.push(new Result(4, "Lamp", "img/sailboat.png",[0,0,0]));
ResultList.push(new Result(5, "Lamp", "img/sailboat.png",[0,1,0]));
ResultList.push(new Result(6, "Lamp", "img/sailboat.png",[0,1,1]));
ResultList.push(new Result(1031,"Lamp", "img/sailboat.png", [0,1,1]));
ResultList.push(new Result(23,"Lamp", "img/sailboat.png", [0,1,1]));
ResultList.push(new Result(33,"Lamp", "img/sailboat.png", [1,1,1]));
ResultList.push(new Result(43,"Lamp", "img/sailboat.png", [1,1,1]));
ResultList.push(new Result(53, "Lamp", "img/sailboat.png",[0,0,0]));
ResultList.push(new Result(36,"Lamp", "img/sailboat.png", [0,0,1]));

// Initialization stuff ------------------------------------------------------------------------------

var NUM_OF_LOTS = 0;

var lotList = [];
for (var i = 0; i < NUM_OF_LOTS.length; i++) {
	lotList.push(false);	
};

function getNumOfLots(resultList) {
	if (resultList.length == 0)
		alert("Err: No Results");
	else
		NUM_OF_LOTS = resultList[0].lots.length;
};

function Result(id, name, img, lots)
{
	this.name = name;
	this.img = img;
	this.id = id;
	this.lots = lots;
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
			colTitleVal = i - 1;
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
	if (!lotList[lotNum])
	{
		lotList[lotNum] = true;
		var approveBtn = document.getElementById(lotNum);
		approveBtn.setAttribute("class", "approvePushed")
	}
};

function getIcon(value)
{
	if (value == 0)
		return "icon-cancel";
	else
		return "icon-checkmark";
};