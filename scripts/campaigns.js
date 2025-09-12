let loggedUser = JSON.parse(localStorage.getItem("user"));
const url = `http://localhost:3000/campaigns`;
let allCampaigns = [];

function createCampaignCard(campaign) {
  const card = document.createElement("div");
  card.classList = "card";

  if (loggedUser) {
    card.innerHTML = `
      <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
      <h3 class="campaign-title">${campaign.title}</h3> 
      <p class="campaign-description">${campaign.description}</p>
      <p class="campaign-goal">Goal: $${campaign.goal}</p>
      <p class="campaign-raised">Dead line: ${campaign.deadline}</p>
      <a href="../HTML/campaign.html?id=${campaign.id}" class="btn-primary-dark" target="_blank">View Details</a>
    `;
  } else {
    card.innerHTML = `
      <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
      <h3 class="campaign-title">${campaign.title}</h3> 
      <p class="campaign-description">${campaign.description}</p>
      <p class="campaign-goal">Goal: $${campaign.goal}</p>
      <p class="campaign-raised">Dead line: ${campaign.deadline}</p>
      <a href="../HTML/login.html" class="btn-primary-dark" target="_blank">View Details</a>
    `;
  }
  return card;
}

function displayCampaigns(campaigns) {
  const container = document.getElementById("campaign-cards");
  container.innerHTML = "";

  campaigns.forEach((campaign) => {
    if (campaign.isApproved == true) {
      const card = createCampaignCard(campaign);
      container.appendChild(card);
    }
  });

  if (campaigns.filter((c) => c.isApproved).length === 0) {
    container.innerHTML = '<p style="color:red;">Not found</p>';
  }
}

function searchCampaigns(searchTerm) {
  const lowercaseSearchTerm = searchTerm.toLowerCase().trim();

  if (lowercaseSearchTerm === "") {
    displayCampaigns(allCampaigns);
    return;
  }

  const filteredCampaigns = allCampaigns.filter((campaign) => {
    return campaign.title.toLowerCase().includes(lowercaseSearchTerm);
  });

  displayCampaigns(filteredCampaigns);
}

async function fetchCampaigns() {
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      allCampaigns = data;
      displayCampaigns(allCampaigns);
    });
}

function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value;
      searchCampaigns(searchTerm);
    });
  }
}

fetchCampaigns();
initializeSearch();

document.querySelector(".camps").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("campaign-cards").innerHTML = "";
  fetchCampaigns();
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
});

// loggedin
if (loggedUser) {
  console.log("User is logged in");
  let welcomeUser = document.createElement("span");
  welcomeUser.classList = "welcome-user";
  welcomeUser.innerHTML = `Welcome, ${loggedUser.name}`;
  document.querySelector("ul").appendChild(welcomeUser);
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";
  document.getElementById("start-your-own").href =
    "../HTML/start-campaign.html";

  //show mycampaigns
  document.querySelector(".myCamps").style.display = "inline-block";
  document.querySelector(".myCamps").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("campaign-cards").innerHTML = "";

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    (async () => {
      const response = await fetch(`${url}?creatorId=${loggedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          allCampaigns = data;
          data.forEach((campaign) => {
            if (campaign.isApproved == true) {
              const card = document.createElement("div");
              card.classList = "card";
              card.innerHTML = `
          <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
          <h3 class="campaign-title">${campaign.title}</h3> 
          <p class="campaign-description">${campaign.description}</p>
          <p class="campaign-goal">Goal: $${campaign.goal}</p>
          <p class="campaign-raised">Dead line: ${campaign.deadline}</p>
          <a href="../HTML/EditCamp.html?id=${campaign.id}" class="btn-primary-dark" target="_blank" id="editCamp">Edit Campaign</a>
        `;
              document.getElementById("campaign-cards").appendChild(card);
            }
          });
        });
    })();
  });

  document.getElementById("start-your-own").href =
    "../HTML/start-campaign.html";
}

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../HTML/index.html";
});
