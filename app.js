#!/usr/bin/env node

import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
dotenv.config()
// import jsdom from 'jsdom'
// const dom = new jsdom.JSDOM(`<!DOCTYPE html><p>Hello world</p>`)
// const text = dom.window.document.querySelector('p').textContent

let onAlert = false

async function run() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://alerts.in.ua')

  // Wait for element to be loaded
  await page.waitForSelector('#super-lite-map > g.oblasts > path:nth-child(22)') // Not sure if it works properly
  await new Promise((r) => setTimeout(r, 1000)) // Adding timeout fix 'alertId' return 'null' sometimes

  const alertId = await page.evaluate(() => {
    // Browser context
    // Info: after many tries, I found that svg 'path' is not general html element, but it is related to ATTRIBUTE, this why, when logging html elements or nodes of html partent element of 'path' it show nothing -> 'HTMLUnknownElement'. Thus access data attributes with 'attributes' method
    // document.querySelector('#super-lite-map > g.oblasts > path:nth-child(22)').innerHTML // return empty, there are no html, only attributes
    let dataAlertId = null
    const svgPath = document.querySelector('#super-lite-map > g.oblasts > path:nth-child(22)')
    if (svgPath.attributes['data-alert-id']) dataAlertId = svgPath.attributes['data-alert-id'].value
    return dataAlertId // return 'data-alert-id' or 'null'
  })

  // Send HTTP GET request to Telegram bot API
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID
  const telegramMessageAlertOn = '🔴 Повітряна тривога у Закарпатській області'
  const telegramMessageAlertOff = '🟢 Кінець тривоги'

  if (alertId && !onAlert) {
    await fetch(
      `https://api.telegram.org/${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${telegramMessageAlertOn}`
    )
    onAlert = true
  }
  if (!alertId && onAlert) {
    await fetch(
      `https://api.telegram.org/${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${telegramMessageAlertOff}`
    )
    onAlert = false
  }

  await browser.close()
}

// Run every 20 sec
setInterval(() => {
  run()
}, 20000)
