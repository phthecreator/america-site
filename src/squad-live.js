import './styles/globals.css';
import './styles/squad-live.css';

// --- CONSTANTS & CONFIG ---
const TILE_SIZE = 32;
const GRID_W = 30;
const GRID_H = 20;
const CANVAS_W = GRID_W * TILE_SIZE;
const CANVAS_H = GRID_H * TILE_SIZE;

const BG_IMG = new Image();
BG_IMG.src = 'office-bg.png';

const COLORS = {
  screenOn: '#00e5ff',
  desk: '#2a2a3e',
  deskTop: '#3a3a5e'
};

const AGENTS_CONFIG = [
  { id: 'frontend-dev', name: 'Stan', short: 'FD', color: '#1c2f8f', startPos: { x: 5, y: 14 }, deskPos: { x: 6, y: 13 }, accessory: 'stan_hat' },
  { id: 'ui-designer', name: 'Kyle', short: 'UD', color: '#28a745', startPos: { x: 10, y: 14 }, deskPos: { x: 12, y: 13 }, accessory: 'kyle_hat' },
  { id: 'data-extractor', name: 'Cartman', short: 'DE', color: '#e03a3e', startPos: { x: 15, y: 14 }, deskPos: { x: 18, y: 13 }, accessory: 'cartman_hat' },
  { id: 'qa-tester', name: 'Kenny', short: 'QA', color: '#ef6c00', startPos: { x: 20, y: 14 }, deskPos: { x: 24, y: 13 }, accessory: 'kenny_hood' }
];

// --- ENGINE STATE ---
const canvas = document.getElementById('office-canvas');
const ctx = canvas.getContext('2d');
const hudLayer = document.getElementById('hud-layer');
canvas.width = CANVAS_W; canvas.height = CANVAS_H;

let isPaused = false;
let speedMultiplier = 1;
let tasks = [];
let agents = [];
let grid = [];
let lastTime = 0;
let stats = { bugs: 0, coffee: 0, done: 0 };
let frameId = null;
let isPolling = false;
let pollInterval = null;
let lastFetchTime = null;

// --- LOCATIONS FOR SIMULATION ---
const LOCATIONS = {
  coffee: { x: 2, y: 2 },
  meeting: { x: 15, y: 5 },
  manager: { x: 28, y: 3 }
};

