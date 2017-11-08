// requires jQuery
// requires momentjs
(function($) {
  //
  // Globals -------------------------------------------------------------------
  //
  var AUDIO_JSON_URL = "https://api.curiousear.com/audio/list?location=";
  //
  // AudioPlayer ---------------------------------------------------------------
  //
  var AudioList;
  (function () {

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

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
        // shuffledDataIn = shuffle(dataIn);
        // shuffledDataIn.forEach(function (model) {
        //   dataOut.push(model);
        // });
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
        // console.log(modelIn);
        var recordingDuration = moment.duration(modelIn.length_in_seconds, 'seconds');
        modelOut.timestamp = moment.utc(modelIn.timestamp).local().format("dddd, MMMM Do YYYY, h:mm a") || "No Time Stamp";
        modelOut.public_url = modelIn.public_url || "#";
        modelOut.duration = recordingDuration.humanize();
        // get filename & create share url
        var parts = modelIn.public_url.split("/");
        var filename = parts[parts.length - 1];
        modelOut.share_url = "http://static.curiousear.com/story.html?f=" + filename;
      }
      return modelOut;
    }

    function createAudioDomElement(model) {
      var htmlString = '';
      htmlString += '<p>' + model.timestamp + "</p>";
      htmlString += '<p>' + model.duration + "</p>";
      htmlString += '<div class="g-cell audio__item margin-bottom--small">';
      htmlString += '<audio controls="controls" preload="none">';
      htmlString += '<source src="' + model.public_url + '">';
      htmlString += '</audio>';
      htmlString += '</div>';
      htmlString += '<div class="g-cell audio__item margin-bottom--large">';
      htmlString += '<div class="g">';
      htmlString += '<div class="g-cell--1of3"><a href="'+ model.share_url +'" target="__blank" class="footer__link">Share</a>:</div>';
      htmlString += '<div class="g-cell--2of3"><input type="text" name="shareurl" value="' + model.share_url + '" onClick="this.setSelectionRange(0, this.value.length)"></div>';
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
  window.CreateAudioList = function (location) {
    $(document).ready(function() {
      audioList = new AudioList();
      audioList.Create(AUDIO_JSON_URL + location);
    });
  }
})($)
