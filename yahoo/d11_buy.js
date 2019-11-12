const {
  authToken: { token: authToken },
  ecgql: {
    gqlItemPage: {
      id: productBundleId
    }
  }
} = ISO_REDUX_DATA

let receiver = {
  name: 'ShenShimin',
  mobile: '0979102078',
  phone: '0979102078',
  ext: null,
  address: '南港區三重路66號14樓',
  city: '台北市',
  country: 'tw',
  town: '南港區',
  zipCode: '115',
  isForeign: false
}
let cvs = {
  storeId: '127516',
  storeName: '經貿',
  storeAddress: '台北市南港區三重路19號1樓'
}

// step1 - item page: add to cart
let addToCartPayload = {
  type: 'CALL_RESERVICE',
  payload: {
    authToken,
    cartType: '30',
    checkoutAction: 'AddToCart',
    isMobile: false,
    isStoreProduct: false,
    itemLines: [
      {
        productBundleId,
        // productBundleId: '4804805',
        quantity: 1
      }
    ]
  },
  reservice: {
    name: 'FETCH_CHECKOUT_ADD_TO_CART_RESULT',
    start: 'FETCH_CHECKOUT_ADD_TO_CART_START',
    state: 'CREATED'
  }
}

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
        res &&
        res.data &&
        res.data.shopping &&
        res.data.shopping.carts &&
        res.data.shopping.carts[0].count
    )
}

const addToCart = async () => {
  let addToCartURL = 'https://tw.buy.yahoo.com/ssfe/_service_/'
  let response = await fetch(addToCartURL, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(addToCartPayload)
  })
  return await response.json()
}

let addCartSuccess = false
let addCartResp
let count

const execute = async () => {
  while (!addCartSuccess || !Number(count)) {
    addCartResp = await addToCart()
    // count = await cartCount()
    addCartSuccess = !addCartResp.error
    console.log(addCartResp)
    // console.log(count);
    if (!addCartSuccess || !Number(count)) {
      console.log('FAILED: addToCart')
      // console.log(addCartResp.payload.errorData.error[0])
    }
  }
}

execute()
