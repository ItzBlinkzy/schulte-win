const puppeteer = require("puppeteer");
const schulte = "https://drafterleo.github.io/schulte/"

class AutoBot {
    constructor(link) {
        this.link = link
    }
    openPage = async (link) => {
        if (!link) {
            console.log(`You did not provide a link!!`);
            return;
        }
        this.browser = await puppeteer.launch({
            headless: false
        });
        this.page = await this.browser.newPage()
        await this.page.goto(link, {
            waitUntil: "domcontentloaded"
        });
    }
    winSchulte = async () => {
        await this.openPage(this.link)
        if (this.link !== schulte) {
            console.log(`Cannot continue. Site is not schulte website.`)
            console.log("Closing browser in 10 seconds")
            await new Promise(resolve => setTimeout(resolve, 10000))
            await this.browser.close()
            return;
        }
        this.timeBegun = await this.page.evaluate(async () => {
            const time = Date.now()
            const [column, rows] = [5, 5] // Change to [3,3] for 3x3 grid etc
            const click = () => document.querySelector(`#app > div:nth-child(${currCol}) > div:nth-child(${box}) > span`).click()
            document.querySelector("#app > div.w3-modal.display-block > div > footer > button").click()
            let [currCol, box] = [1, 1]
            const turns = (column * rows) ** 2
            let i = 0
            while (i < turns) {
                if (currCol === box && box === rows) {
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
            return time
        })
        const clicks = await this.page.evaluate(() => {
            const wrongClicks = parseInt(document.querySelector("#app > div.w3-modal.display-block > div > div.w3-container.w3-margin > table > tbody > tr.w3-pale-red > td:nth-child(2)").textContent.trim())
            const correctClicks = parseInt(document.querySelector("#app > div.w3-modal.display-block > div > div.w3-container.w3-margin > table > tbody > tr.w3-pale-green > td:nth-child(2)").textContent.trim())
            const totalClicks = wrongClicks + correctClicks
            return {
                wrongClicks,
                correctClicks,
                totalClicks
            }
        })
        console.log(`Completed in: ${Date.now() - this.timeBegun}ms`)
        console.log(clicks)
        console.log("Closing browser in 10 seconds")
        await new Promise(resolve => setTimeout(resolve, 10000))
        await this.browser.close()
        console.log("Browser closed.")
    }
}

const myBot = new AutoBot(schulte)
myBot.winSchulte()