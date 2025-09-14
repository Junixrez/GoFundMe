export function isAdmin() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = currentUser.role;

  if (currentUser && role === "admin") {
    document.getElementById("dashboard").style.display = "block";
  }
}
