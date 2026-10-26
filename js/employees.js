function renderEmployeesTable(searchTerm = "", deptFilter = "") {
  const tbody = document.getElementById("employeeTableBody");
  if (!tbody) return;

  let users = DB.getUsers().filter(u => u.role === "employee");

  if (searchTerm) {
    users = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  if (deptFilter) {
    users = users.filter(u => u.department === deptFilter);
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.department}</td>
      <td>PKR ${Number(u.salary).toLocaleString()}</td>
      <td>
        <button onclick="deleteEmployee(${u.id})" style="color: var(--danger); border: none; background: none; cursor: pointer; font-weight: 600;">Delete</button>
      </td>
    </tr>
  `).join("");
}

function createEmployee(e) {
  e.preventDefault();
  const name = document.getElementById("empName").value.trim();
  const email = document.getElementById("empEmail").value.trim();
  const password = document.getElementById("empPassword").value;
  const department = document.getElementById("empDept").value;
  const salary = parseFloat(document.getElementById("empSalary").value);

  const users = DB.getUsers();
  if (users.some(u => u.email === email)) {
    document.getElementById("emailError").innerText = "Email already registered!";
    return;
  }

  const newEmp = {
    id: Date.now(),
    name,
    email,
    password,
    role: "employee",
    department,
    salary
  };

  users.push(newEmp);
  DB.setUsers(users);
  renderEmployeesTable();
  document.getElementById("addEmpForm").reset();
}

function deleteEmployee(id) {
  let users = DB.getUsers();
  users = users.filter(u => u.id !== id);
  DB.setUsers(users);
  renderEmployeesTable();
}