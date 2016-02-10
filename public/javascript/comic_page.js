///<reference path='jquery.d.ts'/>
jQuery(document).on('click', '#btnNext', function () {
    nextComicSet();
});
jQuery(document).on('click', '#btnPrev', function () {
    prevComicSet();
});
var nextComicSet = function () {
    if (nextSetTitle.length > 0) {
        window.location = '/comic_page/' + nextSetTitle;
    }
    else {
        alert("there is no next set!");
    }
};
var prevComicSet = function () {
    if (prevSetTitle.length > 0) {
        window.location = '/comic_page/' + prevSetTitle;
    }
    else {
        alert("there is no previous set!");
    }
};
//# sourceMappingURL=comic_page.js.map