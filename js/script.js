;(function(){
    let audio = document.querySelector('audio');
    audio.style["display"] = "none";
    let play = false;
    let loaded = false;

    let player = document.querySelector('.arm-player');

    let volume = player.querySelector('.volume');

    let playBitton = player.querySelector('.btn-circle-hover-gradient');

    let showBtnTitle = playBitton.querySelector('.tooltip-custom');

    let showDuration = player.querySelector('.text-duration-audio span');

    let duration = "00:00";
    let currentTime = "00:00";

    showDuration.innerText = currentTime  + " / " + duration;

    function updateTrackTime() {
        if (audio) {
            let currTime = Math.floor(audio.currentTime).toString();
            currentTime = formatSecondsAsTime(currTime);
            showDuration.innerText = currentTime  + " / " + duration;
        }
    };

    function getDuration() {
        if (audio) {
            let dur = Math.floor(audio.duration).toString();
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
})();