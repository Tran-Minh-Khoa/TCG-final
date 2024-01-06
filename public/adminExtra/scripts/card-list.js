async function toggleCardStatus(cardId, isActive) {
  try {
    const response = await fetch(
      `/admin/card/${isActive ? "enable" : "disable"}/${cardId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success:", data);
    window.location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteCard(cardId) {
  displayErrorModal(
    "Confirm",
    "Are you sure you want to delete this card?",
    () => ConfirmDelete(cardId)
  );
}

async function ConfirmDelete(cardId) {
  try {
    const response = await fetch(`/admin/card/delete/${cardId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorText}`);
    }

    const data = await response.json();
    console.log("Success:", data);
    // Timeout to wait for the database update
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  }
}
