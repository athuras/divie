$(document).ready(function(){
	// wait for document to be loaded before binding click event
	$('#gAuction').click(function()
	{
		alert("postin up")
		$.ajax({
			type: "POST",
			datatype: "json",
			url: 'http://divie.herokuapp.com/static/myAuctions.html',
			async: false,
			error: function(){
				alert("failed to load assets.")
			},
		})
	});	
});

