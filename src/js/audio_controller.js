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
                        begin: () => introBallCycle()
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

        init() {
            controller.animateIntroStart();
        }

    };

    return {
        init: controller.init
    };

})(jQuery);