/**
 * Copyright (c) Amur 2022
 *
 * Timer
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 let Graphic = {
    tag: null,
    width: 200,
    height: 50,
    color: '#FFFFFF',
    canvas: null,
    frequencyArray: null,
    contextCanvas: null,
    analyser: null,
    audioWave: true,
    audioWaveTag: null,
    audio: null
}

Graphic.createDiagram = function() {
    this.contextCanvas = null;
    let _self = this;

    function startAnimation() {
        _self.contextCanvas.clearRect(0, 0, _self.width, _self.height);
        _self.analyser.getByteFrequencyData(_self.frequencyArray);
        for (let i = 0; i < _self.width; i++) {
            let x = i;
            let y = _self.frequencyArray[i] * 0.4;
            let xEnd = i;
            let yEnd = 0
            drawBar(x, y, xEnd, yEnd, 1);
        }

        requestAnimationFrame(startAnimation);
    }

    function drawBar(x1, y1, x2, y2, width) {
        _self.contextCanvas.strokeStyle = _self.color;
        _self.contextCanvas.lineWidth = width;
        _self.contextCanvas.beginPath();
        _self.contextCanvas.moveTo(x1, y1);
        _self.contextCanvas.lineTo(x2, y2);
        _self.contextCanvas.stroke();
    }

    if (this.tag !== null) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.contextCanvas = this.canvas.getContext("2d");

        this.tag.appendChild(this.canvas);

        startAnimation();
    }
};

Graphic.run = async function(audio, loadAudioCallback) {
    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = ( function() {
            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
        } )();
    }

    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.src = audio;
    this.audio.controls = true;
    await this.audio.load();

    let _self = this;
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = new AudioContext();
    _self.analyser = context.createAnalyser();
    let source = context.createMediaElementSource(_self.audio);
    source.crossOrigin = "anonymous";
    source.connect(_self.analyser);
    _self.analyser.connect(context.destination);
    _self.frequencyArray = new Uint8Array(_self.analyser.frequencyBinCount);

    _self.createDiagram();

    if (_self.audioWave && _self.audioWaveTag) {
        const NUMBER_OF_BUCKETS = 200;
        const SPACE_BETWEEN_BARS = 0.1;

        fetch(audio)
            .then(response => response.arrayBuffer())
            .then(audioData => {
                context.decodeAudioData(audioData, buffer => {
                    let decodedAudioData = buffer.getChannelData(0);
                    let bucketDataSize = Math.floor(decodedAudioData.length / NUMBER_OF_BUCKETS);
                    let buckets = [];
                    for (var i = 0; i < NUMBER_OF_BUCKETS; i++) {
                        let startingPoint = i * bucketDataSize;
                        let endingPoint = i * bucketDataSize + bucketDataSize;
                        let max = 0;
                        for (var j = startingPoint; j < endingPoint; j++) {
                            if (decodedAudioData[j] > max) {
                                max = decodedAudioData[j];
                            }
                        }
                        let size = Math.abs(max);
                        buckets.push(size / 2);
                    }

                    _self.audioWaveTag.innerHTML = `<svg viewbox="0 0 100 100" class="waveform-container" preserveaspectratio="none" height="50px" width="100%">
                        <rect class="waveform-bg" x="0" y="0" height="100" width="100%"/>
                        <rect id="waveform-progress" class="waveform-progress" x="0" y="0" height="100" width="0"/>
                    </svg>
                    <svg height="0" width="0">
                        <defs>
                            <clippath id="waveform-mask"></clippath>
                        </defs>
                    </svg>`;

                    let svgMask = document.getElementById('waveform-mask');

                    svgMask.innerHTML = buckets.map((bucket, i) => {
                        let bucketSVGWidth = 100.0 / buckets.length;
                        let bucketSVGHeight = bucket * 300.0;

                        return `<rect
                            x=${bucketSVGWidth * i + SPACE_BETWEEN_BARS / 2.0}
                            y=${ (100 - bucketSVGHeight) / 2.0}
                            width=${bucketSVGWidth - SPACE_BETWEEN_BARS}
                            height=${bucketSVGHeight} />`;
                    }).join('');
                    
                    let waveformProgress = document.getElementById('waveform-progress');

                    setInterval(() => {
                        waveformProgress.setAttribute('width', _self.audio.currentTime / _self.audio.duration * 100);
                    }, 100);

                    loadAudioCallback(_self.audio);
                }, e => {
                    console.log('Error with decoding audio data' + e.err);
                },);
        }).catch(err => {
            console.log(err);
        });
    } else {
        loadAudioCallback(_self.audio);
    }
};



