$(document).ready(function() {	

	$('#logOut').click(function()
	{
		window.location = 'http://divie.herokuapp.com/logout'
	})
	$('#myAuctions').click(function()
	{
		window.location = 'http://divie.herokuapp.com/static/myAuctions.html'
	})
	$('#resetDB').click(function(){
		var res = confirm("Confirm reset of database.")
		if (res==true){
			$.ajax({
				type: "POST",
				datatype: "text",
				url: 'http://divie.herokuapp.com/resetAuction',
				async: false,
				success: function(data){
					window.location = "http://divie.herokuapp.com/static/myAuctions.html";
				},
				error: function(msg){
					alert("failed to reset auction. " + msg);
					console.log(msg);
				}
			})
		}
	})
	('#username').click(function()
	{
		$.ajax({
				type: "POST",
				datatype: "text",
				url: 'http://divie.herokuapp.com/name',
				async: false,
				success: function(name){
					//set the element value to name
				},
				error: function(msg){
					console.log(msg);
				}
			})
	})
});
