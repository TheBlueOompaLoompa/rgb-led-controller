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

		led.setAnimation((pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList) => {
			
			switch(server.getSettings().on ? server.getSettings().mode : 0) {
				case 6:
					return patterns.marqueeSolids(pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops);
				case 5:
					return patterns.shootingStar(pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList, led.getLedCount(), [{r: 0, g: 0, b: 0},{r: 255, g: 0, b: 0},{r: 0, g: 255, b: 0}], 50, nextStarBirthTime, starList);
				case 4:
					//inOutFading
					return patterns.inOutFading(pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList, led.getLedCount(), [...server.getSettings().color]);
				case 3:
					//marquee gradient
					return patterns.gradient(pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops, true, true, 50);
				case 2:
					//gradient
					return patterns.gradient(pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList, led.getLedCount(), [...server.getSettings().color], server.getSettings().loops, true, false, 50);
				case 1:
					//rainbow
					return patterns.rainbow(pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList, led.getLedCount(), server.getSettings().loops, false, 50);
				default:
					//solid
					return patterns.gradient(pixelData, offset, thisTime, lastTime, nextStarBirthTime, starList, led.getLedCount(), server.getSettings().on ? [server.getSettings().color[0]] : [{r: 0, g: 0, b: 0}], server.getSettings().loops, false, false, 50);
			}
		});
	}

}, 1000/4)
// Server

server.init();

console.log('Press <ctrl>+C to exit.');