document
  .getElementById("confirmBtn")
  .addEventListener("click", function (event) {
    // Call a function to get data from input fields
    gatherAndPrintFormData(event);
  });

async function gatherAndPrintFormData(event) {
  event.preventDefault();
  event.stopPropagation();
  var selectedTypes = [];
  document
    .querySelectorAll('input[name="type[]"]:checked')
    .forEach(function (checkbox) {
      selectedTypes.push(checkbox.value);
    });
  // Subtypes
  var selectedSubtypes = [];
  document
    .querySelectorAll('input[name="subtypes[]"]:checked')
    .forEach(function (checkbox) {
      selectedSubtypes.push(checkbox.value);
    });

  var formData = new FormData();
  formData.append("id", document.getElementById("cardID").value);
  formData.append("name", document.getElementById("cardName").value);
  formData.append("isActive", document.getElementById("isActive").value);
  formData.append("setId", document.getElementById("setID").value);
  formData.append("rarity", document.getElementById("cardRarity").value);
  formData.append("subtypes", selectedSubtypes);
  formData.append("types", selectedTypes);
  formData.append("supertype", document.getElementById("superType").value);
  formData.append("marketPrices", document.getElementById("price").value);
  formData.append("amount", document.getElementById("amount").value);
  formData.append("updatedAt", GetCurrentDate());
  formData.append("timestamp", Date.now());
  formData.append("image", GetFile("fileInput"));

  var result = await CheckValidInput(formData);
  if (result != null) {
    displayErrorModal("Error", result);
    return;
  }

  var newFormData = new FormData();
  newFormData.append("id", document.getElementById("cardID").value);

  var imgStatus = {};
  var img_1 = GetFile("fileInput-1");
  var img_2 = GetFile("fileInput-2");
  var img_3 = GetFile("fileInput-3");
  if (img_1 != null) {
    newFormData.append("image", img_1);
    imgStatus.image1 = true;
  } else {
    imgStatus.image1 = false;
  }

  if (img_2 != null) {
    newFormData.append("image", img_2);
    imgStatus.image2 = true;
  } else {
    imgStatus.image2 = false;
  }

  if (img_3 != null) {
    newFormData.append("image", img_3);
    imgStatus.image3 = true;
  } else {
    imgStatus.image3 = false;
  }
  newFormData.append("imgStatus", JSON.stringify(imgStatus)); // JSON.stringify(imgStatus);
  console.log(formData);
  console.log(newFormData);
  PostData(formData);
  if (newFormData.get("image") != null) {
    PostCardList(newFormData);
  }
  //window.location.href = "/admin/card";
}

async function CheckValidInput(formData) {
  const amount = Number(formData.get("amount"));
  const marketPrices = Number(formData.get("marketPrices"));
  const cardId = formData.get("id");

  // Check if the card with the given ID already exists
  const existingCard = await GetCard(cardId);
  if (existingCard != "\0") {
    return "Card with this ID already exists";
  }

  if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
    return "Amount is not a valid positive integer";
  }

  if (typeof marketPrices !== "number" || marketPrices <= 0) {
    return "Price is not a valid positive number";
  }

  // All conditions passed, input is valid
  return null;
}

function PostData(formDataObject) {
  fetch("/admin/card/upload", {
    method: "POST",
    body: formDataObject,
  })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function PostCardList(formDataObject) {
  fetch("/admin/card/updateListCard", {
    method: "POST",
    body: formDataObject,
  })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function GetCard(cardId) {
  try {
    const apiUrl = `/admin/card/get/${cardId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch card with ID ${cardId}. Status code: ${response.status}`
      );
    }

    const cardData = await response.json();
    return cardData;
  } catch (error) {
    console.error("Error fetching card:", error.message);
    throw new Error("Error fetching card.");
  }
}

function GetCurrentDate() {
  var currentDate = new Date();

  var formattedDateString = `${currentDate.getUTCFullYear()}/${(
    currentDate.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${currentDate
    .getUTCDate()
    .toString()
    .padStart(2, "0")} ${currentDate
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${currentDate
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:${currentDate
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}`;

  // Replace '/' with ' ' to match the format "YYYY/MM/DD HH:mm:ss"
  formattedDateString = formattedDateString.replace(/\,/g, "");
  return formattedDateString;
}
function GetFile(inputId) {
  var fileInput = document.getElementById(inputId);
  if (fileInput?.files.length > 0) {
    var file = fileInput.files[0];
    return file;
  } else {
    return null;
  }
}

function ToFormData(item) {
  var form_data = new FormData();

  for (var key in item) {
    form_data.append(key, item[key]);
  }

  return form_data;
}

function GetAllImage() {
  var fileInput = document.getElementById("fileInputs");
  console.log(fileInput.files.length);
  return fileInput.files;
}

function createFileList(images) {
  var dataTransfer = new DataTransfer();

  images.forEach(function (image, index) {
    dataTransfer.items.add(
      new File([image], `image-${index + 1}.png`, { type: "image/png" })
    );
  });

  return dataTransfer.files;
}
