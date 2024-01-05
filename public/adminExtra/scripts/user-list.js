async function toggleUserStatus(userID, isBaned) {
  try {
    const url = `/admin/user/${isBaned ? "unban" : "ban"}/${userID}`;
    console.log(url);
    const response = await fetch(
      `/admin/user/${isBaned ? "unban" : "ban"}/${userID}`,
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

async function DeleteUser(userID) {
  displayErrorModal(
    "Confirm",
    "Are you sure you want to delete this user?",
    () => ConfirmDelete(userID)
  );
}

async function ConfirmDelete(userID) {
  try {
    const response = await fetch(`/admin/user/delete/${userID}`, {
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
