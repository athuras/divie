// Initialization stuff ------------------------------------------------------------------------------

var ResultList = [];
// ResultList.push(new Result(101, "Sailboat Painting", "img/sailboat.png"));
// ResultList.push(new Result(2, "Car", "img/car.jpg"));
// ResultList.push(new Result(3, "Lamp", "img/sailboat.png"));
// ResultList.push(new Result(4, "Lamp", "img/sailboat.png"));
// ResultList.push(new Result(5, "Lamp", "img/sailboat.png"));
// ResultList.push(new Result(6, "Lamp", "img/sailboat.png"));
// ResultList.push(new Result(1031,"Lamp", "img/sailboat.png"));
// ResultList.push(new Result(23,"Lamp", "img/sailboat.png"));
// ResultList.push(new Result(33,"Lamp", "img/sailboat.png"));
// ResultList.push(new Result(43,"Lamp", "img/sailboat.png"));
// ResultList.push(new Result(53, "Lamp", "img/sailboat.png"));
// ResultList.push(new Result(36,"Lamp", "img/sailboat.png"));


// Initialization stuff ------------------------------------------------------------------------------

function loaded()
{
	$.ajax({
		type: "POST",
		datatype: "json",
		url: 'http://divie.herokuapp.com/requestFinalDiv',
		async: false,
		success: function(data){ 
			$.each(data, function(k, v){
				ResultList.push(
					new Result(
						v.item_id, 
						v.item_name, 
						v.img_url
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
	// $('.submitBtn').click(function(){
	// 	$.ajax({
	// 		type: "POST",
	// 		datatype: "text",
	// 		contentType: "application/json",
	// 		url: 'http://divie.herokuapp.com/submitPrefs',
	// 		data: JSON.stringify(lotList),
	// 		async: false,
	// 		success: function(data){
	// 			window.location = "http://divie.herokuapp.com/static/myAuctions.html";
	// 		},
	// 		error: function(msg){
	// 			alert("failed to submit preferences. " + msg);
	// 			console.log(msg);
	// 		}
	// 	})
	// })
});

var NUM_OF_LOTS = 0;
var lotList = [];

function Result(id, name, img)
{
	this.name = name;
	this.img = 'img/' + img;
	this.id = id;
};

function buildResultsTable()
{
	var head = document.getElementById("head");

	var newImgCol = document.createElement("th");
	newImgCol.setAttribute("scope", "col");

	var newAssetCol = document.createElement("th");
	newAssetCol.setAttribute("scope", "col");
	newAssetCol.setAttribute("id", "right");
	var newTitle = document.createTextNode("Your Items!");

	newAssetCol.appendChild(newTitle);

	head.appendChild(newImgCol);
	head.appendChild(newAssetCol);

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

		newAssetRow.appendChild(newAssetName);
		
		body.appendChild(newAssetRow);
	};
};
