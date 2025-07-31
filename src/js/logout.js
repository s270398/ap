// scripts/logout.js

// Function to handle logout
function logout() {
  // Debugging: Ensure this is triggered
  console.log("Logout button clicked");

  // Remove access from localStorage
  localStorage.removeItem("access");

  // Debugging: Check if localStorage is empty
  console.log("localStorage after logout: ", localStorage.getItem("access"));

  // Redirect to the login page (password.html)
  window.location.href = "/password.html";
}
