let led = require('./led');
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
	solid: (pixelData, offset, ledCount = 24, color = {r: 0, g: 0, b: 0}) => {
		for(let i = 0; i < ledCount; i++) {
			pixelData[i] = led.rgb2Int(color.r, color.g, color.b);
		}
		
		return {pixelData, offset};
	},
	rainbow: (pixelData, offset, ledCount = 48, loops = 1) => {
		for (var i = 0; i < ledCount; i++) {
			pixelData[i] = colorwheel((offset + (i * 2)) * loops % 256);
  		}

		offset = (offset + 1) % 256;

		return {pixelData, offset};
	},
	gradient: (pixelData, offset, ledCount = 48, color = [{r: 255, g: 255, b: 255}], loops = 1) => {

		if(color.length == 1) {
			for(let i = 0; i < ledCount; i++) {
				pixelData[i] = led.rgb2Int(color[0].r, color[0].g, color[0].b);
			}
		}else {
			let gradient = tinygradient(color);

			for(let i = 0; i < ledCount; i++) {
				let col = gradient.rgbAt((i/ledCount) * loops % 1).toRgb();
				pixelData[i] = led.rgb2Int(col.r, col.g, col.b);
			}
		}

		return {pixelData, offset};
	},
	marqueeGradient: (pixelData, offset, ledCount = 48, color = [{r: 255, g: 255, b: 255}], loops = 1) => {
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

		return {pixelData, offset};
	},
	inOutFading: (pixelData, offset, ledCount = 48, color = [{r: 255, g: 255, b: 255}]) => {
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

		return {pixelData, offset};
	},
	shootingStar: (pixelData, offset, ledCount = 48, color = [{r: 255, g: 255, b: 255}]) => {
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

		return {pixelData, offset};
	},
	marqueeSolids: (pixelData, offset, ledCount = 48, color = [{r: 255, g: 255, b: 255}], loops = 1) => {
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

		return {pixelData, offset};
	},
	demo: (pixelData, offset, ledCount) => {
		return {pixelData, offset};
	}
}