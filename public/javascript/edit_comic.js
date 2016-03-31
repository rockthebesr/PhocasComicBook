///<reference path='../../types/DefinitelyTyped/jquery/jquery.d.ts'/>
var sortByKey = function (array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
};
jQuery(document).on("click", "#btmSaveComicSet", function () {
    saveComicSet();
});
jQuery(document).on("click", "#btmDeleteComicSet", function () {
    deleteComicSet();
});
jQuery(document).on("click", ".deleteImageButton", function () {
    var imageIndex = $('.deleteImageButton').index(this);
    var imageUrl = uploadImageList[imageIndex].imageUrl;
    deleteComicImage(imageUrl);
});
var deleteComicSet = function () {
    $.ajax({
        url: '/deleteComicSet',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ comicSetTitle: title }),
        success: function (data) {
            if (typeof data.redirect == 'string')
                window.location = data.redirect;
        }
    });
};
var deleteComicImage = function (imageUrl) {
    $.ajax({
        url: '/deleteComicImage',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ imageUrl: imageUrl, comicSetTitle: title }),
        success: function (data) {
            if (typeof data.redirect == 'string')
                window.location = data.redirect;
        }
    });
};
var saveComicSet = function () {
    var allowOthersToEdit = $('#allowEditCheckBox').is(':checked') ? 'true' : 'false';
    if (title != "undefined") {
        var positions = [];
        jQuery(".uploadedImagePosition").each(function (index, element) {
            positions.push(jQuery(this).val());
        });
        var imageList = uploadImageList;
        for (var i = 0; i < positions.length; i++) {
            imageList[i].imagePosition = positions[i];
        }
        $.each(imageList, function (index, imageData) {
            imageData.comicSetTitle = title;
        });
        var inputTitle = $("#comicSetTitle").val();
        imageList = sortByKey(imageList, "imagePosition");
        $.ajax({
            url: '/updateComicSet',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                oldComicSetTitle: title,
                newComicSetTitle: inputTitle,
                allowOthersToEdit: allowOthersToEdit,
                editedby: editedby,
                imageList: imageList }),
            success: function (data) {
                if (typeof data.redirect == 'string')
                    window.location = data.redirect;
            }
        });
    }
    else {
        var inputTitle = $("#comicSetTitle").val();
        if (!inputTitle || inputTitle == "undefined") {
            alert("You need a title!");
        }
        else {
            var positions = [];
            jQuery(".uploadedImagePosition").each(function (index, element) {
                positions.push(jQuery(this).val());
            });
            var imageList = uploadImageList;
            for (var i = 0; i < positions.length; i++) {
                imageList[i].imagePosition = positions[i];
            }
            $.each(imageList, function (index, imageData) {
                imageData.comicSetTitle = inputTitle;
            });
            imageList = sortByKey(imageList, "imagePosition");
            $.ajax({
                url: '/uploadComicSet',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    comicSetTitle: inputTitle,
                    allowOthersToEdit: allowOthersToEdit,
                    imageList: imageList }),
                success: function (data) {
                    if (typeof data.redirect == 'string')
                        window.location = data.redirect;
                }
            });
        }
    }
};
