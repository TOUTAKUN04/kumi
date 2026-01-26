let munchCredits = 0;

// 1. Initialize Rain
function startFallingRain() {
  const container = document.getElementById('falling-container');
  const images = ['images/softtoy.png', 'images/munch.png', 'images/flower1.png'];
  for (let i = 0; i < 35; i++) {
    const img = document.createElement('img');
    img.src = images[Math.floor(Math.random() * images.length)];
    img.classList.add('falling-item');
    img.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 10 + 7;
    img.style.animationDuration = duration + 's';
    img.style.animationDelay = Math.random() * -duration + 's';
    img.style.width = Math.random() * 30 + 20 + 'px';
    container.appendChild(img);
  }
}

// 2. Vibe Color Change
const vibeColors = ["#FFF1F4", "#FFE5E9", "#FDF6F0", "#FCE4EC", "#F8F0FF", "#FFF9FA"];
function changeBg() {
  const randomColor = vibeColors[Math.floor(Math.random() * vibeColors.length)];
  document.body.style.backgroundColor = randomColor;
}

// 3. Navigation
function next(id) {
  changeBg();
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function nextWithCredit(id, credit = 1) {
  munchCredits += credit;
  if (id === 'yes' || id === 'later') {
    showToast(`🍫 Total 2 Munch Credited!`);
  } else {
    showToast(`🍫 +${credit} Munch Credit!`);
  }

  if (id === 'yes' || id === 'later') {
    await sendNotification(id);
  }
  next(id);
}

function firstButtonClick() {
  munchCredits += 1;
  showToast(`🍫 +1 Munch Credit!`);
  next('message');
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "show";
  setTimeout(() => t.className = "", 1000);
}

// 4. Tracking
async function sendNotification(userChoice) {
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userChoice,
        munchCredits,
        ip: ipData.ip,
        deviceInfo: navigator.userAgent
      })
    });
  } catch (e) { console.error("Tracking failed", e); }
}

window.onload = startFallingRain;