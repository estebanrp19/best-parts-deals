const spinner = {
    show: (status) => {

        const current_effect = 'bounce';

        function run_waitMe(effect) {
            $('body').waitMe({

                //none, rotateplane, stretch, orbit, roundBounce, win8, 
                //win8_linear, ios, facebook, rotation, timer, pulse, 
                //progressBar, bouncePulse or img
                effect: 'bounce',

                //place text under the effect (string).
                text: '',

                //background for container (string).
                bg: 'rgba(255,255,255,0.7)',

                //color for background animation and text (string).
                color: '#000',

                //max size
                maxSize: '',

                //wait time im ms to close
                waitTime: -1,

                //url to image
                source: '',

                //or 'horizontal'
                textPos: 'vertical',

                //font size
                fontSize: '',

                // callback
                onClose: function () { }

            });
        }

        run_waitMe(current_effect)
    },
    stop: () => {
        $("body").waitMe("hide");
    }
}