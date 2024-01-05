async function DeleteOrder(orderId) {
  displayErrorModal(
    "Confirm",
    "Are you sure you want to delete this order?",
    () => ConfirmDelete(orderId)
  );
}

async function ConfirmDelete(orderId) {
  try {
    const response = await fetch(`/admin/order/delete/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorText}`);
    }

    const data = await response.json();
    console.log("Success:", data);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
