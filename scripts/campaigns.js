import { isAdmin } from "./adminAuth.js";
let loggedUser = JSON.parse(localStorage.getItem("user"));
const url = "/api/campaigns";
let allCampaigns = [];

function createCampaignCard(campaign, isMyCampaign) {
  let card = document.createElement("div");
  card.classList = "card";

  let linkURL;
  let buttonText;

  if (isMyCampaign) {
    linkURL = `/HTML/EditCamp.html?id=${campaign.id}`;
    buttonText = "Edit Campaign";
  } else if (!loggedUser) {
    linkURL = `/HTML/login.html`;
    buttonText = "View More";
  } else {
    linkURL = `/HTML/campaign.html?id=${campaign.id}`;
    buttonText = "View Details";
  }

  card.innerHTML = `
    <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
    <h3 class="campaign-title">${campaign.title}</h3> 
    <p class="campaign-description">${campaign.description}</p>
    <p class="campaign-goal">Goal: $${campaign.goal}</p>
    <p class = "campaign-raised">Raised: $${campaign.raised}</p>
    <p class="campaign-deadline">Dead line: ${campaign.deadline}</p>
    <a href="${linkURL}" class="btn-primary-dark" id="cardBtn">${buttonText}</a>
  `;

  return card;
}

function displayCampaigns(campaigns, isMyCampaign) {
  let container = document.getElementById("campaign-cards");
  container.innerHTML = "";

  let approved = campaigns.filter(function (c) {
    return c.isApproved === true;
  });

  if (approved.length === 0) {
    container.innerHTML = '<p style = "color: red;">Not found</p>';
    return;
  }

  approved.forEach(function (campaign) {
    let card = createCampaignCard(campaign, isMyCampaign);
    container.appendChild(card);
  });
}

function searchCampaigns(searchTerm) {
  let term = searchTerm.toLowerCase().trim();

  if (term === "") {
    displayCampaigns(allCampaigns, false);
    return;
  }

  let filtered = allCampaigns.filter(function (campaign) {
    return campaign.title.toLowerCase().includes(term);
  });

  displayCampaigns(filtered, false);
}

function fetchAllCampaigns() {
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      allCampaigns = data;
      displayCampaigns(allCampaigns, false);
    });
}

function fetchMyCampaigns() {
  if (!loggedUser) return;

  fetch(`${url}?creatorId=${loggedUser.id}`)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      allCampaigns = data;
      displayCampaigns(allCampaigns, true);
    });
}

function initializeSearch() {
  let searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      let searchTerm = e.target.value;
      searchCampaigns(searchTerm);
    });
  }
}

function setActive(tabEl) {
  let camps = document.querySelector(".camps");
  let myCamps = document.querySelector(".myCamps");

  if (camps) {
    camps.classList.remove("active");
  }
  if (myCamps) {
    myCamps.classList.remove("active");
  }

  tabEl.classList.add("active");
}

function clearSearch() {
  let searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeSearch();

  let campsTab = document.querySelector(".camps");
  let myCampsTab = document.querySelector(".myCamps");

  if (campsTab) {
    campsTab.addEventListener("click", function (e) {
      e.preventDefault();
      setActive(campsTab);
      clearSearch();
      fetchAllCampaigns();
    });
  }

  if (loggedUser && myCampsTab) {
    myCampsTab.style.display = "inline-block";
    myCampsTab.addEventListener("click", function (e) {
      e.preventDefault();
      setActive(myCampsTab);
      clearSearch();
      fetchMyCampaigns();
    });
  } else if (myCampsTab) {
    myCampsTab.style.display = "none";
  }

  fetchAllCampaigns();
});

if (loggedUser) {
  console.log("User is logged in");

  let welcomeUser = document.createElement("span");
  welcomeUser.classList = "welcome-user";
  welcomeUser.innerHTML = `Welcome, ${loggedUser.name}`;
  document.querySelector("ul").appendChild(welcomeUser);

  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";
  document.getElementById("start-your-own").href = "/HTML/start-campaign.html";

  document.querySelector(".myCamps").style.display = "inline-block";
} else if (!loggedUser) {
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("user");
  window.location.href = "/";
});
isAdmin();
