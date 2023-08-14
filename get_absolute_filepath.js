const path = require('path')

const getAbsoluteFilePath = (dirName, fileName) => {
    return path.join(__dirname, dirName, fileName)
}

module.exports = getAbsoluteFilePath