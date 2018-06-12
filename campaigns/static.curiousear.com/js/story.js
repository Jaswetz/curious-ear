// requires jQuery
(function($) {
  //
  // Globals -------------------------------------------------------------------
  //
  var AUDIO_STORAGE_URL = "https://storage.googleapis.com/storybox-pdx/";
  //
  // Get URI Quiry String ------------------------------------------------------
  //
  function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
  //
  // AudioPlayer ---------------------------------------------------------------
  //
  var AudioPlayer;
  (function () {
    function createAudioDomElement(model) {
      var htmlString = '';
      htmlString += '<div class="g-cell audio__item margin-bottom--small" style="text-align:center">';
      htmlString += '<audio controls="controls" preload="none">';
      htmlString += '<source src="' + model.url + '">';
      htmlString += '</audio>';
      htmlString += '</div>';
      $("#audioContainer").append(htmlString);
    }
    AudioPlayer = function () {}
    AudioPlayer.prototype = {
      Create : function (url) {
        createAudioDomElement({ url : url});
      }
    };
  })();
  //
  // Main ----------------------------------------------------------------------
  //
  $(document).ready(function() {
    var audioPlayer = new AudioPlayer();
    var filename = getUrlVars()["f"];
    console.log(filename);
    audioPlayer.Create(AUDIO_STORAGE_URL + filename);
  });
})($)
