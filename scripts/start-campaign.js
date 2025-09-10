const loggedUser = localStorage.getItem("user");
const currentUser = JSON.parse(localStorage.getItem("user")).id;
document
  .getElementById("campaign-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const campaignData = {
      title: document.getElementById("title").value,
      goal: document.getElementById("goal").value,
      deadline: document.getElementById("deadline").value,
      description: document.getElementById("description").value,
      creatorId: currentUser,
      isApproved: false,
    };
    try {
      const response = await fetch("http://localhost:3000/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        window.location.href = "../HTML/campaigns.html";
        alert("Campaign created successfully! Awaiting approval.");
      } else {
        alert(
          `Failed to create campaign: ${result.message || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while creating the campaign. Please try again later."
      );
    }
  });

//logged
if (loggedUser) {
  console.log(loggedUser);
  console.log("user is logged in");
  console.log(currentUser);
  document.getElementById("logoutBtn").style.display = "block";
}

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "../HTML/index.html";
});
