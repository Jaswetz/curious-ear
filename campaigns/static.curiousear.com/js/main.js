// requires jQuery
// requires momentjs
(function($) {

  var DOM_CONTAINER = "#audioContainer";
  var ROOT_URL = "http://static.curiousear.com/";
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
    // Used to fix any changes that may happen as the API changes
    // {
    //   timestamp: "2017-04-12T03:53:31.993000",
    //   public_url: "https://storage.googleapis.com/storybox-pdx/423f9e21-904b-4fd6-8296-c467aa81e671.mp4",
    //   prompt: "default",
    //   length_in_seconds: 23,
    //   location_recorded: "friendship-health-easter"
    // }
    var modelConverterIndex = 0;
    function modelConverter (modelIn) {
      var modelOut = {};
      if (modelIn instanceof Object) {
        var recordingDuration = moment.duration(modelIn.length_in_seconds, 'seconds');
        modelOut.timestamp = moment.utc(modelIn.timestamp).local().format("dddd, MMMM Do YYYY, h:mm a") || "No Time Stamp";
        modelOut.public_url = modelIn.public_url || "#";
        modelOut.duration = recordingDuration.humanize();
        modelOut.htmlId = "audio" + modelConverterIndex;
        modelConverterIndex++;
        // get filename & create share url
        var parts = modelIn.public_url.split("/");
        var filename = parts[parts.length - 1];
        modelOut.share_url = "http://static.curiousear.com/story.html?f=" + filename;
      }
      return modelOut;
    }

    function createAudioDomElement(model) {
      var htmlString = '';
      // htmlString += '<p>' + model.timestamp + "</p>";
      // htmlString += '<p>' + model.duration + "</p>";
      htmlString += '<div class="g-cell">';
      htmlString += '<audio class="center" id="' + model.htmlId + '" controls="controls" preload="none">';
      htmlString += '<source src="' + model.public_url + '">';
      htmlString += '</audio>';
      htmlString += '</div>';
      htmlString += '<div class="g-cell margin-bottom--large">';
      htmlString += '<a class="center" href="'+ model.share_url +'" target="__blank">Share</a>';
      // htmlString += '<div><a href="'+ model.share_url +'" target="__blank">Share</a>:<input class="g-cell--full" type="text" name="shareurl" value="' + model.share_url + '" onClick="this.setSelectionRange(0, this.value.length)"></div>';
      htmlString += '</div>';
      $(DOM_CONTAINER).append(htmlString);
    }

    AudioList = function () {}
    AudioList.prototype = {
      Create : function (url, dataConverter) {
        getJSON(url, function (data) {
          // Check if empty or error
          console.log(data);
          if (data instanceof Array && data.length == 0) {return;}

          // Convert Data
          var convertedData = dataConverter(data);
          var modelCollection = [];
          convertedData.forEach(function (model) {
            modelCollection.push(modelConverter(model));
          });
          // Create Play Button
          var player = new Player(modelCollection);
          // Create List
          modelCollection.forEach(function (model) {
            createAudioDomElement(model);
          });
        });
      }
    };
  })();

  //
  // Player --------------------------------------------------------------------
  //
  var PLAYING_CLASS_NAME = "play-button-spin";

  var Player = function (data) {
    this.data = data;
    this.createDomPlayButton();
  };
  Player.prototype = {
    index : 0,
    getAudioUrl : function (index) { return this.data[index].public_url;},
    getAudioModelByIndex : function (index) {
      if (this.data != null &&
          this.data.length > index) {
        return this.data[index];
      }
      return null;
    },
    createDomPlayButton : function () {
      // Create Play Button
      var $playerHolder = $('<div class="g-cell"></div>');
      this.$playerImage = $('<img alt="Play All" class="center" src="'+ ROOT_URL + 'svg/play-button-2.svg' +'" style="cursor:pointer;width:200px;height:auto;margin-bottom:5em;max-width:100%;"/>');
      this.$playerImage.click(this.playBtnPressed.bind(this));
      $playerHolder.append(this.$playerImage);
      $(DOM_CONTAINER).append($playerHolder);
    },
    playAudio : function (audioModel) {
      if (audioModel === null) { return; }
      var $audio = $("#" + audioModel.htmlId);
      var audio = $audio.get(0);
      if (audio !== null) {
        if (audio.currentTime === 0) {
          audio.addEventListener("ended", this.handleAudioFinished.bind(this));
        }
        // Google Analytics
        if (typeof ga === "function") {
          ga('send', 'event', 'Audio', 'play');
        }
        audio.play();
      }
    },
    stopAudio: function(audioModel) {
      if (audioModel === null) { return; }
      var $audio = $("#" + audioModel.htmlId);
      var audio = $audio.get(0);
      if (audio !== null) {
        audio.pause();
      }
    },
    handleAudioFinished : function () {
      this.index++;
      this.playAudio(this.getAudioModelByIndex(this.index));
    },
    playBtnPressed : function (e) {
      if (this.$playerImage.hasClass(PLAYING_CLASS_NAME)) { // playing
        this.$playerImage.removeClass(PLAYING_CLASS_NAME);
        this.stopAudio(this.getAudioModelByIndex(this.index));
      } else {
        this.$playerImage.addClass(PLAYING_CLASS_NAME);
        this.playAudio(this.getAudioModelByIndex(this.index));
      }
    }
  };
  //
  // Main ----------------------------------------------------------------------
  //
  function passThroughDataConverter (dataIn) {
    var dataOut = [];
    if (dataIn instanceof Array) {
      dataIn.forEach(function (model) {
        dataOut.push(model);
      });
    }
    return dataOut;
  }
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
  function shuffleDataConverter (dataIn) {
    var dataOut = [];
    if (dataIn instanceof Array) {
      shuffledDataIn = shuffle(dataIn);
      shuffledDataIn.forEach(function (model) {
        dataOut.push(model);
      });
    }
    return dataOut;
  }
  window.CreateAudioList = function (location, featured) {
    $(document).ready(function() {
      audioList = new AudioList();
      if (featured) {
        audioList.Create("http://api.curiousear.com/audio/featured", shuffleDataConverter);
      } else {
        audioList.Create("https://api.curiousear.com/audio/list?location=" + location, passThroughDataConverter);
      }
    });
  }
})($)
