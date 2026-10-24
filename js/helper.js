function querySmartHelper(q) {
  const query = q.toLowerCase();
  const session = DB.getSession();
  const users = DB.getUsers();
  const attendance = DB.getAttendance();
  const leaves = DB.getLeaves();
  const today = new Date().toISOString().split("T")[0];

  if (session.role === "admin") {
    if (query.includes("how many employees")) {
      const emps = users.filter(u => u.role === "employee");
      return `Total employees: ${emps.length}`;
    }
    if (query.includes("leave today")) {
      const todayLeaves = leaves.filter(l => l.status === "Approved" && l.from <= today && l.to >= today);
      return `${todayLeaves.length} employees on leave today.`;
    }
    if (query.includes("late today")) {
      const lates = attendance.filter(a => a.date === today && a.status === "Late");
      return `${lates.length} employees late today.`;
    }
  } else {
    if (query.includes("leave") || query.includes("remaining")) {
      const company = DB.getCompany();
      const used = leaves
        .filter(l => l.empId === session.id && l.status === "Approved")
        .reduce((sum, l) => sum + l.days, 0);
      return `Remaining leaves: ${parseInt(company.leaveQuota) - used}`;
    }
    if (query.includes("late")) {
      const myLate = attendance.filter(a => a.empId === session.id && a.date === today && a.status === "Late");
      return myLate.length > 0 ? "Yes, you were late today." : "No, you were on time.";
    }
  }

  return "Sorry, I didn't understand. Ask about leaves, employees count, or late records.";
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const container = document.getElementById("chatMessages");
  container.innerHTML += `<div class="chat-msg user">${msg}</div>`;

  const reply = querySmartHelper(msg);
  container.innerHTML += `<div class="chat-msg bot">${reply}</div>`;

  input.value = "";
  container.scrollTop = container.scrollHeight;
}