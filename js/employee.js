function handleCheckIn() {
  const session = DB.getSession();
  const company = DB.getCompany();
  const records = DB.getAttendance();

  const today = new Date().toISOString().split("T")[0];
  let record = records.find(r => r.empId === session.id && r.date === today);

  if (record) {
    alert("Already checked in today!");
    return;
  }

  const now = new Date();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [startH, startM] = company.startTime.split(":").map(Number);
  const graceLimit = startH * 60 + startM + parseInt(company.graceMinutes);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const status = currentMinutes > graceLimit ? "Late" : "Present";

  records.push({
    id: Date.now(),
    empId: session.id,
    date: today,
    checkIn: currentTimeStr,
    checkOut: null,
    status: status,
    hoursWorked: 0
  });

  DB.setAttendance(records);
  location.reload();
}

function handleCheckOut() {
  const session = DB.getSession();
  const records = DB.getAttendance();
  const today = new Date().toISOString().split("T")[0];

  let record = records.find(r => r.empId === session.id && r.date === today);

  if (!record) {
    alert("You need to check in first!");
    return;
  }

  if (record.checkOut) {
    alert("Already checked out today!");
    return;
  }

  const now = new Date();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [inH, inM] = record.checkIn.split(":").map(Number);
  const diffMinutes = (now.getHours() * 60 + now.getMinutes()) - (inH * 60 + inM);
  const hoursWorked = (diffMinutes / 60).toFixed(1);

  record.checkOut = currentTimeStr;
  record.hoursWorked = parseFloat(hoursWorked);

  if (record.hoursWorked < 5) {
    record.status = "Half Day";
  }

  DB.setAttendance(records);
  location.reload();
}

function submitLeaveRequest(e) {
  e.preventDefault();
  const session = DB.getSession();
  const company = DB.getCompany();

  const type = document.getElementById("leaveType").value;
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
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