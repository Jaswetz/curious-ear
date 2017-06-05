// requires jQuery
// requires momentjs
(function($) {
  //
  // Globals -------------------------------------------------------------------
  //
  var AUDIO_JSON_URL = "https://storybox-145021.appspot.com/api/audio/list?location=meals-on-wheels";
  //
  // AudioPlayer ---------------------------------------------------------------
  //
  var AudioList;
  (function () {

    function getJSON (url, cb) {
      $.getJSON( url, function( data ) {
        cb(data);
      });
    }
    // Used to convert data depending on how it comes
    //
    // [ {}, {} ,{}] // curently
    //
    function dataConverter (dataIn) {
      var dataOut = [];
      if (dataIn instanceof Array) {
        dataIn.forEach(function (model) {
          dataOut.push(model);
        });
      }
      return dataOut;
    }
    // Used to fix any changes that may happen as the API changes
    // {
    //   timestamp: "2017-04-12T03:53:31.993000",
    //   public_url: "https://storage.googleapis.com/storybox-pdx/423f9e21-904b-4fd6-8296-c467aa81e671.mp4",
    //   prompt: "default",
    //   length_in_seconds: 23,
    //   location_recorded: "friendship-health-easter"
    // }
    function modelConverter (modelIn) {
      var modelOut = {};
      if (modelIn instanceof Object) {
        var recordingDuration = moment.duration(modelIn.length_in_seconds, 'seconds');
        modelOut.timestamp = moment.utc(modelIn.timestamp).local().format("dddd, MMMM Do YYYY, h:mm a") || "No Time Stamp";
        modelOut.public_url = modelIn.public_url || "#";
        modelOut.duration = recordingDuration.humanize();
      }
      return modelOut;
    }

    function createAudioDomElement(model) {
      var htmlString = '';
      htmlString += '<p>' + model.timestamp + "</p>";
      htmlString += '<p class="margin-left">' + model.duration + "</p>";
      htmlString += '<div class="g-cell audio__item margin-bottom--large">';
      htmlString += '<audio controls="controls" preload="none">';
      htmlString += '<source src="' + model.public_url + '">';
      htmlString += '</audio>';
      htmlString += '</div>';
      $("#audioContainer").append(htmlString);
    }

    AudioList = function () {}
    AudioList.prototype = {
      Create : function (url) {
        getJSON(url, function (data) {
          var convertedData = dataConverter(data);
          convertedData.forEach(function (model) {
            createAudioDomElement(modelConverter(model));
          });
        });
      }
    };
  })();
  //
  // Main ----------------------------------------------------------------------
  //
  $(document).ready(function() {
    audioList = new AudioList();
    audioList.Create(AUDIO_JSON_URL);
  });
})($)
