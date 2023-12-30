const loginInForm = document.getElementById('login-form');

loginInForm.addEventListener('submit', (event) => {
  event.preventDefault(); 
  const formData = {
    email: loginInForm.elements['email'].value,
    password: loginInForm.elements['password'].value
  };
  fetch('/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData),
  })
  .then(response => {
    if(!response.ok) {
      return response.text();
    }
    return window.location.href = response.url;
  })
  .then(data => {
    console.log('Response from server:', data);
  })
  
  .catch(error => {
    // Xử lý lỗi khi có lỗi kết nối hoặc lỗi từ server
    console.log('Error:', error.message);
  });
});
