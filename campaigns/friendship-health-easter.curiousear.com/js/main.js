(function($) {

  //
  // Globals -------------------------------------------------------------------
  //
  var AUDIO_JSON_URL = "http://storybox-145021.appspot.com/api/audio/list?location=friendship-health-easter";

  //
  // AudioPlayer ---------------------------------------------------------------
  //
  var AudioPlayer;
  (function () {

    function getJSON (url, cb) {
      $.getJSON( url, function( data ) {
        cb(data);
      });
    }

    // Used to fix any changes that may happen as the API changes
    // {
    //   timestamp: "2017-04-12T03:53:31.993000",
    //   public_url: "https://storage.googleapis.com/storybox-pdx/423f9e21-904b-4fd6-8296-c467aa81e671.mp4",
    //   prompt: "default",
    //   length_in_seconds: 23,
    //   location_recorded: "friendship-health-easter"
    // }
    function dataConverter (dataIn) {
      var dataOut = dataIn;
      return dataOut;
    }

    function createAudioDomElement(model) {
      var htmlString = '';
      htmlString += '<div class="g-cell audio__item">';
      htmlString += '<audio controls="controls" preload="none">';
      htmlString += '<source src="' + model.public_url + '">';
      htmlString += '</audio>';
      htmlString += '</div>';
      $("#audioContainer").append(htmlString);
    }

    AudioPlayer = function () {}
    AudioPlayer.prototype = {
      Create : function (url) {
        getJSON(url, function (data) {
          var convertedData = dataConverter(data);

          if (!(convertedData instanceof Array))
            return;

          convertedData.forEach(function (model) {
            createAudioDomElement(model);
          });
        });
      }
    };
  })();

  //
  // Main ----------------------------------------------------------------------
  //
  $(document).ready(function() {
    window.audioPlayer = new AudioPlayer();
    audioPlayer.Create(AUDIO_JSON_URL);
  });

})($)
