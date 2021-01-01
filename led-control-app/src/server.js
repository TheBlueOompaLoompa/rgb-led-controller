const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const request = require('request');
let app = express();

const port = 80 || process.env.PORT;
const hostname = "0.0.0.0" || process.env.HOSTNAME;

const apiURI = 'http://localhost:3000/'

const trustedRoot = process.env.PUBLIC_DIR;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/ctrl', (req, res) => {
    try {
        var options = {
            uri: apiURI + 'ctrl',
            method: 'POST',
            json: req.body
        };
          
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
            }
        });
        res.status(200).sendFile(trustedRoot + '/index.html');
        console.log(req.body)
    } catch (error) {
        console.log(error);
    }
});

app.get('/settings', (req, res) => {
    try {
        request.get(apiURI + 'settings', { json: true }, (err, resp, body) => {
            if (err) { 
                res.send("err"); 
            }
    
            res.send(body);
        }); 
    } catch (error) {
        console.log(error);
    }
});

app.get('/*', (req, res) => {
    if(path.normalize(trustedRoot + req.url).startsWith(trustedRoot)) {
        if(req.url == '/')
            res.status(200).sendFile(trustedRoot + '/index.html');

        let fileExists = fs.existsSync(trustedRoot + req.url);

        if(fileExists){
            res.status(200).sendFile(trustedRoot + req.url);
        } else {
            res.status(404).sendFile(__dirname + '/404.html');
        }
    } else {
        res.status(404).sendFile(__dirname + '/404.html');
    }
});

module.exports = {
    init: () => {
        app.listen(port, hostname, () => {console.log(`App listening at http://${hostname}:${port}`)});
    },
}
