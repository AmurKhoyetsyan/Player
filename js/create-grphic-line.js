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
    analyser: null
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

Graphic.run = function(audio) {

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

    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = new AudioContext();
    this.analyser = context.createAnalyser();
    let source = context.createMediaElementSource(audio);
    source.crossOrigin = "anonymous";
    source.connect(this.analyser);
    this.analyser.connect(context.destination);
    this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.createDiagram();
};