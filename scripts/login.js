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
  console.log(data.user);
  localStorage.setItem("user", JSON.stringify(data.user));
  if (!response.ok) {
    alert("wrong email or password");
  } else if (response.ok) {
    window.location.href = "../HTML/index.html";
  }
});
