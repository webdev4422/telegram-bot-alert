import puppeteer from 'puppeteer'
import jsdom from 'jsdom'
// const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`)
// const text = dom.window.document.querySelector('p').textContent

async function run() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: 'new' })
  // const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://alerts.in.ua')
  // await page.goto('https://t.me/s/alarmukraine')
  // await page.goto('https://x-drive.ua')
  // await new Promise((r) => setTimeout(r, 2000))
  // document.querySelector('#__layout > div > main > h2').innerHTML
  // await page.screenshot({ path: 'example.png' })
  // const html = await page.content();

  // Proceed
  await page.waitForSelector('#super-lite-map > g.oblasts > path:nth-child(22)')

  const data = await page.evaluate(() => {
    // Get element in browser context
    // Info: after many tries, I found that svg 'path' is not html element, but it is ATTRIBUTE, thiw why, when logging html elements or nodes of html partent element of 'path' it show nothing -> 'HTMLUnknownElement'. Thus access data attributes with 'attributes' method
    // document.querySelector('#super-lite-map > g.oblasts > path:nth-child(22)').innerHTML // return empty, there are not html, only attributes
    const svgPath = document.querySelector('#super-lite-map > g.oblasts > path:nth-child(22)')
    // let oblast = svgPath.attributes['data-oblast'].value
    let alertInfo = null
    if (svgPath.attributes['data-alert-id']) alertInfo = svgPath.attributes['data-alert-id'].value
    return alertInfo
  })

  if (data) {
    console.log(data)
  } else {
    console.log('no data')
  }

  await browser.close()
}
run()
