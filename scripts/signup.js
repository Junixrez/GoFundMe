document.getElementById("signup-form").addEventListener("submit", async (e) => {
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

  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  if (response.ok) {
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
    // setTimeout(() => {
    //   window.location.href = "/HTML/login.html";
    // }, 1000);
    // Swal.fire({
    //   title: `Account Created Successfully`,
    //   icon: "success",
    // });
  } else {
    alert("signup failed");
  }
});
