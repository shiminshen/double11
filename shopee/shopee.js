  const ITEM_URL =
  'https://shopee.tw/api/v2/item/get?itemid=2203443583&shopid=54598032'
  // 'https://shopee.tw/api/v2/item/get?itemid=5504415029&shopid=54598032'

const getCookies = () =>
  Object.fromEntries(document.cookie.split('; ').map(x => x.split('=')))

const getItemInfo = (price = 16900) => {
  return fetch(ITEM_URL, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      const {
        item: { models, shopid }
      } = res
      console.log(res)
      const { itemid, modelid } =
        models.find(m => m.price === price * 100000) || {}
      return modelid
        ? {
            shopid,
            itemid,
            modelid
          }
        : null
    })
}

// getItemInfo().then(res => console.log(res))

const addtoCart = async itemPayload => {
  return fetch('https://shopee.tw/api/v2/cart/add_to_cart', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'x-api-source': 'pc',
      'x-csrftoken': getCookies().csrftoken,
      'x-requested-with': 'XMLHttpRequest',
      'x-shopee-language': 'zh-Hant',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_source: 1,
      quantity: 1,
      checkout: true,
      update_checkout_only: false,
      donot_add_quantity: false,
      source: '{"refer_urls":[]}',
      ...itemPayload
    })
  }).then(res => res.json())
}

const getToken = fetch(
  'https://seller.shopee.tw/webchat/api/v1.1/mini/login?source=pcmall&_uid=0-73045632&_v=1.11.1',
  {
    credentials: 'same-origin'
  }
).then(res => res.json())

const getCartInfo = () =>
  fetch('https://shopee.tw/api/v1/account_info/?need_cart=1&skip_address=1', {
    credentials: 'same-origin'
  }).then(res => res.json())

const dummyPayload = {
  shoporders: [
    {
      shop: { shopid: 54598032 },
      items: [
        {
          itemid: 2203443583,
          modelid: 4141958923,
          add_on_deal_id: null,
          is_add_on_sub_item: null,
          item_group_id: null,
          quantity: 1
        }
      ],
      logistics: { recommended_channelids: null },
      buyer_address_data: {}
    }
  ],
  selected_payment_channel_data: {
    channel_id: 3004100,
    channel_item_option_info: {},
    version: 2
  },
  promotion_data: {
    use_coins: false,
    free_shipping_voucher_info: {
      free_shipping_voucher_id: 0,
      disabled_reason: '',
      description: ''
    },
    platform_vouchers: [],
    shop_vouchers: [],
    check_shop_voucher_entrances: true,
    auto_apply_shop_voucher: false
  },
  device_info: {
    device_id: '',
    device_fingerprint: '',
    tongdun_blackbox: '',
    buyer_payment_info: {}
  },
  tax_info: { tax_id: '' }
}

const checkoutGet = (itemInfo) => {
  return fetch('https://shopee.tw/api/v2/checkout/get', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'x-api-source': 'pc',
      'x-csrftoken': getCookies().csrftoken,
      'x-requested-with': 'XMLHttpRequest',
      'x-shopee-language': 'zh-Hant',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...dummyPayload,
      shop: { shopid: itemInfo.shopid },
      items: [
        {
          itemid: itemInfo.itemid,
          modelid: itemInfo.modelid,
          add_on_deal_id: null,
          is_add_on_sub_item: null,
          item_group_id: null,
          quantity: 1
        }
      ]
    })
  })
    .then(res => res.json())
    .then(res => console.log(res))
}

const execute = async () => {
  let itemInfo = null
  let addtoCartResp
  let addtoCartSuccess = false
  let cartInfo = false

  do {
    itemInfo = await getItemInfo()
  } while (!itemInfo)

  console.log('getItemInfo: ', itemInfo)

  do {
    addtoCartResp = await addtoCart(itemInfo)

    cartInfo = await getCartInfo()
    console.log(cartInfo)
    addtoCartSuccess =
      !addtoCartResp.error && cartInfo && cartInfo.cart_item_count
  } while (!addtoCartSuccess)

  const checkoutInfo = await checkoutGet()
  console.log(checkoutInfo)
}

execute()

/**
 *
 *
 * checkout
 *
 *
 *
 **/

// const checkoutGetPayload = {
//   shoporders: [
//     {
//       shop: { shopid: 12443 },
//       items: [
//         {
//           itemid: 1234818783,
//           modelid: 1454070900,
//           add_on_deal_id: null,
//           is_add_on_sub_item: null,
//           item_group_id: null
//         }
//       ],
//       logistics: { recommended_channelids: null },
//       buyer_address_data: {}
//     }
//   ],
//   selected_payment_channel_data: {},
//   promotion_data: {
//     voucher_code: '',
//     use_coins: false,
//     free_shipping_voucher_info: {}
//   },
//   device_info: {
//     device_id: '',
//     device_fingerprint: '',
//     tongdun_blackbox: '',
//     buyer_payment_info: {}
//   }
// }

// const step1Check = () => window.setInterval(() => {
//   let step1Btn
//   if (window.location.pathname === '/cart/') {
//     step1Btn = document.querySelector('.cart-page-footer__checkout button')
//     console.log('step1: ', step1Btn);
//     if (step1Btn) {
//       step1Btn.click()
//     }
//   }
// }, 100)

// const step2Check = () => window.setInterval(() => {
//   let step2Btn, loading
//   if (window.location.pathname === '/checkout/') {
//     window.clearInterval(step1Check)
//     loading = document.querySelector('.loading-spinner-popup__container')
//     step2Btn = document.querySelector('.checkout-payment-method-view ~ div button')
//     console.log('step2: ', step2Btn);
//     if (loading) {
//       console.log('loading!!!!!!!!!!!!!!!!!!!!!!!');
//     }
//     if (step2Btn && !loading) {
//       console.log('click step2!')
//       step2Btn.click()
//     }
//   }
// }, 100)

// module.exports = {
//   addtoCart,
//   execute,
//   step1Check,
//   step2Check
// }
