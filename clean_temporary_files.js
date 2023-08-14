const fs = require('fs')

//utility function 
const isLessThen10mins = (fileCreationTime) => {
    const currentTime = new Date()

    const minutesToCompareTo = 10

    const miliseconds = 1000 // to convert time in miliseconds into seconds
    const senconds = 60 //to convert time in seconds into minutes

    const differenceInMinutes = Math.floor((currentTime.getTime() - fileCreationTime.getTime()) / miliseconds / senconds)

    return differenceInMinutes < minutesToCompareTo
}

const cleanTemporaryFiles = (dir) => fs.readdir(dir, (e, files) => {
    // console.log(files)
    files.forEach(file => {
        const filePath = `${dir}/${file}`
        fs.stat(filePath, (err, stats) => {
            if (err) console.log()
            console.log(isLessThen10mins(stats.birthtime))
            if (isLessThen10mins(stats.birthtime)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.log()
                    console.log(`${filePath} deleted`)
                })
            }
        })
    });
})



module.exports = cleanTemporaryFiles