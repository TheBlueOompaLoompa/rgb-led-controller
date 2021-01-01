const express = require('express')
let bodyParser = require('body-parser')

const config = require('./config');

const app = express()
const port = 3000
const hostname = '0.0.0.0';

let settings = { mode: 0, color: [{r:0, g:0, b:0}], speed: 30 };

if(config.check()) {
	settings = config.read();
}

app.use(bodyParser.json());

app.post('/ctrl', (req, res) => {
	console.log(req.body);
	let setting = req.body.setting;

	settings[setting] = req.body.value;

  	res.send(`{"${setting}": "${settings[setting]}"}`);
});

app.get('/settings', (req, res) => {
	res.send(settings);
});

module.exports = {
	init: () => {
		app.listen(port, hostname, () => {
			console.log(`RGB app listening at http://${hostname}:${port}`)
		});
	},
	getSettings: () => {
		return settings;
	},
	exit: () => {
		config.write(settings);
	},
}