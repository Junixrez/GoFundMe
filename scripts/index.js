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
          document.getElementById("campaign-cards").innerHTML += `
          <div class="card">
            <img src="${campaign.image}" alt="${campaign.title}" />
            <h3>${campaign.title}</h3>
            <p>${campaign.description}</p>
            <p>Goal: $${campaign.goal}</p>
            <p>Raised: $${campaign.raised}</p>
            <a href="campaign.html?id=${campaign.id}" class="btn-primary-dark">View Campaign</a>
          </div>
        `;
        }
      });
    });
}
fetchCampaigns();
