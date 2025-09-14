import { isAdmin } from "./adminAuth.js";
function getCampId(id) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(id);
}
const campaignId = getCampId("id");
isAdmin();
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
        console.log("Image converted");
      } catch (error) {
        console.log("Failed to convert image:", error);
        alert("Failed to process image. Please try again.");
        base64Image = "";
      }
    }
  });
}
const loggedUser = JSON.parse(localStorage.getItem("user"));

// get the campaign in the inputs
async function getCamp(id) {
  const response = await fetch(`/api/campaigns?id=${id}`);
  const data = await response.json();
  data.forEach((camp) => {
    document.getElementById("title").value = `${camp.title}`;
    document.getElementById("goal").value = `${camp.goal}`;
    document.getElementById("deadline").value = `${camp.deadline}`;
    document.getElementById("description").value = `${camp.description}`;
  });
}
getCamp(campaignId);

document.getElementById("editBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  async function editCamp(id) {
    const res = await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: document.getElementById("title").value,
        goal: parseFloat(document.getElementById("goal").value),
        imageUrl: base64Image,
        deadline: document.getElementById("deadline").value,
        description: document.getElementById("description").value,
        creatorId: loggedUser.id,
        isApproved: true,
      }),
    });
  }
  await editCamp(campaignId);

  Swal.fire({
    title: "Are you sure?",
    text: "you about to edit the campaign",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0d7377",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Edit it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Done",
        text: "Your campaign has been Edited",
        icon: "success",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.href = "/HTML/campaigns.html";
      }, 2000);
    }
  });
});

//logged auth
if (loggedUser) {
  console.log("User is logged in");
  let welcomeUser = document.createElement("span");
  welcomeUser.classList = "welcome-user";
  welcomeUser.innerHTML = `Welcome, ${loggedUser.name}`;
  document.querySelector("ul").appendChild(welcomeUser);
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";
}
//logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/";
});
