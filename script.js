(() => {
  'use strict';

  // --- DOM helpers
  const $ = sel => document.querySelector(sel);
  const scoreEl = $('#score'), hiscoreEl = $('#hiscore'), speedvEl = $('#speedv');
  const cvs = $('#game'), wrap = $('#canvaswrap');
  const btnStart = $('#btnStart'), btnPause = $('#btnPause'), btnReset = $('#btnReset');
  const selMode = $('#mode'), selGrid = $('#grid'), selSpeed = $('#speed');
  const btnInstall = $('#btnInstall');
  const pad = { up: document.querySelector('.pad .up'),
                down: document.querySelector('.pad .down'),
                left: document.querySelector('.pad .left'),
                right: document.querySelector('.pad .right') };

  // --- State
  let grid = 20;
  let cell = 30;
  let rows = grid, cols = grid;
  let snake, dir, nextDir, apple, score, hiscore, running = false, paused = false;
  let wrapMode = false;
  let speed = 8; // ticks per second initial
  let tickMs = 1000 / speed;
  let acc = 0, lastTs = 0;
  let deferredPrompt = null;

  // --- Resize canvas to fit container while keeping cells squared
  function resize() {
    const rect = wrap.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, rect.height));
    cvs.width = size;
    cvs.height = size;
    cell = Math.floor(size / grid);
    // keep whole cells
    cvs.width = cell * grid;
    cvs.height = cell * grid;
  }
  window.addEventListener('resize', resize, {passive:true});

  // --- Game setup
  function newGame() {
    grid = parseInt(selGrid.value, 10);
    rows = cols = grid;
    wrapMode = selMode.value === 'wrap';
    speed = parseInt(selSpeed.value, 10);
    tickMs = 1000 / speed;
    speedvEl.textContent = (speed/8).toFixed(2).replace(/\.00$/, '') + 'x';
    resize();
    snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
    dir = {x:1,y:0};
    nextDir = {x:1,y:0};
    score = 0;
    scoreEl.textContent = '0';
    spawnApple();
    paused = false;
    updateHiscoreDisplay();
    draw(); // draw initial state
  }

  function updateHiscoreDisplay() {
    try {
      hiscore = parseInt(localStorage.getItem('snake_hiscore') || '0', 10);
    } catch(_) { hiscore = 0; }
    hiscoreEl.textContent = String(hiscore);
  }
  function saveHiscore() {
    if(score > hiscore) {
      hiscore = score;
      try { localStorage.setItem('snake_hiscore', String(hiscore)); } catch(_){}
      updateHiscoreDisplay();
    }
  }

  function spawnApple() {
    let ok = false;
    while(!ok){
      apple = { x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows) };
      ok = !snake.some(s => s.x===apple.x && s.y===apple.y);
    }
  }

  function setDir(nx, ny){
    // prevent reversing directly
    if((nx === -dir.x && ny === -dir.y) || (nx === dir.x && ny === dir.y)) return;
    nextDir = {x:nx, y:ny};
  }

  // --- Input
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if(k === 'arrowup' || k === 'w') setDir(0,-1);
    else if(k === 'arrowdown' || k === 's') setDir(0,1);
    else if(k === 'arrowleft' || k === 'a') setDir(-1,0);
    else if(k === 'arrowright' || k === 'd') setDir(1,0);
    else if(k === ' '){ togglePause(); }
  });

  // Touch swipe
  let touchStart = null;
  cvs.addEventListener('touchstart', e => {
    const t = e.changedTouches[0];
    touchStart = {x:t.clientX, y:t.clientY, t: Date.now()};
  }, {passive:true});
  cvs.addEventListener('touchend', e => {
    if(!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    if(Math.max(adx, ady) > 24){
      if(adx > ady) setDir(dx>0?1:-1,0);
      else setDir(0, dy>0?1:-1);
    }
    touchStart = null;
  }, {passive:true});

  // Pad buttons
  pad.up.addEventListener('click', () => setDir(0,-1));
  pad.down.addEventListener('click', () => setDir(0,1));
  pad.left.addEventListener('click', () => setDir(-1,0));
  pad.right.addEventListener('click', () => setDir(1,0));

  btnStart.addEventListener('click', start);
  btnPause.addEventListener('click', togglePause);
  btnReset.addEventListener('click', () => { newGame(); running=false; lastTs=0; acc=0; draw(); });

  // PWA install
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btnInstall.style.display = 'inline-block';
  });
  btnInstall.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btnInstall.style.display = 'none';
  });

  // --- Loop
  function start(){
    if(!running){ running = true; paused=false; lastTs=performance.now(); acc = 0; requestAnimationFrame(loop); }
  }
  function togglePause(){
    if(!running) return;
    paused = !paused;
    if(!paused) { lastTs = performance.now(); requestAnimationFrame(loop); }
  }

  function loop(ts){
    if(!running) return;
    if(paused){ drawPause(); return; }
    const dt = ts - lastTs; lastTs = ts; acc += dt;
    while(acc >= tickMs){
      step();
      acc -= tickMs;
    }
    draw();
    requestAnimationFrame(loop);
  }

  function step(){
    // apply buffered direction
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // wrapping or walls
    if(wrapMode){
      head.x = (head.x + cols) % cols;
      head.y = (head.y + rows) % rows;
    } else {
      if(head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows){
        gameOver(); return;
      }
    }
    // self collision: compare head with the rest of the body only
    if (snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
      gameOver(); return;
    }
    snake.unshift(head);
    // apple
    if(head.x === apple.x && head.y === apple.y){
      score += 1;
      scoreEl.textContent = String(score);
      // slight speed up every 4 apples
      if(score % 4 === 0){
        speed = Math.min(18, speed+1);
        tickMs = 1000 / speed;
        speedvEl.textContent = (speed/8).toFixed(2).replace(/\.00$/, '') + 'x';
      }
      spawnApple();
    } else {
      snake.pop();
    }
  }

  // --- Drawing
  const ctx = cvs.getContext('2d');
  function drawGrid(){
    const s = cell;
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for(let x=0;x<=cols;x++){
      ctx.beginPath(); ctx.moveTo(x*s+0.5,0); ctx.lineTo(x*s+0.5,rows*s); ctx.stroke();
    }
    for(let y=0;y<=rows;y++){
      ctx.beginPath(); ctx.moveTo(0,y*s+0.5); ctx.lineTo(cols*s,y*s+0.5); ctx.stroke();
    }
  }
  function draw(){
    const s = cell;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0,0,cvs.width,cvs.height);
    // grid (subtle)
    drawGrid();
    // apple
    ctx.fillStyle = '#ef4444';
    roundRect(ctx, apple.x*s+2, apple.y*s+2, s-4, s-4, 6, true);
    // snake
    for(let i=snake.length-1;i>=0;i--){
      const seg = snake[i];
      const alpha = Math.max(.5, 1 - i / (snake.length*1.2));
      ctx.fillStyle = `rgba(34,197,94,${alpha.toFixed(3)})`;
      roundRect(ctx, seg.x*s+1, seg.y*s+1, s-2, s-2, 8, true);
    }
    if(!running){
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.font = Math.floor(s*1.2) + 'px system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Premi ▶︎ Avvia', cvs.width/2, cvs.height/2);
    }
  }
  function drawPause(){
    draw();
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.fillStyle = 'white';
    ctx.font = Math.floor(cell*1.1) + 'px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('In Pausa', cvs.width/2, cvs.height/2);
  }

  function roundRect(ctx, x, y, w, h, r, fill){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    if(fill) ctx.fill();
    else ctx.stroke();
  }

  function gameOver(){
    running = false;
    saveHiscore();
    // flash
    const s = cell;
    ctx.fillStyle = 'rgba(239,68,68,.2)';
    ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = Math.floor(s*1.2) + 'px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', cvs.width/2, cvs.height/2);
  }

  // Init
  newGame();

})();