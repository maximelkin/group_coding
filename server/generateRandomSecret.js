const fs = require('fs');
const crypto = require('crypto');

fs.writeFile('./config.json', {
    token: crypto.randomBytes(20).toString('hex')
});
