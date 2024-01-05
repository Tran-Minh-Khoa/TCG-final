$("#table-card").DataTable({
  // Disable search bar and filters
  searching: false,
  ordering: false,
  info: false,
  paging: false,
  // Add more options as needed
});

document.getElementById("confirmBtn").addEventListener("click", function (e) {
  e.preventDefault();
  UpdateOrder(e);
});

async function UpdateOrder(e) {
  var newStatus = document.getElementById("status").value;
  var orderId = document.getElementById("orderID").value;

  const formData = {
    newStatus: newStatus,
  };
  console.log(orderId);
  // Call the PutData function to update the order status
  await PutData(formData, orderId);
  window.location.href = "/admin/order";
}

async function PutData(formData, id) {
  try {
    const response = await fetch(`/admin/order/update/${id}`, {
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
