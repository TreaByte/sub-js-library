// Page elements (a page only has some of them, the others are null)
var form = document.getElementById("subscription-form");
var tableBody = document.getElementById("subscription-body");
var totalCount = document.getElementById("total-count");
var expiredCount = document.getElementById("expired-count");
var notification = document.getElementById("notification");

// Load saved subscriptions (empty list the first time)
var subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

// Save the list in the browser
function save() {
  localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
}

// "Expired" if the renewal date is before today, otherwise "Active"
function getStatus(renewalDate) {
  var today = new Date().toLocaleDateString("en-CA"); // today as yyyy-mm-dd
  return renewalDate < today ? "Expired" : "Active";
}

// Add one table cell with text to a row
function addCell(row, text) {
  var cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

// Draw the table (subscriptions page)
function renderTable() {
  tableBody.innerHTML = "";
  for (var i = 0; i < subscriptions.length; i++) {
    var s = subscriptions[i];
    var status = getStatus(s.renewalDate);

    var row = document.createElement("tr");
    addCell(row, s.service);
    addCell(row, s.provider);
    addCell(row, s.subscriber);
    addCell(row, s.renewalDate);
    addCell(row, s.category);
    var statusCell = addCell(row, status);
    statusCell.className = status === "Expired" ? "status-expired" : "status-active";

    // Delete button remembers its position in the list
    var actionCell = document.createElement("td");
    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("data-index", i);
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  }
}

// Draw the summary numbers (first page)
function renderSummary() {
  var expired = 0;
  for (var i = 0; i < subscriptions.length; i++) {
    if (getStatus(subscriptions[i].renewalDate) === "Expired") {
      expired++;
    }
  }
  totalCount.textContent = subscriptions.length;
  expiredCount.textContent = expired;
}

// Show the notification with a message
function showNotification(message) {
  notification.textContent = message;
  notification.classList.remove("hidden");
}

// First page: summary, notification and the add form
if (form) {
  renderSummary();
  if (subscriptions.length > 0) {
    showNotification("You have " + subscriptions.length + " subscription(s). Click to view the table.");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading
    var service = document.getElementById("service").value;
    subscriptions.push({
      service: service,
      provider: document.getElementById("provider").value,
      subscriber: document.getElementById("subscriber").value,
      renewalDate: document.getElementById("renewal-date").value,
      category: document.getElementById("category").value
    });
    save();
    renderSummary();
    showNotification(service + " added. Click to view the table.");
    form.reset();
  });
}

// Second page: the table and the Delete buttons
if (tableBody) {
  renderTable();
  tableBody.addEventListener("click", function (event) {
    if (event.target.className === "delete-btn") {
      var index = Number(event.target.getAttribute("data-index"));
      subscriptions.splice(index, 1);
      save();
      renderTable();
    }
  });
}