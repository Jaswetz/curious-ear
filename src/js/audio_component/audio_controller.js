/**
 * Created by keenan on 10/21/17.
 */

var audioController = (function($) {

    var controller = {
        audioElementPlayControls :
            `<div id="controls-container">
                    <button id="controls-prev" class="controls">PREV</button>
                    <button id="controls-play" class="controls">PLAY</button>
                    <button id="controls-next" class="controls">NEXT</button>
                </div>`,

        audioElementControlsExpander :
        `<div id="controls-expander"><button>See more stories</button></div>`,

        audioElementControlsMinimizer:
        `<div id="controls-minimizer">X</div>`,

        auidioElementStoriesList:
        `<div id="audio-list-container">
        </div>`,


        animateIntroStart() {
            $('#audio-element--button-init').fadeOut(500, () => {
                introBall = anime({
                    targets: '#wave-form-sphere',
                    width: '500px',
                    height: '500px',
                    duration: '1000',
                    easing: 'linear',
                    complete: () => controller.appendControls()
                });
            });

        },

        appendControls() {
            $('#audio-element').prepend(controller.audioElementControlsExpander);
            $('#wave-form-sphere').append(controller.audioElementPlayControls);
            $('#controls-expander').on('click', function() {
                controller.expandControls();
            });
        },

        expandControls() {
            $('#controls-expander').fadeOut(500, () => {
                expandElementContainer = anime({
                    targets: '#audio-element',
                    width: '100%',
                    backgroundColor: 'rgba(100,100,100, 1.0)',
                    duration: '1000',
                    easing: 'linear',
                    complete: () => controller.appendMinimizer()
                });
            });
        },

        appendMinimizer() {
            $('#audio-element').append(controller.audioElementControlsMinimizer);
            $('#controls-minimizer').on('click', function(e) {
                controller.minimizeControls();
            });
        },

        minimizeControls() {
            $('#controls-minimizer').fadeOut(500, () => {
                $('#controls-minimizer').remove();
                expandElementContainer = anime({
                    targets: '#audio-element',
                    width: '0',
                    backgroundColor: 'rgba(100,100,100, 0)',
                    duration: '1000',
                    easing: 'linear',
                    complete: () => $('#controls-expander').fadeIn()
                });
            });
        },

        queRandomStory() {
            var randomStory = audioModel.stories[Math.floor(Math.random() * audioModel.stories.length)];
            controller.loadRandomStory(randomStory.public_url);
        },

        loadRandomStory(randomStory) {
            $("#wave-form-sphere").append(`<div id="waveform-player"></div>`);
            var wavesurfer = WaveSurfer.create({
                container: '#waveform-player',
                hideScrollbar: true,
                scrollParent: true,
                progressColor: '#36b084'
            });
            wavesurfer.load(randomStory);
            wavesurfer.on('ready', function () {
                wavesurfer.play();
            });
        },

        init() {
            $('#audio-element--button-init').on('click', (e) => {
                controller.animateIntroStart();
            });
        }

    };

    return {
        init: controller.init
    };

})(jQuery);