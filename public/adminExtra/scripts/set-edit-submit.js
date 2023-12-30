document.getElementById("confirmBtn").addEventListener("click", function (e) {
  e.preventDefault();
  SubmitForm(e);
});

async function SubmitForm(event) {
  const formData = {
    name: document.getElementById("setName").value,
    series: document.getElementById("series").value,
    isActive: document.getElementById("isActive").value === "true", // Convert string to boolean
  };
  var setID = document.getElementById("setID").value;
  console.log(formData);
  console.log(setID);
  await PutData(formData, setID);
  window.location.href = "/admin/set";
}

async function PutData(formData, id) {
  try {
    const response = await fetch(`/admin/set/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorText}`);
    }

    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
    displayErrorModal("Error", error.message);
  }
}
