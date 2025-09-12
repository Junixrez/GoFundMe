const campaignsEP = "campaigns";
const usersEP = "users";
const plegesEP = "pleges";
let loggedUser = localStorage.getItem("user");
const getRequest = (ep) => {
  return fetch(`http://localhost:3000/${ep}`);
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
          <p class="campaign-raised">Dead line: ${campaign.deadline}</p>
          <a href="../HTML/campaign.html?id=${campaign.id}" class="btn-primary-dark"  target="_blank">View Details</a>
        `;
          document.getElementById("campaign-cards").appendChild(card);
        }
      });
    });
}
fetchCampaigns();

// loggedin
if (loggedUser) {
  console.log("User is logged in");
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";

  let welcomeUser = document.createElement("span");
  welcomeUser.classList = "welcome-user";
  welcomeUser.innerText = `Welcome, ${JSON.parse(loggedUser).name}`;
  document.querySelector("header").appendChild(welcomeUser);
  document.getElementById("start-campaign").href =
    "../HTML/start-campaign.html";
}

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../HTML/index.html";
});
