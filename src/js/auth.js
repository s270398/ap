// Check if the user is logged in when they visit the page
if (localStorage.getItem("access") !== "granted") {
  window.location.href = "/password.html";  // Redirect to password.html if no access
}
