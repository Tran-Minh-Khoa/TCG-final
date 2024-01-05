const productLists = [...document.querySelectorAll('.product-row')]
const nextBtns = [...document.querySelectorAll('.next-btn')]
const prevBtns = [...document.querySelectorAll('.prev-btn')]

productLists.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect()
    let containerWidth = containerDimensions.width

    nextBtns[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth
    })

    prevBtns[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth
    })
})

const quantitySelectors = [...document.querySelectorAll("[id^='quantitySelector']")]

const itemIDs = [...document.querySelectorAll("[id^='itemID']")]
const maxQuantities = [...document.querySelectorAll("[id^='maxQuantity']")]
const oldQuantities = [...document.querySelectorAll("[id^='oldQuantity']")]
const itemPrices = [...document.querySelectorAll("[id^='itemPrice']")]

quantityRegex = /^\d+$/

quantitySelectors.forEach((item, i) => {
    item.addEventListener('input', () => {
        const value = item.value
        if(!quantityRegex.test(value)){
            item.value = oldQuantities[i].value
            return
        }
        if(parseInt(value) > parseInt(maxQuantities[i].value)){
            item.value = maxQuantities[i].value
        }
    })

    item.addEventListener('change', () => {
        const productId = itemIDs[i].value
        const quantity = parseInt(item.value)
        const price = quantity * parseFloat(itemPrices[i].value)

        formBody = {}

        formBody['productId'] = productId
        formBody['quantity'] = quantity
        formBody['price'] = price

        fetch("/cart/update-cart-item", {
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(formBody)
        })
        .then(response => {
            if(response.ok){
                window.location.reload(true);
            }
        })
    })
})

function removeCartItem(id) {
    console.log("unimplemented")
    formBody = {}

    formBody['productId'] = id
    formBody['quantity'] = 0
    formBody['price'] = 0

    fetch("/cart/update-cart-item", {
        method: "PUT",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(formBody)
    })
    .then(response => {
        if(response.ok){
            window.location.reload(true);
        }
    })
}

const checkoutForm = document.getElementById('checkoutForm')

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch("/cart/checkout", {
        method: "POST"
    })
    .then(response => {
        if(response.ok){
            window.location.href = response.url
        }
    })
})