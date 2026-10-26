if (!localStorage.getItem("hcm_users")) {
  const defaultAdmin = [
    {
      id: 1,
      name: "Super Admin",
      email: "admin@hcmlite.com",
      password: "admin123",
      role: "admin",
      department: "Management",
      salary: 150000
    }
  ];
  localStorage.setItem("hcm_users", JSON.stringify(defaultAdmin));
}

if (!localStorage.getItem("hcm_company")) {
  const defaultCompany = {
    name: "HCM Lite Inc.",
    startTime: "09:00",
    graceMinutes: 15,
    leaveQuota: 20
  };
  localStorage.setItem("hcm_company", JSON.stringify(defaultCompany));
}

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const role = document.getElementById("loginRole").value;
  const errorDiv = document.getElementById("loginError");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    if (errorDiv) {
      errorDiv.innerText = "Please enter a valid email format!";
    }
    return;
  }

  if (password.length > 0) {
    const fakeUser = {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      role: role,
      department: "IT",
      salary: 100000
    };

    localStorage.setItem("hcm_session", JSON.stringify(fakeUser));
    
    if (fakeUser.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "employee.html";
    }
  } else {
    if (errorDiv) {
      errorDiv.innerText = "Password cannot be empty!";
    }
  }
}

function handleLogout() {
  localStorage.removeItem("hcm_session");
  window.location.href = "index.html";
}

function checkAuth(requiredRole) {
  const session = JSON.parse(localStorage.getItem("hcm_session"));
  
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  if (requiredRole && session.role !== requiredRole) {
    if (session.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "employee.html";
    }
  }
}