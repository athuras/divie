var AssetList = [];
AssetList.push(new Asset(0, "Sailboat Painting", 37, '', "img/sailboat.png"));
AssetList.push(new Asset(1, "Car", 0, '', "img/car.jpg"));
AssetList.push(new Asset(2, "Lamp", 0));
AssetList.push(new Asset(3, "Family Portrait", 0));
AssetList.push(new Asset(4, "Sailboat Painting", 0));
AssetList.push(new Asset(5, "Everything Else", 0));

var init = true;
var SLIDER_RESULT = 50;

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
		//var valueBarValue = document.createTextNode(AssetList[i].rank); 
		
		newAssetSpan.appendChild(spanValue);
		//newValueBarDiv.appendChild(valueBarValue);
		
		newLi.appendChild(newAssetSpan);
		newLi.appendChild(newValueBarDiv);

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

		var newSliderDiv = document.createElement("div");
		newSliderDiv.setAttribute("class", "slider");
		newSliderDiv.setAttribute("id", "slider");

		var newSliderResultDiv = document.createElement("div");
		newSliderResultDiv.setAttribute("id", "slider-result")
		var sliderResultValue = document.createTextNode(AssetList[findArrLoc(idTag)].rank);
		console.log(sliderResultValue);
		newSliderResultDiv.appendChild(sliderResultValue);

		var newSliderInput = document.createElement("input");
		newSliderInput.setAttribute("type", "hidden");
		newSliderInput.setAttribute("id", "hidden");

		// var newSliderFill = document.createElement("div");
		// newSliderFill.setAttribute("id", "sliderFill");

		newSliderClass.appendChild(newSliderDiv);
		newSliderClass.appendChild(newSliderResultDiv);
		newSliderClass.appendChild(newSliderInput);
		
		newDiv.appendChild(newTopBoxDiv);
		newDiv.appendChild(newSliderClass);
		//newDiv.appendChild(newSliderFill);

		mainDiv.appendChild(newDiv);


	}

	else
	{
		document.getElementById("image").setAttribute("src" , AssetList[findArrLoc(idTag)].img);
		document.getElementById("currAssetTitle").innerHTML = AssetList[findArrLoc(idTag)].name;
		document.getElementById("desc").innerHTML = AssetList[findArrLoc(idTag)].description;
		document.getElementById("slider-result").innerHTML = AssetList[findArrLoc(idTag)].rank;

	}

	$( "#slider" ).slider({
        animate: true,
        range: "min",
        value: AssetList[findArrLoc(idTag)].rank,
        min: 0,
        max: 100,
        step: 1,


        //this gets a live reading of the value and prints it on the page
        slide: function( event, ui ) {
            $( "#slider-result" ).html( ui.value );
        },
 
        //this updates the hidden form field so we can submit the data using a form
        change: function(event, ui) {
            $('#hidden').attr('value', ui.value);
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


