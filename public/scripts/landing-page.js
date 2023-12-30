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

const minusBtns = [...document.querySelectorAll('.minus-btn')]
const plusBtns = [...document.querySelectorAll('.plus-btn')]
const quantityFields = [...document.querySelectorAll('.quantity')]

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

const images =  [...document.querySelectorAll('.slider-img')]
const overlays = [...document.querySelectorAll('.overlay')]

//Initialize image slider's indicators
document.querySelector('.indicators').innerHTML = images.map((element, index) => {
    return `<button type="button" class="indicator-btn" onclick="handleSlideTo(event, ${index})" onmouseover="handleHover(event)">${index + 1}</button>`
}).join('')

const indicators = [...document.querySelectorAll('.indicator-btn')]

images[0].classList.add('img-appear')
overlays[0].classList.add('overlay-appear')
indicators[0].classList.add('indicator-btn-chosen')
addClassToAllChildren(overlays[0], 'overlay-text-appear')

i = 0;
max_i = images.length

var custom_cursor = document.querySelector('.custom-cursor')

function handleSlideTo(event, index) {
    event.stopPropagation()
    slideTo(index)
}

function handleHover(event) {
    event.stopPropagation()
    custom_cursor.style.display = 'none'
}

function slideTo(index) {
    images[i].classList.remove('img-appear')
    overlays[i].classList.remove('overlay-appear') 
    indicators[i].classList.remove('indicator-btn-chosen')
    removeClassToAllChildren(overlays[i], 'overlay-text-appear')
    i = index
    images[i].classList.add('img-appear')
    overlays[i].classList.add('overlay-appear')
    indicators[i].classList.add('indicator-btn-chosen')
    addClassToAllChildren(overlays[i], 'overlay-text-appear')
}

function addClassToAllChildren(element, class_name){
    children = element.children
    let index = 0
    const interval = 70

    const addClass = () => {
        if(index < children.length){
            children[index].classList.add(class_name)
            index++
        }
        else{
            clearInterval(intervalLoop);
        }
    }

    const intervalLoop = setInterval(addClass, interval)
}

function removeClassToAllChildren(element, class_name){
    for (const child of element.children){
        child.classList.remove(class_name)
    }
}

//slide image based on cursor's position

const image_container = document.querySelector('.image-container')

image_container.addEventListener('click', (e) => {
    const clickX = e.clientX - image_container.getBoundingClientRect().left
    const divWidth = image_container.clientWidth

    if(clickX < divWidth / 2){
        slideTo( i - 1 < 0 ? max_i - 1 : i - 1)
    }
    else{
        slideTo((i + 1 ) % max_i)
    }
})

image_container.addEventListener('mousemove', (e) => {
    const clickX = e.clientX - image_container.getBoundingClientRect().left
    const clickY = e.clientY - image_container.getBoundingClientRect().top
    custom_cursor.style.translate = (clickX - 25) + 'px '+ (clickY - 25) + 'px'
    const divWidth = image_container.clientWidth

    if(clickX < divWidth / 2){
        custom_cursor.children[0].style.transform = 'rotate(180deg)'
    }
    else{
        custom_cursor.children[0].style.transform = 'rotate(0deg)'
    }
})

image_container.addEventListener('mouseover', (e) => {
    custom_cursor.style.display = 'flex'
})

image_container.addEventListener('mouseleave', (e) => {
    custom_cursor.style.display = 'none'
})

// setInterval(function() {
//     image[i].classList.remove('img-appear')
//     overlay[i].classList.remove('overlay-appear')
//     i = (i +1) % 2
//     overlay[i].classList.add('overlay-appear')
//     image[i].classList.add('img-appear')

// }, 2000)