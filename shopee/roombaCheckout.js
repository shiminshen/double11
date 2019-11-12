const puppeteer = require('puppeteer')

const wsChromeEndpointurl =
  'ws://127.0.0.1:9222/devtools/browser/b846c49c-1b85-4d13-aa19-f3e08fc83ab1'

;(async () => {
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl
  })
  const page = await browser.newPage()

  await page.goto('https://shopee.tw/')

  setInterval(() => {
    page.close()
  }, 3600000)

  await page.goto('https://shopee.tw/cart/')

  const evaluateCheckout = await page.evaluate(async () => {
    const step1Check = window.setInterval(async () => {
      let step1Btn
      if (window.location.pathname === '/cart/') {
        step1Btn = document.querySelector('.cart-page-footer__checkout button')
        console.log('step1: ', step1Btn)
        if (step1Btn) {
          step1Btn.click()
        } else {
          console.log('reload')
          window.location.href = 'https://shopee.tw/cart/'
        }
      }
    }, 100)

    const step2Check = window.setInterval(() => {
      let step2Btn, loading
      if (window.location.pathname === '/checkout/') {
        window.clearInterval(step1Check)
        loading = document.querySelector('.loading-spinner-popup__container')
        step2Btn = document.querySelector(
          '.checkout-payment-method-view ~ div button'
        )
        console.log('step2: ', step2Btn)
        if (loading) {
          console.log('loading!!!!!!!!!!!!!!!!!!!!!!!')
        }
        if (step2Btn && !loading) {
          console.log('click step2!')
          step2Btn.click()
        }
      }
    }, 100)
  })

  // await page.screenshot({ path: 'example.png' })
  // await browser.close();
})()
