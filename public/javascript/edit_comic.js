var $ = require("./jquery-2.2.0.js");



$('#btmSaveComicSet').on('click', function () {
    alert("working");
});

var saveComicSet = function() {
    var title = $("#comicSetTitle").val();
    var imageList = uploadImageList;
    $.ajax({
        url: '/uploadComicSet',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({number:1})
    })
};