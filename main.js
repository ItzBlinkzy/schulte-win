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
        // By Kevin [ItzBlinkzy]
        // To be used with website [https://drafterleo.github.io/schulte/]
        const ezClick = (column, rows) => {
            // const selected = document.querySelector("#grid_size").selectedIndex = 1 // 3 x 3
            document.querySelector("#app > div.w3-modal.display-block > div > footer > button").click()
            let currCol = 1
            let box = 1
            let turns = (column * rows) ** 2
            let i = 0
            const click = () => document.querySelector(`#app > div:nth-child(${currCol}) > div:nth-child(${box}) > span`).click()
            while (i < turns) {
                if (currCol === column && box === rows) {
                    click()
                    currCol = 1
                    box = 1
                } else if (box === rows) {
                    click()
                    box = 1;
                    currCol++;
                } else {
                    click()
                    box++
                }
                i++
            }
        }
        ezClick(5, 5)
        return time
    })
    console.log("Finished Clicking: GAME ENDED")
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
    console.log("Closing browser in 10 seconds")
    await new Promise(resolve => setTimeout(resolve, 10000))
    await browser.close()
    console.log("Browser closed.")
})()