
var audioController = (function($) {

    var controller = {
        audioPlaying: false,
        wavesurfer: null,
        playingAudioIndex: null,
        previousPlayingAudio: null,

        audioElementPlayControls :
            `<div id="controls-container">
                    <button id="controls-prev" class="controls">PREV</button>
                    <button id="controls-play" class="controls"></button>
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
            $('#controls-play').on('click', controller.handlePlayAndPause);
            $('#controls-next').on('click', controller.handlePlayNext);
            $('#controls-expander').on('click', function() {
                controller.expandControls();
            });
            controller.queRandomStory();
        },

        handlePlayAndPause() {
            if (controller.audioPlaying) {
                $('#controls-play').removeClass('pause');
                controller.wavesurfer.pause();
                controller.audioPlaying = false;
            } else {
                $('#controls-play').addClass('pause');
                controller.wavesurfer.play();
                controller.audioPlaying = true;
            }
        },

        handlePlayNext() {
            controller.wavesurfer.destroy();
            controller.queRandomStory();
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
            controller.previousPlayingAudio = controller.playingAudio;
            var randomStory = audioModel.stories[Math.floor(Math.random() * audioModel.stories.length)];
            controller.loadRandomStory(randomStory.public_url);
            controller.playingAudio = randomStory;
        },

        loadRandomStory(randomStory) {
            controller.wavesurfer = WaveSurfer.create({
                container: '#waveform-player',
                hideScrollbar: true,
                scrollParent: true,
                progressColor: '#36b084'
            });

            controller.wavesurfer.load(randomStory);
            controller.wavesurfer.on('ready', function () {
                controller.handlePlayAndPause();
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