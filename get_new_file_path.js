const uuid = require('uuid')

function getNewFilePath(path) {
    return `${path}/${uuid.v4()}.png`
}

module.exports = getNewFilePath