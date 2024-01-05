const sortDropdown = document.getElementById("sortDropdown")
const selectedSort = document.getElementById("selectedSort")
const filterForm = document.getElementById("filterForm")
const filterFormSmall = document.getElementById("filterFormSmall")
const productList = document.getElementById("productList")
const prevPageBtn = document.getElementById("prevPageBtn")
const nextPageBtn = document.getElementById("nextPageBtn")
const currentPageText = document.getElementById("currentPageText")
const rarityFiter = document.getElementById("rarity-filter")
const typeFilter = document.getElementById("type-filter")
const subtypeFilter = document.getElementById("subtype-filter")
const supertypeFilter = document.getElementById("supertype-filter")
const raritySmallFilter = document.getElementById("rarity-small-filter")
const typeSmallFilter = document.getElementById("type-small-filter")
const subtypeSmallFilter = document.getElementById("subtype-small-filter")
const supertypeSmallFilter = document.getElementById("supertype-small-filter")

// const minInput = 0 // thay bằng document.getElementById("minInput")
// const maxInput = 100 // thay bằng document.getElementById("maxInput")
const minPriceRangeLabel = document.getElementById("minPriceRangeLabel")
const minPriceRange = document.getElementById("minPriceRange")
const maxPriceRangeLabel = document.getElementById("maxPriceRangeLabel")
const maxPriceRange = document.getElementById("maxPriceRange")

var currentPage = 1
var maxPage = null
function sortOption(sortString)
{
    if(sortString =='Date, new to old')
    {
        return {
            name:'Date, new to old',
            updatedAt: -1
        }
    }
    else if(sortString =='Date, old to new')
    {
        return {
            name:'Date, old to new',
            updatedAt: 1
        }
    }
    else if(sortString =='Price, low to high')
    {
        return {
            name:'Price, low to high',
            marketPrices: 1
        }
    }
    else if(sortString =='Price, high to low')
    {
        return {
            name:'Price, high to low',
            marketPrices: -1
        }
    }
    return {
        name:'Date, old to new',
        updatedAt: 1
    }
}
function toggleSortBtn(element){
    if (element.getAttribute('aria-expanded') === "false") {
        element.setAttribute('aria-expanded', 'true')
        sortDropdown.classList.add("on-display")
    }
    else {
        element.setAttribute('aria-expanded', 'false')
        sortDropdown.classList.remove("on-display")
    }
}

function handleOptionClick(element, canFetch=true){
    const parentListBox = element.parentElement
    const prevSelectedOption = parentListBox.querySelector('[aria-selected="true"]')

    const dropdownMenu = parentListBox.parentElement
    const sortBtn = document.querySelector(dropdownMenu.getAttribute('aria-describedby'))
    sortBtn.setAttribute('aria-expanded', 'false')
    sortDropdown.classList.remove("on-display")

    if (prevSelectedOption != element){
        prevSelectedOption.setAttribute('aria-selected', 'false')
        element.setAttribute('aria-selected', 'true')
    
        selectedSort.innerHTML = element.innerHTML

        if(canFetch){
            filterFormSmall.querySelector(`input[name="sort-by"][value="${element.value}"]`).checked = true
            // FETCHING AFTER CHOOSING OPTION
            fetchProducts(filterForm)
        }
    }
}

const inStockFilter = document.getElementById("inStockFilter")

filterForm.addEventListener("change", (e) => {
    syncForms(e)
    fetchFilterBar(e.target.name,e.target.form)
    fetchProducts(filterForm)

})

filterFormSmall.addEventListener("change", (e) => {
    syncForms(e)
    // fetchProducts(filterForm) // Cái form nhỏ không có fetch mỗi lần nhấn
})

