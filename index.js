const campaignsEP = "campaigns";
const usersEP = "users";

async function getCampaingns() {
  await fetch(`http://localhost:3000/${campaignsEP}`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${element.image}" alt="#" />
          <h3>${element.title}</h3>
          <p>${element.description}</p>
          <p>Goal: ${element.goal}</p>
          <p>Raised: ${element.raised}</p>
        `;

        document.getElementById("campaign-cards").appendChild(div);
      });
    });
}

getCampaingns();
