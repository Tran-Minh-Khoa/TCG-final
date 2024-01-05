const orderDetailModal = document.getElementById("orderDetailModal")
const orderDetailModalInstance = new bootstrap.Modal(orderDetailModal)

function showOrderDetail(orderId) {
    fetch(`/account/get-order-detail/${orderId}`, {
        method: "GET"
    })
    .then(response => {
        if(response.ok){
            return response.json()
        }
        else{
            return null
        }
    })
    .then(data => {
        if(data !== null){
            const displayItemData = data.items.map((item) => {
                return `
                <div class="left-aligned-column">
                    <img src="${item.card.image}" alt="Image">
                    <div class="vstack gap-1 justify-content-center">
                        <span class="heavy-text">${item.card.name}</span>
                        <span class="red-text">${item.card.marketPrices}₫</span>
                    </div>
                </div>
                <div class="center-aligned-column">
                    <span class="light-text">${item.quantity}</span>
                </div>
                <div class="right-aligned-column">
                    <span class="light-text">${item.price}₫</span>
                </div>
                `
            }).join('')

            const modalData = `
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <span id="orderDetailModalLabel">Order's details</span>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="vstack gap-4">
                        <div class="vstack gap-3 align-items-center">
                            <span class="modal-title">Order's information</span>
                            <div class="vstack gap-2">
                                <div class="text-container">
                                    <span class="heavy-text">Order's ID:</span>
                                    <span>${data.order_id}</span>
                                </div>
                                <div class="text-container">
                                    <span class="heavy-text">Created on:</span>
                                    <span>${data.order_date}</span>
                                </div>
                                <div class="text-container">
                                    <span class="heavy-text">Status:</span>
                                    <span>${data.order_status.charAt(0).toUpperCase() + data.order_status.slice(1)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="vstack gap-3 align-items-center">
                            <div class="hstack gap-3 justify-content-center">
                                <span class="modal-title">Items</span>
                                <span class="count-bubble">${data.items.length}</span>
                            </div>
                            <div class="order-items-wrapper">
                                <div class="left-aligned-column header-column">Product</div>
                                <div class="center-aligned-column header-column">Quantity</div>
                                <div class="right-aligned-column header-column">Total</div>
            ` + displayItemData + `
            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <div class="gap-2 total-wrapper">
                                <div class="text-container">
                                    <span class="light-text">Subtotal</span>
                                    <span class="light-text">${data.total_price}₫</span>
                                </div>
                                <div class="text-container">
                                    <span class="light-text">Shipping</span>
                                    <span class="light-text">0₫</span>
                                </div>
                                <div class="text-container">
                                    <span class="heavy-text">Total</span>
                                    <span class="heavy-text">${data.total_price}₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `
            orderDetailModal.innerHTML = modalData
            orderDetailModalInstance.show()
        }
    })
}