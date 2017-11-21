//should be setup to recieve additional configuration from the server

//should be setup to switch to different story categories

var audioModel = (function($) {


    /**
     * @property - configuration to be used for audio module, TBD
     */
    var audio = {
        page: null,
        story_type: null,
        stories: [],
        AUDIO_JSON_URL: "http://api.curiousear.com/audio/featured",

        /**
         * @method
         * @description - fetches audio json from google cloud
         * @param - url for audio json
         */
        fetchStories(url) {
        $.getJSON(url , (stories) => {
            stories.forEach(function(story){
                audio.stories.push(audio.formatData(story));
            });
        })
        .done(() => {
            audio.toHTML();
        })
        .fail((err) => {
            console.log('error in ', err);
        });
        },

        /**
         * @method
         * @description - currently formats the time, will be used to format more as functionality is needed.
         * @param {Object} story to be formatted
         * @return {Object} formatted story
         */
        formatData(story) {
            var recordingDuration = moment.duration(story.length_in_seconds, 'seconds');
            story.timestamp = moment.utc(story.timestamp).local().format("dddd, MMMM Do YYYY, h:mm a") || "No Time Stamp";
            story.public_url = story.public_url || "#";
            story.duration = recordingDuration.humanize();
            return story;
        },

        /**
         * @method
         * @description - renders audio model to html
         */
        toHTML() {
                var audioElement =
                    `<div id="audio-element--container">
                        <div id="audio-element">
                            <div id="wave-form-sphere">
                                <button id="audio-element--button-init">Listen to Our Stories</button>
                                <div id="waveform-player"></div>
                                <div class="bg-img" id="img-first"></div>
                                <div class="bg-img" id="img-second"></div>
                            </div>
                        </div>
                    </div>`;
                $('#audioContainer').append(audioElement);
                audioController.init();
            },

        /**
         * @method
         * @description - initializes the audio component model.
         */
        init() {
            audio.fetchStories(audio.AUDIO_JSON_URL);
        },
    };


    return {
        init: audio.init,
        stories: audio.stories
    };

})(jQuery);


audioModel.init();