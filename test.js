async function dispatchReservice(payload) {
  let getCouponUrl = 'https://tw.buy.yahoo.com/morder/_reservice_/'
  let response = await fetch(getCouponUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  return await response.json()
}

const acquireCoupon = async campaignId => {
  console.log(`acuire coupon ${campaignId}`)
  const authToken = ISO_REDUX_DATA.authToken.token
  const acquireCouponPayload = {
    type: 'CALL_RESERVICE',
    payload: { campaignId, authToken, viewCode: '' },
    reservice: { name: 'ACQUIRE_COUPON_PMO', state: 'CREATED' }
  }
  return await dispatchReservice(acquireCouponPayload)
}

let intervalId = null
const coupons = ['262732', '262734', '262739', '262741']
const startCouponInterval = () => {
  intervalId = window.setInterval(() => {
    coupons.map(campaignId => {
      return acquireCoupon(campaignId).then(res => {
        const status = res && res.payload && res.payload.status
        if (status === 201) {
          console.log('SUCCESS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        } else {
          console.log(`get ${campaignId} failed`)
        }
      })
    })
  }, 100)
}

const clearCouponInterval = () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
}

startCouponInterval()
