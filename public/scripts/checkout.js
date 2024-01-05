const checkoutForm = document.getElementById("checkoutForm")

checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Lấy id của cái order/bill
    const url = window.location.href;
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];

    formBody = {}
    
    formBody['orderId'] = lastSegment
    //formBody['amount'] = 500000

    fetch("/payment/create_payment_url", {
        method: "POST",
        body: JSON.stringify(formBody),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => {
        if(response.ok){
            return response.json()
        }
    })
    .then(data => {
        window.location.href = data.link
    })
})