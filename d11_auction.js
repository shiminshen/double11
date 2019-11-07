let { item, seller, page } = ISO_REDUX_DATA
let { listingId, productId } = item
// need manual handle if spec/model is complicated
let model = item.models[0]
let modelId = model.id
let specAndOption = model.specCombination.split(':')
let specId = specAndOption[0]
let specOptionId = specAndOption[1]

let sellerScreenName = seller.screenName
let wssid = page.wssid

// update manually
let selectedShipType = '.s7c'
let selectedPayTypeId = "C2C_SEVEN_LOGISTICS_PAYMENT_PAY_TYPE"
let amount = {
  item: 11,
  shipping: 60,
  order: 71
}

let receiver = { 
  "name":"ShenShimin",
  "mobile":"0979102078",
  "phone":"0979102078",
  "ext":null,
  "address":"南港區三重路66號14樓",
  "city":"台北市",
  "country":"tw",
  "town":"南港區",
  "zipCode":"115",
  "isForeign":false
}
let cvs = { 
  "storeId":"127516",
  "storeName":"經貿",
  "storeAddress":"台北市南港區三重路19號1樓"
}

// step1 - item page: add to cart
let addToCartPayload = { 
  "type":"CALL_RESERVICE",
  "payload":{ 
     "formData":{ 
        [specId]:specOptionId,
        "listingId":listingId,
        "productId":productId,
        "modelId":modelId,
        "cartType":"normal",
        "wssid":wssid,
        "streamingListingUuid":"",
        "streamingRoomId":"",
        "quantity":"1",
        "trigger":"buyNow"
     }
  },
  "reservice":{ 
     "name":"FETCH_ADD_CART",
     "start":"FETCH_ADD_CART_START",
     "state":"CREATED"
  }
}

async function addToCart () {
  let addToCartURL = 'https://tw.bid.yahoo.com/fe/_reservice_/'
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
while (!addCartSuccess) {
  addCartResp = await addToCart()
  addCartSuccess = !addCartResp.error
  if (!addCartSuccess) {
    console.log('FAILED: addToCart')
    console.log(addCartResp.payload.errorData.error[0])
  }
}

// step2 - shopping cart: create draft order
let createDraftOrderPayload = { 
  "type":"CALL_RESERVICE",
  "payload":{ 
     "cartId":sellerScreenName,
     "selectedShipType":selectedShipType,
     "prices":[ 
        { "type":"item", "amount":amount.item },
        { "type":"shipping", "amount":amount.shipping, "isCustomShippingFee":false },
        { "type":"order", "amount":amount.order }
     ],
     "discounts":[],
     "items":[ 
        { 
           "merchandiseId":listingId,
           "productId":productId,
           "modelId":modelId,
           "qty":1,
           "isCheckoutable":true
        }
     ],
     "extra":null
  },
  "reservice":{ 
     "name":"FETCH_CREATE_DRAFT_ORDER",
     "start":"FETCH_CREATE_DRAFT_ORDER_START",
     "state":"CREATED"
  }
}

async function createDraftOrder () {
  let createDraftOrderURL = 'https://tw.bid.yahoo.com/fe/_reservice_/'
  let response = await fetch(createDraftOrderURL, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createDraftOrderPayload)
  })
  return await response.json()
}

let createDraftOrderSuccess = false
let createDraftOrderResp
while (!createDraftOrderSuccess) {
  createDraftOrderResp = await createDraftOrder()
  createDraftOrderSuccess = !createDraftOrderResp.error
}

let draftOrderId = createDraftOrderResp.payload.draftOrderId
console.log(`draftOrderId: ${draftOrderId}`)

// step3 - checkout: update draft order
let updateDraftOrderPayload = { 
  "type":"CALL_RESERVICE",
  "payload":{ 
     "updateData":{ 
        "draftOrderId":draftOrderId,
        "receiver":receiver,
        "cvs":cvs,
        "selectedPayTypeId":selectedPayTypeId
     }
  },
  "reservice":{ 
     "name":"FETCH_UPDATE_DRAFT_ORDER",
     "start":"FETCH_UPDATE_DRAFT_ORDER_START",
     "state":"CREATED"
  }
}

async function updateDraftOrder () {
  let updateDraftOrderURL = 'https://tw.bid.yahoo.com/fe/_reservice_/'
  let response = await fetch(updateDraftOrderURL, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateDraftOrderPayload)
  })
  return await response.json()
}

let updateDraftOrderSuccess = false
let updateDraftOrderResp
while (!updateDraftOrderSuccess) {
  updateDraftOrderResp = await updateDraftOrder()
  updateDraftOrderSuccess = !updateDraftOrderResp.error
}

// step4 - checkout: create order
let createOrderPayload = { 
  "type":"CALL_RESERVICE",
  "payload":{ 
     "cartId":sellerScreenName,
     "draftOrderId":draftOrderId,
     "items":[ 
        { 
           "merchandiseId":listingId,
           "productId":productId,
           "modelId":modelId,
           "qty":1
        }
     ],
     "selectedShipType":selectedShipType
  },
  "reservice":{ 
     "name":"FETCH_CREATE_ORDER",
     "start":"FETCH_CREATE_ORDER_START",
     "state":"CREATED"
  }
}

async function createOrder () {
  let createOrderURL = 'https://tw.bid.yahoo.com/fe/_reservice_/'
  let response = await fetch(createOrderURL, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createOrderPayload)
  })
  return await response.json()
}

let createOrderSuccess = false
let createOrderResp
while (!createOrderSuccess) {
  createOrderResp = await createOrder()
  createOrderSuccess = !createOrderResp.error
}

console.log('createOrderResp', createOrderResp)
let orderId = createOrderResp.payload.orderId
if (orderId) {
  const orderCompleteURL = `https://tw.bid.yahoo.com/checkout/ordercomplete?orderId=${orderId}`
  console.log(orderCompleteURL)
  location.href = orderCompleteURL
}
