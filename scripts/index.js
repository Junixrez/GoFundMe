const campaignsEP = "campaigns";
const usersEP = "users";
const plegesEP = "pleges";
let index = 0;
const getRequest = (ep) => {
  return fetch(`http://localhost:3000/${ep}`);
};

async function fetchCampaigns() {
  await getRequest(campaignsEP)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((campaign) => {
        if (campaign.id <= 6) {
          const card = document.createElement("div");
          card.classList = "card";
          card.innerHTML = `
          <img src="${campaign.image}" alt="Campaign Image" class="campaign-cards"/>
          <h3 class="campaign-title">${campaign.title}</h3> 
          <p class="campaign-description">${campaign.description}</p>
          <p class="campaign-goal">Goal: $${campaign.goal}</p>
          <p class="campaign-raised">Raised: $${campaign.raised}</p>
          <a href="../HTML/campaign.html?id=${campaign.id}" class="btn-primary-dark">View Details</a>
        `;
          document.getElementById("campaign-cards").appendChild(card);
        }
      });
    });
}
fetchCampaigns();
