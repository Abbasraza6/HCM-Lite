function applyLeave(e) {
  e.preventDefault();
  const session = DB.getSession();
  const company = DB.getCompany();

  const type = document.getElementById("leaveType").value;
  const from = document.getElementById("leaveFrom").value;
  const to = document.getElementById("leaveTo").value;
  const reason = document.getElementById("leaveReason").value;

  if (new Date(from) > new Date(to)) {
    alert("From Date cannot be after To Date!");
    return;
  }

  let count = 0;
  let cur = new Date(from);
  const end = new Date(to);

  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  const leaves = DB.getLeaves();
  const usedDays = leaves
    .filter(l => l.empId === session.id && l.status === "Approved")
    .reduce((sum, l) => sum + l.days, 0);

  if (usedDays + count > parseInt(company.leaveQuota)) {
    alert("Leave quota exceeded!");
    return;
  }

  leaves.push({
    id: Date.now(),
    empId: session.id,
    empName: session.name,
    type,
    from,
    to,
    days: count,
    reason,
    status: "Pending",
    comment: ""
  });

  DB.setLeaves(leaves);
  alert("Leave applied successfully!");
  location.href = "employee.html";
}

function updateLeaveStatus(id, newStatus) {
  const leaves = DB.getLeaves();
  const comment = prompt("Enter decision comment:");
  const leave = leaves.find(l => l.id === id);

  if (leave) {
    leave.status = newStatus;
    leave.comment = comment || "";
    DB.setLeaves(leaves);
    location.reload();
  }
}