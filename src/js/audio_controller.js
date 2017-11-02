/**
 * Created by keenan on 10/21/17.
 */

var audioController = (function($) {

    var controller = {

            animateIntroStart() {
                var introBall = anime({
                    targets: '#background-animation',
                    left: '50%',
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: '.1',
                    duration: '2000',
                    easing: 'easeInOutQuad',
                    complete: () => {
                        introBallGrow();
                    }
                });

                var introBallGrow = () => {
                     introBall = anime({
                        targets: '#background-animation',
                        width: '700px',
                        height: '700px',
                        duration: '3000',
                        opacity: '.9',
                        easing: 'linear',
                        complete: () => controller.queRandomStory()
                    });
                };

                var introBallCycle = () => {
                    introBall = anime({
                        targets: '#background-animation',
                        background: [
                            { value: 'url("images/img--marc.jpg")', duration: 200, easing: 'linear', },
                            { value: 'url("images/clay_ball.jpg")', duration: 200, easing: 'linear',  },
                            { value: 'url("images/img--marc.jpg")', duration: 200, easing: 'linear', },
                            { value: 'url("images/clay_ball.jpg")', duration: 200, easing: 'linear',  },
                            { value: 'url("images/img--marc.jpg")', duration: 200, easing: 'linear', },
                            { value: 'url("images/clay_ball.jpg")', duration: 200, easing: 'linear',  },
                            { value: 'url("images/img--marc.jpg")', duration: 200, easing: 'linear', },
                            { value: 'url("images/clay_ball.jpg")', duration: 200, easing: 'linear', }
                        ],
                    });
                };
            },

        queRandomStory() {
            var randomStory = audioModel.stories[Math.floor(Math.random() * audioModel.stories.length)];
            controller.loadRandomStory(randomStory.public_url);
        },

        loadRandomStory(randomStory) {
            $("#background-animation").append(`<div id="waveform-player"></div>`);
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

            $('#audio-initializer').on('click', (e) => {
                controller.animateIntroStart();
            });
        }

    };

    return {
        init: controller.init
    };

})(jQuery);