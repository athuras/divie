// Initialization stuff ------------------------------------------------------------------------------

var AssetList = [];
AssetList.push(new Asset(101, "Sailboat Painting", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(2, "Car", 0, '', "img/car.jpg"));
AssetList.push(new Asset(3, "Lamp", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(4, "Family Portrait", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(5, "Sailboat Painting", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(6, "Everything Else", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(1031, "Sailboat Painting", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(23, "Car", 0, '', "img/car.jpg"));
AssetList.push(new Asset(33, "Lamp", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(43, "Family Portrait", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(53, "Sailboat Painting", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(36, "Everything Else", 0, '', "img/sailboat.png"));

var ResultList = [];
ResultList.push(new Result(101, [0,1,1,0]));
ResultList.push(new Result(2, [1,1,1,0]));
ResultList.push(new Result(3, [0,1,1,0]));
ResultList.push(new Result(4, [0,0,0,0]));
ResultList.push(new Result(5, [0,1,0,0]));
ResultList.push(new Result(6, [0,1,1,0]));
ResultList.push(new Result(1031, [0,1,1,1]));
ResultList.push(new Result(23, [0,1,1,0]));
ResultList.push(new Result(33, [1,1,1,1]));
ResultList.push(new Result(43, [1,1,1,0]));
ResultList.push(new Result(53, [0,0,0,0]));
ResultList.push(new Result(36, [0,0,1,0]));

// Initialization stuff ------------------------------------------------------------------------------

var NUM_OF_LOTS = 0;

function getNumOfLots(resultList) {
	if (resultList.length == 0)
		alert("Err: No Results");
	else
		NUM_OF_LOTS = resultList[0].lots.length;
};

function Asset (id, name, rank, description, imgSrc){
	this.id = id;
	this.name = name;
	this.rank = rank;
	this.description = "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass.";
	// this.description = description;
	this.img = "img/sailboat.png";//imgSrc;
};

function Result(id, lots)
{
	this.lots = lots;
	this.asset = AssetList[findArrLoc(id)];
};

function findArrLoc(idTag)
{
	for(var i=0; i<AssetList.length;i++)
	{
		if (AssetList[i].id == idTag)
		{
			return i;
		}
	}
};


function buildResultsTable()
{
	getNumOfLots(ResultList);

	var head = document.getElementById("head");

	for(var i=0;i<NUM_OF_LOTS+1;i++)
	{
		var newCol = document.createElement("th");
		newCol.setAttribute("scope", "col");

		var colTitleVal = "";
		if (i != 0)
		{
			colTitleVal = i;
		}

		var colTitle = document.createTextNode(colTitleVal);
		
		if(i == NUM_OF_LOTS)
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
		console.log(ResultList.length)
		var newAssetRow = document.createElement("tr");
		newAssetRow.setAttribute("class", "assetRow");

		var newAssetName = document.createElement("td");
		newAssetName.setAttribute("class", "assetName");
		var assetName = document.createTextNode(ResultList[i].asset.name);	
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

	for (var i = 0; i < NUM_OF_LOTS+1; i++) {
		var newRow = document.createElement("tr");
		var newTd = document.createElement("td");
		var newImg = document.createElement("img");
		newImg.setAttribute("src", "img/approve-btn.png")
		if (i != 0)
		{
			newTd.appendChild(newImg);
		}

		newRow.appendChild(newTd);
	};
};

function getIcon(value)
{
	if (value == 0)
		return "icon-cancel";
	else
		return "icon-checkmark";
};