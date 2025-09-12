document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  let data = await response.json();
  localStorage.setItem("user", JSON.stringify(data.user));
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(user.role);

  if (!response.ok) {
    alert("wrong email or password");
  } else if (user.isActive == false) {
    alert("Account suspended");
  } else if (response.ok && user.role == "admin") {
    window.location.href = "../HTML/dashboard.html";
    alert("welcome admin");
  } else if (response.ok && user.role == "user") {
    window.location.href = "../HTML/index.html";
    alert("Login successful");
  }
});
