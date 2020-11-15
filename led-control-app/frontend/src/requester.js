function httpGet (theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );

    return xmlHttp.responseText;
}

function httpPost(theUrl, data) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xmlHttp.send( data );
    console.log(data);
    return xmlHttp.responseText;
}

module.exports = {
    updateSetting: function (setting, value) {
		httpPost("/ctrl", JSON.stringify({setting, value}));
    },
    getSettings: function () {
        return JSON.parse(httpGet("/settings").replace('\\"', '"'));
    }
}