function loaded(){
	$.ajax({
		type: "POST",
		dataType: "text",
		contentType: "application/json",
		url: 'http://divie.herokuapp.com/divieResults',
		async: false,
		data: JSON.stringify(AssetList, jsonReplacer),
		success: function(msg){ 
			//wait X seconds
			//redirect to myauctions
			window.location = 'http://divie.herokuapp.com/static/myAuctions.html';
		},
		error: function(msg){
			alert("Error! " + msg)
			console.log(msg)
		}
	})
};