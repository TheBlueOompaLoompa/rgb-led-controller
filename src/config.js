const fs = require('fs');

module.exports = {
    check: () => {
        return fs.existsSync(__dirname + '/../config.json');
    },
    read: () => {
        return JSON.parse(fs.readFileSync(__dirname + '/../config.json', 'utf-8'));
    },
    write: (data) => {
        console.log('save config');
        fs.writeFile(__dirname + '/../config.json', JSON.stringify(data));
    },
    writeSync: (data) => {
        fs.writeFileSync(__dirname + '/../config.json', JSON.stringify(data));
    }
}