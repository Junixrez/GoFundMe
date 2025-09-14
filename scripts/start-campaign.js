import { isAdmin } from "./adminAuth.js";
isAdmin();
const loggedUser = JSON.parse(localStorage.getItem("user"));
console.log(loggedUser);
if (!loggedUser) {
  alert("Access denied.");
  window.location.href = "../HTML/login.html";
}

async function convertImageToBase64(imageFile) {
  const reader = new FileReader();

  const base64Text = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(imageFile);
  });

  return base64Text;
}

const imageInput = document.getElementById("image");
let base64Image = "";

if (imageInput) {
  imageInput.addEventListener("change", async function () {
    if (imageInput.files && imageInput.files[0]) {
      base64Image = await convertImageToBase64(imageInput.files[0]);
      console.log("Image converted to Base64 successfully!");
    }
  });
}

document
  .getElementById("campaign-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!base64Image) {
      alert("Select an image");
      return;
    }

    const campaignData = {
      title: document.getElementById("title").value,
      goal: parseFloat(document.getElementById("goal").value),
      raised: 0,
      imageUrl: base64Image,
      deadline: document.getElementById("deadline").value,
      description: document.getElementById("description").value,
      creatorId: loggedUser.id,
      isApproved: false,
    };

    const response = await fetch("http://localhost:3000/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaignData),
    });
    const result = await response.json();
    console.log(result);

    if (response.ok) {
      alert("Campaign created successfully! Awaiting approval.");
      // window.location.href = "../HTML/campaigns.html";
      window.close();
    } else {
      alert("Failed to create campaign");
    }
  });

if (loggedUser) {
  console.log(loggedUser);
  document.getElementById("logoutBtn").style.display = "block";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../HTML/index.html";
});
