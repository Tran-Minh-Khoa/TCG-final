async function toggleSetStatus(setId, isActive) {
  try {
    const response = await fetch(
      `/admin/set/${isActive ? "enable" : "disable"}/${setId}`,
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

async function deleteSet(setId) {
  displayErrorModal("Confirm", "Are you sure you wan to delete this set?", () =>
    ConfirmDelete(setId)
  );
}

async function ConfirmDelete(setId) {
  try {
    const response = await fetch(`/admin/set/delete/${setId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorText}`);
    }

    const data = await response.json();
    console.log("Success:", data);
    //Timeout đợi database update
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  }
}
