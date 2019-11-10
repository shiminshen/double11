// shopId: {
//  senao: 54598032
// }

const itemPayload = {
  shopid: 54598032,
  itemid: 2804455767,
  modelid: 6950131608
}

// const xiaomiPayload = {
//   shopid: 29947484,
//   itemid: 2336142593,
//   modelid: 6353301854
// };

const xiaomiPayload = {
  shopid: 29947484,
  itemid: 2336142593,
  modelid: 4682222571
};

const getCookies = () => Object.fromEntries(
  document.cookie.split('; ').map(x => x.split('='))
)

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
      ...xiaomiPayload
    })
  })
    .then(res => res.json())
}

const getCartInfo = () => fetch('https://shopee.tw/api/v1/account_info/?need_cart=1&skip_address=1', { credentials: 'same-origin' }).then(res => res.json())

const execute = async () => {
  console.log(window);
  let addtoCartSuccess = false
  let cartInfo = false
  do {
    addtoCartResp = await addtoCart()
    console.log(addtoCartResp);
    console.log(addtoCartResp.error);
    cartInfo= await getCartInfo()
    console.log(cartInfo);
    addtoCartSuccess = !addtoCartResp.error && (cartInfo && cartInfo.cart_item_count)
  } while (!addtoCartSuccess)
  document.location.href = 'https://shopee.tw/cart/'
}

// execute()

/**
 *
 *
 * checkout
 *
 *
 *
 **/


const step1Check = () => window.setInterval(() => {
  let step1Btn
  if (window.location.pathname === '/cart/') {
    step1Btn = document.querySelector('.cart-page-footer__checkout button')
    console.log('step1: ', step1Btn);
    if (step1Btn) {
      step1Btn.click()
    }
  }
}, 100)

const step2Check = () => window.setInterval(() => {
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
      step2Btn.click()
    }
  }
}, 100)

module.exports = {
  addtoCart,
  execute,
  step1Check,
  step2Check
}
