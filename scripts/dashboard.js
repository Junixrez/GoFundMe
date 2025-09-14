const url = "/api";
let currentPage = "dashboard";
let allCampaigns = [];
let allUsers = [];
let allPledges = [];
const loggedUser = JSON.parse(localStorage.getItem("user"));

if (!loggedUser || loggedUser.role !== "admin") {
  Swal.fire({
    icon: "error",
    title: "Access Denied",
    text: "You don't have permission to access this page",
    showConfirmButton: false,
    timer: 1500,
  }).then(() => {
    window.location.href = "/";
  });
  const cover = document.createElement("div");
  cover.classList = "cover";
  document.querySelector(".container").appendChild(cover);
}

async function getCampaigns() {
  const response = await fetch(`${url}/campaigns`);
  const data = await response.json();
  allCampaigns = data;
}

async function getUsers() {
  const response = await fetch(`${url}/users`);
  const data = await response.json();
  allUsers = data;
}

async function getPledges() {
  const response = await fetch(`${url}/pledges`);
  const data = await response.json();
  allPledges = data;
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

  let totalAmount = 0;
  allPledges.forEach((pledge) => {
    totalAmount = totalAmount + parseFloat(pledge.amount || 0);
  });

  let approvedCampaigns = 0;
  allCampaigns.forEach((campaign) => {
    if (campaign.isApproved) {
      approvedCampaigns++;
    }
  });

  let activeUsers = 0;
  allUsers.forEach((user) => {
    if (user.isActive) {
      activeUsers++;
    }
  });

  let pendingCampaigns = 0;
  allCampaigns.forEach((campaign) => {
    if (!campaign.isApproved) {
      pendingCampaigns++;
    }
  });

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
  let pledgesToShow = [];
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
    let user = null;
    allUsers.forEach((u) => {
      if (u.id == pledge.userId) {
        user = u;
      }
    });

    let campaign = null;
    allCampaigns.forEach((c) => {
      if (c.id == pledge.campaignId) {
        campaign = c;
      }
    });

    let pledgeDate = "N/A";
    if (pledge.createdAt) {
      pledgeDate = new Date(pledge.createdAt).toLocaleDateString();
    }

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

  tableHTML += `</tbody></table>`;
  return tableHTML;
}

function createCampaignsTable(showRecentOnly) {
  let campaignsToShow = [];
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
  tableHTML += `</tr></thead><tbody>`;

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
      tableHTML += `<td><div class="action-buttons">`;
      if (campaign.isApproved) {
        tableHTML += `<button class="btn-action reject" onclick="rejectCampaign(${campaign.id})">Reject</button>`;
      } else {
        tableHTML += `<button class="btn-action approve" onclick="approveCampaign(${campaign.id})">Approve</button>`;
      }
      tableHTML += `</div></td>`;
    }
    tableHTML += `</tr>`;
  });
  tableHTML += `</tbody></table>`;
  return tableHTML;
}

function createUsersTable(showRecentOnly) {
  let usersToShow = [];
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
  tableHTML += `</tr></thead><tbody>`;

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
  tableHTML += `</tbody></table>`;
  return tableHTML;
}

async function approveCampaign(campaignId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to approve this campaign?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#0d7377",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, approve it!",
  });

  if (result.isConfirmed) {
    const response = await fetch(url + "/campaigns/" + campaignId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Campaign has been approved successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve campaign",
      });
    }
  }
}

async function rejectCampaign(campaignId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to reject this campaign?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0d7377",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, reject it!",
  });

  if (result.isConfirmed) {
    const response = await fetch(url + "/campaigns/" + campaignId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: false }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      Swal.fire({
        icon: "success",
        title: "Rejected!",
        text: "Campaign has been rejected successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject campaign",
      });
    }
  }
}

async function banUser(userId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to ban this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0d7377",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, ban user!",
  });

  if (result.isConfirmed) {
    const response = await fetch(url + "/users/" + userId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      Swal.fire({
        icon: "success",
        title: "Banned!",
        text: "User banned successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to ban user",
      });
    }
  }
}

async function unbanUser(userId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to unban this user?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#0d7377",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, unban user!",
  });

  if (result.isConfirmed) {
    const response = await fetch(url + "/users/" + userId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    if (response.ok) {
      await getAllData();
      refreshCurrentPage();
      Swal.fire({
        icon: "success",
        title: "Unbanned!",
        text: "User unbanned successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to unban user",
      });
    }
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

document
  .getElementById("logoutBtn")
  .addEventListener("click", async function () {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      localStorage.clear();
      window.location.href = "/HTML/login.html";
    }
  });

document.getElementById("logo").addEventListener("click", () => {
  document.getElementById("logo").style.cursor = "pointer";
  window.location.href = "/";
});
