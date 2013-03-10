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
		//open confirmation box
		//when confirm send request to clear database
		//redirect to myauctions page
	})
});
