Assets = [];
Assets.push("Lamp");
Assets.push("Furniture");
Assets.push("Painting");
Assets.push("TV");
Assets.push("Everything Else");

UserRankings = [];
UserRankings.push(new UserRank(1, "Riley Donelson", [21, 34, 15, 0, 14]));
UserRankings.push(new UserRank(2, "Matthew Chong", [0,14,5,8,9]));
UserRankings.push(new UserRank(3, "Brian Sinclair", [1,2,3,4,5]));
UserRankings.push(new UserRank(4, "Scott Neil", [2,4,5,6,73]));
UserRankings.push(new UserRank(5, "Alex Huras", [34,45,0,0,0]));

function loaded(){
	// $.ajax({
	// 	type: "POST",
	// 	datatype: "json",
	// 	url: 'http://divie.herokuapp.com/requestBids',
	// 	async: false,
	// 	success: function(data){ 
	// 		$.each(data, function(k, v){
	// 			AuctionList.push(
	// 				new Auction(
	// 					v.agent_id,
	// 					v.agent_name, 
	// 					v.item_id,
	// 					v.item_name,
	// 					v.bids
	// 				)
	// 			);
	// 		});
	// 	},
	// 	error: function(){
	// 		alert("failed to load bids.")
	// 	}
	// })
};

$(document).ready(function(){
	$('.divieBtn').click(function(){
		window.location = 'http://divie.herokuapp.com/static/loader.html'
	})
});

function UserRank(userID, name, ranks)
{
	this.id = userID;
	this.name = name;
	this.ranks = ranks;
}

function loadUsers()
{
	var body = document.getElementById("body");

	for (var i = 0; i < UserRankings.length; i++) {
		
		var newAssetRow = document.createElement("tr");
		newAssetRow.setAttribute("class", "assetRow");
		newAssetRow.setAttribute("id", i);
		newAssetRow.setAttribute("onclick", 'toggleRows(' + i + ');');

		var tdArr = document.createElement("td");
		var arrowImg = document.createElement("img");
		arrowImg.setAttribute("class", "arrow");
		arrowImg.setAttribute("id", "notClicked");
		arrowImg.setAttribute("src", "img/arrow-left.png");
		tdArr.appendChild(arrowImg);

		var tdActor = document.createElement("td");
		tdActor.setAttribute("class", "actor");
		var actorName = document.createTextNode(UserRankings[i].name);
		tdActor.appendChild(actorName)

		var tdIcon = document.createElement("td");
		tdIcon.setAttribute("class", "icon-checkmark");

		newAssetRow.appendChild(tdArr);
		newAssetRow.appendChild(tdActor);
		newAssetRow.appendChild(tdIcon);

		body.appendChild(newAssetRow);

		var ranks = UserRankings[i].ranks;

		for (var j = 0; j < ranks.length; j++) {

			if (ranks[j] > 0)
			{

				var newRateRow = document.createElement("tr");
				newRateRow.setAttribute("class", "rateRow");
				newRateRow.setAttribute("id", i + "-" + j);
				newRateRow.setAttribute("style", "display: none");

				var tdAsset = document.createElement("td");
				tdAsset.setAttribute("class", "assetName");
				tdAsset.setAttribute("id", "rating");

				var heartImg = document.createElement("img");
				heartImg.setAttribute("src", "img/heart-grey.png");
				
				var rankValue = document.createTextNode(ranks[j])

				tdAsset.appendChild(heartImg);
				tdAsset.appendChild(rankValue);

				var tdAssetName = document.createElement("td");
				tdAssetName.setAttribute("class", "assetName");
				var tdAssetNameVal = document.createTextNode(Assets[j]);
				tdAssetName.appendChild(tdAssetNameVal);

				var tdBlank = document.createElement("td");

				newRateRow.appendChild(tdAsset);
				newRateRow.appendChild(tdAssetName);
				newRateRow.appendChild(tdBlank);

				body.appendChild(newRateRow);
			}

		};
	};
};

function toggleRows(id)
{
	var table = document.getElementById("displayTable");
	for (var i = 0, row; row = table.rows[i]; i++) {
		var type = row.className;
		var rowId = row.id;
		if (type == 'rateRow' && rowId.charAt(0) == id && rowId.length > 1)
		{

			if(row.style.display == "none")
			{

				row.style.display = "";
			}
			else
			{
				row.style.display = "none";
			}
		}
		else if (type == 'assetRow' && rowId == id)
		{
			if(row.childNodes[0].childNodes[0].id == "notClicked")
			{
				row.childNodes[0].childNodes[0].src = "img/arrow-down.png"; 
				row.childNodes[0].childNodes[0].id = "clicked";
			}
			else
			{
				row.childNodes[0].childNodes[0].src = "img/arrow-left.png"; 
				row.childNodes[0].childNodes[0].id = "notClicked";
			}
		};
	}
};