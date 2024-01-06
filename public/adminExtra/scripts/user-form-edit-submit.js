document.getElementById("updateBtn").addEventListener("click", function (e) {
  e.preventDefault();
  GetData(e);
});

async function GetData(event) {
  const id = document.getElementById("userID").value;
  const formData = {
    email: document.getElementById("email").value,
    name: document.getElementById("userName").value,
    gender: document.getElementById("gender").value,
    phone: document.getElementById("phoneNumber").value,
    role: document.getElementById("roles").value,
    isBaned: document.getElementById("banned").value,
  };
  if (GetFile("fileInput") != null) {
    formData.avatar = GetFile("fileInput");
  }
  console.log(formData);
  const _formData = ToFormData(formData);
  await PutData(_formData, id);
  window.location.href = "/admin/user";
}

async function PutData(formData, id) {
  try {
    const response = await fetch(`/admin/user/update/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(`${errorText}`);
    }
  } catch (error) {
    console.error("Error:", error);
    displayErrorModal("Error", error.message);
  }
}

function GetFile(inputId) {
  var fileInput = document.getElementById(inputId);
  if (fileInput?.files.length > 0) {
    var file = fileInput.files[0];
    return file;
  } else {
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
