jQuery(function ($) {
    var items = $("#content #details");
    var numItems = items.length;
    var perPage = 2;

    items.slice(perPage).hide();

    $("#pagination").pagination({
        items: numItems,
        itemsOnPage: perPage,
        cssStyle: "dark-theme",
        onPageClick: function (pageNumber) {
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;
            items.hide() // first hide everything, then show for the new page
                .slice(showFrom, showTo).show();
        }
    });
});
//# sourceMappingURL=pagination.js.map