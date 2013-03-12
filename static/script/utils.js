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
	//sets username
	$.ajax({
			type: "POST",
			datatype: "text",
			url: 'http://divie.herokuapp.com/name',
			async: false,
			success: function(name){
				$(".username").html("Hi " + name + "!");
			},
			error: function(msg){
				console.log(msg);
			}
		})
});

$(document).ready(function() {	
	$(".username").html("Hi " + "name" + "!");
	$('.profile').attr('src', 'img/men.png');
});
