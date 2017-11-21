
var audioController = (function($) {

    var controller = {
        wavesurfer: null,
        audioPlaying: false,
        currentAudioIndex: null,
        nextAudioIndex: null,
        previousPlayingAudio: null,

        /**
         * @markup -
         * @description -
         */
        audioElementPlayControls :
            `<div id="controls-container">
                    <button id="controls-prev" class="controls">PREV</button>
                    <button id="controls-play" class="controls"></button>
                    <button id="controls-next" class="controls">NEXT</button>
                </div>`,

        /**
         * @markup -
         * @description -
         */
        audioElementControlsExpander :
            `<div id="controls-expander"><button>See more stories</button></div>`,

        /**
         * @markup -
         * @description -
         */
        audioElementControlsMinimizer:
            `<div id="controls-minimizer">X</div>`,

        /**
         * @markup -
         * @description -
         */
        auidioElementStoriesList:
            `<div id="audio-list-container">
            </div>`,


        /**
         * @method -
         * @description -
         */
        animateIntroStart() {
            $('#audio-element--button-init').fadeOut(500, () => {
                var fadeeOut = anime({
                    targets: '#img-first',
                    opacity: 0,
                    delay: 100,
                    duration: '1000',
                    easing: 'linear',
                    begin: () => backgroundFadeIn(),
                    complete: () => introBallGrow()
                });

                var backgroundFadeIn = () => {
                    var imageFadeIn= anime({
                        targets: '#img-second',
                        opacity: '1',
                        duration: '1000',
                        easing: 'linear'
                    });
                };

                var introBallGrow = () => {
                    $('#wave-form-sphere').addClass('grow');
                    setTimeout(() => controller.appendControls(), 1000);
                };
            });

        },


        /**
         * @method -
         * @description -
         */
        appendControls() {
            // $('#audio-element').prepend(controller.audioElementControlsExpander);
            $('#audio-element--container').append(controller.audioElementPlayControls);
            $('#controls-play').on('click', controller.handlePlayOrPause);
            $('#controls-next').on('click', controller.handlePlayNext);
            $('#controls-prev').on('click', controller.handlePlayPrev);
            $('#controls-expander').on('click', function() {
                controller.expandControls();
            });
            controller.queRandomAudio();
        },


        /**
         * @method -
         * @description -
         */
        handlePlayOrPause() {
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


        /**
         * @method -
         * @description -
         */
        handlePlayNext() {
            var nextAudio,
                nextAudioIndex,
                currentAudioIndex = audioModel.stories.map((story) => story.public_url).indexOf(controller.playingAudio.public_url);
            controller.wavesurfer.destroy();
            controller.handlePlayOrPause();
            if (currentAudioIndex === audioModel.stories.length - 1) {
                nextAudioIndex = 0;
            } else {
                nextAudioIndex = currentAudioIndex + 1;
            }
            nextAudio = audioModel.stories[nextAudioIndex];
            controller.previousPlayingAudio = controller.playingAudio;
            controller.playingAudio = nextAudio;
            controller.loadAudio(nextAudio);
        },


        /**
         * @method -
         * @description -
         */
        handlePlayPrev() {
            var prevAudio,
                prevAudioIndex,
                currentAudioIndex = audioModel.stories.map((story) => story.public_url).indexOf(controller.playingAudio.public_url);
            controller.wavesurfer.destroy();
            controller.handlePlayOrPause();
            if (currentAudioIndex === 0) {
                prevAudioIndex = audioModel.stories.length - 1;
            } else {
                prevAudioIndex =  currentAudioIndex - 1;
            }
            prevAudio = audioModel.stories[prevAudioIndex];
            controller.playingAudio = prevAudio;
            controller.loadAudio(prevAudio);
        },

        /**
         * @method -
         * @description -
         */
        // expandControls() {
        //     $('#controls-expander').fadeOut(500, () => {
        //         expandElementContainer = anime({
        //             targets: '#audio-element',
        //             width: '100%',
        //             backgroundColor: 'rgba(100,100,100, 1.0)',
        //             duration: '1000',
        //             easing: 'linear',
        //             complete: () => controller.appendMinimizer()
        //         });
        //     });
        // },

        /**
         * @method -
         * @description -
         */
        // appendMinimizer() {
        //     $('#audio-element').append(controller.audioElementControlsMinimizer);
        //     $('#controls-minimizer').on('click', function(e) {
        //         controller.minimizeControls();
        //     });
        // },


        /**
         * @method -
         * @description -
         */
        // minimizeControls() {
        //     $('#controls-minimizer').fadeOut(500, () => {
        //         $('#controls-minimizer').remove();
        //         expandElementContainer = anime({
        //             targets: '#audio-element',
        //             width: '0',
        //             backgroundColor: 'rgba(100,100,100, 0)',
        //             duration: '1000',
        //             easing: 'linear',
        //             complete: () => $('#controls-expander').fadeIn()
        //         });
        //     });
        // },

        /**
         * @method -
         * @description -
         */
        queRandomAudio() {
            var randomStory = audioModel.stories[Math.floor(Math.random() * audioModel.stories.length)];
            controller.loadAudio(randomStory);
            controller.playingAudio = randomStory;
        },

        /**
         * @method -
         * @description -
         */
        loadAudio(audio) {
            controller.wavesurfer = WaveSurfer.create({
                container: '#waveform-player',
                backEnd: 'MediaElement',
                hideScrollbar: true,
                scrollParent: true,
                progressColor: '#36b084',
                cursorColor: '#36b084'
            });

            controller.wavesurfer.load(audio.public_url);
            controller.wavesurfer.on('ready', function () {
                controller.handlePlayOrPause();
            });
        },

        /**
         * @method -
         * @description -
         */
        init() {
            $('#audio-element--button-init').one('click', (e) => {
                controller.animateIntroStart();
            });
        }
    };

    return {
        init: controller.init
    };

})(jQuery);