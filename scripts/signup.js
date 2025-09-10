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
    document.getElementById("join-us").style.display = "none";

    let sentence = "You are now one of US <3";
    let letters = sentence.split("");
    let successContainer = document.createElement("span");
    successContainer.classList = "success";
    document.querySelector("h3").appendChild(successContainer);
    successContainer.innerHTML = "";

    letters.forEach((letter, index) => {
      setTimeout(() => {
        successContainer.innerHTML += letter;
      }, index * 100);
    });
    setTimeout(() => {
      window.location.href = "../HTML/login.html";
    }, 3000);
  } else {
    alert("signup failed");
  }
});
