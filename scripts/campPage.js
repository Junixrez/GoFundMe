const loggedUser = JSON.parse(localStorage.getItem("user"));
function getCampId(id) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(id);
}
const campaignId = getCampId("id");
const userId = loggedUser.id;

//getting the campaign
async function fetchCampaigns(id) {
  const response = await fetch(`http://localhost:3000/campaigns?id=${id}`);
  const data = await response.json();
  data.forEach((campaign) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML += `
          <h2>${campaign.title}</h2>
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
      const time = new Date().toISOString();
      console.log(time);
      const payment = {
        campaignId: campaign.id,
        amount: amount,
        userId: userId,
        createdAt: time,
      };
      if (amount >= 1) {
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
          confirm(
            `Thanks mr.${loggedUser.name} for Donating $${amount} 
            to "${campaign.title}" `
          );
          window.close();
        })();
      } else {
        alert("wrong");
      }
    });
  });
}
fetchCampaigns(campaignId);

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
  window.location.href = "../HTML/login.html";
});
