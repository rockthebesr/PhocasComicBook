(function() {

  'use strict';

  /**
   * rating
   * 
   * @description The rating component.
   * @param {HTMLElement} el The HTMl element to build the rating widget on
   * @param {Number} currentRating The current rating value
   * @param {Number} maxRating The max rating for the widget
   * @param {Function} callback The optional callback to run after set rating
   * @return {Object} Some public methods
   */
  function rating_title(el, currentRating, maxRating, callback) {
    
    /**
     * stars
     * 
     * @description The collection of stars in the rating.
     * @type {Array}
     */
    var stars = [];
    var decimal = currentRating - Math.floor(currentRating);
    decimal = decimal.toFixed(2);

    /**
     * init
     *
     * @description Initializes the rating widget. Returns nothing.
     */
    (function init() {
      if (!el) { throw Error('No element supplied.'); }
      if (!maxRating) { throw Error('No max rating supplied.'); }
      if (!currentRating) { currentRating = 0; }
      if (currentRating < 0 || currentRating > maxRating) { throw Error('Current rating is out of bounds.'); }

      for (var i = 0; i < maxRating; i++) {
        var star = document.createElement('li');
        star.setAttribute('data-index', i);

        if (i < Math.floor(currentRating) ) {
          star.classList.add('c-rating__full');
          star.classList.add('is-active');
        }

        if(i === Math.floor(currentRating) ) {
          if(decimal < 0.50 && decimal > 0.00){
            star.classList.add('c-rating__half');
            star.classList.add('half-active');
          }
          else {
            star.classList.add('c-rating__nearfull');
            star.classList.add('near-active');
          }
        }
        else star.classList.add('c-rating__full');

        el.appendChild(star);
        stars.push(star);
      }
    })();

    /**
     * getRating
     *
     * @description Gets the current rating.
     * @return {Number} The current rating
     */
    function getRating() {
      return currentRating;
    }

    /**
     * Returns the setRating and getRating methods
     */
    return {
      getRating: getRating
    };

  }

  /**
   * Add to global namespace
   */
  window.rating_title = rating_title;

})();