UserRankings = [];
// UserRankings.push({"agend_id": 1, "agent_name": "Matt Chong", "profile": "img/matt.jpg", 
// 						"Bid": [{"item_name": "Lamp", "value": 4},
// 								{"item_name": "Painting", "value": 35},
// 								{"item_name": "Shit", "value": 4},
// 								{"item_name": "On", "value": 35},
// 								{"item_name": "My", "value": 3},
// 								{"item_name": "Dick", "value": 6}]});
// UserRankings.push({"agend_id": 2, "agent_name": "Riley Donelson", "profile": "img/matt.jpg", 
// 						"Bid": [{"item_name": "Lamp", "value": 4},
// 								{"item_name": "Painting", "value": 35},
// 								{"item_name": "Shit", "value": 4},
// 								{"item_name": "On", "value": 35},
// 								{"item_name": "My", "value": 3},
// 								{"item_name": "Dick", "value": 6}]});
// UserRankings.push({"agend_id": 3, "agent_name": "Alex Huras", "profile": "img/matt.jpg", 
// 						"Bid": [{"item_name": "Lamp", "value": 4},
// 								{"item_name": "Painting", "value": 35},
// 								{"item_name": "Shit", "value": 4},
// 								{"item_name": "On", "value": 35},
// 								{"item_name": "My", "value": 3},
// 								{"item_name": "Dick", "value": 6}]});
// UserRankings.push({"agend_id": 4, "agent_name": "Scott Neil", "profile": "img/matt.jpg", 
// 						"Bid": [{"item_name": "Lamp", "value": 4},
// 								{"item_name": "Painting", "value": 35},
// 								{"item_name": "Shit", "value": 4},
// 								{"item_name": "On", "value": 35},
// 								{"item_name": "My", "value": 3},
// 								{"item_name": "Dick", "value": 6}]});

function loaded(){
	$.ajax({
		type: "POST",
		datatype: "json",
		url: 'http://divie.herokuapp.com/requestAllBids',
		async: false,
		success: function(data){ 
			$.each(data, function(k, v){
				AuctionList.push(
					new Auction(
						v.agent_id,
						v.agent_name,
						v.profile, 
						v.item_id,
						v.item_name,
						v.Bids
					)
				);
			});
		},
		error: function(){
			alert("failed to load bids.")
		}
	})
};

$(document).ready(function(){
	$('.divieBtn').click(function(){
		window.location = 'http://divie.herokuapp.com/static/loader.html'
	})
});

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

		var tdPic = document.createElement("td");
		tdPic.setAttribute("class", "pic");
		var newPic = document.createElement("img");
		newPic.setAttribute("class", "pic");
		newPic.setAttribute("src", UserRankings[i].profile);
		tdPic.appendChild(newPic);

		var tdActor = document.createElement("td");
		tdActor.setAttribute("class", "actor");
		var actorName = document.createTextNode(UserRankings[i].agent_name);
		tdActor.appendChild(actorName)

		var tdIcon = document.createElement("td");
		tdIcon.setAttribute("class", "icon-checkmark");
		tdIcon.setAttribute("id", "checkmark");

		newAssetRow.appendChild(tdArr);
		newAssetRow.appendChild(tdPic);
		newAssetRow.appendChild(tdActor);
		newAssetRow.appendChild(tdIcon);

		body.appendChild(newAssetRow);

		var ranks = UserRankings[i].Bid;

		for (var j = 0; j < ranks.length; j++) {
				var newRateRow = document.createElement("tr");
				newRateRow.setAttribute("class", "rateRow");
				newRateRow.setAttribute("id", i + "-" + j);
				newRateRow.setAttribute("style", "display: none");

				var tdAsset = document.createElement("td");
				tdAsset.setAttribute("class", "assetName");
				tdAsset.setAttribute("id", "rating");

				var heartImg = document.createElement("img");
				heartImg.setAttribute("src", "img/heart-grey.png");

				var rankValue = document.createTextNode(ranks[j].value)

				tdAsset.appendChild(heartImg);
				tdAsset.appendChild(rankValue);

				var tdAssetName = document.createElement("td");
				tdAssetName.setAttribute("class", "assetName");
				var tdAssetNameVal = document.createTextNode(ranks[j].item_name);
				tdAssetName.appendChild(tdAssetNameVal);

				var tdBlank1 = document.createElement("td");
				var tdBlank2 = document.createElement("td");

				newRateRow.appendChild(tdBlank1);
				newRateRow.appendChild(tdAsset);
				newRateRow.appendChild(tdAssetName);
				newRateRow.appendChild(tdBlank2);

				body.appendChild(newRateRow);

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