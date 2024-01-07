const deleteArray = [false, false, false];
document.getElementById("fileInput").addEventListener("change", (event) => {
  previewImage("fileInput", "preview-image", -1);
});

document.getElementById("fileInput-1").addEventListener("change", (event) => {
  previewImage("fileInput-1", "preview-image-1", 0);
});

document.getElementById("fileInput-2").addEventListener("change", (event) => {
  previewImage("fileInput-2", "preview-image-2", 1);
});

document.getElementById("fileInput-3").addEventListener("change", (event) => {
  previewImage("fileInput-3", "preview-image-3", 2);
});

document.getElementById("delete-1").addEventListener("click", (event) => {
  DeleteImage("fileInput-1", "preview-image-1", 0);
});

document.getElementById("delete-2").addEventListener("click", (event) => {
  DeleteImage("fileInput-2", "preview-image-2", 1);
});

document.getElementById("delete-3").addEventListener("click", (event) => {
  DeleteImage("fileInput-3", "preview-image-3", 2);
});

function previewImage(fileinputID, previewImageId, index = -1) {
  // Get the file input element
  const fileInput = document.getElementById(fileinputID);

  // Check if a file is selected
  if (fileInput.files.length > 0) {
    // Get the first file
    const file = fileInput.files[0];

    // Create a FileReader to read the file
    const reader = new FileReader();

    // Define the onload event to set the preview image source
    reader.onload = function (e) {
      const previewImage = document.getElementById(previewImageId);
      previewImage.src = e.target.result;
      if (index != -1) deleteArray[index] = false;
      //document.getElementById('preview-container').style.display = 'block';
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  }
}
function DeleteImage(fileinputID, previewImageId, index) {
  const previewImage = document.getElementById(previewImageId);
  const fileInput = document.getElementById(fileinputID);

  previewImage.src = "/img/card-back.png";
  deleteArray[index] = true;
}
