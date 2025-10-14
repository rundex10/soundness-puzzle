const DB_NAME = "SoundnessPuzzleDB";
const STORE_NAME = "users";

let db;
const request = indexedDB.open(DB_NAME, 1);

request.onerror = (e) => console.error("Database error:", e.target.error);
request.onsuccess = (e) => (db = e.target.result);
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore(STORE_NAME, { keyPath: "username" });
};

function saveUserData(user) {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put(user);
}

function getUserData(username, callback) {
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const req = store.get(username);

  req.onsuccess = () => callback(req.result || null);
  req.onerror = () => callback(null);
}

function setActiveUser(username) {
  localStorage.setItem("activeUser", username);
}

function getActiveUser() {
  return localStorage.getItem("activeUser");
}

function logoutUser() {
  localStorage.removeItem("activeUser");
}

function registerUser(username, password) {
  getUserData(username, (existing) => {
    if (existing) {
      alert("Username already exists!");
      return;
    }

    const newUser = {
      username,
      password,
      gamesPlayed: 0,
      createdAt: new Date().toISOString(),
      lastPlayed: null,
    };

    saveUserData(newUser);
    setActiveUser(username);
    alert("Account created successfully!");
    location.reload();
  });
}

function loginUser(username, password) {
  getUserData(username, (user) => {
    if (!user) {
      alert("User not found!");
      return;
    }
    if (user.password !== password) {
      alert("Wrong password!");
      return;
    }

    setActiveUser(username);
    alert(`Welcome back, ${username}!`);
    location.reload();
  });
}

function updateUserUI() {
  const username = getActiveUser();
  if (!username) return;

  getUserData(username, (user) => {
    if (!user) return;
    const infoBar = document.getElementById("user-info");
    if (infoBar) {
      infoBar.innerHTML = `👤 ${user.username} | 🎮 Games Played: ${user.gamesPlayed}`;
    }
  });
}

function incrementGamesPlayed() {
  const username = getActiveUser();
  if (!username) return;

  getUserData(username, (user) => {
    if (!user) return;
    user.gamesPlayed++;
    user.lastPlayed = new Date().toISOString();
    saveUserData(user);
    updateUserUI();
  });
}

window.userData = {
  registerUser,
  loginUser,
  logoutUser,
  getActiveUser,
  updateUserUI,
  incrementGamesPlayed,
};
