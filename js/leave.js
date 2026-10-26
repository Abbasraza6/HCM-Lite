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