function checkAuth(requiredRole = null) {
  const session = DB.getSession();
  const company = DB.getCompany();

  if (!company && window.location.pathname.indexOf("index.html") === -1) {
    window.location.href = "index.html";
    return;
  }

  if (!session && window.location.pathname.indexOf("index.html") === -1) {
    window.location.href = "index.html";
    return;
  }

  if (session && requiredRole && session.role !== requiredRole) {
    if (session.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "employee.html";
    }
  }
}

function handleLogout() {
  DB.clearSession();
  window.location.href = "index.html";
}