const minusBtns = [...document.querySelectorAll(".minus-btn")];
const plusBtns = [...document.querySelectorAll(".plus-btn")];
const quantityFields = [...document.querySelectorAll(".quantity")];
const maxQuantity = document.getElementById("maxQuantity");
const itemPrice = document.getElementById("itemPrice");

const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("userReviews");
const detailsElement = document.querySelector("details");

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const currentPageText = document.getElementById("currentPageText");
var currentPage = null;
quantityFields.forEach((item, i) => {
  minusBtns[i].addEventListener("click", () => {
    const value = parseInt(item.value);
    item.value = value - 1 <= 0 ? 1 : value - 1;
  });
  plusBtns[i].addEventListener("click", () => {
    const value = parseInt(item.value);
    const maxValue = parseInt(maxQuantity.value);
    item.value = value + 1 > maxValue ? maxValue : value + 1;
  });
  item.addEventListener("change", () => {
    const value = parseInt(item.value);
    const maxValue = parseInt(maxQuantity.value);
    if (value <= 0) {
      item.value = 1;
    } else if (value > maxValue) {
      item.value = maxValue;
    } else {
      item.value = value;
    }
  });
});
const renderReviews = (reviews) => {
  reviewList.innerHTML = reviews
    .map((review) => {
      return ` <div class="review-content vstack gap-3">
        <span class="review-content-name">${review.name}</span>
        <p>${review.content}</p>
    </div>`;
    })
    .join("");
};
const fetchReviews = (firstTime = true, currentPage = 1) => {
  const url = window.location.href;
  const segments = url.split("/"); // Tách URL thành các phần dựa trên dấu '/'
  const lastSegment = segments[segments.length - 1]; // Lấy phần tử cuối cùng
  console.log(lastSegment);
  fetch(`/products/detail/reviews/${lastSegment}?page=${currentPage}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      renderReviews(data.reviews);
      if (firstTime) {
        resetPagination(data.totalPages);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

if (reviewForm !== null) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(reviewForm);
    const data = Object.fromEntries(formData.entries());
    const url = window.location.href;
    const segments = url.split("/"); // Tách URL thành các phần dựa trên dấu '/'
    const lastSegment = segments[segments.length - 1]; // Lấy phần tử cuối cùng
    console.log(lastSegment);
    console.log(data);
    fetch(`/products/detail/${lastSegment}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        fetchReviews();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    detailsElement.removeAttribute("open");
  });
}

const liveToast = document.getElementById("liveToast");
const addToCartBtn = document.getElementById("addToCartBtn");

const toastBootstrap = new bootstrap.Toast(liveToast);
addToCartBtn.addEventListener("click", (e) => {
  //FETCH
  const url = window.location.href;
  const segments = url.split("/");
  const lastSegment = segments[segments.length - 1];
  quantity = quantityFields[0].value;
  price = quantity * itemPrice.value;

  formBody = {};

  formBody["productId"] = lastSegment;
  formBody["quantity"] = quantity;
  formBody["price"] = price;

  console.log(formBody);

  fetch("/cart/add-to-cart", {
    method: "POST",
    body: JSON.stringify(formBody),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => {
    console.log(response);
    if (response.ok) {
      if (response.url.includes("/cart/add-to-cart")) {
        toastBootstrap.show();
      } else {
        console.log("Something wrong here");
        window.location.href = response.url;
      }
    }
  });
});

function resetPagination(pages) {
  prevPageBtn.classList.add("disabled");
  currentPageText.innerHTML = `1&nbsp;&nbsp;/&nbsp;&nbsp;${pages}`;

  currentPage = 1;
  maxPage = parseInt(pages);
  if (currentPage === maxPage) {
    nextPageBtn.classList.add("disabled");
  } else {
    nextPageBtn.classList.remove("disabled");
  }
}

nextPageBtn.addEventListener("click", (e) => {
  currentPage++;
  if (currentPage === maxPage) {
    nextPageBtn.classList.add("disabled");
  }
  if (prevPageBtn.classList.contains("disabled")) {
    prevPageBtn.classList.remove("disabled");
  }
  currentPageText.innerHTML = `${currentPage}&nbsp;&nbsp;/&nbsp;&nbsp;${maxPage}`;
  fetchReviews(false, currentPage);
});

prevPageBtn.addEventListener("click", (e) => {
  currentPage--;
  if (currentPage === 1) {
    prevPageBtn.classList.add("disabled");
  }
  if (nextPageBtn.classList.contains("disabled")) {
    nextPageBtn.classList.remove("disabled");
  }
  currentPageText.innerHTML = `${currentPage}&nbsp;&nbsp;/&nbsp;&nbsp;${maxPage}`;
  fetchReviews(false, currentPage);
});

window.addEventListener("load", (e) => {
  fetchReviews();
});
