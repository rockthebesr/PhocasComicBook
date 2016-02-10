require(["jquery"], function($){
	$('#btnNext').on('click', function(){
		nextComicSet();
	});
	var nextComicSet = function(){
		var comicSetTitle = nextSet.title;
	//	alert('test');
		$.ajax({
			url: '/comic_page' + comicSetTitle,
			type: 'GET',
			contentType: 'application/json',
			data: JSON.stringify({title:title, imageList: imageList, nextSet:nextSet, prevSet:prevSet})
			success: function(data) {
				if (typeof data.redirect == 'string')
					window.location = data.redirect;
			}

		});
	 };
});

