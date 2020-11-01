const puppeteer = require("puppeteer");

(async () => {
    const schulte = "https://drafterleo.github.io/schulte/"
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage()
    await page.goto(schulte, {
        waitUntil: "domcontentloaded"
    });
    console.log("Schulte website loaded.")
    const timeBegun = await page.evaluate(async () => {
        const time = Date.now()
        // document.querySelector("#grid_size").selectedIndex = 1;// 3 x 3 doesnt work :()
        const ezClick = (column, rows) => {
            document.querySelector("#app > div.w3-modal.display-block > div > footer > button").click()
            let currCol = 1
            let box = 1
            let turns = (column * rows) ** 2
            let i = 0
            while (i < turns) {
                if (currCol === column && box === rows) {
                    document.querySelector(`#app > div:nth-child(${currCol}) > div:nth-child(${box}) > span`).click()
                    currCol = 1
                    box = 1
                } else if (box === rows) {
                    document.querySelector(`#app > div:nth-child(${currCol}) > div:nth-child(${box}) > span`).click();
                    box = 1;
                    currCol++;
                } else {
                    document.querySelector(`#app > div:nth-child(${currCol}) > div:nth-child(${box}) > span`).click()
                    box++
                }
                i++
            }
        }
        ezClick(5, 5)
        return time
    })
    console.log("GAME ENDED")
    console.log(`Completed in: ${Date.now() - timeBegun}ms`)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const clicks = await page.evaluate(() => {
        const wrongClicks = parseInt(document.querySelector("#app > div.w3-modal.display-block > div > div.w3-container.w3-margin > table > tbody > tr.w3-pale-red > td:nth-child(2)").textContent.trim())
        const correctClicks = parseInt(document.querySelector("#app > div.w3-modal.display-block > div > div.w3-container.w3-margin > table > tbody > tr.w3-pale-green > td:nth-child(2)").textContent.trim())
        const totalClicks = wrongClicks + correctClicks
        return {
            wrongClicks,
            correctClicks,
            totalClicks
        }
    })
    console.log(clicks)
})()