// --- DATA FETCHING & POLLING ---
async function fetchTasks() {
  try {
    const response = await fetch(`/squad-tasks.json?t=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (e) {
    console.warn('Failed to fetch tasks:', e.message);
    return null;
  }
}

function startPolling() {
  if (isPolling) return;
  isPolling = true;
  updatePollingUI();

  pollInterval = setInterval(async () => {
    const data = await fetchTasks();
    if (data && data.timestamp !== lastFetchTime) {
      lastFetchTime = data.timestamp;
      updateTasksFromData(data.tasks);
      createSpeechBubble(agents[Math.floor(Math.random() * agents.length)], '📊 Data synced!');
    }
  }, 5000);
}

function stopPolling() {
  if (!isPolling) return;
  isPolling = false;
  clearInterval(pollInterval);
  updatePollingUI();
}

function togglePolling() {
  if (isPolling) {
    stopPolling();
  } else {
    startPolling();
  }
}

function updatePollingUI() {
  const icon = document.getElementById('polling-icon');
  const text = document.getElementById('polling-text');
  if (icon) icon.textContent = isPolling ? '🟢' : '🔴';
  if (text) text.textContent = isPolling ? 'Updates: ON' : 'Updates: OFF';
}

function updateTasksFromData(newTasks) {
  tasks = newTasks.map(task => ({
    id: task.id,
    agentId: task.agentId,
    name: task.name,
    status: task.status,
    progress: task.progress,
    maxProgress: task.maxProgress,
    duration: task.duration || 1000
  }));
  renderKanban();
  updateMetrics();
}

// --- INITIALIZATION ---
function init() {
  grid = [];
  for (let y = 0; y < GRID_H; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_W; x++) {
      const isFloor = (x > 3 && x < 26 && y > 3 && y < 16);
      grid[y][x] = isFloor ? 0 : 1;
    }
  }

  const obstacles = [{ x: 5, y: 12 }, { x: 23, y: 12 }, { x: 25, y: 10 }, { x: 25, y: 11 }, { x: 25, y: 12 }];
  obstacles.forEach(p => { if (grid[p.y]) grid[p.y][p.x] = 1; });

  agents = AGENTS_CONFIG.map(config => new Agent(config));
  lastTime = performance.now();
  if (!frameId) frameId = requestAnimationFrame(gameLoop);
}

async function initWithData() {
  const data = await fetchTasks();
  if (data) {
    lastFetchTime = data.timestamp;
    updateTasksFromData(data.tasks);
    startPolling();
  }
  init();
}

// --- CLASSES ---
class Agent {
  constructor(config) {
    this.config = config;
    this.id = config.id;
    this.x = config.startPos.x;
    this.y = config.startPos.y;
    this.state = 'IDLE';
    this.path = [];
    this.timer = 0;
    this.currentTask = null;
    this.frameInfo = { timer: 0 };
    this.nextState = null;
  }

  update(dt) {
    switch (this.state) {
      case 'IDLE': this.handleIdle(); break;
      case 'WALKING': this.handleWalking(dt); break;
      case 'WORKING': this.handleWorking(dt); break;
      case 'REVIEWING': this.handleReviewing(dt); break;
      case 'CELEBRATING': this.timer += dt; if (this.timer > 1.5) this.state = 'IDLE'; break;
    }
  }

  handleIdle() {
    if (!this.currentTask) {
      const task = tasks.find(t => t.agentId === this.id && t.status === 'backlog');
      if (task) {
        this.currentTask = task;
        updateTaskStatus(task.id, 'in-progress');
        createSpeechBubble(this, 'Task picked!');
        this.moveTo(this.config.deskPos.x, this.config.deskPos.y + 1, 'WORKING');
      } else if (Math.random() < 0.002) {
        this.moveTo(LOCATIONS.coffee.x, LOCATIONS.coffee.y, 'IDLE');
        createSpeechBubble(this, 'Coffee break...');
        stats.coffee++;
        updateMetrics();
      }
    } else if (this.currentTask.status === 'in-progress') {
      this.state = 'WORKING';
    }
  }

  handleWalking(dt) {
    if (this.path.length === 0) {
      this.state = this.nextState || 'IDLE';
      return;
    }
    const next = this.path[0];
    const dx = next.x - this.x, dy = next.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = 5 * dt;

    if (dist <= speed) {
      this.x = next.x;
      this.y = next.y;
      this.path.shift();
    } else {
      this.x += (dx / dist) * speed;
      this.y += (dy / dist) * speed;
    }
    this.frameInfo.timer += dt;
  }

  handleWorking(dt) {
    if (!this.currentTask) {
      this.state = 'IDLE';
      return;
    }
    this.currentTask.progress += (200 * dt);
    updateTaskCard(this.currentTask.id);
    if (Math.random() < 0.005) {
      createSpeechBubble(this, ['Typing...', 'Fixing bug...', 'Almost done!'][Math.floor(Math.random() * 3)]);
    }

    if (this.currentTask.progress >= this.currentTask.maxProgress) {
      this.currentTask.progress = this.currentTask.maxProgress;
      const qa = agents.find(a => a.id === 'qa-tester');
      this.moveTo(qa.x, qa.y + 1, 'REVIEWING');
      createSpeechBubble(this, 'Review please!');
    }
  }

  handleReviewing(dt) {
    this.timer += dt;
    if (this.timer > 2.0) {
      if (Math.random() > 0.2) {
        updateTaskStatus(this.currentTask.id, 'done');
        this.currentTask = null;
        this.state = 'CELEBRATING';
        this.timer = 0;
        stats.done++;
        updateMetrics();
      } else {
        updateTaskStatus(this.currentTask.id, 'backlog');
        this.currentTask.progress = 0;
        this.currentTask = null;
        this.state = 'IDLE';
        stats.bugs++;
        updateMetrics();
        createSpeechBubble(this, 'Oops, a bug!');
      }
    }
  }

  moveTo(tx, ty, next) {
    const path = findPath({ x: Math.round(this.x), y: Math.round(this.y) }, { x: tx, y: ty });
    if (path) {
      this.path = path;
      this.state = 'WALKING';
      this.nextState = next;
    }
  }

  draw() {
    drawAgent(this);
  }
}

// --- RENDERERS ---
function drawAgent(a) {
  const px = a.x * TILE_SIZE, py = a.y * TILE_SIZE;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(px + 16, py + 30, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  let b = 0;
  let angle = 0;
  if (a.state === 'WALKING') {
    b = Math.abs(Math.sin(a.frameInfo.timer * 15)) * 4;
    angle = Math.sin(a.frameInfo.timer * 15) * 0.1;
  }
  if (a.state === 'CELEBRATING') b = Math.abs(Math.sin(a.timer * 20)) * 12;

  ctx.save();
  ctx.translate(px + 16, py + 32);
  ctx.rotate(angle);
  ctx.translate(-(px + 16), -(py + 32));

  ctx.fillStyle = (a.config.accessory === 'kenny_hood') ? '#ef6c00' : a.config.color;
  ctx.beginPath();
  ctx.roundRect(px + 6, py + 14 - b, 20, 18, 5);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.fillRect(px + 15, py + 18 - b, 2, 2);
  ctx.fillRect(px + 15, py + 24 - b, 2, 2);

  ctx.fillStyle = (a.config.accessory === 'kenny_hood') ? '#5d4037' : '#f44336';
  if (a.config.id === 'ui-designer') ctx.fillStyle = '#1b5e20';
  ctx.beginPath();
  ctx.arc(px + 5, py + 26 - b, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 27, py + 26 - b, 4, 0, Math.PI * 2);
  ctx.fill();

  if (a.config.accessory === 'kenny_hood') {
    ctx.fillStyle = '#ef6c00';
    ctx.beginPath();
    ctx.arc(px + 16, py + 12 - b, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.arc(px + 16, py + 12 - b, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f5d1b5';
  let faceSize = (a.config.accessory === 'kenny_hood') ? 7 : 11;
  ctx.beginPath();
  ctx.arc(px + 16, py + 12 - b, faceSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(px + 12, py + 11 - b, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 20, py + 11 - b, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(px + 12, py + 11 - b, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 20, py + 11 - b, 1, 0, Math.PI * 2);
  ctx.fill();

  if (a.config.accessory === 'stan_hat') {
    ctx.fillStyle = '#1c2f8f';
    ctx.beginPath();
    ctx.arc(px + 16, py + 6 - b, 12, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#f44336';
    ctx.fillRect(px + 4, py + 4 - b, 24, 3);
    ctx.beginPath();
    ctx.arc(px + 16, py + 1 - b, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (a.config.accessory === 'kyle_hat') {
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(px + 4, py - 2 - b, 24, 10);
    ctx.fillRect(px + 2, py + 4 - b, 6, 12);
    ctx.fillRect(px + 24, py + 4 - b, 6, 12);
  } else if (a.config.accessory === 'cartman_hat') {
    ctx.fillStyle = '#00bcd4';
    ctx.beginPath();
    ctx.arc(px + 16, py + 6 - b, 13, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(px + 16, py + 1 - b, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawWorld() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  if (BG_IMG.complete) ctx.drawImage(BG_IMG, 0, 0, CANVAS_W, CANVAS_H);

  AGENTS_CONFIG.forEach(agt => {
    const dx = agt.deskPos.x * TILE_SIZE, dy = agt.deskPos.y * TILE_SIZE;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
    ctx.fillStyle = 'rgba(42, 42, 62, 0.8)';
    ctx.beginPath();
    ctx.roundRect(dx, dy + 8, 36, 12, 4);
    ctx.fill();
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(dx + 10, dy, 16, 10);
    const ag = agents.find(a => a.id === agt.id);
    if (ag && ag.state === 'WORKING') {
      ctx.beginPath();
      ctx.moveTo(dx + 10, dy);
      ctx.lineTo(dx + 5, dy + 20);
      ctx.lineTo(dx + 31, dy + 20);
      ctx.lineTo(dx + 26, dy);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
      ctx.fill();
      ctx.fillStyle = COLORS.screenOn;
    } else ctx.fillStyle = '#333';
    ctx.fillRect(dx + 11, dy + 1, 14, 8);
    ctx.shadowBlur = 0;
  });

  const grad = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, 200, CANVAS_W / 2, CANVAS_H / 2, 600);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// --- CORE LOGIC ---
function findPath(s, e) {
  const q = [{ ...s, p: [] }], vis = new Set([`${s.x},${s.y}`]);
  while (q.length > 0) {
    const cur = q.shift();
    if (cur.x === e.x && cur.y === e.y) return cur.p;
    [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }].forEach(d => {
      const n = { x: cur.x + d.x, y: cur.y + d.y };
      const k = `${n.x},${n.y}`;
      if (n.x >= 0 && n.x < GRID_W && n.y >= 0 && n.y < GRID_H && !vis.has(k) && (grid[n.y][n.x] === 0 || (n.x === e.x && n.y === e.y))) {
        vis.add(k);
        q.push({ ...n, p: [...cur.p, n] });
      }
    });
  }
  return null;
}

function gameLoop(time) {
  if (!isPaused) {
    const dt = (time - lastTime) / 1000 * speedMultiplier;
    agents.forEach(a => a.update(dt));
    drawWorld();
    agents.forEach(a => a.draw());
  }
  lastTime = time;
  frameId = requestAnimationFrame(gameLoop);
}

// --- UI HELPERS ---
function renderKanban() {
  ['backlog', 'in-progress', 'review', 'done'].forEach(s => {
    const list = document.getElementById(`list-${s}`);
    if (!list) return;
    list.innerHTML = '';
    const colTasks = tasks.filter(t => t.status === s);
    const countEl = document.getElementById(`count-${s}`);
    if (countEl) countEl.textContent = colTasks.length;
    colTasks.forEach(t => {
      const ag = AGENTS_CONFIG.find(a => a.id === t.agentId);
      const card = document.createElement('div');
      card.className = 'task-card';
      card.id = `card-${t.id}`;
      card.innerHTML = `<div class="task-header"><span class="agent-badge" style="background:${ag.color}">${ag.short}</span><span class="task-id">#${t.id}</span></div>
        <div class="task-title">${t.name}</div><div class="task-progress"><div class="progress-bar" style="width:${(t.progress / t.maxProgress) * 100}%"></div></div>`;
      list.appendChild(card);
    });
  });
  const done = tasks.filter(t => t.status === 'done').length;
  const sprintEl = document.getElementById('sprint-progress');
  const doneEl = document.getElementById('tasks-done');
  if (sprintEl) sprintEl.textContent = Math.floor((done / tasks.length) * 100) + '%';
  if (doneEl) doneEl.textContent = `${done}/${tasks.length}`;
}

function updateTaskStatus(id, s) {
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.status = s;
    renderKanban();
  }
}

function updateTaskCard(id) {
  const t = tasks.find(x => x.id === id);
  const card = document.getElementById(`card-${id}`);
  if (card && t) {
    card.querySelector('.progress-bar').style.width = `${(t.progress / t.maxProgress) * 100}%`;
  }
}

function updateMetrics() {
  const bugsEl = document.getElementById('bugs-found');
  const coffeeEl = document.getElementById('coffee-count');
  if (bugsEl) bugsEl.textContent = `${stats.bugs} 🐛`;
  if (coffeeEl) coffeeEl.textContent = `${stats.coffee} ☕`;
}

function createSpeechBubble(a, txt) {
  if (Array.isArray(txt)) txt = txt[Math.floor(Math.random() * txt.length)];
  const b = document.createElement('div');
  b.className = 'speech-bubble';
  b.textContent = txt;
  b.style.left = (a.x * TILE_SIZE + 16) + 'px';
  b.style.top = (a.y * TILE_SIZE - 10) + 'px';
  b.style.transform = 'translate(-50%, -100%)';
  hudLayer.appendChild(b);
  setTimeout(() => b.remove(), 2000);
}

// --- BUTTON HANDLERS ---
function togglePause() {
  isPaused = !isPaused;
  const btn = document.querySelector('button');
  if (btn) btn.innerHTML = isPaused ? '▶️ Play' : '⏸️ Pause';
}

function changeSpeed() {
  if (speedMultiplier === 1) speedMultiplier = 2;
  else if (speedMultiplier === 2) speedMultiplier = 4;
  else speedMultiplier = 1;

  const btn = document.getElementById('speed-btn');
  if (btn) btn.innerHTML = `⏩ Speed: ${speedMultiplier}x`;
}

function restart() {
  tasks.forEach(t => {
    t.status = 'backlog';
    t.progress = 0;
  });
  stats = { bugs: 0, coffee: 0, done: 0 };
  agents.forEach(a => {
    a.state = 'IDLE';
    a.currentTask = null;
    a.path = [];
    a.x = a.config.startPos.x;
    a.y = a.config.startPos.y;
  });
  renderKanban();
  updateMetrics();
  if (isPaused) togglePause();
}

function addRandomBug() {
  stats.bugs++;
  updateMetrics();
  const victim = agents[Math.floor(Math.random() * agents.length)];
  createSpeechBubble(victim, '🐛 BUG!');
}

// --- INITIALIZE ---
initWithData();

// Expose functions to window for HTML onclick handlers
window.togglePause = togglePause;
window.changeSpeed = changeSpeed;
window.togglePolling = togglePolling;
window.restart = restart;
window.addRandomBug = addRandomBug;
