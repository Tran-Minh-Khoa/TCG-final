document.getElementById("confirmBtn").addEventListener("click", function (e) {
  e.preventDefault();
  SubmitForm(e);
});

async function SubmitForm(event) {
  try {
    const formData = {
      id: document.getElementById("setID").value,
      name: document.getElementById("setName").value,
      series: document.getElementById("series").value,
      isActive: document.getElementById("isActive").value === "true", // Convert string to boolean
    };
    console.log(formData);
    await PostData(formData);
    window.location.href = "/admin/set";
  } catch (error) {
    displayErrorModal("Error", error.message);
  }
}

async function PostData(formData) {
  try {
    const response = await fetch(`/admin/set/add/upload`, {
      method: "POST",
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
    console.log(error);
    displayErrorModal("Error", error.message);
    throw error;
  }
}
