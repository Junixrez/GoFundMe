export function isAdmin() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = currentUser.role;

  if (currentUser && role === "admin") {
    document.getElementById("dashboard").style.display = "block";
    // document.getElementById("start-campaign").style.display = "none";
    // document.getElementById("start").style.display = "none";
    // document.getElementById("openDonate").style.display = "none";
  }
}
