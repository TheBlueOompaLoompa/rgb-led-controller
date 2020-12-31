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

let updateLoop = setInterval(function() {
	if(!_.isEqual(server.getSettings(), lastSettings)){
		Object.assign(lastSettings, server.getSettings());

		console.log("Settings changed");

		led.setSpeed(server.getSettings().speed);

		led.setBrightness(server.getSettings().brightness);

		led.setAnimation((pixelData, offset) => {
			switch(server.getSettings().on ? server.getSettings().mode : 0) {
				case 5:
					return patterns.shootingStar(pixelData, offset, led.getLedCount(), [...server.getSettings().color]);
				case 4:
					return patterns.inOutFading(pixelData, offset, led.getLedCount(), [...server.getSettings().color]);
				case 3:
					return patterns.marqueeGradient(pixelData, offset, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops);
				case 2:
					return patterns.gradient(pixelData, offset, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops);
				case 1:
					return patterns.rainbow(pixelData, offset, led.getLedCount(), server.getSettings().loops);
				default:
					return patterns.solid(pixelData, offset, led.getLedCount(), server.getSettings().on ? server.getSettings().color[0] : {r: 0, g: 0, b: 0});
			}
		});
	}
}, 1000/4)
// Server

server.init();

console.log('Press <ctrl>+C to exit.');