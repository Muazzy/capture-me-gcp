const fs = require('fs')

function prepareDir(path) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) return resolve(true) //if the path already exists

        fs.mkdir(path, (err) => {
            if (err) {
                // console.log(err);
                reject(false); // Directory creation failed
            } else {
                resolve(true); // Directory creation succeeded
            }
        });
    });
}

module.exports = prepareDir