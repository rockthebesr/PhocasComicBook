$(function() {
    'use strict';
    // SHOP ELEMENT
    var shop = document.querySelector('#shop');
    var data = imgdata;

    // INITIALIZE
    (function init() {
        for (var i = 0; i < data.length; i++) {
            addRatingWidget(buildShopItem(data[i]), data[i]);
        }
    })();

    // Create Html
    function createHtml(data){
        if(data.length === 0) return '';
        else
            var title = data[0].comicSetTitle;

        var before = '<div class="c-shop-item__details">' +
            '<h3 class="c-shop-item__title">' + title + '</h3>' +
            '<p class="c-shop-item__description">' + 'Fresh kicks dolor sit amet, consectetur adipisicing elit.' +
            'Commodi consectetur similique ullam natus ut debitis praesentium. Commodi consectetur similique ullam natus ut debitis praesentium.' + '</p>';

        var link = '';
        for(var i = 0; i < Math.min(4, data.length); i++){
            link += '<a href="/comic_page/' + title + '">';
            link += '<img src=' + '../'+ data[i].imageUrl + ' style="width:200px;height:200px;border:0;">' + '</a>';
            link += '&nbsp'+ '&nbsp'+'&nbsp'+ '&nbsp';
        }
        if(data.length < 4){
            for(var i = 4; i > data.length; i--){
                link += '<a href="/edit_comic/' + title + '">';
                link += '<img src=' + '../images'+ '/add.jpg' + ' style="width:200px;height:200px;border:0;">' + '</a>';
                link += '&nbsp'+ '&nbsp'+'&nbsp'+ '&nbsp';
            }
        }
        var after = '<ul class="c-rating"></ul>' + '</div>';

        return before + link + after;
    }


    // BUILD SHOP ITEM
    function buildShopItem(data) {
        var shopItem = document.createElement('div');
        var html = createHtml(data);

        shopItem.classList.add('c-shop-item');
        shopItem.innerHTML = html;
        shop.appendChild(shopItem);
        return shopItem;
    }
    // ADD RATING WIDGET
    function addRatingWidget(shopItem, data) {
        var ratingElement = shopItem.querySelector('.c-rating');
        var currentRating = 4; //data.rating;
        var maxRating = 5;
        var callback = function(rating) { alert(rating); };
        var r = rating(ratingElement, currentRating, maxRating, callback);
    }
    //$('#form').html('Hello World!');
});

