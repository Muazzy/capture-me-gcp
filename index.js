const express = require('express')
const prepareDir = require('./prepare_dir')
const captureMe = require('./capture_me')
const cleanTemporaryFiles = require('./clean_temporary_files')
const getAbsoluteFilePath = require('./get_absolute_filepath')
const validateParams = require('./validate_params')
require("dotenv").config()


//1 (hour) => 60 (mins) => 60 (seconds) => 1000(miliseconds)
const cleanUpInterval = 1 * 60 * 60 * 1000


const app = express()

const PORT = process.env.PORT || 3069
const HOST = process.env.HOST || '0.0.0.0';
const ssDir = 'screenshots'

app.use(express.json()) //using json middleware to parse the body of the post request
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send('hello workd')
})


app.post('/api/captureme', async (req, res) => {
    const params = {
        url: req.body.url,
        device: req.body.device,
        fullPage: req.body.fullPage,
    }

    const error = validateParams(params)
    if (error) return res.status(400).send(error.details.at(0).message)

    //CHECK IF THE DIR IS PREPARED, IF ITS NOT, RETURN A SERVER ERROR
    const isDirReady = await prepareDir(ssDir).catch((e) => { return false }) //on success the function returns true by default
    if (!isDirReady) return res.status(500).send('Something unexpected happened on the server')

    //FINALLY RUN THE CAPTUREME FUNCTION 
    let fileName = ''
    try {
        fileName = await captureMe(params, ssDir)
        const abosoluteFilePath = getAbsoluteFilePath(ssDir, fileName)
        console.log('absolute file path is', abosoluteFilePath)
        return res.sendFile(abosoluteFilePath)
    } catch (e) {
        console.log(e)
        return res.status(500).send('Something unexpected happened on the server')
    }
})

//will be running this after every interval
setInterval(() => {
    cleanTemporaryFiles(ssDir)
}, cleanUpInterval)


app.listen(PORT, HOST, () => { console.log(`litsening to port ${PORT}`) })


//TODO: Feature: filters to the ss