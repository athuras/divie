function redirect()
{
	$.ajax({
		type: "POST",
		datatype: "json",
		url: 'http://divie.herokuapp.com/static/myAuctions.html',
		async: false,
		success: function(){ },
		error: function(){
			// alert("failed to load assets.")
		},
	})
};