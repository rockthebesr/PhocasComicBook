$(function () {
    'use strict';
    // SHOP ELEMENT
    var shop = document.querySelector('#shop');
    var data = theComicSet;
    // INITIALIZE
    (function init() {
        addRatingWidget(buildShopItem(data), data);
    })();
    // Create Html
    function createHtml(data, statRating) {
        if (data.length === 0)
            return '';
        else
            var title = data[0].comicSetTitle;
        function plural(numberofR) {
            if (numberofR < 2)
                return numberofR + ' rating';
            else
                return numberofR + ' ratings';
        }
        var before = '<div class="c-shop-item__details" id = "details">' +
            '<div class = "c-rating-title">' + '<h3 class="c-shop-item__title">' + title + '</h3>' +
            '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
            '<p id = "rateStat">' + '~ ' + statRating.avgRate.toFixed(2) + ' avg rating' + ' - ' + plural(statRating.numberofR) + ' ~' + '</p>' +
            '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
            '</div>' +
            '<p class="c-shop-item__description">' + title + ' dolor sit amet, consectetur adipisicing elit.' +
            'Commodi consectetur similique ullam natus ut debitis praesentium. Commodi consectetur similique ullam natus ut debitis praesentium.' + '</p>';
        var link = '';
        for (var i = 0; i < data.length; i++) {
            link += '<img src=' + data[i].imageUrl + ' style="width:200px;height:200px;border: 0;">';
            link += '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';
            if ((i + 1) % 4 === 0 && i !== 0) {
                link += '<br>' + '<br>' + '<br>';
            }
        }
        return before + link;
    }
    // BUILD SHOP ITEM
    function buildShopItem(data) {
        var shopItem = document.createElement('anything');
        var html = createHtml(data.imageList, data);
        shopItem.innerHTML = html;
        shop.appendChild(shopItem);
        return shopItem;
    }
    // ADD RATING WIDGET
    function addRatingWidget(shopItem, data) {
        var ratingElement = shopItem.querySelector('.c-rating');
        var ratingElementTitle = shopItem.querySelector('.c-rating-title');
        var currentRating = data.avgRate;
        var maxRating = 5;
        var s = rating_title(ratingElementTitle, currentRating, maxRating, null);
    }
});
//# sourceMappingURL=comic_display.js.map