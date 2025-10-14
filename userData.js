// userData.js
const userData = {
  dataKey: "soundness_users",
  sessionKey: "soundness_session",

  loadAllUsers() {
    return JSON.parse(localStorage.getItem(this.dataKey) || "{}");
  },

  saveAllUsers(users) {
    localStorage.setItem(this.dataKey, JSON.stringify(users));
  },

  getSession() {
    return JSON.parse(localStorage.getItem(this.sessionKey) || "null");
  },

  setSession(username) {
    localStorage.setItem(this.sessionKey, JSON.stringify({ username }));
  },

  clearSession() {
    localStorage.removeItem(this.sessionKey);
  },

  registerUser(username, password) {
    const users = this.loadAllUsers();
    if (!username || !password) {
      alert("Please fill username and password!");
      return;
    }
    if (users[username]) {
      alert("Username already exists!");
      return;
    }
    users[username] = {
      password,
      gamesPlayed: 0,
      createdAt: new Date().toISOString()
    };
    this.saveAllUsers(users);
    this.setSession(username);
    alert("Registration successful!");
    this.updateUserUI();
  },

  loginUser(username, password) {
    const users = this.loadAllUsers();
    if (!users[username]) {
      alert("User not found!");
      return;
    }
    if (users[username].password !== password) {
      alert("Incorrect password!");
      return;
    }
    this.setSession(username);
    alert("Login successful!");
    this.updateUserUI();
  },

  logoutUser() {
    this.clearSession();
    this.updateUserUI();
  },

  incrementGamesPlayed() {
    const session = this.getSession();
    if (!session) return;
    const users = this.loadAllUsers();
    const user = users[session.username];
    if (user) {
      user.gamesPlayed = (user.gamesPlayed || 0) + 1;
      this.saveAllUsers(users);
      this.updateUserUI();
    }
  },

  updateUserUI() {
    const session = this.getSession();
    const info = document.getElementById("user-info");
    const loginPopup = document.getElementById("login-popup");

    if (session) {
      const users = this.loadAllUsers();
      const user = users[session.username];
      if (!user) {
        this.logoutUser();
        return;
      }

      info.innerHTML = `
        👤 ${session.username} | 🧩 Games: ${user.gamesPlayed || 0}
        <button style="margin-left:10px;" onclick="userData.logoutUser()">Logout</button>
      `;
      loginPopup.style.display = "none";
    } else {
      info.innerHTML = "";
      loginPopup.style.display = "block";
    }
  }
};

// Auto login update on load
document.addEventListener("DOMContentLoaded", () => {
  userData.updateUserUI();
});
