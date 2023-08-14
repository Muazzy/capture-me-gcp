const puppeteer = require('puppeteer')
const getNewFilePath = require('./get_new_file_path')

const puppeteerLaunchArgs = {
    defaultViewport: null,
    args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        "--disable-setuid-sandbox",
        // `--window-size=20,100` //not the right way
    ],
    executablePath:
        process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    // executablePath:
    //     puppeteer.executablePath(),
    headless: true

}

const iphone = puppeteer.KnownDevices['iPhone X']
const android = puppeteer.KnownDevices['Pixel 4a (5G)']

async function captureMe(params, dirPath) {
    try {
        const browser = await puppeteer.launch(puppeteerLaunchArgs)
        const page = await browser.newPage()

        if (params.device) {
            if (params.device.toUpperCase() === 'I') {
                await page.emulate(iphone)
            }
            if (params.device.toUpperCase() === 'A') {
                await page.emulate(android)
            }
        }

        page.setDefaultNavigationTimeout(0) //For the page to be fully loaded
        page.setDefaultTimeout(0)

        await page.goto(params.url)

        await page.waitForNetworkIdle()
        const newImagePath = getNewFilePath(dirPath)
        await page.screenshot({ path: newImagePath, type: 'png', fullPage: true })
        await browser.close()
        return newImagePath.split('/')[1] // (the getNewFilePath() returns a string like this: 'dir/filenamexx123', we have used split & used the later part [1] cuz we are only intrested in the file name)
    } catch (e) {
        console.log(e)
        throw e //rethrow for the post request to handle
    }
}


module.exports = captureMe