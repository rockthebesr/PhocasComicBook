///<reference path='../../types/DefinitelyTyped/jquery.d.ts'/>
jQuery(document).on("click", "#btmSaveComicSet", function () {
    saveComicSet();
});
var saveComicSet = function () {
    var title = $("#comicSetTitle").val();
    if (!title) {
        alert("You need a title!");
    }
    else {
        var imageList = uploadImageList;
        $.each(imageList, function (index, imageData) {
            imageData.comicSetTitle = title;
        });
        $.ajax({
            url: '/uploadComicSet',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ comicSetTitle: title, imageList: imageList }),
            success: function (data) {
                if (typeof data.redirect == 'string')
                    window.location = data.redirect;
            }
        });
    }
};
//# sourceMappingURL=edit_comic.js.map