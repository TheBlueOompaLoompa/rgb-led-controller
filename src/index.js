let led = require('./led');
let patterns = require('./patterns');
let server = require('./server');

var _ = require('lodash');

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  led.reset();
  server.exit();
  process.nextTick(function () { process.exit(0); });
});

// Led stuv

led.init({framerate: server.getSettings().speed, ledMapping: led.GRB});

let lastSettings = {};

var lastTime = Date.now();
var thisTime = Date.now();
var nextStarBirthTime = 0;
var starList = [{startTime:0, position:100, direction:1, speed:0.3, twinkleTime:1500, color:'#FF0000',},
				{startTime:0, position:50, direction:-1, speed:0.5, twinkleTime:2000, color:'#00FF00',}];

var updateLoop = setInterval(function() {
	if(!_.isEqual(server.getSettings(), lastSettings)){
		Object.assign(lastSettings, server.getSettings());

		console.log("Settings changed");

		led.setSpeed(server.getSettings().speed);

		led.setBrightness(server.getSettings().brightness);

		led.setAnimation((pixelData, offset) => {
			thisTime = Date.now();
			switch(server.getSettings().on ? server.getSettings().mode : 0) {
				case 6:
					return patterns.marqueeSolids(pixelData, offset, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops);
				case 5:
					return patterns.shootingStar(pixelData, offset, led.getLedCount(), [...server.getSettings().color], 50, thisTime, lastTime, nextStarBirthTime);
				case 4:
					//inOutFading
					return patterns.inOutFading(pixelData, offset, led.getLedCount(), [...server.getSettings().color]);
				case 3:
					//marquee gradient
					return patterns.gradient(pixelData, offset, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops, true, true, 50, thisTime, lastTime);
				case 2:
					//gradient
					return patterns.gradient(pixelData, offset, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops, true, false, 50, thisTime, lastTime);
				case 1:
					//rainbow
					return patterns.rainbow(pixelData, offset, led.getLedCount(), server.getSettings().loops), false, 50, thisTime, lastTime;
				default:
					//solid
					return patterns.gradient(pixelData, offset, led.getLedCount(), server.getSettings().on ? [server.getSettings().color[0]] : [{r: 0, g: 0, b: 0}], server.getSettings().loops, false, false, 50, thisTime, lastTime);
			}
		});
	}

	lastTime = thisTime;

}, 1000/4)
// Server

server.init();

console.log('Press <ctrl>+C to exit.');