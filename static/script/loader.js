function loaded(){
	// var millisecondsToWait = 3000;
	// setTimeout(function() {
	// }, millisecondsToWait);
	$.ajax({
		type: "POST",
		dataType: "text",
		url: 'http://divie.herokuapp.com/divieResults',
		async: false,
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