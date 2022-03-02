;(async function(){
    let audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = './src/Club_ray_fortepiano.mp3';
    audio.controls = true;
    
    let play = false;
    let loaded = false;

    let player = document.querySelector('.arm-player');

    let volume = player.querySelector('.volume');

    let progress = player.querySelector('.progress');

    let loader = player.querySelector('.loader-parent');

    let playBitton = player.querySelector('.btn-circle-hover-gradient');

    let showBtnTitle = playBitton.querySelector('.tooltip-custom');

    let showDuration = player.querySelector('.text-duration-audio span');

    let duration = "00:00";
    let currentTime = "00:00";

    let progressDuration = 0;
    let progressCurrentTime = 0;

    if(!loader.classList.contains('active')) {
        loader.classList.add('active');
    }

    audio.oncanplaythrough = function(event) {
        if(loader.classList.contains('active')) {
            loader.classList.remove('active');
        }
    };
    
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

    async function playAudio(event) {
        event.preventDefault();
        event.stopPropagation();
        play = !play;
        if (audio) {
            if (!loaded) {
                await audio.load();
                loaded = true;

                let parentGraphic = document.querySelector('.graphic');

                Graphic.tag = parentGraphic;
                Graphic.color = "#FFFFFF";
                Graphic.width = parentGraphic.clientWidth;
                Graphic.height = parentGraphic.clientHeight || 50;
                Graphic.run(audio);
            }
            
            play ? audio.play() : audio.pause();

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

    audio.onloadedmetadata = getDuration;
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
})();