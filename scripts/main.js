const templates = [
      { name: "SN Original", file: "assets/sn-original.jpg" },
      { name: "SN Graffiti", file: "assets/sn-graffiti.png" },
      { name: "SN Corals", file: "assets/sn-corals.png" },
      { name: "SN Planets", file: "assets/sn-planets.png" },
      { name: "SN Animals", file: "assets/sn-animals.png" },
      { name: "SN Leaves", file: "assets/sn-leaves.png" },
      { name: "SN Snake", file: "assets/sn-snake.png" },
      { name: "SN Queen", file: "assets/sn-queen.png" },
      { name: "SN Candies", file: "assets/sn-candies.png" },
      { name: "SN Fruits", file: "assets/sn-fruits.png" },
      { name: "SN Wool", file: "assets/sn-wool.png" },
      { name: "SN Textile", file: "assets/sn-textile.png" },
      { name: "SN Porcelain", file: "assets/sn-porcelain.png" },
      { name: "SN Wood", file: "assets/sn-wood.png" },
      { name: "SN Neon", file: "assets/sn-neon.png" },
      { name: "SN Flowers", file: "assets/sn-flowers.png" }
    ];
    let selectedTemplate = null;
    let puzzleSize = null;
    const board = document.getElementById("board");
    const pieces = document.getElementById("pieces");
    const templateList = document.getElementById("templateList");
    const timerDisplay = document.getElementById("timer");
    const moveDisplay = document.getElementById("moves");
    let timer = 0, interval;
    let moveCount = 0;

    templates.forEach(tpl => {
      const div = document.createElement("div");
      div.className = "template-item";
      div.innerHTML = `<img src="${tpl.file}" />
        <div>${tpl.name}</div>
        <button class="retro-btn" onclick="selectTemplate('${tpl.file}', '${tpl.name}')">Select</button>`;
      templateList.appendChild(div);
    });

      const moreDiv = document.createElement("div");
     moreDiv.className = "template-item no-text"; 
     moreDiv.innerHTML = `<img src="more.jpg" alt="More" />`;
     templateList.appendChild(moreDiv);

    function openTemplatePopup() {
      document.getElementById("templatePopup").style.display = "block";
      document.getElementById("overlay").style.display = "block";
      document.getElementById("overlayBlur").style.display = "block";
    }

    function openModePopup() {
      document.getElementById("modePopup").style.display = "block";
      document.getElementById("overlay").style.display = "block";
      document.getElementById("overlayBlur").style.display = "block";
    }

    function closePopups() {
      document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
      document.getElementById("overlay").style.display = "none";
      document.getElementById("overlayBlur").style.display = "none";
    }

    function selectTemplate(file, name) {
  selectedTemplate = { file, name };
  const btn = document.getElementById("templateBtn");
  btn.innerText = name;
  btn.classList.add("selected");
  closePopups();
  updateStartButton();
   }

    function selectMode(size) {
  puzzleSize = size;
  const btn = document.getElementById("modeBtn");
  btn.innerText = `${size} x ${size}`;
  btn.classList.add("selected");
  closePopups();
  updateStartButton();
    }

   function updateStartButton() {
  const startBtn = document.getElementById("startBtn");
  if (selectedTemplate && puzzleSize) {
    startBtn.disabled = false;
    startBtn.classList.add("enabled");
  } else {
    startBtn.disabled = true;
    startBtn.classList.remove("enabled");
  }
}

    function goHome() {
      stopConfetti();
      board.style.display = "none";
      pieces.style.display = "none";
      const love = document.getElementById("love");
      love.style.display = "flex";
      love.style.flexDirection = "row";
      love.classList.remove("hidden");
      document.getElementById("topBar").style.display = "none";
      document.getElementById("controls").style.display = "block";
      document.getElementById("winPopup").style.display = "none";
      document.getElementById("love").style.display = "flex";
      document.getElementById("love").classList.add("hidden");
      document.getElementById("game-desc").style.display = "block";
      clearInterval(interval);
      timer = 0;
      moveCount = 0;
      updateStartButton();
    }

  function resetGameState() {
  selectedTemplate = null;
  puzzleSize = null;

  document.getElementById("templateBtn").innerText = "Pick a Theme";
  document.getElementById("modeBtn").innerText = "Mode";

  document.getElementById("startBtn").disabled = true;

  board.innerHTML = "";
  pieces.innerHTML = "";
  board.style.display = "none";
  pieces.style.display = "none";
  document.getElementById("topBar").style.display = "none";
  document.getElementById("controls").style.display = "block";
  document.getElementById("game-desc").style.display = "block";
  document.getElementById("winPopup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("overlayBlur").style.display = "none";
  document.getElementById("templateBtn").classList.remove("selected");
  document.getElementById("modeBtn").classList.remove("selected");

  const love = document.getElementById("love");
  love.style.display = "flex";
  love.classList.remove("hidden");

  clearInterval(interval);
  timer = 0;
  moveCount = 0;
  timerDisplay.textContent = "0";
  moveDisplay.textContent = "0";

  stopConfetti();

  updateStartButton();
}

function restartGame() {
  resetGameState();
}

function goHome() {
  resetGameState();
}

    function startGame() {
    if (!selectedTemplate || !Number.isInteger(puzzleSize)) return;

      board.innerHTML = "";
      pieces.innerHTML = "";
      document.getElementById("controls").style.display = "none";
      board.style.display = "grid";
      pieces.style.display = "flex";
      document.getElementById("topBar").style.display = "flex";
      document.getElementById("game-desc").style.display = "none";
      document.getElementById("love").style.display = "none";
      document.getElementById("love").classList.add("hidden");
      board.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;

      const total = puzzleSize * puzzleSize;
      const tileSize = 492 / puzzleSize;
      let tiles = [];
      for (let i = 0; i < total; i++) tiles.push(i);
      const oneIndex = Math.floor(Math.random() * total);
      const rest = tiles.filter(i => i !== oneIndex);

      for (let i = 0; i < total; i++) {
        const slot = document.createElement("div");
        slot.style.width = tileSize + "px";
        slot.style.height = tileSize + "px";
        slot.dataset.index = i;
        slot.ondragover = e => e.preventDefault();
        slot.ondrop = function(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData("text");
  const tileOriginal = document.getElementById(data);
  const fromPieces = pieces.contains(tileOriginal);

  if (fromPieces) {
    if (!slot.hasChildNodes()) {
      pieces.removeChild(tileOriginal);
      slot.appendChild(tileOriginal);

      const size = board.clientWidth / puzzleSize;
      const row = parseInt(slot.dataset.row);
      const col = parseInt(slot.dataset.col);
      resizeTileToSlot(tileOriginal, size, row, col);
    }
  } else {
    if (!slot.hasChildNodes()) {
      slot.appendChild(tileOriginal);
    } else {
      const existing = slot.firstChild;
      const parentSlot = tileOriginal.parentElement;
      slot.replaceChild(tileOriginal, existing);
      parentSlot.appendChild(existing);

      const size = board.clientWidth / puzzleSize;
      const r1 = parseInt(slot.dataset.row);
      const c1 = parseInt(slot.dataset.col);
      resizeTileToSlot(tileOriginal, size, r1, c1);

      const r2 = parseInt(parentSlot.dataset.row);
      const c2 = parseInt(parentSlot.dataset.col);
      resizeTileToSlot(existing, size, r2, c2);
    }
  }

  moveCount++;
  moveDisplay.textContent = moveCount;
  checkWin();
};

function resizeTileToSlot(tile, size, row, col) {
  tile.style.width = size + "px";
  tile.style.height = size + "px";
  tile.style.backgroundSize = `${puzzleSize * 100}% ${puzzleSize * 100}%`;
  tile.style.backgroundPosition = `${(col / (puzzleSize - 1)) * 100}% ${(row / (puzzleSize - 1)) * 100}%`;
}
        board.appendChild(slot);
      }

      const oneSlot = board.children[oneIndex];
      oneSlot.appendChild(createTile(oneIndex, tileSize));

      shuffle(rest).forEach(i => {
        pieces.appendChild(createTile(i, 49.2, true));
      });

      timer = 0;
      moveCount = 0;
      timerDisplay.textContent = 0;
      moveDisplay.textContent = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
      }, 1000);
    }

   function createTile(i, size, isList = false) {
  const div = document.createElement("div");
  div.className = "tile";
  div.id = "tile" + i;
  div.dataset.id = i;
  div.draggable = true;
  div.style.backgroundImage = `url(${selectedTemplate.file})`;
  div.style.backgroundSize = `${puzzleSize * 100}% ${puzzleSize * 100}%`;

  const x = i % puzzleSize;
  const y = Math.floor(i / puzzleSize);
  div.style.backgroundPosition = `${(x / (puzzleSize - 1)) * 100}% ${(y / (puzzleSize - 1)) * 100}%`;

  div.style.width = size + "px";
  div.style.height = size + "px";

  div.ondragstart = e => e.dataTransfer.setData("text", e.target.id);

  return div;
}

    function shuffle(arr) {
      let m = arr.length, i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    }
    function checkWin() {
      let correct = 0;
      for (let i = 0; i < board.children.length; i++) {
        const tile = board.children[i].firstChild;
        if (tile && tile.id === "tile" + i) correct++;
      }
      if (correct === puzzleSize * puzzleSize) {
        clearInterval(interval);
        document.getElementById("winThumb").src = selectedTemplate.file;
        document.getElementById("winStats").textContent = `Time: ${timer}s - Attempts: ${moveCount}`;
        document.getElementById("winPopup").style.display = "block";
        document.getElementById("overlay").style.display = "block";
        document.getElementById("overlayBlur").style.display = "block";

        launchConfetti();
      }
    }

  let confettiRAF = null;
  let confettiStopFn = null;

function stopConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = null;
  ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = "none";
  confettiStopFn = null;
}

function launchConfetti() {

  stopConfetti();

  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.display = "block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettis = [];
  const colors = ["#ff595e","#ffca3a","#8ac926","#1982c4","#6a4c93","#ff99c8"];

  for (let i = 0; i < 150; i++) {
    confettis.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 8, h: 14,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      rotate: Math.random() * 360,
      opacity: Math.random() * 0.8 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettis.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotate * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.opacity;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
      c.y += c.speed;
      c.rotate += 5;
      if (c.y > canvas.height) c.y = -20;
    });
    confettiRAF = requestAnimationFrame(draw);
  }
  draw();

  confettiStopFn = () => stopConfetti();
  setTimeout(confettiStopFn, 5000);
}

 function shareToX() {
  const stats = document.getElementById("winStats").textContent;
  const url = "https://soundness-puzzle.netlify.app/";
  const text = `Hi Soundy! I just solved the Soundness Puzzle! 🎉
🏆 ${stats}

Think you can beat me?
Play here: ${url}

This is fan-made game built by community to support @SoundnessLabs 🐬

#WeLoveSoundness`;

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(shareUrl, "_blank");
}
