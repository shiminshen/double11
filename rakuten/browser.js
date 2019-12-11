const puppeteer = require('puppeteer')

const wsChromeEndpointurl =
  'ws://[::1]:9222/devtools/browser/ebe01460-def2-4347-b775-256c263156ab'

;(async () => {
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsChromeEndpointurl
  })
  const page = await browser.newPage()
  await page.goto('https://www.rakuten.com.tw/event/supersale/?m-id=RADTop-My-Normal-BN')

  setInterval(() => {
    page.close()
  }, 3600000)

  const evaluateAddtoCart = await page.evaluate(async () => {
    const getToken = () =>
    fetch('https://www.rakuten.com.tw/api/csrf_tokens.json')
    .then(res => res.json())
    .then(({ token }) => token)

    const addToCart = token =>
    fetch('https://www.rakuten.com.tw/api/carts/add.json', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'x-csrf-token': token,
        'x-requested-with': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shop_id: 'd2e138b0-7ed8-11e6-b97d-2c600c73734f',
        merchant_id: 'd2daa900-7ed8-11e6-be17-54ab3a295b79',
        item_id: '9b061c90-0f2f-11ea-948e-0242ac110003',
        variant_id: '9b061c91-0f2f-11ea-948e-0242ac110003',
        price: '290',
        // iphone
        // shop_id: '317dfcd0-dc55-11e6-9d99-2c600c429076',
        // merchant_id: '31745fe0-dc55-11e6-9d99-2c600c429076',
        // item_id: '189356f0-1a70-11ea-870b-0242ac110003',
        // variant_id: '189356f1-1a70-11ea-870b-0242ac110003',
        // price: '17430',
        currency: '元',
        quantity: '1'
      })
    }).then(res => res.json())

    const step1 = body =>
    fetch('https://www.rakuten.com.tw/buy/login?l-id=tw_cart_checkout_1', {
      method: 'POST',
      credentials: 'same-origin',
      body
    })

    const step2 = body =>
    fetch('https://www.rakuten.com.tw/buy/shipping_update', {
      method: 'POST',
      credentials: 'include',
      mode: 'same-origin',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'referer': 'https://www.rakuten.com.tw/buy/shipping?l-id=tw_checksignin_member',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })


    const execute = async () => {
      const token = await getToken()
      console.log(token)

      let addToCartRes = await addToCart(token)
      while (!addToCartRes || addToCartRes.status !== 200) {
        console.log(addToCartRes)
        addToCartRes = await addToCart(token)
      }
      const { status, shopperId, shopCarts } = addToCartRes
      const { shopId, items } = shopCarts[0]
      const { quantities, price } = items[0]

      console.log(addToCartRes)

      // step1
      const formData = new FormData()
      formData.append('authenticity_token', token)
      // formData.append('cart', JSON.stringify(answer))
      formData.append(
        'cart',
        JSON.stringify({
          shop_cart: {
            shopId,
            shopperId,
            items: [
              {
                ...items[0],
                currency: 'TWD',
                deliverable: true,
                in_stock: true,
                is_bogo_item: false,
                // rakuten_category: { rakutenCategoryId: 5174 }
                rakuten_category: { rakutenCategoryId: 9005 }
              }
            ],
            bundleInfo: { bundleDiscount: 0, subtotal: quantities * Number(price) },
            orderCampaignInfo: { orderCampaignDiscount: 0 }
          }
        })
      )

      const step1Res = await step1(formData)
      console.log(step1Res);
    }

    await execute()
  })

  await page.goto('https://www.rakuten.com.tw/buy/shipping?l-id=tw_checksignin_member')

  const btn = await page.waitForSelector('.lt-continue-payment:not([disabled])')
  btn.click()
  await page.waitForNavigation()
  const paymentBtn = await page.waitForSelector('input[name=payment-methods-selection]')
  paymentBtn.click()
  // const CVVInput= await page.waitForSelector('#CVV')
  await page.waitForSelector('#CVV')
  await page.focus('#CVV')
  page.keyboard.type('091')

  // await page.screenshot({ path: 'example.png' })
  // await browser.close();
})()
