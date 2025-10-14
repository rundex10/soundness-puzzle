<script>

const defaultUserData = {
  username: "Guest",
  lastTemplate: null,
  lastMode: null,
  bestTime: null,
  bestMoves: null,
  completed: []
};

function loadUserData() {
  const saved = localStorage.getItem("soundnessUserData");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { ...defaultUserData };
    }
  } else {
    localStorage.setItem("soundnessUserData", JSON.stringify(defaultUserData));
    return { ...defaultUserData };
  }
}

let userData = loadUserData();

function saveUserData() {
  localStorage.setItem("soundnessUserData", JSON.stringify(userData));
}

function recordWin(templateName, time, moves) {
  if (!userData.completed.includes(templateName))
    userData.completed.push(templateName);

  if (
    !userData.bestTime ||
    time < userData.bestTime ||
    (time === userData.bestTime && moves < userData.bestMoves)
  ) {
    userData.bestTime = time;
    userData.bestMoves = moves;
  }

  userData.lastTemplate = selectedTemplate?.name || null;
  userData.lastMode = puzzleSize || null;
  saveUserData();
}

function showUserData() {
  console.log("User Data:", userData);
}

window.addEventListener("load", () => {
  userData = loadUserData();

  if (userData.lastTemplate && userData.lastMode) {
    selectedTemplate = templates.find(
      t => t.name === userData.lastTemplate
    ) || null;
    puzzleSize = userData.lastMode;

    if (selectedTemplate) {
      document.getElementById("templateBtn").innerText = selectedTemplate.name;
      document.getElementById("templateBtn").classList.add("selected");
    }

    if (puzzleSize) {
      document.getElementById("modeBtn").innerText = `${puzzleSize} x ${puzzleSize}`;
      document.getElementById("modeBtn").classList.add("selected");
    }

    updateStartButton();
  }
});
</script>

