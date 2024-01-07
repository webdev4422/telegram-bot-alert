# Telegram bot with Puppeteer

Puppeteer is a testing library and headless chrome automation tool https://pptr.dev/
Telegram HTTP API https://core.telegram.org/api
This bot works by scraping https://alerts.in.ua website every 20 second and checking status of alert on Zakarpatska oblast (by checking svg path element attribute 'data-alert-id')

## Deployment

```
ssh -i ~/.ssh/ubuntu-22-x64_key.pem azureuser@xxx.xxx.xxx.xxx
cd telegram-bot-puppeteer/
git pull
sudo systemctl restart telegram-bot
```