filterFormSmall.addEventListener("submit", (e) => {
    e.preventDefault()
    // fetchProducts(filterFormSmall, false)
    fetchProducts(filterFormSmall, false)
    fetchFilterBar(e.target.name,e.target.form)

})
const renderFilterBar = (data,element, category,isSmall=false) => {
    
        const div = document.createElement('div');
        div.classList.add('d-flex', 'align-items-center');
    
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('checkbox');
        input.name = category;
        input.value = data.name;
        if (isSmall) {
            input.id = `${category}-small-filter-${data.name}`;
        }
        else{
            input.id = `${category}-filter-${data.name}`;
        }
    
        // Kiểm tra và đặt thuộc tính checked cho checkbox nếu cần
        if (data.checked) {
            input.checked = true;
        }
    
        const label = document.createElement('label');
        label.htmlFor = `${category}-filter-${data.name}`;
        if(isSmall)
        {
            label.htmlFor = `${category}-small-filter-${data.name}`;
        }
        else
        {
            label.htmlFor = `${category}-filter-${data.name}`;
        }
        label.textContent = `${data.name} (${data.count})`;
    
        div.appendChild(input);
        div.appendChild(label);
    
        element.appendChild(div);
}
const updateFilterBar = (data) => {
   if(data?.rarity)
   {
    console.log(data.rarity)
    rarityFiter.innerHTML = ''
    raritySmallFilter.innerHTML = ''
    data.rarity.forEach(rarity => {
        renderFilterBar(rarity,rarityFiter,'rarity')
        renderFilterBar(rarity,raritySmallFilter,'rarity',true)
    })
   }
   if(data?.types)
   {
    console.log(data.types)
    typeFilter.innerHTML = ''
    typeSmallFilter.innerHTML = ''
    data.types.forEach(type => {
        renderFilterBar(type,typeFilter,'types')
        renderFilterBar(type,typeSmallFilter,'types',true)
    })
   }
   if(data?.subtypes)
   {
    subtypeFilter.innerHTML = ''
    subtypeSmallFilter.innerHTML = ''
    data.subtypes.forEach(subtype => {
        renderFilterBar(subtype,subtypeFilter,'subtypes')
        renderFilterBar(subtype,subtypeSmallFilter,'subtypes',true)
    })
   }
   if(data?.supertype)
   {
    supertypeFilter.innerHTML = ''
    supertypeSmallFilter.innerHTML = ''
    data.supertype.forEach(supertype => {
        renderFilterBar(supertype,supertypeFilter,'supertype')
        renderFilterBar(supertype,supertypeSmallFilter,'supertype',true)
    })
   }
}
const fetchFilterBar = async (except,formToGet) => {
    const formData = new FormData(formToGet)
    let fillters = {}
    let price ={
        // min:minInput,
        // max:maxInput
    }
    let page=null
    for (const [key, value] of formData.entries()) {
        if(key === "min" || key === "max"){
            price[key] = value
            continue
        }
        if(fillters[key] === undefined){
            fillters[key] = []
        }
        fillters[key].push(value)
    }
    const params = new URLSearchParams({
        filters: JSON.stringify(fillters),
        price: JSON.stringify(price)
    })
    const fetchURL = `/products/filterBar/${except}?${params.toString()}`; 
    fetch(fetchURL)
    .then (response => 
        {
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
            // console.log( response.json())
            return response.json()
        })
    .then (data => {
        updateFilterBar(data)
    })

}
function syncForms(e){

    const currentForm = e.target.form
    const otherForm = (e.target.form === filterForm) ? filterFormSmall : filterForm
    console.log(e.target.name)

    if(currentForm === filterFormSmall && e.target.name === "sort-by"){
        const dropdownOptionToChange = sortDropdown.firstElementChild.querySelector(`[value="${e.target.value}"]`)
        handleOptionClick(dropdownOptionToChange)
    }
    else if(e.target.type === "range"){
        otherForm.querySelector(`input[name="${e.target.name}"]`).value = currentForm.querySelector(`input[name="${e.target.name}"]`).value
    }
    else{
        otherForm.querySelector(`input[name="${e.target.name}"][value="${e.target.value}"]`).checked = currentForm.querySelector(`input[name="${e.target.name}"][value="${e.target.value}"]`).checked
    }
}

// function fetchProducts(formToGet, fromSideBar=true, toPage=null){
//     // To change form action, find id="filterForm" in product.ejs
//     const formAction = formToGet.getAttribute("action")
//     const formData = new FormData(formToGet)
//     let fillters = {}
//     let sort ={}
//     let page=null
//     console.log(formAction)
//     for (const [key, value] of formData.entries()) {
//         if(fillters[key] === undefined){
//             fillters[key] = []
//         }
//         fillters[key].push(value)
//     }
//     console.log(fillters)
    
