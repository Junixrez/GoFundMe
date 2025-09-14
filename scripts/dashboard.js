const url = "http://localhost:3000";
let currentPage = "dashboard";
let allCampaigns = [];
let allUsers = [];
let allPledges = [];
const loggedUser = JSON.parse(localStorage.getItem("user"));
if (!loggedUser || loggedUser.role !== "admin") {
  alert("Access denied!");
  window.location.href = "../HTML/index.html";
}
async function getCampaigns() {
  try {
    const response = await fetch(`${url}/campaigns`);
    allCampaigns = await response.json();
  } catch (error) {
    console.log("Failed to get campaigns:", error);
    allCampaigns = [];
  }
}

async function getUsers() {
  try {
    const response = await fetch(`${url}/users`);
    allUsers = await response.json();
  } catch (error) {
    console.log("Failed to get users:", error);
    allUsers = [];
  }
}

async function getPledges() {
  try {
    const response = await fetch(`${url}/pledges`);
    allPledges = await response.json();
  } catch (error) {
    console.log("Failed to get pledges:", error);
    allPledges = [];
  }
}

async function getAllData() {
  await getCampaigns();
  await getUsers();
  await getPledges();
}

document.addEventListener("DOMContentLoaded", async function () {
  await getAllData();
  setupMenu();
  showMainDashboard();
});

function setupMenu() {
  const menuItems = document.querySelectorAll("li");
  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener("click", function () {
      menuItems.forEach(function (item) {
        item.classList.remove("active");
      });
      menuItem.classList.add("active");
      const clickedItem = menuItem.textContent.trim();
      if (clickedItem === "Dashboard") {
        showMainDashboard();
      } else if (clickedItem === "Campaigns") {
        showCampaignsPage();
      } else if (clickedItem === "Users") {
        showUsersPage();
      } else if (clickedItem === "Pledges") {
        showPledgesPage();
      }
    });
  });
}

function showMainDashboard() {
  currentPage = "dashboard";
  const mainArea = document.querySelector(".main-content");
  const totalCampaigns = allCampaigns.length;
  const totalUsers = allUsers.length;
  const totalPledges = allPledges.length;
  const totalAmount = allPledges.reduce(
    (sum, pledge) => sum + parseFloat(pledge.amount || 0),
    0
  );
  const approvedCampaigns = allCampaigns.filter(
    (campaign) => campaign.isApproved
  ).length;
  const activeUsers = allUsers.filter((user) => user.isActive).length;
  const pendingCampaigns = allCampaigns.filter(
    (campaign) => !campaign.isApproved
  ).length;

  mainArea.innerHTML = `
    <section class="overview-cards">
      <div class="card">
        <h2>Total Campaigns</h2>
        <p class="amount">${totalCampaigns}</p>
        <p class="change positive">+${approvedCampaigns} approved</p>
      </div>
      <div class="card">
        <h2>Total Users</h2>
        <p class="amount">${totalUsers}</p>
        <p class="change positive">+${activeUsers} active</p>
      </div>
      <div class="card">
        <h2>Total Pledges</h2>
        <p class="amount">${totalPledges}</p>
        <p class="change positive">$${totalAmount.toLocaleString()} raised</p>
      </div>
      <div class="card">
        <h2>Pending Approval</h2>
        <p class="amount">${pendingCampaigns}</p>
        <p class="change positive">Awaiting review</p>
      </div>
    </section>
    
    <section class="recent-campaigns">
      <h2>Recent Campaigns</h2>
      ${createCampaignsTable(true)}
    </section>
    
    <section class="recent-users">
      <h2>Recent Users</h2>
      ${createUsersTable(true)}
    </section>

    <section class="recent-pledges">
      <h2>Recent Pledges</h2>
      ${createPledgesTable(true)}
    </section>
  `;
}

