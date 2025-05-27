const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let width, height;

let player, obstacles = [], score = 0, highscore = 0, gameOver = false, eclipseX;
let keys = {};

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  score = 0;
  eclipseX = 0;
  gameOver = false;
  obstacles = [];
  player = { x: 100, y: height - 150, w: 40, h: 40, vy: 0, grounded: false };
  requestAnimationFrame(gameLoop);
}

function drawPlayer() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawEclipse() {
  eclipseX += 0.5;
  ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
  ctx.fillRect(0, 0, eclipseX, height);
  if (player.x < eclipseX) {
    gameOver = true;
  }
}

function generateObstacle() {
  if (Math.random() < 0.02) {
    obstacles.push({
      x: width,
      y: height - 100,
      w: 30 + Math.random() * 40,
      h: 30 + Math.random() * 40
    });
  }
}

function drawObstacles() {
  ctx.fillStyle = 'crimson';
  for (let obs of obstacles) {
    obs.x -= 4;
    ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

    // collision
    if (
      player.x < obs.x + obs.w &&
      player.x + player.w > obs.x &&
      player.y < obs.y + obs.h &&
      player.y + player.h > obs.y
    ) {
      gameOver = true;
    }
  }

  obstacles = obstacles.filter(o => o.x + o.w > 0);
}

function updatePlayer() {
  // Contrôle horizontal
  if (keys['ArrowRight'] || keys['KeyD']) {
    player.x += 6;
    if (player.x + player.w > width) player.x = width - player.w;
  }
  if (keys['ArrowLeft'] || keys['KeyA']) {
    player.x -= 6;
    if (player.x < 0) player.x = 0;
  }

  // Gravité verticale
  player.vy += 1.2;
  player.y += player.vy;

  // Collision sol
  if (player.y + player.h > height - 80) {
    player.y = height - 80 - player.h;
    player.vy = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  // Saut
  if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.grounded) {
    player.vy = -20;
  }
}

function drawGround() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, height - 80, width, 80);
}

function drawScore() {
  score += 1;
  document.getElementById('score').textContent = score;
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('shadow_highscore', highscore);
    document.getElementById('highscore').textContent = highscore;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  if (!gameOver) {
    drawGround();
    drawEclipse();
    generateObstacle();
    drawObstacles();
    updatePlayer();
    drawPlayer();
    drawScore();
    requestAnimationFrame(gameLoop);
  } else {
    document.getElementById('start-screen').style.display = 'flex';
  }
}

// Charger le meilleur score au lancement
highscore = localStorage.getItem('shadow_highscore') || 0;
document.getElementById('highscore').textContent = highscore;