//     // console.log(selectedSortOption)
//     // console.log(new URLSearchParams(formData).toString())
//     var params=null
//     const filterFormQuery = new URLSearchParams(formData).toString()
//     console.log(filterFormQuery)
//     var completeQuery = null
//     if(fromSideBar){
//         const selectedSortOption = sortDropdown.firstElementChild.querySelector('[aria-selected="true"]').value
//         completeQuery =  filterFormQuery + (filterFormQuery === "" ? 'sort=' : '&sort=') + selectedSortOption
//         console.log(selectedSortOption)
//         sort=sortOption(selectedSortOption)

//     }
//     else{
//         completeQuery = filterFormQuery
//     }
//     if(toPage !== null){
//         completeQuery += `&page=${toPage}`
//     }

//     const fetchURL = formAction + '?' + completeQuery
//     // window.history.replaceState({path: fetchURL}, '', fetchURL)
//     // console.log(fetchURL) 
//     // history.pushState({}, '', fetchURL); 

//     // FETCHING DATA
//     fetch(fetchURL)
//     .then(response => {
//         // return response.json()
//         return {
//             "data": [
//                 {
//                     "id": "1",
//                     "name": "Pokémon Card Game Bulbasaur - Vending series 1",
//                     "supertype": "Pokémon",
//                     "img": "https://images.pokemontcg.io/xy1/1_hires.png",
//                     "price": "211.990₫"
//                 },
//                 {
//                     "id": "2",
//                     "name": "Pokémon Card Game Bulbasaur - Vending series 2",
//                     "supertype": "Trainer",
//                     "img": "https://images.pokemontcg.io/g1/1_hires.png",
//                     "price": "221.990₫"
//                 },
//                 {
//                     "id": "3",
//                     "name": "Pokémon Card Game Bulbasaur - Vending series 3",
//                     "supertype": "Energy",
//                     "img": "https://images.pokemontcg.io/xy1/1_hires.png",
//                     "price": "212.990₫"
//                 },
//                 {
//                     "id": "4",
//                     "name": "Pokémon Card Game Bulbasaur - Vending series 4",
//                     "supertype": "Pokémon",
//                     "img": "https://images.pokemontcg.io/g1/1_hires.png",
//                     "price": "233.990₫"
//                 }
//             ],
//             "pages": "4"
//         } 
//     })
//     .then(data => {
//         showProducts(data.data)
//         if(toPage === null){
//             resetPagination(data.pages)
//         }
//     })
// }
function fetchProducts(formToGet, fromSideBar=true, toPage=null){
    // To change form action, find id="filterForm" in product.ejs
    const formAction = formToGet.getAttribute("action")
    const formData = new FormData(formToGet)
    let fillters = {}
    let price = {}
    let sort ={}
    let page=null
    for (const [key, value] of formData.entries()) {
        if(key === "min" || key === "max"){
            price[key] = value
            continue
        }
        if(fillters[key] === undefined){
            fillters[key] = []
        }
        fillters[key].push(value)
    }
    
    // console.log(selectedSortOption)
    // console.log(new URLSearchParams(formData).toString())
    const filterFormQuery = new URLSearchParams(formData).toString()
    var completeQuery = null
    if(fromSideBar){
        const selectedSortOption = sortDropdown.firstElementChild.querySelector('[aria-selected="true"]').children[0].textContent
        completeQuery =  filterFormQuery + (filterFormQuery === "" ? 'sort=' : '&sort=') + selectedSortOption
        console.log(selectedSortOption)
        sort=sortOption(selectedSortOption)

    }
    else{
        completeQuery = filterFormQuery
    }
    if(toPage !== null){
        page=toPage
    }
    else
    {
        page=1
    }
    const params = new URLSearchParams({
        filters: JSON.stringify(fillters),
        price: JSON.stringify(price),
        page: page,
        sort: JSON.stringify(sort),
    })
    const fetchURL = `/products/filter?${params.toString()}`;
    // window.history.replaceState({path: fetchURL}, '', fetchURL)
    // console.log(fetchURL) 
    // history.pushState({}, '', fetchURL); 
    console.log(fillters)
    console.log(sort)
    // FETCHING DATA
    fetch(fetchURL)
    .then(response => {
        // console.log(response.json())
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        return response.json(); 
    //     return {
    //         "data": [
    //             {
    //                 "id": "1",
    //                 "name": "Pokémon Card Game Bulbasaur - Vending series 1",
    //                 "supertype": "Pokémon",
    //                 "img": "https://images.pokemontcg.io/xy1/1_hires.png",
    //                 "price": "211.990₫"
    //             },
    //             {
    //                 "id": "2",
    //                 "name": "Pokémon Card Game Bulbasaur - Vending series 2",
    //                 "supertype": "Trainer",
    //                 "img": "https://images.pokemontcg.io/g1/1_hires.png",
    //                 "price": "221.990₫"
    //             },
    //             {
    //                 "id": "3",
    //                 "name": "Pokémon Card Game Bulbasaur - Vending series 3",
    //                 "supertype": "Energy",
    //                 "img": "https://images.pokemontcg.io/xy1/1_hires.png",
    //                 "price": "212.990₫"
    //             },
    //             {
    //                 "id": "4",
    //                 "name": "Pokémon Card Game Bulbasaur - Vending series 4",
    //                 "supertype": "Pokémon",
    //                 "img": "https://images.pokemontcg.io/g1/1_hires.png",
    //                 "price": "233.990₫"
    //             }
    //         ],
    //         "pages": "4"
    //     } 
    })
    .then(data => {
        showProducts(data.products)
        if(toPage === null){
            resetPagination(data.totalPages)
        }
    })
}
function showProducts(data){
    productList.innerHTML = data.map((item) => {
        return `
        <div class="d-flex flex-column card-float-in">
            <div class="card-image">
                <img src="${item.image}" alt="Image">
                <a href="/products/detail/${item.id}" class="overlay"></a>
                <a href="#">
                    <button type="button" class="add-btn">+ Quick add</button>
                </a>
            </div>
            <div class="card-info">
                <div class="d-flex flex-column">
                    <a href="/products?supertype=${item.supertype}&sort_by=created-descending" class="card-category">${item.supertype}</a>
                    <a href="/products/detail/${item.id}">
                        <div class="card-name">${item.name}</div>
                    </a>
                    <div class="card-price">${item.marketPrices}₫</div>
                </div>
            </div>
        </div>`
    }).join('')
    itemsToFloatIn = document.querySelectorAll('.card-float-in')
}


