// step2 - shopping cart: create draft order
//
const cartCount = async () => {
  return fetch('https://graphql.ec.yahoo.com/web/sas/v1/ajax/sasCartCount', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(
      res =>
        res && res.data && res.data.shopping && res.data.shopping.carts[0].count
    )
}

const getCheckoutPageData = async () =>
  fetch('https://twpay.buy.yahoo.com/ajax/checkout/preview?fromCart=10', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(e => null)

const placeOrder = async payload => {
  let response = await fetch(
    'https://twpay.buy.yahoo.com/checkout/_reservice_/',
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )
  return response.json()
}

const tmpPlaceorderPayload = {
  '.crumb': 'db8NLobxPVN',
  actCode: '',
  coServerName1: '',
  coServerName2: '',
  ct: 10,
  expco_bookmark: '1',
  invo_donate: '2',
  'ordr_note[0]': '',
  ordr_phone_extension: '',
  paysrc: 50,
  paytype: '1',
  recv_zipcode: '115',
  session_id: 'Y_314DA_778145bb188aaf1fdc399506abbd9473',
  useExpco: 1,
  wallet_address_id: '8729282'
}

const checkoutExecute = async () => {
  let checkoutResp
  let getDataSuccess
  while (!getDataSuccess) {
    checkoutResp = await getCheckoutPageData()
    console.log(checkoutResp)
    if (
      checkoutResp &&
      !checkoutResp.error &&
      checkoutResp.cart &&
      checkoutResp.cart.itemLines.length
    ) {
      getDataSuccess = true
      console.log('placeorder')
      const {
        crumb,
        cart: { draftOrderId: session_id }
      } = checkoutResp
      const placeorderPayload = {
        payload: {
          ...tmpPlaceorderPayload,
          '.crumb': crumb,
          session_id
        },
        reservice: { name: 'FETCH_PLACEORDER_DATA', state: 'CREATED' },
        type: 'CALL_RESERVICE'
      }

      let placeorderSuccess
      do {
        await placeOrder(placeorderPayload)
        placeorderSuccess = !Number(await cartCount())
      } while (placeorderSuccess)
    }
  }
}

checkoutExecute()
