document
  .getElementById("confirmBtn")
  .addEventListener("click", function (event) {
    // Call a function to get data from input fields
    gatherAndPrintFormData(event);
  });

async function gatherAndPrintFormData(event) {
  event.preventDefault();
  // Create an object to store form data
  var formDataObject = {};
  // imageFiles=[0,1,2]
  // imageFiles.forEach((file, index) => {
  //   formDataObject[`test${index + 1}`] = file;
  // });
  // Get values from individual form elements by ID
  formDataObject.name = document.getElementById("cardName").value;
  formDataObject.id = document.getElementById("cardID").value;
  formDataObject.isActive = document.getElementById("isActive").value;
  formDataObject.setId = document.getElementById("setID").value;
  formDataObject.rarity = document.getElementById("cardRarity").value;

  // Types
  var selectedTypes = [];
  document
    .querySelectorAll('input[name="type[]"]:checked')
    .forEach(function (checkbox) {
      selectedTypes.push(checkbox.value);
    });
  formDataObject.types = selectedTypes;

  // Subtypes
  var selectedSubtypes = [];
  document
    .querySelectorAll('input[name="subtypes[]"]:checked')
    .forEach(function (checkbox) {
      selectedSubtypes.push(checkbox.value);
    });
  formDataObject.subtypes = selectedSubtypes;

  formDataObject.supertype = document.getElementById("superType").value;
  formDataObject.marketPrices = document.getElementById("price").value;
  formDataObject.amount = document.getElementById("amount").value;

  formDataObject.updatedAt = GetCurrentDate();

  // Add timestamp with the Unix timestamp of the current time
  formDataObject.timestamp = Date.now();
  formDataObject.image = GetFile("fileInput");
  console.log(formDataObject);
  multipleFormDataObj = { id: formDataObject.id };
  var images = [];
  var imgStatus = {};
  var img_1 = GetFile("fileInput-1");
  var img_2 = GetFile("fileInput-2");
  var img_3 = GetFile("fileInput-3");
  if (img_1 != null) {
    images.push(img_1);
    imgStatus.image1 = true;
  } else {
    imgStatus.image1 = false;
  }

  if (img_2 != null) {
    images.push(img_2);
    imgStatus.image2 = true;
  } else {
    imgStatus.image2 = false;
  }

  if (img_3 != null) {
    images.push(img_3);
    imgStatus.image3 = true;
  } else {
    imgStatus.image3 = false;
  }

  multipleFormDataObj.image = createFileList(images);
  multipleFormDataObj.imgStatus = imgStatus;
  console.log(multipleFormDataObj);
  //PostData(formDataObject);
}

function PostData(formDataObject) {
  formData = ToFormData(formDataObject);
  fetch("/admin/card/upload", {
    method: "POST",
    body: formData,
  })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
  console.log(fileInput);
  if (fileInput?.files.length > 0) {
    var file = fileInput.files[0];
    return file;
  } else {
    console.log("bbbbbbbbbbbb");
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
