import { isAdmin } from "./adminAuth.js";
const loggedUser = JSON.parse(localStorage.getItem("user"));
function getCampId(id) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(id);
}
const campaignId = getCampId("id");
const userId = loggedUser.id;
console.log(12345678901234);
function validatePaymentInputs(
  amount,
  cardNumber,
  cardHolder,
  expireDate,
  cvv
) {
  if (!amount || isNaN(amount) || amount < 1) {
    Swal.fire({
      icon: "error",
      title: "Invalid Amount",
      text: "Enter at least $1.",
    });
    return false;
  }
  if (amount > 10000) {
    Swal.fire({
      icon: "error",
      title: "Amount Too High",
      text: "Max-limit is $10K",
    });
    return false;
  }
  if (!cardNumber || cardNumber.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Card Number Required",
      text: "Enter your card number",
    });
    return false;
  }
  const cleanCardNumber = cardNumber.replace(/\s+/g, "");
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    Swal.fire({
      icon: "error",
      title: "Invalid Card Number",
      text: "Enter a valid card number",
    });
    return false;
  }
  if (!/^\d+$/.test(cleanCardNumber)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Card Number",
      text: "Numberical input only",
    });
    return false;
  }
  if (!cardHolder || cardHolder.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Cardholder Name Required",
      text: "Enter the cardholder name.",
    });
    return false;
  }
  if (cardHolder.trim().length < 2) {
    Swal.fire({
      icon: "error",
      title: "Name Too Short",
      text: "Minimum name length is 3 letters",
    });
    return false;
  }
  if (!/^[a-zA-Z\s]+$/.test(cardHolder.trim())) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain letters only",
    });
    return false;
  }
  if (!expireDate || expireDate.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Expiry Date Required",
      text: "Please enter the expiry date.",
    });
    return false;
  }
  if (!/^\d{2}\/\d{2}$/.test(expireDate)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Date Format",
      text: "Please enter expiry date in MM/YY format.",
    });
    return false;
  }
  const [month, year] = expireDate.split("/").map((num) => parseInt(num));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  if (month < 1 || month > 12) {
    Swal.fire({
      icon: "error",
      title: "Invalid Month",
      text: "Enter a valid month",
    });
    return false;
  }
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    Swal.fire({
      icon: "error",
      title: "Card Expired",
      text: "Expired Card",
    });
    return false;
  }
  if (!cvv || cvv.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "CVV Required",
      text: "Please enter the CVV code.",
    });
    return false;
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    Swal.fire({
      icon: "error",
      title: "Invalid CVV",
      text: "Enter a vaild CVV",
    });
    return false;
  }
  return true;
}
async function fetchCampaigns(id) {
  const response = await fetch(`/api/campaigns?id=${id}`);
  const data = await response.json();
  data.forEach((campaign) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML += `
          <img src="${campaign.imageUrl}" alt="Campaign Image" class="campaign-cards"/>
          <h3 class="campaign-title">${campaign.title}</h3>
          <p class="campaign-description">${campaign.description}</p>
          <p class="campaign-goal">Goal: $${campaign.goal}</p>
          <p class= "campaign-raised">Raised: $${campaign.raised}</p>
          <p class="campaign-deadline">Deadline: ${campaign.deadline}</p>
          <button id="openDonate" class="btn-primary-dark">Donate Now</button>
        `;
    document.querySelector(".camp").appendChild(card);

    if (loggedUser.id === campaign.creatorId) {
      document.getElementById("openDonate").style.display = "none";
      console.log(campaign.creatorId);
    }

    document.getElementById("openDonate").addEventListener("click", () => {
      document.querySelector(".donate").style.display = "block";
    });

    document.getElementById("donateBtn").addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Confirm Payment",
        text: `Are you sure you want to donate $${amount} to ${campaign.title}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d7377",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed with payment",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const amount = parseFloat(document.getElementById("amount").value);
          const cardNumber = document.getElementById("cardNum").value;
          const cardHolder = document.getElementById("cardHolder").value;
          const expireDate = document.getElementById("date").value;
          const cvv = document.getElementById("cvv").value;
          if (
            !validatePaymentInputs(
              amount,
              cardNumber,
              cardHolder,
              expireDate,
              cvv
            )
          ) {
            return;
          }

          const time = new Date().toISOString();
          const payment = {
            campaignId: campaign.id,
            amount: amount,
            userId: userId,
            createdAt: time,
          };
          (async () => {
            const rawResponse = await fetch("/api/pledges", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payment),
            });
            if (rawResponse.ok) {
              const campResponse = await fetch(`/api/campaigns/${campaign.id}`);
              const campData = await campResponse.json();
              const newGoal = Math.max(0, campData.goal - amount);
              const newRaised = (campData.raised || 0) + amount;
              await fetch(`/api/campaigns/${campaign.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  goal: newGoal,
                  raised: newRaised,
                }),
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: "Failed",
              });
            }
          })();
          Swal.fire({
            icon: "success",
            title: "Done",
            text: `Thank you Mr. ${loggedUser.name} for donating $${amount} to ${campaign.title}`,
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            window.location.href = "../HTML/campaigns.html";
          }, 2500);
        }
      });
    });
  });
}
fetchCampaigns(campaignId);

if (loggedUser) {
  console.log("User is logged in");
  let welcomeUser = document.createElement("span");
  welcomeUser.classList = "welcome-user";
  welcomeUser.innerHTML = `Welcome, ${loggedUser.name}`;
  document.querySelector("ul").appendChild(welcomeUser);
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeUser("user");
  window.location.href = "/";
});
isAdmin();
