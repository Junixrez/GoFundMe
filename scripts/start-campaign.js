const loggedUser = localStorage.getItem("user");
const currentUser = JSON.parse(localStorage.getItem("user")).id;

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
      try {
        base64Image = await convertImageToBase64(imageInput.files[0]);
        console.log("Image converted to Base64 successfully!");
      } catch (error) {
        console.log("Failed to convert image:", error);
        alert("Failed to process image. Please try again.");
        base64Image = "";
      }
    }
  });
}

document
  .getElementById("campaign-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!base64Image) {
      alert("Please select an image for your campaign.");
      return;
    }

    const campaignData = {
      title: document.getElementById("title").value,
      goal: document.getElementById("goal").value,
      imageUrl: base64Image,
      deadline: document.getElementById("deadline").value,
      description: document.getElementById("description").value,
      creatorId: currentUser,
      isApproved: false,
    };

    try {
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
        window.location.href = "../HTML/campaigns.html";
      } else {
        alert(
          `Failed to create campaign: ${result.message || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while creating the campaign. Please try again later."
      );
    }
  });

if (loggedUser) {
  console.log(loggedUser);
  console.log("user is logged in");
  console.log(currentUser);
  document.getElementById("logoutBtn").style.display = "block";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../HTML/index.html";
});
