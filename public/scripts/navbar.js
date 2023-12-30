offcanvasSearchInput = document.getElementById("offcanvasSearchInput")
offcanvasSearchClear = document.getElementById("offcanvasSearchClear")
searchResultContainer = document.getElementById("searchResultContainer")

offcanvasSearchInput.addEventListener("focus", (e) => {
    offcanvasSearchInput.parentElement.parentElement.style.borderBottom = '2px solid rgba(26, 26, 26, 1)'
    offcanvasSearchClear.style.opacity = ".8"
})

offcanvasSearchInput.addEventListener("blur", (e) => {
    offcanvasSearchInput.parentElement.parentElement.style.borderBottom = '2px solid rgba(26, 26, 26, .3)'
    offcanvasSearchClear.style.opacity = "0"
})

let inputTimer = null

offcanvasSearchInput.addEventListener("input", (e) => {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(function() {
        const queryString = offcanvasSearchInput.value 

        // STIMULATE FETCHING DATA
        // setTimeout(function() {
        //     searchResultContainer.innerHTML = `<a href="/products/id" class="w-100 hstack gap-4 align-items-center">
        //     <img src="https://images.pokemontcg.io/xy1/1_hires.png" alt="Product Image" class="search-result-img">
        //     <div class="vstack gap-2 justify-content-center">
        //         <span class="search-result-supertype">Pokémon</span>
        //         <span class="search-result-name">Pokémon Card Game Bulbasaur - Vending series</span>
        //         <span class="search-result-price">211.990₫</span>
        //     </div>
        // </a>`
        // }, 1000)

        if(queryString != ""){
            searchResultContainer.innerHTML = `
                <div class="w-100 hstack gap-4 align-items-center" aria-hidden="true">
                    <div class="img-placeholder placeholder-glow">
                        <span class="placeholder col-12 h-100"></span>
                    </div>
                    <div class="vstack gap-2 justify-content-center">
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-3 placeholder-sm"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-12"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-4"></span>
                        </div>
                    </div>
                </div>
                <div class="w-100 hstack gap-4 align-items-center" aria-hidden="true">
                    <div class="img-placeholder placeholder-glow">
                        <span class="placeholder col-12 h-100"></span>
                    </div>
                    <div class="vstack gap-2 justify-content-center">
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-3 placeholder-sm"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-12"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-4"></span>
                        </div>
                    </div>
                </div>
                <div class="w-100 hstack gap-4 align-items-center" aria-hidden="true">
                    <div class="img-placeholder placeholder-glow">
                        <span class="placeholder col-12 h-100"></span>
                    </div>
                    <div class="vstack gap-2 justify-content-center">
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-3 placeholder-sm"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-12"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-4"></span>
                        </div>
                    </div>
                </div>
                <div class="w-100 hstack gap-4 align-items-center" aria-hidden="true">
                    <div class="img-placeholder placeholder-glow">
                        <span class="placeholder col-12 h-100"></span>
                    </div>
                    <div class="vstack gap-2 justify-content-center">
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-3 placeholder-sm"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-12"></span>
                        </div>
                        <div class="placeholder-glow">
                            <span class="text-placeholder placeholder col-4"></span>
                        </div>
                    </div>
                </div>
            `

            // FETCHING
            fetch(`/products/search?keyWord=${queryString}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                return response.json();                
            })
            
            .then(data => {
                console.log(data)
                searchResultContainer.innerHTML = data.map((item) => {
                    return `
                    <a href="/products/detail/${item.id}" class="w-100 hstack gap-4 align-items-center">
                    <img src="${item.image}" alt="Product Image" class="search-result-img">
                    <div class="vstack gap-2 justify-content-center">
                        <span class="search-result-supertype">${item.supertype}</span>
                        <span class="search-result-name">${item.name}</span>
                        <span class="search-result-price">${item.marketPrices}₫</span>
                    </div>
                    </a>
                    `
                }).join('')
            })
        }
        else{
            searchResultContainer.innerHTML = ""
        }
    }, 200)
})

offcanvasSearchClear.addEventListener("click", (e) => {
    offcanvasSearchInput.value = ""
    searchResultContainer.innerHTML = ""
})