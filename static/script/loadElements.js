var AssetList = [];
AssetList.push(new Asset(0, "Sailboat Painting", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(1, "Car", 0, '', "img/car.jpg"));
AssetList.push(new Asset(2, "Lamp", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(3, "Family Portrait", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(4, "Sailboat Painting", 0, '', "img/sailboat.png"));
AssetList.push(new Asset(5, "Everything Else", 0, '', "img/sailboat.png"));

var init = true;
var MAX_BUDGET_VALUE = 100;

//this loads assets from server
function loaded()
{
	$.ajax({
		type: "POST",
		datatype: "json",
		url: 'http://divie.herokuapp.com/static/auction.html',
		async: false,
		success: function(data){ 
			$.each(data, function(i, at){
				AssetList.push(new Asset(at.id, at.name, at.ranking, at.desc, at.img));
			});

			addAssets();
		},
		error: function(){
			alert("failed to load assets.")
		},
	})
};

function addAssets()
{
	var list = document.getElementById("assetList"); //change ID to whatever is used in html
	for(var i=0; i<AssetList.length; i++)
	{
		var newLi = document.createElement("li");
		newLi.setAttribute("id", AssetList[i].id)
		newLi.setAttribute("onclick",'loadAsset(' + AssetList[i].id + ');');

		var newAssetSpan = document.createElement("span");
		newAssetSpan.setAttribute("id", "assetTitle");
		var spanValue = document.createTextNode(AssetList[i].name);

		var newValueBarDiv = document.createElement("div");
		newValueBarDiv.setAttribute("id", "valueBar");
		var newAssignText = document.createElement("div");
		newAssignText.setAttribute("id", "assignText");
		var assignTextValue = document.createTextNode("Assign a Value");
		newAssignText.appendChild(assignTextValue);
		//var valueBarValue = document.createTextNode(AssetList[i].rank); 
		
		newAssetSpan.appendChild(spanValue);
		//newValueBarDiv.appendChild(valueBarValue);
	
		newLi.appendChild(newAssetSpan);
		newLi.appendChild(newValueBarDiv);
		newLi.appendChild(newAssignText);
		//console.log(newLi.childNode['1']);
		//newLi.childNode[1].style.width = parseInt(AssetList[i].rank) / currBudget * 100 + "%";

		list.appendChild(newLi);
	}
};

function Asset (id, name, rank, description, imgSrc){
	this.id = id;
	this.name = name;
	this.rank = rank;
	this.description = "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass.";
	// this.description = description;
	this.img = imgSrc;
};

function loadAsset(idTag)
{
	try
		{
			var nextID = parseInt(idTag) + 1;
			var prevID = parseInt(idTag) - 1;

			var list = document.getElementById(idTag);
			if (list.childNodes.length > 2)
			{
				list.removeChild(list.childNodes[2]);
				list.style.height = "70.5px";
			}
			if (init)
			{

				var mainDiv = document.getElementById("main");

				var newDiv = document.createElement("div");
				newDiv.setAttribute("class", "assetOverlay");



				var newTopBoxDiv = document.createElement("div");
				newTopBoxDiv.setAttribute("class", "topBox");

				var newImg = document.createElement("img");
				newImg.setAttribute("id", "image");
				newImg.setAttribute("src", AssetList[findArrLoc(idTag)].img);

				var newWordsDiv = document.createElement("div");
				newWordsDiv.setAttribute("class", "words");

				var newTitleDiv = document.createElement("div");
				newTitleDiv.setAttribute("class", "bigTitle");
				newTitleDiv.setAttribute("id", "currAssetTitle");
				var newTitleValue = document.createTextNode(AssetList[findArrLoc(idTag)].name);
				newTitleDiv.appendChild(newTitleValue);

				var newDescDiv = document.createElement("div");
				newDescDiv.setAttribute("class", "description");
				newDescDiv.setAttribute("id", "desc");
				var newDescValue = document.createTextNode(AssetList[findArrLoc(idTag)].description);
				newDescDiv.appendChild(newDescValue);

				newWordsDiv.appendChild(newTitleDiv);
				newWordsDiv.appendChild(newDescDiv);

				newTopBoxDiv.appendChild(newImg);
				newTopBoxDiv.appendChild(newWordsDiv);

				var newSliderClass = document.createElement("div");
				newSliderClass.setAttribute("class", "sliderHorizon");
				newSliderClass.setAttribute("id", "sliderHorizon");

				var newSliderDiv = document.createElement("div");
				newSliderDiv.setAttribute("class", "slider");
				newSliderDiv.setAttribute("id", "slider");

				var newSliderResultDiv = document.createElement("div");
				newSliderResultDiv.setAttribute("id", "slider-result")
				var sliderResultValue = document.createTextNode(AssetList[findArrLoc(idTag)].rank);
				newSliderResultDiv.appendChild(sliderResultValue);

				var newSliderInput = document.createElement("input");
				newSliderInput.setAttribute("type", "hidden");
				newSliderInput.setAttribute("id", "hidden");

				var newSliderText = document.createElement("div");
				newSliderText.setAttribute("class", "sliderText");

				var newSliderRem = document.createElement("div");
				newSliderRem.setAttribute("id", "slider-remaining");
				var newSliderRemValue = document.createTextNode(getRemainingBudget())
				newSliderRem.appendChild(newSliderRemValue);
				newSliderRem.innerHTML = '<img src = "img/heart-red.png"/> ' + getRemainingBudget() + '<br> remaining';

				// var newSliderFill = document.createElement("div");
				// newSliderFill.setAttribute("id", "sliderFill");

				newSliderClass.appendChild(newSliderRem);
				newSliderClass.appendChild(newSliderText);
				newSliderClass.appendChild(newSliderDiv);
				newSliderClass.appendChild(newSliderResultDiv);
				newSliderClass.appendChild(newSliderInput);

				var nextButton = document.createElement("div");
				nextButton.setAttribute("class", formatButton(idTag, "next"));
				nextButton.setAttribute("id", "next");
				nextButton.setAttribute("onclick", 'loadAsset(' + nextID + ');');
				var nextButtonValue = document.createTextNode("Next Item");
				nextButton.appendChild(nextButtonValue);

				var prevButton = document.createElement("div");
				prevButton.setAttribute("class", formatButton(idTag, "prev"));
				prevButton.setAttribute("id", "previous");
				prevButton.setAttribute("onclick", 'loadAsset(' + prevID + ');');
				var prevButtonValue = document.createTextNode("Previous Item");
				prevButton.appendChild(prevButtonValue);		
				

				newDiv.appendChild(newTopBoxDiv);
				newDiv.appendChild(newSliderClass);
				newDiv.appendChild(prevButton);
				newDiv.appendChild(nextButton);
				//newDiv.appendChild(newSliderFill);

				mainDiv.appendChild(newDiv);


			}

			else
			{
				document.getElementById("image").setAttribute("src" , AssetList[findArrLoc(idTag)].img);
				document.getElementById("currAssetTitle").innerHTML = AssetList[findArrLoc(idTag)].name;
				document.getElementById("desc").innerHTML = AssetList[findArrLoc(idTag)].description;
				document.getElementById("slider-result").innerHTML = AssetList[findArrLoc(idTag)].rank;
				document.getElementById("previous").setAttribute("onclick", 'loadAsset(' + prevID + ');');
				document.getElementById("next").setAttribute("onclick", 'loadAsset(' + nextID + ');');
				document.getElementById("previous").setAttribute("class", formatButton(idTag, "prev"));
				document.getElementById("next").setAttribute("class", formatButton(idTag, "next"));

			}

			$( "#slider" ).slider({
		        animate: true,
		        range: "min",
		        value: AssetList[findArrLoc(idTag)].rank,
		        min: 0,
		        max: currBudget + parseInt(AssetList[findArrLoc(idTag)].rank),
		        step: 1,


		        //this gets a live reading of the value and prints it on the page
		        slide: function( event, ui ) {
		            $( "#slider-result" ).html( ui.value );

		        },
		 
		        //this updates the hidden form field so we can submit the data using a form
		        change: function(event, ui) {
		            $('#hidden').attr('value', ui.value);

		        },

		        stop: function(event, ui){
		        	AssetList[findArrLoc(idTag)].rank = document.getElementById("slider-result").innerHTML;
		        	adjustBudget();
		        }

		     });


			for(var j=0;j<AssetList.length;j++)
			{
				var liTag = document.getElementById(j);
				liTag.removeAttribute("class");
				if (liTag.lastChild.id == "triangleSelector")
				{
					liTag.removeChild(liTag.lastChild);
				}
			}

			var liTag = document.getElementById(idTag);
			liTag.setAttribute("class", "active");

			init = false;
		}	
	catch(err)
	{
		console.log("error: " + err.message);
	}
};

function formatButton(idTag, order)
{
	if (idTag < 1 && order == "prev")
	{
		return "noClick";
	}
	else if (idTag == AssetList.length - 1 && order == "next")
	{
		return "noClick";
	}
	else
	{
		return "lowerBtn";
	}
}

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

var currBudget = 100;

function adjustBudget()
{
	var tempBudget = MAX_BUDGET_VALUE;
	var runningSum = 0;
	for(var i=0; i<AssetList.length;i++)
	{
		runningSum += parseInt(AssetList[i].rank);
			var listItem = document.getElementById(i);
			listItem.childNodes[1].style.width = parseInt(AssetList[i].rank) / MAX_BUDGET_VALUE * 100  + "%";
		
	}
	var remBudget = document.getElementById("remBudget");
	currBudget = parseInt(tempBudget) - parseInt(runningSum);
	remBudget.innerHTML = "Remaining Budget:  " + '<img src = "img/heart-white.png"/> ' + currBudget;
	document.getElementById("slider-remaining").innerHTML = '<img src = "img/heart-red.png"/> ' + getRemainingBudget() + '<br> remaining';
};

function getRemainingBudget()
{
	return currBudget;
};

function getChildNodeIndex(list, idName)
{
	var index = -1
	for(var i=0;i<list.childNodes.length;i++)
	{
		console.log(list.childNodes[i].id);
		if (list.childNodes[i].id == idName)
		{
			index = i;
		}
	}
	return index;
};




