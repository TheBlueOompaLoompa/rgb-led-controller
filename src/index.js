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

var updateLoop = setInterval(function() {
	if(!_.isEqual(server.getSettings(), lastSettings)){
		Object.assign(lastSettings, server.getSettings());

		console.log("Settings changed");

		led.setSpeed(server.getSettings().speed);

		led.setBrightness(server.getSettings().brightness);

		led.setAnimation((pixelData, offset, lastTime, thisTime) => {
			
			switch(server.getSettings().on ? server.getSettings().mode : 0) {
				case 6:
					return patterns.marqueeSolids(pixelData, offset, lastTime, thisTime, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops);
				case 5:
					return patterns.shootingStar(pixelData, offset, lastTime, thisTime, led.getLedCount(), [{r: 0, g: 0, b: 0},{r: 255, g: 0, b: 0},{r: 0, g: 255, b: 0}], 5, server.getSettings().starSpeed);
				case 4:
					//inOutFading
					return patterns.inOutFading(pixelData, offset, lastTime, thisTime, led.getLedCount(), [...server.getSettings().color]);
				case 3:
					//marquee gradient
					return patterns.gradient(pixelData, offset, lastTime, thisTime, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops, true, true, 5);
				case 2:
					//gradient
					return patterns.gradient(pixelData, offset, lastTime, thisTime, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops, true, false, 5);
				case 1:
					//rainbow
					return patterns.rainbow(pixelData, offset, lastTime, thisTime, led.getLedCount(), server.getSettings().loops, false, 5);
				default:
					//solid
					return patterns.gradient(pixelData, offset, lastTime, thisTime, led.getLedCount(), server.getSettings().on ? [server.getSettings().color[0]] : [{r: 0, g: 0, b: 0}], server.getSettings().loops, false, false, 5);
			}
		});
	}

}, 1000/4)
// Server

server.init();

console.log('Press <ctrl>+C to exit.');