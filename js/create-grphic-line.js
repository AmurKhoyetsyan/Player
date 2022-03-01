let Graphic = {
    tag: null,
    width: 200,
    height: 50,
    color: '#00FF00',
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
            let y = _self.height;
            let xEnd = i;
            let yEnd = _self.frequencyArray[i] * 0.1;
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
    source.connect(this.analyser);
    this.analyser.connect(context.destination);
    this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.createDiagram();
};