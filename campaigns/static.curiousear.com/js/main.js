// requires jQuery
(function($) {

  //
  // CONSTANTS -----------------------------------------------------------------
  //
  var DOM_CONTAINER = "#audioContainer";
  var ROOT_URL = "http://static.curiousear.com/";
  var API_URL = "http://api.curiousear.com/";

  //
  // Private Functions ---------------------------------------------------------
  //
  function valueOrDefault (value, def) {
    var result = def;
    if (value) { result = value; }
    else if (value === false) {result = value; } // Handle False
    return result;
  }
  //
  // AudioPlayer ---------------------------------------------------------------
  //
  var AudioList = function (config) {
    
    config = config || {};
    this.config = {};
    // Show a full list of all the stories
    // TRUE -  All stories listed
    // FALSE - Only the story currently playing is displayed
    this.config.showList = valueOrDefault(config.showList, true);
    // Shuffle Audio Story Order
    this.config.shuffle = valueOrDefault(config.shuffle, true);
    // Show Title
    this.config.showTitle = valueOrDefault(config.showTitle, false);
  };
  (function () {

    function getJSON (url, cb) {
      $.getJSON( url, function( data ) {
        cb(data);
      });
    }
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
        modelOut.public_url = modelIn.public_url || "#";
        modelOut.htmlId = "audio" + modelConverterIndex;
        modelOut.htmlContainerId = "container" + modelConverterIndex;
        modelConverterIndex++;
        // get filename & create share url
        var parts = modelIn.public_url.split("/");
        var filename = parts[parts.length - 1];
        modelOut.share_url = "http://static.curiousear.com/story.html?f=" + filename;
        modelOut.title = modelIn.tags[0] || "";
      }
      return modelOut;
    }

    function createAudioDomElement(model, config) {
      var htmlString = '';
      htmlString += '<div class="g-cell audioContainer" id="' + model.htmlContainerId + '" >';
      if (config.showTitle)
      {
        htmlString += '<p class="center margin-bottom--small">' + model.title + "</p>";
      }
      htmlString += '<audio class="center" id="' + model.htmlId + '" controls="controls" preload="none">';
      htmlString += '<source src="' + model.public_url + '">';
      htmlString += '</audio>';
      htmlString += '<div class="g-cell margin-bottom--large">';
      htmlString += '<a class="center" href="'+ model.share_url +'" target="_blank'+ model.htmlId +'">Share</a>';
      htmlString += '</div>';
      htmlString += '</div>';
      $(DOM_CONTAINER).append(htmlString);
    }
    
    // Proto    
    AudioList.prototype = {
      Create : function (url) {
        var that = this;
        getJSON(url, function (data) {
          // Check if empty or error
          // console.log(data);
          if (data instanceof Array && data.length == 0) {return;}

          // Convert Data
          if (that.config.shuffle) {
            var convertedData = shuffleDataConverter(data);
          } else {
            var convertedData = passThroughDataConverter(data);
          }
          var modelCollection = [];
          convertedData.forEach(function (model) {
            modelCollection.push(modelConverter(model));
          });
          // Create Play Button
          var player = new Player(modelCollection);
          player.listenOnPlaying(that.hideAll.bind(that));
          player.listenOnStoppedPlaying(that.showAll.bind(that));
          // Create List
          modelCollection.forEach(function (model) {
            createAudioDomElement(model, that.config);
            // Attach OnPlay Handler
            var $audio = $("#" + model.htmlId);
            var audio = $audio.get(0);
            audio.onplay = player.stopPlayAll.bind(player);
          });
          that.modelCollection = modelCollection;
        });
      },
      hideAll : function () {
        // Stop All Playing
        this.modelCollection.forEach(function (model) {
          var $audio = $("#" + model.htmlId);
          var audio = $audio.get(0);
          audio.pause();
        });
        // Hide All
        var els = document.getElementsByClassName("audioContainer");
        for (var i = 0; i < els.length; i++)
        {
          var el = els[i];
          el.style.display = "none";
        }
      },
      showAll : function () {
        var els = document.getElementsByClassName("audioContainer");
        for (var i = 0; i < els.length; i++)
        {
          var el = els[i];
          el.style.display = "block";
        }
      },
    };
  })();
  //
  // END AudioPlayer -----------------------------------------------------------
  //

  //
  // Player --------------------------------------------------------------------
  //
  // Constructor
  var Player = function (data) {
    this.data = data;
    this.createDomPlayButton();
  };
  // Prototype
  (function () {

    var PLAYING_CLASS_NAME = "play-button-spin";

    Player.prototype = {
      index : 0,
      listenOnPlaying : function (cb) {
        this.onPlayingCallback = cb;
      },
      listenOnStoppedPlaying : function (cb) {
        this.onStoppedPlayingCallback = cb;
      },
      getAudioUrl : function (index) { return this.data[index].public_url;},
      getAudioModelByIndex : function (index) {
        if (this.data !== null ||
            this.data !== undefined ||
            this.data.length === 0) {
          if (index >= this.data.length) {
            index = 0;
            this.index = 0;
          }
          return this.data[index];
        }
        return null;
      },
      createDomPlayButton : function () {
        // Create Play Button
        $(DOM_CONTAINER).append($('<p class="center margin-bottom--small">Play All:</p>'));
        var $playerHolder = $('<div class="g-cell"></div>');
        this.$playerImage = $('<img alt="Play All" class="center" src="'+ ROOT_URL + 'svg/play-button-2.svg' +'" style="cursor:pointer;width:200px;height:auto;margin-bottom:5em;max-width:100%;"/>');
        this.$playerImage.click(this.playBtnPressed.bind(this));
        $playerHolder.append(this.$playerImage);
        $(DOM_CONTAINER).append($playerHolder);
        // Create Hidden Play All Player
        this.$playAllPlayer = $('<audio autoplay style="display:none"></audio>');
        $(DOM_CONTAINER).append(this.$playAllPlayer);
        var player = this.$playAllPlayer.get(0);
        if (player !== null) {
          player.addEventListener("ended", this.handleAudioFinished.bind(this));
        }
        // Or one at a time:
        $(DOM_CONTAINER).append($('<p id="orOneAtATime" class="center margin-bottom--large">Or one at a time:</p>'));
      },
      playAudio : function (audioModel) {
        // console.log(audioModel);
        var player = this.$playAllPlayer.get(0);
        if (player !== null) {
          player.src = audioModel.public_url;
          player.play();
        }
      },
      stopAudio: function(audioModel) {
        // console.log(audioModel);
        var player = this.$playAllPlayer.get(0);
        if (player !== null) {
          player.pause();
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
          if (this.onStoppedPlayingCallback) {
            this.onStoppedPlayingCallback();
          }
          // Show orOneAtATime
          $("#orOneAtATime").show();
        } else {
          this.$playerImage.addClass(PLAYING_CLASS_NAME);
          this.playAudio(this.getAudioModelByIndex(this.index));
          if (this.onPlayingCallback) {
            this.onPlayingCallback();
          }
          // Hide orOneAtATime
          $("#orOneAtATime").hide();
        }
      },
      stopPlayAll : function () {
        if (this.$playerImage.hasClass(PLAYING_CLASS_NAME)) {
          this.$playerImage.removeClass(PLAYING_CLASS_NAME);
          this.stopAudio(this.getAudioModelByIndex(this.index));
        }  
      }
    };
  })();
  //
  // END Player ----------------------------------------------------------------
  //

  //
  // Public Methods ------------------------------------------------------------
  //
  window.CreateAudioList = function (location, featured, config) {
    $(document).ready(function() {
      audioList = new AudioList(config);
      if (featured) {
        audioList.Create(API_URL + "audio/list?featured=true");
      } else {
        audioList.Create(API_URL + "audio/list?location=" + location);
      }
    });
  }
})($)