function showCampaignsPage() {
  currentPage = "campaigns";
  const mainArea = document.querySelector(".main-content");
  mainArea.innerHTML = `
    <section class="campaigns-only">
      <h2>Campaign Management</h2>
      ${createCampaignsTable(false)}
    </section>
  `;
}

function showUsersPage() {
  currentPage = "users";
  const mainArea = document.querySelector(".main-content");
  mainArea.innerHTML = `
    <section class="users-only">
      <h2>User Management</h2>
      ${createUsersTable(false)}
    </section>
  `;
}

function showPledgesPage() {
  currentPage = "pledges";
  const mainArea = document.querySelector(".main-content");
  mainArea.innerHTML = `
    <section class="pledges-only">
      <h2>Pledges Management</h2>
      ${createPledgesTable(false)}
    </section>
  `;
}

function createPledgesTable(showRecentOnly) {
  let pledgesToShow;
  if (showRecentOnly) {
    pledgesToShow = allPledges.slice(-5).reverse();
  } else {
    pledgesToShow = allPledges;
  }

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Pledge ID</th>
          <th>User</th>
          <th>Campaign</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>`;

  pledgesToShow.forEach(function (pledge) {
    const user = allUsers.find((u) => u.id == pledge.userId);
    const campaign = allCampaigns.find((c) => c.id == pledge.campaignId);
    const pledgeDate = pledge.createdAt
      ? new Date(pledge.createdAt).toLocaleDateString()
      : "N/A";

    tableHTML += `
      <tr>
        <td>#${pledge.id}</td>
        <td>
          <div class="creator-info">
            <div>
              <p class="campaign-title">${user ? user.name : "Unknown User"}</p>
              <p style="font-size: 0.8em; color: #666;">${
                user ? user.email : "N/A"
              }</p>
            </div>
          </div>
        </td>
        <td>
          <div class="creator-info">
            <div>
              <p class="campaign-title">${
                campaign ? campaign.title : "Campaign Not Found"
              }</p>
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight: 600; color: #28a745;">$${parseFloat(
            pledge.amount || 0
          ).toLocaleString()}</span>
        </td>
        <td>${pledgeDate}</td>
      </tr>`;
  });

  tableHTML += `
      </tbody>
    </table>`;

  return tableHTML;
}

function createCampaignsTable(showRecentOnly) {
  let campaignsToShow;
  if (showRecentOnly) {
    campaignsToShow = allCampaigns.slice(-5).reverse();
  } else {
    campaignsToShow = allCampaigns;
  }
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Campaign ID</th>
          <th>Campaign Title</th>
          <th>Creator ID</th>
          <th>Status</th>`;
  if (!showRecentOnly) {
    tableHTML += `<th>Actions</th>`;
  }
  tableHTML += `
        </tr>
      </thead>
      <tbody>`;
  campaignsToShow.forEach(function (campaign) {
    const status = campaign.isApproved ? "Approved" : "Pending";
    const statusClass = campaign.isApproved ? "active" : "pending";
    tableHTML += `
      <tr>
        <td>#${campaign.id}</td>
        <td>
          <div class="creator-info">
            <div>
              <p class="campaign-title">${campaign.title}</p>
            </div>
          </div>
        </td>
        <td>${campaign.creatorId || "N/A"}</td>
        <td>
          <span class="status ${statusClass}">${status}</span>
        </td>`;
    if (!showRecentOnly) {
      tableHTML += `
        <td>
          <div class="action-buttons">
            <button class="btn-action approve" onclick="approveCampaign(${campaign.id})">
              Approve
            </button>
            <button class="btn-action reject" onclick="rejectCampaign(${campaign.id})">
              Reject
            </button>
          </div>
        </td>`;
    }
    tableHTML += `</tr>`;
  });
  tableHTML += `
      </tbody>
    </table>`;
  return tableHTML;
}

