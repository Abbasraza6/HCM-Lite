function handleLogin(e) {
  e.preventDefault();
  const role = document.getElementById("loginRole").value;
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  
  let empData = {
    id: Date.now(),
    name: email.split('@')[0] || "User",
    email: email || "user@hcm.com",
    role: role,
    department: "General",
    salary: 100000
  };

  if (role === "employee") {
    const employees = JSON.parse(localStorage.getItem("hcm_employees")) || [];
    const found = employees.find(emp => emp.email.toLowerCase() === email);
    if (found) {
      empData.id = found.id;
      empData.name = found.name;
      empData.department = found.department;
      empData.salary = found.salary || 100000;
    }
  }

  DB.setSession(empData);

  if (role === "admin") {
    location.href = "admin.html";
  } else {
    location.href = "employee.html";
  }
}

function checkAuth() {
  const session = DB.getSession();
  if (!session) {
    location.href = "index.html";
  }
}

function handleLogout() {
  DB.clearSession();
  location.href = "index.html";
}