const DB = {
  getCompany: () => JSON.parse(localStorage.getItem("hcm_company")) || null,
  setCompany: (data) => localStorage.setItem("hcm_company", JSON.stringify(data)),
  getUsers: () => JSON.parse(localStorage.getItem("hcm_users")) || [],
  setUsers: (users) => localStorage.setItem("hcm_users", JSON.stringify(users)),
  getAttendance: () => JSON.parse(localStorage.getItem("hcm_attendance")) || [],
  setAttendance: (records) => localStorage.setItem("hcm_attendance", JSON.stringify(records)),
  getLeaves: () => JSON.parse(localStorage.getItem("hcm_leaves")) || [],
  setLeaves: (leaves) => localStorage.setItem("hcm_leaves", JSON.stringify(leaves)),
  getSession: () => JSON.parse(localStorage.getItem("hcm_session")) || null,
  setSession: (user) => localStorage.setItem("hcm_session", JSON.stringify(user)),
  clearSession: () => localStorage.removeItem("hcm_session")
};