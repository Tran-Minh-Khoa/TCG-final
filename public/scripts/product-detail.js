const minusBtns = [...document.querySelectorAll('.minus-btn')]
const plusBtns = [...document.querySelectorAll('.plus-btn')]
const quantityFields = [...document.querySelectorAll('.quantity')]
const reviewForm = document.getElementById('reviewForm')
const reviewList = document.getElementById('userReviews')
const detailsElement = document.querySelector('details');
quantityFields.forEach((item, i) => {
    minusBtns[i].addEventListener('click', () => {
        const value = parseInt(item.value)
        item.value = value - 1 <= 0 ? 1 : value - 1
    })
    plusBtns[i].addEventListener('click', () => {
        const value = parseInt(item.value)
        item.value = value + 1 > 99 ? 99 : value + 1
    })
})
const renderReviews = (reviews) => {
    reviewList.innerHTML = reviews.map((review) => {
        return ` <div class="review-content vstack gap-3">
        <span class="review-content-name">${review.name}</span>
        <p>${review.content}</p>
    </div>`
    }).join('')
}
const fetchReviews = () => {
    const url = window.location.href;
    const segments = url.split('/'); // Tách URL thành các phần dựa trên dấu '/'
    const lastSegment = segments[segments.length - 1]; // Lấy phần tử cuối cùng
    console.log(lastSegment);
    fetch(`/products/detail/reviews/${lastSegment}`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(data => {
        renderReviews(data)
    })
    .catch(error => {
        console.error('Error:', error);
    })
}




reviewForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(reviewForm)
    const data = Object.fromEntries(formData.entries())
    const url = window.location.href;
    const segments = url.split('/'); // Tách URL thành các phần dựa trên dấu '/'
    const lastSegment = segments[segments.length - 1]; // Lấy phần tử cuối cùng
    console.log(lastSegment);
    console.log(data)
    fetch(`/products/detail/${lastSegment}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        fetchReviews()
    })
    .catch(error => {
        console.error('Error:', error);
    })
    detailsElement.removeAttribute('open');

})
window.addEventListener("load", (e) => {
    fetchReviews()
})