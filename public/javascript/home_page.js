///<reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>
///<reference path='../../types/DefinitelyTyped/jqueryui/jqueryui.d.ts'/>
/*jQuery(document).on('click', '#comicSetImage', function(){
    imgRedirect();
});

var imgRedirect = function(){
    // if (setTitle.length > 0) {
    //     window.loctaion = '/comic_page/' + setTitle;
    // } else {
    //     alert("Cannot retrieve this comic set");
    // }
    alert("test");
}*/
/*$(document).ready(function() {

    $("#button").click(function () {
        alert("Hello!");
    });
});*/
$(function () {
    var availableTags = titleList;
    var NoResultsLabel = "No Results";
    $("#input").autocomplete({
        source: function (request, response) {
            var results = $.ui.autocomplete.filter(availableTags, request.term);
            if (!results.length) {
                results = [NoResultsLabel];
            }
            response(results);
        } //,
    });
});
