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

function processStars(value, index, array, inData) {

	let elapsedTime = inData.thisTime - array[index].startTime;
	if (elapsedTime > array[index].twinkleTime) {
		//remove star
		array.splice(index,1);
	}else{
		let newPostion = array[index].position + (array[index].speed*elapsedTime*array[index].direction/1000)
		let gradient = tinycolor(inData.color);
		let percentage = 100-(100*((elapsedTime)/(array[index].twinkleTime)));
		tailLength = Math.round(Math.abs(newPostion-array[index].position)) + 1;
		for (j=0; j< tailLength; j++) {
			let tailpercentage = Math.min(Math.max(percentage*(1/(j+1)),0),100);
			let col = tinycolor.mix(inData.color[0].replace("0x","#"),array[index].color.replace("0x","#"),tailpercentage).toRgb();
			inData.lightArray[Math.max(0, Math.min(inData.ledCount-1, Math.round(newPostion)-(j*array[index].direction)))] = rgb2Int(col.r, col.g, col.b);
		}		
		//help with partial glow of next position while moving.
		let preGlow = 100 - (percentage * Math.abs(newPostion % 1));
		let preCol = tinycolor.mix(inData.color[0].replace("0x","#"),array[index].color.replace("0x","#"),percentage).toRgb();
	}			  
  
}		


function processTwinkles(value, index, array, inData) {
	
	let elapsedTime = inData.thisTime - array[index].startTime;
	if (elapsedTime > array[index].twinkleTime) {
		//remove star
		array.splice(index,1);
	}else{
		//draw star
		let gradient = tinycolor(inData.color);
		let percentage = Math.min(Math.max(100-(100*((elapsedTime)/(array[index].twinkleTime))),0),100);
		let col = tinycolor.mix(inData.color[0].replace("0x","#"),array[index].color.replace("0x","#"),percentage).toRgb();
		inData.lightArray[Math.max(0, Math.min(inData.ledCount-1, array[index].position))] = rgb2Int(col.r, col.g, col.b);
	}			  
}

function addStar(CountLEDs, nowTime, listOfStars, CountColors, colorList) {
	if (listOfStars.length < CountLEDs/10){
		let tempstartTime = nowTime;
		let tempposition = Math.round(Math.random() * CountLEDs);
		let temptwinkleTime = Math.round(Math.random() * 2000)+2000;
		let tempspeed = Math.round(Math.random() * 4)+2;
		let tempdirection = 1;
		if(Math.random() > .5) {
			tempdirection = -1;
		}
		let temptemp = Math.random()*(CountColors-1);
		temptemp = Math.min(Math.floor(temptemp)+1, colorList.length-1);
		let tempcolor = colorList[temptemp];
		let tempStar = {startTime:tempstartTime, position:tempposition, direction:tempdirection, position:tempposition, speed:tempspeed, twinkleTime:temptwinkleTime, color:tempcolor};
		listOfStars.push(tempStar);
	}
	let WaitNextStarBirthTime = nowTime + (Math.random() * 10000/CountLEDs);
	return WaitNextStarBirthTime;
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
	rainbow: (pixelData, offset, ledCount = 48, loops = 1, marquee = false, speed = 50, thisTime = 50, lastTime = 0) => {
		for (var i = 0; i < ledCount; i++) {
			pixelData[i] = colorwheel((Math.floor(offset) + Math.round(256/ledCount * i * loops)) % 256);
  		}

		if (marquee) {
			offset = (offset + speed*(thisTime-lastTime)/1000) % 256;
		}

		return {pixelData, offset};
	},
	gradient: (pixelData, offset, ledCount = 48, color = [{r: 255, g: 255, b: 255}], loops = 1, mirrored = true, marquee = false, speed = 50, thisTime = 50, lastTime = 0) => {

		if(color.length == 1) {
			pixelData[i].fill(led.rgb2Int(color[0].r, color[0].g, color[0].b),0,ledCount);
		}else {
			let maxColorRepeat = color.length - 1;
			let gradArray = color;
			if (mirrored) {
				maxColorRepeat = color.length;
				let gradArray = [...color, color[0]];
			}
			let gradient = tinygradient(gradArray);

			for(let i = 0; i < ledCount; i++) {
				let gradPos = maxColorRepeat*(((i + Math.floor(offset))/ledCount) * loops ) % maxColorRepeat;
				let col = gradient.rgbAt(gradPos).toRgb();
				pixelData[i] = led.rgb2Int(col.r, col.g, col.b);
			}
			if (marquee) {
				offset += speed*(thisTime-lastTime)/1000;			
				offset = offset % ledCount;
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
	shootingStar: (pixelData, offset, ledCount = 48, color = [{r: 255, g: 255, b: 255}], speed = 50, thisTime = 50, lastTime = 0, nextStarBirthTime = 50) => {
		//set background color
		pixelData.fill(color[0],0,ledCount);
		// Add new stars if needed			
		if (thisTime > nextStarBirthTime){
			nextStarBirthTime = addStar(ledCount, thisTime, starList, color.length, color);
		}
		// Now show all the stars
		starData = {thisTime: thisTime, color:color, ledCount:ledCount, lightArray:pixelData};
		starList.forEach(function calcStars(value, index, array){processStars(value, index, array, starData);});
		break;

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
}