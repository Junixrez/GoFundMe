import { isAdmin } from "./adminAuth.js";

const campaignsEP = "campaigns";
const usersEP = "users";
const plegesEP = "pleges";
let loggedUser = JSON.parse(localStorage.getItem("user"));

const getRequest = (ep) => {
  return fetch(`/api/${ep}`);
};

// campaigns
async function fetchCampaigns() {
  await getRequest(campaignsEP)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((campaign) => {
        if (campaign.id <= 6) {
          const card = document.createElement("div");
          card.classList = "card";
          card.innerHTML = `
          <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
          <h3 class="campaign-title">${campaign.title}</h3> 
          <p class="campaign-description">${campaign.description}</p>
          <p class="campaign-goal">Goal: $${campaign.goal}</p>
          <p class = "campaign-raised">Raised: $${campaign.raised}</p>
          <p class="campaign-deadline">Dead line: ${campaign.deadline}</p>
          <a href="/HTML/campaign.html?id=${campaign.id}" class="btn-primary-dark" target="_blank">View Details</a>
        `;
          document.getElementById("campaign-cards").appendChild(card);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching campaigns:", error);
    });
}
fetchCampaigns();

// loggedin
if (loggedUser) {
  console.log("User is logged in");
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";
  document.getElementById("start").href = "/HTML/start-campaign.html";
  let welcomeUser = document.createElement("span");
  welcomeUser.classList = "welcome-user";
  welcomeUser.innerText = `Welcome, ${loggedUser.name}`;
  document.querySelector("ul").appendChild(welcomeUser);
  document.getElementById("start-campaign").href = "/HTML/start-campaign.html";
}

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/";
});

isAdmin();