function createUsersTable(showRecentOnly) {
  let usersToShow;
  if (showRecentOnly) {
    usersToShow = allUsers.slice(-5).reverse();
  } else {
    usersToShow = allUsers;
  }
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>`;
  if (!showRecentOnly) {
    tableHTML += `<th>Actions</th>`;
  }
  tableHTML += `
        </tr>
      </thead>
      <tbody>`;
  usersToShow.forEach(function (user) {
    const status = user.isActive ? "Active" : "Inactive";
    const statusClass = user.isActive ? "active" : "inactive";
    tableHTML += `
      <tr>
        <td>#${user.id}</td>
        <td>
          <div class="creator-info">
            <div>
              <p class="campaign-title">${user.name}</p>
            </div>
          </div>
        </td>
        <td>${user.email}</td>
        <td>
          <span class="status ${user.role}">${user.role}</span>
        </td>
        <td>
          <span class="status ${statusClass}">${status}</span>
        </td>`;
    if (!showRecentOnly) {
      tableHTML += `<td><div class="action-buttons">`;
      if (user.role !== "admin") {
        if (user.isActive) {
          tableHTML += `<button class="btn-action ban" onclick="banUser(${user.id})">Ban</button>`;
        } else {
          tableHTML += `<button class="btn-action unban" onclick="unbanUser(${user.id})">Unban</button>`;
        }
      } else {
        tableHTML += `<span class="admin-protected">Protected</span>`;
      }
      tableHTML += `</div></td>`;
    }
    tableHTML += `</tr>`;
  });
  tableHTML += `
      </tbody>
    </table>`;
  return tableHTML;
}

async function approveCampaign(campaignId) {
  const userConfirmed = confirm(
    "Are you sure you want to approve this campaign?"
  );
  if (!userConfirmed) return;
  try {
    const response = await fetch(url + "/campaigns/" + campaignId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      alert("Campaign approved successfully!");
    } else {
      alert("Failed to approve campaign");
    }
  } catch (error) {
    console.log("Error approving campaign:", error);
    alert("Failed to approve campaign");
  }
}

async function rejectCampaign(campaignId) {
  const userConfirmed = confirm(
    "Are you sure you want to reject this campaign?"
  );
  if (!userConfirmed) return;
  try {
    const response = await fetch(url + "/campaigns/" + campaignId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: false }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      alert("Campaign rejected successfully!");
    } else {
      alert("Failed to reject campaign");
    }
  } catch (error) {
    console.log("Error rejecting campaign:", error);
    alert("Failed to reject campaign");
  }
}

async function banUser(userId) {
  const userConfirmed = confirm("Are you sure you want to ban this user?");
  if (!userConfirmed) return;
  try {
    const response = await fetch(url + "/users/" + userId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      alert("User banned successfully!");
    } else {
      alert("Failed to ban user");
    }
  } catch (error) {
    console.log("Error banning user:", error);
    alert("Failed to ban user");
  }
}

async function unbanUser(userId) {
  const userConfirmed = confirm("Are you sure you want to unban this user?");
  if (!userConfirmed) return;
  try {
    const response = await fetch(url + "/users/" + userId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      alert("User unbanned successfully!");
    } else {
      alert("Failed to unban user");
    }
  } catch (error) {
    console.log("Error unbanning user:", error);
    alert("Failed to unban user");
  }
}

function refreshCurrentPage() {
  if (currentPage === "dashboard") {
    showMainDashboard();
  } else if (currentPage === "campaigns") {
    showCampaignsPage();
  } else if (currentPage === "users") {
    showUsersPage();
  } else if (currentPage === "pledges") {
    showPledgesPage();
  }
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  const userConfirmed = confirm("Are you sure you want to logout?");
  if (userConfirmed) {
    localStorage.clear();
    window.location.href = "../HTML/login.html";
  }
});

document.getElementById("logo").addEventListener("click", () => {
  document.getElementById("logo").style.cursor = "pointer";
  window.location.href = "../HTML/index.html";
});
