const puppeteer = require('puppeteer')

const wsChromeEndpointurl =
  'ws://127.0.0.1:9222/devtools/browser/29d1f299-4ad9-42cb-9f06-db473a142ab1'

;(async () => {
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl
  })
  const page = await browser.newPage()
  await page.goto('https://shopee.tw/')

  setInterval(() => {
    page.close()
  }, 100000)

  const evaluateAddtoCart = await page.evaluate(async () => {
    //test
    const itemPayload = {
      shopid: 20162694,
      itemid: 422541525,
      modelid: 324508154
    }
    
    //0000 iphone
    // const itemPayload = {
    //   shopid: 54598032,
    //   itemid: 2804455767,
    //   modelid: 6950131608
    // }

    // 0000 moto
    // const itemPayload = {
    //   shopid: 23151015,
    //   itemid: 2288651549,
    //   modelid: 4453135821
    // }

    const getCookies = () =>
      Object.fromEntries(document.cookie.split('; ').map(x => x.split('=')))

    const addtoCart = () => {
      return fetch('https://shopee.tw/api/v2/cart/add_to_cart', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'x-api-source': 'pc',
          'x-csrftoken': getCookies().csrftoken,
          'x-requested-with': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: 1,
          checkout: true,
          update_checkout_only: false,
          donot_add_quantity: false,
          source: '{"refer_urls":[""]}',
          ...itemPayload
        })
      }).then(res => res.json())
    }

    const getCartInfo = () =>
      fetch(
        'https://shopee.tw/api/v1/account_info/?need_cart=1&skip_address=1',
        { credentials: 'same-origin' }
      ).then(res => res.json())

    const execute = async () => {
      console.log(window)
      let addtoCartSuccess = false
      do {
        const addtoCartResp = await addtoCart()
        console.log(addtoCartResp);
        const cartInfo = await getCartInfo()
        console.log(cartInfo);
        addtoCartSuccess =
          !addtoCartResp.error && (cartInfo && cartInfo.cart_item_count)
      } while (!addtoCartSuccess)

    }
    return await execute()
  })

  await page.goto('https://shopee.tw/cart/')

  const evaluateCheckout = await page.evaluate(async () => {

    const step1Check = window.setInterval(() => {
      let step1Btn
      if (window.location.pathname === '/cart/') {
        step1Btn = document.querySelector('.cart-page-footer__checkout button')
        console.log('step1: ', step1Btn);
        if (step1Btn) {
          step1Btn.click()
        }
      }
    }, 100)

    const step2Check = window.setInterval(() => {
      let step2Btn, loading
      if (window.location.pathname === '/checkout/') {
        window.clearInterval(step1Check)
        loading = document.querySelector('.loading-spinner-popup__container')
        step2Btn = document.querySelector('.checkout-payment-method-view ~ div button')
        console.log('step2: ', step2Btn);
        if (loading) {
          console.log('loading!!!!!!!!!!!!!!!!!!!!!!!');
        }
        if (step2Btn && !loading) {
          console.log('click step2!')
          // step2Btn.click()
        }
      }
    }, 100)
  })

  // await page.screenshot({ path: 'example.png' })
  // await browser.close();
})()
