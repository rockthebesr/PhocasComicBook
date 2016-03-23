///<reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>

/*$( "#button-holder" ).keypress(function(event) {
  if (event.which == 13) {
    searchComicSet();
  }
});*/

jQuery(document).on("click", "#button-holder", function () {
  searchComicSet();
});

var searchComicSet = function(){
  var text = $("#search-input").val();
  $.ajax({
    url: '/',
    type: 'POST',
    contentType: 'application/json',
    data : JSON.stringify({searchComic: text}),
    success: function(data) {
      if (typeof data.redirect == 'string')
        window.location = data.redirect;
    }
  })
};