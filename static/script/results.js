var AuctionList = [];
AuctionList.push(new Auction(1, 1, "Grandma's Belongings", "Splittin her shit up", "February 23, 2013", "March 2, 2013"));
AuctionList.push(new Auction(1, 1, "Uncle Ken's Shit Needs Divie", "Splittin her shit up", "April 23, 2013", "April 30, 2013"));


var results = [];
results.push();

var NUM_OF_LOTS = 3;


function Asset (id, name, rank, description, imgSrc){
	this.id = id;
	this.name = name;
	this.rank = rank;
	this.description = "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass.";
	// this.description = description;
	this.img = "img/sailboat.png";//imgSrc;
};

function Result()
{

};

function buildResultsTable()
{
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
	}
};

function loadResults()
{

};