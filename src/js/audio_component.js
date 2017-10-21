/**
 * Created by keenan on 10/21/17.
 */

var audioModule = (function($) {

    var audio = {};


    //need flexible way to load audio, such as url
        //must initialize on page load
        audio.init = function(url) {
            alert(url);
        };

    //audio data model

    //html audio component

    (function() {

    })();

    return {
        init: audio.init
    };

})(jQuery);

audioModule.init(window.location);