// === userData.js ===
// Sistem penyimpanan dan sinkronisasi user menggunakan localStorage

// Ambil data user dari localStorage
function getUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : {};
}

// Simpan semua user ke localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Ambil user yang sedang login
function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

// Simpan user yang sedang login
function setCurrentUser(username) {
  localStorage.setItem("currentUser", username);
}

// Hapus user yang sedang login
function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// Ambil data user tertentu
function getUserData(username) {
  const users = getUsers();
  return users[username] || null;
}

// Register user baru
function registerUser(username, password) {
  const users = getUsers();
  if (users[username]) return false; // sudah ada
  users[username] = { password, gamesPlayed: 0 };
  saveUsers(users);
  setCurrentUser(username);
  return true;
}

// Login user
function loginUser(username, password) {
  const users = getUsers();
  if (users[username] && users[username].password === password) {
    setCurrentUser(username);
    return true;
  }
  return false;
}

// Logout user
function logoutUser() {
  clearCurrentUser();
}

// Tambahkan 1 ke games played user aktif
function incrementGamesPlayed() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const users = getUsers();
  if (users[currentUser]) {
    users[currentUser].gamesPlayed = (users[currentUser].gamesPlayed || 0) + 1;
    saveUsers(users);
  }
}

// Ambil total games played user aktif
function getGamesPlayed() {
  const currentUser = getCurrentUser();
  if (!currentUser) return 0;
  const users = getUsers();
  return users[currentUser]?.gamesPlayed || 0;
}
