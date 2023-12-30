document
  .getElementById("subTypesDropdown")
  .addEventListener("change", function (event) {
    event.stopPropagation();
  });
document
  .getElementById("subTypesDropdown")
  .addEventListener("click", function (event) {
    event.preventDefault();
  });

document.addEventListener("DOMContentLoaded", async function () {
  UpdateSubTypeSelect();
  UpdateTypeSelect();
});

function UpdateTypeSelect() {
  const typesDropdown = document.getElementById("typesDropdown");
  const checkboxes = document.querySelectorAll('input[name="type[]"]');

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateSelectedTypes);
  });

  function updateSelectedTypes() {
    const selectedTypes = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    let displayedText =
      selectedTypes.length > 0 ? selectedTypes.join(", ") : "Select Types";

    // Truncate text with "..." if it's too long
    const maxLength = 20; // Adjust the maximum length as needed
    if (displayedText.length > maxLength) {
      displayedText = displayedText.substring(0, maxLength) + "...";
    }

    typesDropdown.innerText = displayedText;
  }

  updateSelectedTypes();
}

function UpdateSubTypeSelect() {
  const subTypesDropdown = document.getElementById("subTypesDropdown");
  const checkboxes = document.querySelectorAll('input[name="subtypes[]"]');

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateSelectedSubtypes);
  });

  function updateSelectedSubtypes() {
    const selectedSubtypes = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    let displayedText =
      selectedSubtypes.length > 0
        ? selectedSubtypes.join(", ")
        : "Select Subtypes";

    // Truncate text with "..." if it's too long
    const maxLength = 20; // Adjust the maximum length as needed
    if (displayedText.length > maxLength) {
      displayedText = displayedText.substring(0, maxLength) + "...";
    }

    subTypesDropdown.innerText = displayedText;
  }
  updateSelectedSubtypes();
}
