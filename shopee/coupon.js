const getCookies = Object.fromEntries(document.cookie.split('; ').map(x => x.split('=')))

const getCoupon = () => {
  return fetch('https://shopee.tw/api/v2/voucher_wallet/save_voucher', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'x-api-source': 'pc',
      'x-csrftoken': getCookies.csrftoken,
      'x-requested-with': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      signature: "30c244fc2eada33e7dcdc1da0348c15e375ddad6fc41cd0554f38fd135eadc07",
      voucher_promotionid: 46412788
    })
  })
    .then(res => res.json())
    .then(res => console.log(res))
}

const execute = async () => {
  setInterval(() => {
    getCoupon()
  }, 10)
}

execute()
