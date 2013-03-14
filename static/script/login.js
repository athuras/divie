$(document).ready(function() {  
	$('.terms').click(function()
	{
	window.location = 'http://divie.herokuapp.com/static/terms.html'
	});

	$('#goBtn').click(function(){
		var data = $("#uname").val();
		$.ajax({
			type: "POST",
			datatype: "text",
			contentType: "application/json",
			url: 'http://divie.herokuapp.com/authenticate',
			data: JSON.stringify(data),
			async: false,
			success: function(msg){
				console.log(msg);
				window.location = "http://divie.herokuapp.com/static/myAuctions.html";
			},
			error: function(msg){
				alert("Could not authenticate user. Invalid username.");
			}
		})
	});

	$(document).keypress(function(e) {
    if(e.which == 13) {
       var data = $("#uname").val();
		$.ajax({
			type: "POST",
			datatype: "text",
			contentType: "application/json",
			url: 'http://divie.herokuapp.com/authenticate',
			data: JSON.stringify(data),
			async: false,
			success: function(msg){
				console.log(msg);
				window.location = "http://divie.herokuapp.com/static/myAuctions.html";
			},
			error: function(msg){
				alert("Could not authenticate user. Invalid username.");
			}
		})
    }
	});

});