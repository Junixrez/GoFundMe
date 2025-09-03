document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fname");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const newUser = {
    email: email.value,
    password: password.value,
    name: fullName.value,
    role: "user",
    isActive: true,
  };

  const response = fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  if (response) {
    console.log("signup successful");
    window.location.href = "../HTML/login.html";
  } else {
    alert("signup failed");
  }
});