function resetPagination(pages){
    prevPageBtn.classList.add("disabled")
    currentPageText.innerHTML = `1&nbsp;&nbsp;/&nbsp;&nbsp;${pages}`
    
    currentPage = 1
    maxPage = parseInt(pages)
    if(currentPage === maxPage){
        nextPageBtn.classList.add("disabled")
    }
    else{
        nextPageBtn.classList.remove("disabled")
    }
}

nextPageBtn.addEventListener("click", (e) => {
    currentPage++
    if(currentPage === maxPage){
        nextPageBtn.classList.add("disabled")
    }
    if(prevPageBtn.classList.contains("disabled")){
        prevPageBtn.classList.remove("disabled")
    }
    currentPageText.innerHTML = `${currentPage}&nbsp;&nbsp;/&nbsp;&nbsp;${maxPage}`
    fetchProducts(filterForm, true, currentPage)
})

prevPageBtn.addEventListener("click", (e) => {
    currentPage--
    if(currentPage === 1){
        prevPageBtn.classList.add("disabled")
    }
    if(nextPageBtn.classList.contains("disabled")){
        nextPageBtn.classList.remove("disabled")
    }
    currentPageText.innerHTML = `${currentPage}&nbsp;&nbsp;/&nbsp;&nbsp;${maxPage}`
    fetchProducts(filterForm, true, currentPage)
})

minPriceRange.addEventListener("input", (e) => {
    minPriceRangeLabel.innerHTML = `Min: ${minPriceRange.value}`
    if(parseFloat(minPriceRange.value) > parseFloat(maxPriceRange.value)){
        maxPriceRange.value = minPriceRange.value
        maxPriceRangeLabel.innerHTML = `Max: ${maxPriceRange.value}`
    }
})

maxPriceRange.addEventListener("input", (e) => {
    maxPriceRangeLabel.innerHTML = `Max: ${maxPriceRange.value}`
    if(parseFloat(maxPriceRange.value) < parseFloat(minPriceRange.value)){
        minPriceRange.value = maxPriceRange.value
        minPriceRangeLabel.innerHTML = `Min: ${minPriceRange.value}`
    }
})

// FETCH WHEN ENTER PAGE
window.addEventListener("load", (e) => {
    fetchProducts(filterForm)
    fetchFilterBar("aaa",filterForm)
})