let loggedUser = JSON.parse(localStorage.getItem("user"));
const url = `http://localhost:3000/campaigns`;
let allCampaigns = [];

function createCampaignCard(campaign) {
  const card = document.createElement("div");
  card.classList = "card";
  const viewHref = loggedUser
    ? `../HTML/campaign.html?id=${campaign.id}`
    : `../HTML/login.html`;
  card.innerHTML = `
    <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
    <h3 class="campaign-title">${campaign.title}</h3> 
    <p class="campaign-description">${campaign.description}</p>
    <p class="campaign-goal">Goal: $${campaign.goal}</p>
    <p class="campaign-raised">Dead line: ${campaign.deadline}</p>
    <a href="${viewHref}" class="btn-primary-dark" target="_blank">View Details</a>
  `;
  return card;
}

function displayCampaigns(campaigns) {
  const container = document.getElementById("campaign-cards");
  container.innerHTML = "";
  const approved = campaigns.filter((c) => c.isApproved === true);
  if (approved.length === 0) {
    container.innerHTML = '<p style="color:red;">Not found</p>';
    return;
  }
  approved.forEach((campaign) => {
    const card = createCampaignCard(campaign);
    container.appendChild(card);
  });
}

function searchCampaigns(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  if (term === "") {
    displayCampaigns(allCampaigns);
    return;
  }
  const filtered = allCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(term)
  );
  displayCampaigns(filtered);
}

async function fetchAllCampaigns() {
  const res = await fetch(url);
  const data = await res.json();
  allCampaigns = data;
  displayCampaigns(allCampaigns);
}

async function fetchMyCampaigns() {
  if (!loggedUser) return;
  const res = await fetch(`${url}?creatorId=${loggedUser.id}`);
  const data = await res.json();
  allCampaigns = data;
  displayCampaigns(allCampaigns);
}

function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    searchCampaigns(e.target.value);
  });
}

function setActive(tabEl) {
  const camps = document.querySelector(".camps");
  const myCamps = document.querySelector(".myCamps");
  camps && camps.classList.remove("active");
  myCamps && myCamps.classList.remove("active");
  tabEl.classList.add("active");
}

function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSearch();

  const campsTab = document.querySelector(".camps");
  const myCampsTab = document.querySelector(".myCamps");

  if (campsTab) {
    campsTab.addEventListener("click", async (e) => {
      e.preventDefault();
      setActive(campsTab);
      clearSearch();
      await fetchAllCampaigns();
    });
  }

  if (loggedUser && myCampsTab) {
    myCampsTab.style.display = "inline-block";
    myCampsTab.addEventListener("click", async (e) => {
      e.preventDefault();
      setActive(myCampsTab);
      clearSearch();
      await fetchMyCampaigns();
    });
  } else if (myCampsTab) {
    myCampsTab.style.display = "none";
  }

  fetchAllCampaigns();
});

// logged in
if (loggedUser) {
  let welcomeUser = document.createElement("span");
  welcomeUser.classList = "welcome-user";
  welcomeUser.innerHTML = `Welcome, ${loggedUser.name}`;
  document.querySelector("ul")?.appendChild(welcomeUser);
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (loginBtn) loginBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "block";
  const startOwn = document.getElementById("start-your-own");
  if (startOwn) startOwn.href = "../HTML/start-campaign.html";
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../HTML/index.html";
});
