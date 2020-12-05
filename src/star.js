const tinycolor = require('tinycolor2');


module.exports = {
    processStars: (value, index, array, inData) => {

        let elapsedTime = inData.thisTime - array[index].startTime;
        if (elapsedTime > array[index].twinkleTime) {
            //remove star
            array.splice(index,1);
        }else{
            let newPostion = array[index].position + (array[index].speed*elapsedTime*array[index].direction/1000)
        //    let gradient = tinycolor(inData.color);
            let percentage = 100-(100*((elapsedTime)/(array[index].twinkleTime)));
            tailLength = Math.round(Math.abs(newPostion-array[index].position)) + 1;
            for (j=0; j< tailLength; j++) {
                let tailpercentage = Math.min(Math.max(percentage*(1/(j+1)),0),100);
           //     console.log("processStars::" + " idx:" + index + " tailpct:" + tailpercentage + " color0:"+inData.color[0]+" arr[idx].col:"+array[index].color);
                let col = tinycolor.mix(inData.color[0],array[index].color,tailpercentage).toRgb();
                inData.lightArray[Math.max(0, Math.min(inData.ledCount-1, Math.round(newPostion)-(j*array[index].direction)))] = rgb2Int(col.r, col.g, col.b);
            }		
            //help with partial glow of next position while moving.
            let preGlow = 100 - (percentage * Math.abs(newPostion % 1));
            let preCol = tinycolor.mix(inData.color[0],array[index].color,percentage).toRgb();
        }			  
    
    },
    
    processTwinkles: (value, index, array, inData) => {
        
        let elapsedTime = inData.thisTime - array[index].startTime;
        if (elapsedTime > array[index].twinkleTime) {
            //remove star
            array.splice(index,1);
        }else{
            //draw star
            let gradient = tinycolor(inData.color);
            let percentage = Math.min(Math.max(100-(100*((elapsedTime)/(array[index].twinkleTime))),0),100);
            let col = tinycolor.mix(inData.color[0],array[index].color,percentage).toRgb();
            inData.lightArray[Math.max(0, Math.min(inData.ledCount-1, array[index].position))] = rgb2Int(col.r, col.g, col.b);
        }			  
    },

    addStar: (CountLEDs, nowTime, listOfStars, CountColors, colorList, starSpeed) => {
        if (listOfStars.length < CountLEDs/10){
            let tempstartTime = nowTime;
            let tempposition = Math.round(Math.random() * CountLEDs);
            let temptwinkleTime = Math.round(Math.random() * 2000)+2000;
            let tempspeed = Math.round(Math.random() * starSpeed)+2;
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
}

let rgb2Int = (r, g, b) => { return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff); }
let int2Rgb = (num) => { return {r: (0xff0000 & num) >> 16, g: (0x00ff00 & num) >> 8, b: (0x0000ff & num)}; }
let hsv2Rgb = (h, s, v) => {
    h /= 360
  v = Math.round(v * 255)

  var i = Math.floor(h * 6)
  var f = h * 6 - i
  var p = Math.round(v * (1 - s))
  var q = Math.round(v * (1 - f * s))
  var t = Math.round(v * (1 - (1 - f) * s))

  switch (i % 6) {
    case 0:
      return [v, t, p]
    case 1:
      return [q, v, p]
    case 2:
      return [p, v, t]
    case 3:
      return [p, q, v]
    case 4:
      return [t, p, q]
    case 5:
      return [v, p, q]
  }
}