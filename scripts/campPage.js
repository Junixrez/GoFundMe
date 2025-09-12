function getCampId(id) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(id);
}
const campaignId = getCampId("id");
const loggedUser = localStorage.getItem("user");
const userId = JSON.parse(loggedUser).id;
const userName = JSON.parse(loggedUser).name;
console.log(cardHolder);

//getting the campaign
async function fetchCampaigns(id) {
  const response = await fetch(`http://localhost:3000/campaigns?id=${id}`);
  const data = await response.json();
  data.forEach((campaign) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
          <h1>${campaign.title}</h1>
          <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
          <h3 class="campaign-title">${campaign.title}</h3>
          <p class="campaign-description">${campaign.description}</p>
          <p class="campaign-goal">Goal: $${campaign.goal}</p>
          <p class="campaign-raised">Deadline: ${campaign.deadline}</p>
          <button id="openDonate" class="btn-primary-dark">Donate Now</button>
        `;
    document.querySelector(".camp").appendChild(card);

    //open payment form
    document.getElementById("openDonate").addEventListener("click", () => {
      document.querySelector(".donate").style.display = "block";
      console.log("click");
    });
    //submitting payment
    document.getElementById("donateBtn").addEventListener("click", (e) => {
      e.preventDefault();
      console.log("payed");
      const amount = parseFloat(document.getElementById("amount").value);
      const cardNumber = document.getElementById("cardNum").value;
      const cardHolder = document.getElementById("cardHolder").value;
      const expireDate = document.getElementById("date").value;
      const cvv = document.getElementById("cvv").value;
      const payment = {
        campaignId: campaign.id,
        amount: amount,
        userId: userId,
      };
      (async () => {
        const rawResponse = await fetch("http://localhost:3000/pledges", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payment),
        });
        const data = rawResponse.json();
        window.location.href = "../HTML/campaigns.html";
        alert(` you've successfully Donated $${amount}
        Thank you for the donation ${userName}`);
      })();
    });
  });
}
fetchCampaigns(campaignId);
