const CORRECT_PASSWORD = "asiapac";

// Check if the Enter key is pressed to submit the password
document.getElementById("password").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    checkPassword();
  }
});

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === CORRECT_PASSWORD) {
    localStorage.setItem("access", "granted");
    window.location.href = "/";  // Redirect to index.html after successful login
  } else {
    alert("incorrect password!");
  }
}
