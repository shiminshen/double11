const puppeteer = require('puppeteer');
const shopee = require('./shopee.js');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://shopee.tw/');

  const dimensions = await page.evaluate(async () => {

    document.cookie = 'SPC_F=gkbyAkZm5sQ7FHw6Br7mL14CSwGMkrbt; REC_T_ID=bbad48b8-1a04-11e9-9b2f-f8f21e1a8252; __BWfp=c1547694325477xea4d2cce2; _ga=GA1.2.1143916704.1547694326; cto_lwid=78cf9f5f-818d-4327-9388-cdb21144b763; _gcl_au=1.1.84771564.1573097338; csrftoken=2AC94fKMCE7CuUqAaoaFQZnZ47jVZJYn; welcomePkgShown=true; _gid=GA1.2.923829821.1573097341; PHPSESSID=b3fa33b5a25a55cd0c9f5b5083b4309f; AMP_TOKEN=%24NOT_FOUND; fbm_382498665271383=base_domain=.shopee.tw; UYOMAPJWEMDGJ=; SPC_SC_SA_TK=; SPC_SC_SA_UD=; SPC_SI=dmhkmbe9moengvf6fqfapy6fb0p1c4m9; SPC_EC="uS50JK6wVujR9BQG4PSalPQK4E7+dhYN0LJZIWzC/Nvjb/iONVz2BGBr12rEwp0qydh55tmozDfc/gKsKpIGDxpziqDLNfcHonZJMJ2dblIaOQ0UsEsKRoD9JOil8oGd8NAZci36/F/JRXPTFjtOeXhR8gq6J2gkeLXy8BgmnO0="; SPC_U=73045632; REC_MD_30_2000182664=1573123632; SPC_IA=1; SPC_SC_TK=3d159e654882509360057fb38b00d9af; SPC_SC_UD=73045632; REC_MD_14=1573123354; REC_MD_36=1573123823; REC_MD_20=1573123314; _dc_gtm_UA-61915057-6=1; SPC_T_IV="1dRbixaHG1Hf5wHQgZq7HQ=="; SPC_T_ID="dheuRO3JHFpnlXR3fiKGuq6IPnEv7Fm++kJz60dVheKo5ysEyPkB154Pi4aLpUS2bLv8LeH8DN5hUfHO1yORBn4pgi/S0ryCbSHxUXQaOuM="; _gali=main'

    const xiaomiPayload = {
      shopid: 29947484,
      itemid: 2336142593,
      modelid: 6353301854
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
          'x-csrftoken': getCookies.csrftoken,
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
      .then(res => console.log('-----------------------', res) || res.json())
      .catch(err => console.log('=======================', err))
    }

    const getCartInfo = () => fetch('https://shopee.tw/api/v1/account_info/?need_cart=1&skip_address=1', { credentials: 'same-origin' }).then(res => res.json())

    const execute = async () => {
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
    return await execute()
  });

  console.log('enooo');
  await page.screenshot({path: 'example.png'});
  // await browser.close();
})();
