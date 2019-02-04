const fs = require('fs');

fs.writeFile('./storage_key.json', process.env.GOOGLE_CONFIG, (err) => {});

