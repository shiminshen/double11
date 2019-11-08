const invalidCouponIds = ['265291', '262490', '265787']

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
const coupons = ['262416', '262430', '262420', '262422']
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

// const getCouponPayload = {
//   type: 'CALL_RESERVICE',
//   payload: { userTags: 'ALL', deviceTags: 'ALL,APP', limit: 100, offset: 0 },
//   reservice: { name: 'APPEND_COUPONS_PMO', state: 'CREATED' }
// }

// const getUsefulCoupons = res => {
//   const {
//     payload: { coupons }
//   } = res
//   const usefulCoupons = coupons.filter(
//     ({ campaignId, discountRule: { percentage } }) =>
//       Number(percentage) === 50 && !invalidCouponIds.includes(campaignId)
//   )
//   return usefulCoupons
// }

// window.STOP = false
// const execute = async () => {
//   let getCouponsResp
//   while (!window.STOP) {
//     getCouponsResp = await dispatchReservice(getCouponPayload)

//     const usefulCoupons = getUsefulCoupons(getCouponsResp)
//     console.log(usefulCoupons)
//     const result = await Promise.all(
//       usefulCoupons.map(({ campaignId }) => acquireCoupon(campaignId))
//     )
//     console.log('acquire result: ', result)
//   }
// }

// execute()
