const minusBtns = document.querySelector('.minus-btn')
const plusBtns = document.querySelector('.plus-btn')
const quantityFields = document.querySelector('.quantity')
const totalPage = document.querySelector('.total-pages')
const checkboxes = document.querySelectorAll('.form-check-input');
const selectedSortOption = document.getElementById('selectedSortOption');
const dropdownMenu = document.querySelector('.dropdown-menu');
const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');
const minPrice = document.querySelector('.min-price');
const maxPrice = document.querySelector('.max-price');



console.log('aaaa')
var filters = {
    
}
var sort = {
    updateAt: 1
}
var page = 1
// const getPage = ({filters, page,sort}) => {
//     const params=new URLSearchParams(
//          {
//             filters: JSON.stringify(filters),
//             page: page,
//             sort: JSON.stringify(sort)
//         }
//     );
//     const url = `/products?${params.toString()}`;
//     fetch(url,{
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         },
       
//     })
//     .then(response => {
//         if (response.ok) {
//           return response.text();
//         }
//         throw new Error('Network response was not ok.');
//       })
//       .then(html => {
//         document.querySelector('.product-list').innerHTML = html
//       })
    
//     .catch(error => {
//         console.error('Error:', error);
//     })
// }
function optionSort() {
    
}
function updateProducts() {
    page=quantityFields.value
    // Tạo URL mới với các bộ lọc được áp dụng
    const selectedRarity = [];
    const selectedSort=selectedSortOption.textContent
    console.log(selectedSort)
    if(selectedSort =='Date, new to old')
    {
        sort = {
            name:'Date, new to old',
            updatedAt: -1
        }
    }
    else if(selectedSort =='Date, old to new')
    {
        sort = {
            name:'Date, old to new',
            updatedAt: 1
        }
    }
    else if(selectedSort =='Price, low to high')
    {
        sort = {
            name:'Price, low to high',
            marketPrices: 1
        }
    }
    else if(selectedSort =='Price, high to low')
    {
        sort = {
            name:'Price, high to low',
            marketPrices: -1
        }
    }
    const price ={
        min: minInput.value,
        max: maxInput.value
    }
  // Lặp qua tất cả các checkbox
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      // Nếu checkbox được chọn, thêm giá trị của checkbox vào mảng selectedRarity
      selectedRarity.push(checkbox.id);
    }
  });
  if (selectedRarity.length > 0) {
    filters['rarity'] = selectedRarity
  } else {
    filters = {}
  }
    const params = new URLSearchParams({
      filters: JSON.stringify(filters),
      page: quantityFields.value,
      sort: JSON.stringify(sort),
      price: JSON.stringify(price)
    });
    if (Object.keys(filters).length == 0) {
        params.delete('filters')
        console.log('no filter')
    }
    
    const url = `/products?${params.toString()}`;
    
    // Chuyển hướng trình duyệt đến URL mới để lấy dữ liệu sản phẩm theo bộ lọc
    window.location.href = url;
  }
minusBtns.addEventListener('click', () => {
    page = quantityFields.value
    if (page > 1) {
        quantityFields.value = parseInt(page)-1
        page = quantityFields.value

        // getPage({filters, page: quantityFields.value, sort})
      updateProducts()
    }
})
plusBtns.addEventListener('click', () => {
    page = quantityFields.value
    const maxPage=totalPage.textContent.split('of')[1].trim();

    if (page < parseInt(maxPage)) {
        console.log(quantityFields.value)

        quantityFields.value = parseInt(page)+1
        updateProducts()
    }
})
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateProducts();
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    dropdownMenu.addEventListener('click', function(event) {
      if (event.target.classList.contains('dropdown-item')) {
        event.preventDefault();
        selectedSortOption.textContent = event.target.textContent;
        updateProducts();
        // Xử lý selectedValue tùy theo giá trị được chọn
        // console.log('Giá trị đã chọn:', selectedValue);
        
        // Thực hiện các hành động khác dựa trên giá trị đã chọn
      }
    });
  });
  
  function updatePrices() {
    const minVal = minInput.value;
    const maxVal = maxInput.value;
    
    minPrice.textContent = minVal;
    maxPrice.textContent = maxVal;
    updateProducts();
  }

  // Bắt sự kiện khi input thay đổi và gọi hàm cập nhật giá trị
  minInput.addEventListener('input', updatePrices);
  maxInput.addEventListener('input', updatePrices);