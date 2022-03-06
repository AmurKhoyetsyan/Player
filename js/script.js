;(async function(){
    let loader = document.querySelector('.loader-parent');

    if(!loader.classList.contains('active')) {
        loader.classList.add('active');
    }

    let parentGraphic = document.querySelector('.graphic-ekvalayzer');

    function run(audio, _self, createEkvalayzer) {
        let play = false;
        let player = document.querySelector('.arm-player');
        let volume = player.querySelector('.volume');
        let progress = player.querySelector('.progress');
        let playBitton = player.querySelector('.btn-circle-hover-gradient');
        let showBtnTitle = playBitton.querySelector('.tooltip-custom');
        let showDuration = player.querySelector('.text-duration-audio span');

        let duration = "00:00";
        let currentTime = "00:00";

        let progressDuration = 0;
        let progressCurrentTime = 0;

        setTimeout(async () => {
            if(loader.classList.contains('active')) {
                loader.classList.remove('active');
            }

            showDuration.innerText = currentTime  + " / " + duration;

            function updateTrackTime() {
                if (audio) {
                    progressCurrentTime = audio.currentTime;

                    if (progressDuration !== 0) {
                        let progressVal = (progressCurrentTime * 100) / progressDuration;
                        progress.value = progressVal;
                        progress.style.setProperty('--bg', `${progressVal}%`);
                    }

                    let currTime = Math.floor(audio.currentTime).toString();
                    currentTime = formatSecondsAsTime(currTime);
                    showDuration.innerText = currentTime  + " / " + duration;
                }
            };

            function getDuration() {
                if (audio) {
                    let dur = Math.floor(audio.duration).toString();
                    progressDuration = audio.duration;
                    progress.setAttribute('step', 100 / audio.duration);
                    if (isNaN(dur)){
                        duration = '00:00';
                    } else{
                        duration = formatSecondsAsTime(dur);
                    }
                    showDuration.innerText = currentTime  + " / " + duration;
                }
            };

            function formatSecondsAsTime(secs, format) {
                let hr  = Math.floor(secs / 3600);
                let min = Math.floor((secs - (hr * 3600))/60);
                let sec = Math.floor(secs - (hr * 3600) -  (min * 60));
                if (min < 10){
                    min = "0" + min;
                }
                if (sec < 10){
                    sec  = "0" + sec;
                }
                return min + ':' + sec;
            };

            function playAudio(event) {
                event.preventDefault();
                event.stopPropagation();
                play = !play;

                
                if (audio) {
                    play ? audio.play() : audio.pause();

                    createEkvalayzer(_self, audio);

                    if (play) {
                        if (playBitton.classList.contains('play')) {
                            playBitton.classList.remove('play');
                            playBitton.classList.add('pause');
                        }
                        showBtnTitle.innerText = "Pause";
                    } else {
                        if (playBitton.classList.contains('pause')) {
                            playBitton.classList.remove('pause');
                            playBitton.classList.add('play');
                        }
                        showBtnTitle.innerText = "Play";
                    }
                }
            };

            audio.onended = function(event) {
                play = false;
                audio.pause();

                if (playBitton.classList.contains('pause')) {
                    playBitton.classList.remove('pause');
                    playBitton.classList.add('play');
                }

                showBtnTitle.innerText = "Play";
            };

            // this.audio.oncanplaythrough = function(event) {};
            // audio.onloadedmetadata = getDuration;
            getDuration();
            audio.ontimeupdate = updateTrackTime;

            playBitton.onclick = playAudio;

            volume.value = 80;

            volume.style.setProperty('--bg', '80%');

            volume.addEventListener('input', (event) => {
                volume.style.setProperty('--bg', `${volume.value}%`);
                audio.volume = parseFloat(volume.value) / 100;
            });

            progress.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            progress.addEventListener('input', (event) => {
                event.preventDefault();
                event.stopPropagation();

                let val = event.target.value;

                if (progressDuration !== 0) {
                    audio.currentTime = (val * progressDuration) / 100;
                }
            });
        }, 1500);
    };

    Graphic.tag = parentGraphic;
    Graphic.color = "#FFFFFF";
    Graphic.width = parentGraphic.clientWidth;
    Graphic.height = parentGraphic.clientHeight || 50;
    Graphic.audioWaveTag = document.querySelector('.graphic-wave');
    Graphic.run('./src/Club_ray_fortepiano.mp3', run);
})();