///<reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>
jQuery(document).on("click", "#btnForsearch", function () {
    searchComicSet();
});
var searchComicSet = function () {
    var text = $("#input").val();
    $.ajax({
        url: '/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ searchComic: text }),
        success: function (data) {
            if (typeof data.redirect == 'string')
                window.location = data.redirect;
        }
    });
};
