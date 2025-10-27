// =============================
// ADMIN DASHBOARD CONTROLLER
// =============================

// Access control for dashboard
if (window.location.pathname.includes("dashboard.html")) {
  const auth = JSON.parse(localStorage.getItem("aroma_auth"));

  if (!auth || !auth.isAdmin) {
    alert("Access denied! Admins only. Please log in.");
    window.location.href = "admin-auth.html";
  } else {
    loadOrders();
  }
}

// =============================
// LOAD CUSTOMER ORDERS
// =============================
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("aroma_orders")) || [];
  const tbody = document.getElementById("ordersBody");
  const table = document.getElementById("ordersTable");
  const emptyMsg = document.getElementById("noOrders");

  if (!tbody) return;

  if (orders.length > 0) {
    emptyMsg.style.display = "none";
    table.style.display = "table";
    tbody.innerHTML = "";

    orders.forEach((order, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.address}</td>
        <td>${order.total}</td>
        <td>${new Date(order.date).toLocaleString()}</td>
        <td>
          <select class="status" data-index="${i}">
            <option value="pending" ${order.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Delivered</option>
            <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".status").forEach(select => {
      select.addEventListener("change", e => {
        const index = e.target.dataset.index;
        orders[index].status = e.target.value;
        localStorage.setItem("aroma_orders", JSON.stringify(orders));
      });
    });
  } else {
    emptyMsg.style.display = "block";
    table.style.display = "none";
  }
}

// =============================
// LOGOUT FUNCTION
// =============================
document.getElementById("logoutAdmin")?.addEventListener("click", () => {
  localStorage.removeItem("aroma_auth");
  alert("Logged out successfully!");
  window.location.href = "admin-auth.html";
});
