
module.exports = {
    processStars: (value, index, array, inData) => {

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
            let col = tinycolor.mix(inData.color[0].replace("0x","#"),array[index].color.replace("0x","#"),percentage).toRgb();
            inData.lightArray[Math.max(0, Math.min(inData.ledCount-1, array[index].position))] = rgb2Int(col.r, col.g, col.b);
        }			  
    },

    addStar: (CountLEDs, nowTime, listOfStars, CountColors, colorList) => {
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
}