const fs = require('fs');
const crypto = require('crypto');

fs.readFile('./config.json', (err, data) => {
    if (err) {
        throw err;
    }

    const old = JSON.parse(data);

    old.token = crypto.randomBytes(20).toString('hex');

    fs.writeFile('./config.json', JSON.stringify(old), (err) => {
        if (err) {
            throw err;
        }
    });

});
