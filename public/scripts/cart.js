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