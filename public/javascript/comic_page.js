require(["jquery"], function($){
	$('#btnNext').on('click', function(){
		nextComicSet();
	});

	$('#btnPrev').on('click', function(){
		prevComicSet();
	});

	var nextComicSet = function(){
		if (nextSetTitle) {
			//$.ajax({
			//	url: '/comic_page/' + comicSetTitle,
			//	type: 'GET',
			//	contentType: 'application/json',
			//	data: JSON.stringify({comic_set_title: comicSetTitle})
			//	success: function(data) {
			//		if (typeof data.redirect == 'string')
			//			window.location = data.redirect;
			//	}
			//});
			window.location = '/comic_page/' + nextSetTitle;
		} else {
			alert("there is no next set!")
		}
	 };

	var prevComicSet = function(){
		if (prevSetTitle) {
			//$.ajax({
			//	url: '/comic_page/' + comicSetTitle,
			//	type: 'GET',
			//	contentType: 'application/json',
			//	data: JSON.stringify({comic_set_title: comicSetTitle})
			//	success: function(data) {
			//		if (typeof data.redirect == 'string')
			//			window.location = data.redirect;
			//	}
			//});
			window.location = '/comic_page/' + prevSetTitle;
		} else {
			alert("there is no previous set!")
		}
	};
});

