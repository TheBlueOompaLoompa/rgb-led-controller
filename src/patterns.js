let led = require('./led');
let star = require('./star');
const termColor = require('ansi-256-colors');

const tinygradient = require('tinygradient');

// rainbow-colors, taken from http://goo.gl/Cs3H0v
function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return led.rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return led.rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return led.rgb2Int(pos * 3, 255 - pos * 3, 0); }
}


Array.prototype.insert = function (x, item) {
	this.splice(x, 0, item);
}

module.exports = {
	solid: (pixelData, offset, lastTime, thisTime, ledCount = 24, color = {r: 0, g: 0, b: 0}) => {
		for(let i = 0; i < ledCount; i++) {
			pixelData[i] = led.rgb2Int(color.r, color.g, color.b);
		}
		
		return {pixelData, offset, lastTime, thisTime};
	},
	rainbow: (pixelData, offset, lastTime, thisTime, ledCount = 48, loops = 1, marquee = false, speed = 50) => {
		for (var i = 0; i < ledCount; i++) {
			pixelData[i] = colorwheel((Math.floor(offset) + Math.round(256/ledCount * i * loops)) % 256);
  		}

		if (marquee) {
			offset = (offset + speed*(thisTime-lastTime)/1000) % 256;
		}

		return {pixelData, offset, lastTime, thisTime};
	},
	gradient: (pixelData, offset, lastTime, thisTime, ledCount = 48, color = [{r: 255, g: 255, b: 255}], loops = 1, mirrored = true, marquee = false, speed = 50) => {

		if(color.length == 1) {
			pixelData.fill(led.rgb2Int(color[0].r, color[0].g, color[0].b),0,ledCount);
		}else {
			let maxColorRepeat = color.length - 1;
			let gradArray = color;
			if (mirrored) {
				maxColorRepeat = color.length;
				let gradArray = [...color, color[0]];
			}
			let gradient = tinygradient(gradArray);

			for(let i = 0; i < ledCount; i++) {
				let gradPos = (maxColorRepeat*(((i + Math.floor(offset))/ledCount) * loops ) % maxColorRepeat) / maxColorRepeat;
				let col = gradient.rgbAt(gradPos).toRgb();
				pixelData[i] = led.rgb2Int(col.r, col.g, col.b);
			}
			if (marquee) {
				offset += speed*(thisTime-lastTime)/1000;			
				offset = offset % ledCount;
			}
		}

		return {pixelData, offset, lastTime, thisTime};
	},
	marqueeGradient: (pixelData, offset, lastTime, thisTime, ledCount = 48, color = [{r: 255, g: 255, b: 255}], loops = 1) => {
		if(color.length == 1) {
			for(let i = 0; i < ledCount; i++) {
				pixelData[i] = led.rgb2Int(color[0].r, color[0].g, color[0].b);
			}
			
		} else {
			let gradArray = [...color, color[0]];

			let gradient = tinygradient(gradArray);

			for(let i = 0; i < ledCount; i++) {
				let col = gradient.rgbAt(Math.abs(((i/2 + offset)/ledCount) * loops % 1)).toRgb();
				pixelData[i] = led.rgb2Int(col.r, col.g, col.b);
				
			}
			
			offset += 2 / color.length;
			
			if(offset > ledCount){
				offset = 0;
			}
		}

		return {pixelData, offset, lastTime, thisTime};
	},
	inOutFading: (pixelData, offset, lastTime, thisTime, ledCount = 48, color = [{r: 255, g: 255, b: 255}]) => {
		let tempCol = [...color];
		for(let i = 0; i < tempCol.length; i++) {
			color.insert(i+1, {r: 0, g: 0, b: 0});
			i++;
		}

		let gradColor = [...color];
		let gradEnds = [gradColor[0], gradColor[gradColor.length - 1]];

		color.shift();
		color.pop();

		let gradMid = [...color];

		let gradArray = [gradEnds[0], ...gradMid, gradEnds[1], gradEnds[0]];

		let gradient = tinygradient(gradArray);

		let col = gradient.rgbAt(offset / (255 * color.length) % 1).toRgb();

		for(let i = 0; i < ledCount; i++) {
			
			pixelData[i] = led.rgb2Int(col.r, col.g, col.b);
			
		}
		
		offset += 1;
		
		if(offset > 255 * color.length){
			offset = 0;
		}

		return {pixelData, offset, lastTime, thisTime};
	},
	shootingStar: (pixelData, offset, lastTime, thisTime, ledCount = 48, color = [{r: 255, g: 255, b: 255}], speed = 50) => {

 		//set background color
		pixelData.fill(color[0],0,ledCount);
		// Add new stars if needed			
		if (thisTime > nextStarBirthTime){
			led.nextStarBirthTime = led.star.addStar(ledCount, thisTime, starList, color.length, color);
		}
		// Now show all the stars
		led.starData = {thisTime, color, ledCount, lightArray:pixelData};
		led.starList.forEach(function calcStars(value, index, array){star.processStars(value, index, array, led.starData);}); 


		return {pixelData, offset, lastTime, thisTime};
	},
	marqueeSolids: (pixelData, offset, lastTime, thisTime, ledCount = 48, color = [{r: 255, g: 255, b: 255}], loops = 1) => {
		if(color.length == 1) {
			for(let i = 0; i < ledCount; i++) {
				pixelData[i] = led.rgb2Int(color[0].r, color[0].g, color[0].b);
			}
			
		} else {
			let colArray = [...color, color[0]];  //wraparound

		//	let gradient = tinygradient(colArray);

			for(let i = 0; i < ledCount; i++) {
				let col = colArray.rgbAt(((i + offset)/ledCount) * loops % 1).toRgb();
				pixelData[i] = led.rgb2Int(col.r, col.g, col.b);
				
			}
			
			offset += 2 / color.length;
			
			if(offset > ledCount){
				offset = 0;
			}
		}

		return {pixelData, offset, lastTime, thisTime};
	},
}