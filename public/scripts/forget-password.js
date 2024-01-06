const forgetPasswordForm = document.getElementById("forgetPasswordForm")
const forgetPasswordSection = document.getElementById("forgetPasswordSection")
var sendAgainBtn = null

var email = null
var timer = null

forgetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    email = forgetPasswordForm.elements['email'].value
    submitForm();

    forgetPasswordSection.innerHTML =  `
        <div class="vstack gap-4 align-items-center justify-content-center">
            <h1>An email has been sent to ${email}, please click on the link inside the email to change your password</h1>
            <button type="button" class="black-btn" onclick="handleClick()" id="sendAgainBtn" disabled>Send again in 30s</button>
        </div>
    `
    sendAgainBtn = document.getElementById("sendAgainBtn")
    setTimer(30)
})

function submitForm(){
    fetch('/login/forget-password', {
        method: "POST",
        body: JSON.stringify({
            email: email
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

function handleClick(){
    submitForm()
    sendAgainBtn.disabled = true
    setTimer(31)
}

function setTimer(duration){
    countdown = duration - 1
    timer = setInterval(function() {
        if (countdown <= 0) {
          clearInterval(timer)
          sendAgainBtn.disabled = false 
          sendAgainBtn.innerText = 'Send again'
        } else {
          sendAgainBtn.innerText = `Send again in ${countdown}s`;
          countdown--
        }
      }, 1000)
}