// ========================
// BOSS FIGHT MODULE
// ========================
// Integra o protótipo "boss-fight-grid" como Fase 4 de cada mundo.
// API pública:
//   startBossFight(worldIdx)  → inicia a luta
//   stopBossFight()           → encerra e libera listeners
//
// Ao vencer, chama window.onBossWin(worldIdx) — implementado no script.js
// Ao abortar, chama window.onBossAbort()       — implementado no script.js

(function(){
    "use strict";
    
    // ============================================================
    // DADOS DOS CHEFES POR MUNDO
    // ============================================================
    const BOSSES = [
      { name: "GOLEM DE PEDRA",       icon: "🗿", color: "#a16207", dmgPerHit: 100, hp: 300 },
      { name: "RAINHA DAS VINHAS",    icon: "🌺", color: "#16a34a", dmgPerHit: 100, hp: 300 },
      { name: "TITÃ CONGELADO",       icon: "❄️", color: "#22d3ee", dmgPerHit: 100, hp: 300 },
      { name: "GUARDIÃO DOS PORTÕES", icon: "🚪", color: "#f97316", dmgPerHit: 100, hp: 300 },
      { name: "SENHOR DO DUNGEON",    icon: "💀", color: "#ef4444", dmgPerHit: 100, hp: 400 },
    ];
    
    // ============================================================
    // CONFIG
    // ============================================================
    const CFG = {
      playerMaxHp: 100,
      dmgToPlayer: 20,
      idleTime: [2600, 4200],
      telegraphTime: 900,
      showStepSpeed: 520,
      respondBase: 4200,
      respondPerTile: 550,
      seqLenBase: [3, 4],
    };
    
    // ============================================================
    // GRID / LAYOUT
    // ============================================================
    const TILE = 64, COLS = 8, ROWS = 6;
    let canvas = null;
    let ctx = null;
    
    const PLAYER_HOME = { x: 1, y: 2 };
    const PUZZLE_TILES = [
      { x: 2, y: 1, color: 'accent' },
      { x: 2, y: 2, color: 'ice' },
      { x: 2, y: 3, color: 'vine2' },
      { x: 2, y: 4, color: 'gold' },
    ];
    const BOSS_ANCHOR = { x: 6, y: 2.5 };
    
    function getVar(name){
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }
    function colorHex() {
      return {
        accent: getVar('--accent') || '#e84040',
        ice:    getVar('--ice')    || '#22d3ee',
        vine2:  getVar('--vine2')  || '#4ade80',
        gold:   getVar('--gold')   || '#ffd700',
      };
    }
    function isWall(x, y) {
      return x <= 0 || y <= 0 || x >= COLS - 1 || y >= ROWS - 1;
    }
    function tileAt(x, y) {
      return PUZZLE_TILES.find(t => t.x === x && t.y === y) || null;
    }
    function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
    
    // ============================================================
    // ESTADO (recriado a cada luta)
    // ============================================================
    let state = null;
    let active = false;
    let rafId = null;
    
    function newState(worldIdx) {
      const boss = BOSSES[worldIdx] || BOSSES[0];
      return {
        worldIdx,
        boss,
        bossHp: boss.hp,
        bossMaxHp: boss.hp,
        playerHp: CFG.playerMaxHp,
        round: 1,
        phase: 'idle',
        player: { x: PLAYER_HOME.x, y: PLAYER_HOME.y, dir: 'baixo' },
        sequence: [],
        seqShowIndex: -1,
        playerProgress: 0,
        timers: [],
        respondDeadline: 0,
        respondTotal: 0,
        bossShake: 0,
        bossFlash: 0,
        playerFlash: 0,
        screenShake: 0,
        projectile: null,
        counterShot: null,
        gameOver: false,
        t: 0,
      };
    }
    
    function clearTimers() {
      if (!state) return;
      state.timers.forEach(id => clearTimeout(id));
      state.timers = [];
    }
    function after(ms, fn) {
      const id = setTimeout(fn, ms);
      if (state) state.timers.push(id);
      return id;
    }
    
    // ============================================================
    // DOM
    // ============================================================
    const $ = (id) => document.getElementById(id);
    
    function dom() {
      return {
        canvas:     $('boss-canvas'),
        bossBar:    $('boss-bar'),
        bossStatus: $('boss-status'),
        bossName:   $('boss-name'),
        playerBar:  $('boss-player-bar'),
        playerHpText: $('boss-player-hp-text'),
        roundCount: $('boss-round-count'),
        floatMsg:   $('boss-floating-msg'),
        timerWrap:  $('boss-timer-wrap'),
        timerFill:  $('boss-timer-fill'),
        winOverlay: $('boss-win-overlay'),
        loseOverlay:$('boss-lose-overlay'),
        winSub:     $('boss-win-sub'),
        loseSub:    $('boss-lose-sub'),
      };
    }
    
    function setMsg(text, cls, autoHideMs) {
      const d = dom();
      if (!d.floatMsg) return;
      d.floatMsg.textContent = text;
      d.floatMsg.className = 'boss-floating-msg show' + (cls ? ' ' + cls : '');
      if (autoHideMs) after(autoHideMs, () => d.floatMsg.classList.remove('show'));
    }
    function hideMsg() {
      const d = dom();
      if (d.floatMsg) d.floatMsg.classList.remove('show');
    }
    function updateBars() {
      if (!state) return;
      const d = dom();
      if (d.bossBar)   d.bossBar.style.width = Math.max(0, (state.bossHp / state.bossMaxHp) * 100) + '%';
      if (d.playerBar) d.playerBar.style.width = Math.max(0, (state.playerHp / CFG.playerMaxHp) * 100) + '%';
      if (d.playerHpText) d.playerHpText.textContent = Math.max(0, state.playerHp) + ' / ' + CFG.playerMaxHp;
      if (d.roundCount) d.roundCount.textContent = state.round;
    }
    
    // ============================================================
    // FLUXO DE COMBATE
    // ============================================================
    function scheduleIdle() {
      if (!state || state.gameOver) return;
      state.phase = 'idle';
      const d = dom();
      if (d.bossStatus) d.bossStatus.textContent = 'RECUPERANDO';
      hideMsg();
      if (d.timerWrap) d.timerWrap.classList.remove('show');
      state.player.x = PLAYER_HOME.x;
      state.player.y = PLAYER_HOME.y;
      state.player.dir = 'baixo';
      const wait = randInt(CFG.idleTime[0], CFG.idleTime[1]);
      after(wait, telegraph);
    }
    
    function telegraph() {
      if (!state || state.gameOver) return;
      state.phase = 'telegraph';
      const d = dom();
      if (d.bossStatus) d.bossStatus.textContent = 'PREPARANDO ATAQUE';
      setMsg(`${state.boss.name} está se preparando...`, 'alert');
      after(CFG.telegraphTime, showSequence);
    }
    
    function showSequence() {
      if (!state || state.gameOver) return;
      state.phase = 'showing';
      const d = dom();
      if (d.bossStatus) d.bossStatus.textContent = 'ATACANDO';
      const minLen = CFG.seqLenBase[0] + Math.floor((state.round - 1) / 2);
      const maxLen = CFG.seqLenBase[1] + Math.floor((state.round - 1) / 2);
      const len = randInt(minLen, Math.min(maxLen, 7));
      state.sequence = [];
      for (let i = 0; i < len; i++) state.sequence.push(randInt(0, 3));
      state.playerProgress = 0;
      setMsg('MEMORIZE A SEQUÊNCIA', 'alert');
    
      launchProjectile();
    
      let i = 0;
      function step() {
        if (!state || state.gameOver) return;
        if (i > 0) state.seqShowIndex = -1;
        if (i >= state.sequence.length) {
          state.seqShowIndex = -1;
          after(250, startInput);
          return;
        }
        state.seqShowIndex = state.sequence[i];
        i++;
        after(CFG.showStepSpeed, step);
      }
      after(400, step);
    }
    
    function launchProjectile() {
      const respondTime = CFG.respondBase + state.sequence.length * CFG.respondPerTile;
      const showTime = 400 + state.sequence.length * CFG.showStepSpeed + 250;
      const totalFlight = showTime + respondTime;
      const shapes = ['triangle', 'square', 'diamond', 'pentagon'];
      state.projectile = {
        shape: shapes[randInt(0, shapes.length - 1)],
        t0: performance.now(),
        t1: performance.now() + totalFlight,
        fromX: BOSS_ANCHOR.x, fromY: BOSS_ANCHOR.y,
        toX: PLAYER_HOME.x, toY: PLAYER_HOME.y,
        resolved: false,
      };
    }
    
    function startInput() {
      if (!state || state.gameOver) return;
      state.phase = 'input';
      const d = dom();
      if (d.bossStatus) d.bossStatus.textContent = 'CONTRA-ATAQUE!';
      setMsg('AGORA! PISE NOS BLOCOS!', 'alert');
      if (d.timerWrap) d.timerWrap.classList.add('show');
      const respondTime = CFG.respondBase + state.sequence.length * CFG.respondPerTile;
      state.respondDeadline = performance.now() + respondTime;
      state.respondTotal = respondTime;
    }
    
    function handleStep(x, y) {
      if (!state || state.phase !== 'input') return;
      if (isWall(x, y)) return;
      const sdx = x - state.player.x, sdy = y - state.player.y;
      const dx = Math.abs(sdx), dy = Math.abs(sdy);
      if (dx + dy !== 1) return;
      if (sdy < 0) state.player.dir = 'cima';
      else if (sdy > 0) state.player.dir = 'baixo';
      else if (sdx < 0) state.player.dir = 'esquerda';
      else if (sdx > 0) state.player.dir = 'direita';
      state.player.x = x;
      state.player.y = y;
    
      const tile = tileAt(x, y);
      if (!tile) return;
      const idx = PUZZLE_TILES.indexOf(tile);
      const expected = state.sequence[state.playerProgress];
      if (idx === expected) {
        state.playerProgress++;
        tile._flash = performance.now();
        if (state.playerProgress >= state.sequence.length) {
          resolveSuccess();
        }
      } else {
        tile._pass = performance.now();
      }
    }
    
    function tryMove(dx, dy) {
      if (!state || state.phase !== 'input') return;
      handleStep(state.player.x + dx, state.player.y + dy);
    }
    
    function onKeyDown(e) {
      if (!active || !state) return;
      const k = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(k)) tryMove(0, -1);
      else if (['arrowdown', 's'].includes(k)) tryMove(0, 1);
      else if (['arrowleft', 'a'].includes(k)) tryMove(-1, 0);
      else if (['arrowright', 'd'].includes(k)) tryMove(1, 0);
      else return;
      e.preventDefault();
    }
    
    function onCanvasClick(e) {
      if (!active || !state) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      const gx = Math.floor(mx / TILE), gy = Math.floor(my / TILE);
      handleStep(gx, gy);
    }
    
    function resolveSuccess() {
      if (!state) return;
      state.phase = 'resolved';
      const d = dom();
      if (d.timerWrap) d.timerWrap.classList.remove('show');
      setMsg('CONTRA-ATAQUE! ATAQUE CANCELADO!', 'success', 1100);
      state.bossHp = Math.max(0, state.bossHp - state.boss.dmgPerHit);
      state.bossFlash = performance.now();
      state.bossShake = performance.now();
      if (state.projectile) state.projectile.resolved = 'success';
      state.counterShot = {
        t0: performance.now(), t1: performance.now() + 450,
        fromX: state.player.x, fromY: state.player.y,
        toX: BOSS_ANCHOR.x, toY: BOSS_ANCHOR.y,
      };
      updateBars();
      if (state.bossHp <= 0) return endGame(true);
      state.round++;
      after(1300, scheduleIdle);
    }
    
    function resolveFail(reason) {
      if (!state) return;
      state.phase = 'resolved';
      const d = dom();
      if (d.timerWrap) d.timerWrap.classList.remove('show');
      const msg = reason === 'time' ? 'TEMPO ESGOTADO!' : 'SEQUÊNCIA ERRADA!';
      setMsg(msg + ' VOCÊ FOI ATINGIDO', 'alert', 1300);
      state.playerHp = Math.max(0, state.playerHp - CFG.dmgToPlayer);
      state.playerFlash = performance.now();
      state.screenShake = performance.now();
      if (state.projectile) state.projectile.resolved = 'fail';
      updateBars();
      if (state.playerHp <= 0) return endGame(false, reason);
      state.round++;
      after(1300, scheduleIdle);
    }
    
    function checkTimeout(now) {
      if (!state) return;
      if (state.phase === 'input') {
        const remaining = state.respondDeadline - now;
        const pct = Math.max(0, remaining / state.respondTotal) * 100;
        const d = dom();
        if (d.timerFill) d.timerFill.style.width = pct + '%';
        if (remaining <= 0) resolveFail('time');
      }
    }
    
    function endGame(playerWon, reason) {
      if (!state) return;
      state.gameOver = true;
      clearTimers();
      const d = dom();
      if (d.timerWrap) d.timerWrap.classList.remove('show');
      if (playerWon) {
        if (d.winSub) d.winSub.textContent = `Você derrotou ${state.boss.name}!`;
        if (d.winOverlay) d.winOverlay.classList.add('show');
      } else {
        if (d.loseSub) d.loseSub.textContent = reason === 'time'
          ? 'Você não conseguiu pisar na sequência a tempo.'
          : 'Você pisou no bloco errado.';
        if (d.loseOverlay) d.loseOverlay.classList.add('show');
      }
    }
    
    // ============================================================
    // RENDER
    // ============================================================
    function lerp(a, b, t) { return a + (b - a) * t; }
    
    function tileRand(x, y, i) {
      let s = (x * 92821 + y * 68917 + i * 104729) % 2147483647;
      if (s <= 0) s += 2147483646;
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    }
    
    function drawGrassTile(x, y, px, py) {
      const checker = (x + y) % 2 === 0;
      ctx.fillStyle = checker ? (getVar('--grass1') || '#3f7d32') : (getVar('--grass2') || '#4a9236');
      ctx.fillRect(px, py, TILE, TILE);
      ctx.save();
      ctx.globalAlpha = 0.10;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(px + TILE * (0.3 + tileRand(x, y, 9) * 0.3), py + TILE * (0.6 + tileRand(x, y, 10) * 0.2), TILE * 0.35, TILE * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      for (let i = 0; i < 6; i++) {
        const rx = tileRand(x, y, i * 3) * TILE;
        const ry = tileRand(x, y, i * 3 + 1) * TILE;
        const h = 4 + tileRand(x, y, i * 3 + 2) * 5;
        const lean = (tileRand(x, y, i * 7) - 0.5) * 4;
        ctx.strokeStyle = (i % 2 === 0) ? (getVar('--grass-blade') || '#2c5b24') : (getVar('--grass-blade2') || '#6ab84a');
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(px + rx, py + ry);
        ctx.lineTo(px + rx + lean, py + ry - h);
        ctx.stroke();
      }
    }
    
    function drawStoneWallTile(x, y, px, py) {
      ctx.fillStyle = getVar('--stone') || '#4b5148';
      ctx.fillRect(px, py, TILE, TILE);
      ctx.save();
      ctx.strokeStyle = getVar('--stone2') || '#5c635a';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 3, py + 3, TILE - 6, TILE - 6);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = getVar('--stone2') || '#5c635a';
      ctx.fillRect(px + 6, py + 6, TILE * 0.35, TILE * 0.35);
      ctx.restore();
    }
    
    function drawFloor() {
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const px = x * TILE, py = y * TILE;
          if (isWall(x, y)) drawStoneWallTile(x, y, px, py);
          else drawGrassTile(x, y, px, py);
        }
      }
    }
    
    function drawPuzzleTiles(now) {
      const colors = colorHex();
      PUZZLE_TILES.forEach((t, idx) => {
        const px = t.x * TILE, py = t.y * TILE;
        const base = colors[t.color];
        const lit = state.seqShowIndex === idx;
        const flashing = t._flash && now - t._flash < 300;
    
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = base;
        ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
        ctx.restore();
    
        ctx.strokeStyle = base;
        ctx.lineWidth = 3;
        ctx.strokeRect(px + 6, py + 6, TILE - 12, TILE - 12);
    
        if (lit || flashing) {
          ctx.save();
          ctx.shadowColor = base;
          ctx.shadowBlur = 22;
          ctx.globalAlpha = flashing ? 1 : 0.9;
          ctx.fillStyle = base;
          ctx.fillRect(px + 8, py + 8, TILE - 16, TILE - 16);
          ctx.restore();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '11px Orbitron, monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(String(idx + 1), px + TILE - 6, py + TILE - 4);
      });
    }
    
    function drawPlayer(now) {
      const p = state.player;
      const px = p.x * TILE + TILE / 2, py = p.y * TILE + TILE / 2;
      const bob = Math.sin(now / 260) * 2;
      const flashActive = state.playerFlash && now - state.playerFlash < 260;
      const shakeActive = state.screenShake && now - state.screenShake < 300;
    
      ctx.save();
      let ox = 0, oy = 0;
      if (shakeActive) {
        const k = 1 - ((now - state.screenShake) / 300);
        ox = (Math.random() - 0.5) * 8 * k;
        oy = (Math.random() - 0.5) * 8 * k;
      }
      ctx.translate(px + ox, py + bob + oy);
    
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 22, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    
      // Usa sprite do jogo se estiver carregado
      const img = (typeof playerSprites !== 'undefined' && playerSprites[p.dir]) ? playerSprites[p.dir] : null;
      const size = TILE * 0.92;
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.drawImage(img, -size / 2, -size + 8, size, size);
        if (flashActive) {
          ctx.globalCompositeOperation = 'source-atop';
          ctx.globalAlpha = 0.55;
          ctx.fillStyle = getVar('--accent') || '#e84040';
          ctx.fillRect(-size / 2, -size + 8, size, size);
        }
        ctx.restore();
      } else {
        // Fallback vetorial
        const grad = ctx.createRadialGradient(-5, -6, 2, 0, 0, 20);
        if (flashActive) { grad.addColorStop(0, '#fff'); grad.addColorStop(1, '#e84040'); }
        else { grad.addColorStop(0, '#ff8a8a'); grad.addColorStop(0.6, '#e84040'); grad.addColorStop(1, '#a02020'); }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-6, -4, 5, 0, Math.PI * 2);
        ctx.arc(6, -4, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1a0a0a';
        ctx.beginPath();
        ctx.arc(-5, -4, 3, 0, Math.PI * 2);
        ctx.arc(7, -4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    
    function drawBoss(now) {
      const ax = BOSS_ANCHOR.x * TILE, ay = BOSS_ANCHOR.y * TILE;
      const glowPhase = state.phase === 'telegraph' ? (Math.sin(now / 90) * 0.5 + 0.5) : 0.15;
      const flashActive = state.bossFlash && now - state.bossFlash < 250;
      const shakeActive = state.bossShake && now - state.bossShake < 350;
      const idleBob = Math.sin(now / 420) * 3;
    
      ctx.save();
      let ox = 0;
      if (shakeActive) { const k = 1 - ((now - state.bossShake) / 350); ox = Math.sin(now / 20) * 10 * k; }
      ctx.translate(ax + ox, ay + idleBob);
    
      // Plataforma
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 64, 70, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    
      // Aura de telegraph
      if (state.phase === 'telegraph') {
        ctx.save();
        ctx.globalAlpha = 0.25 + glowPhase * 0.35;
        ctx.fillStyle = state.boss.color;
        ctx.beginPath();
        ctx.arc(0, -10, 78, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    
      const scale = state.phase === 'telegraph' ? 1 + glowPhase * 0.06 : 1;
      ctx.scale(scale, scale);
    
      // Corpo
      const bodyColor = flashActive ? '#fff' : '#2a2035';
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(-55, 60); ctx.lineTo(-60, -10); ctx.lineTo(-38, -58);
      ctx.lineTo(38, -58); ctx.lineTo(60, -10); ctx.lineTo(55, 60);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = flashActive ? '#fff' : state.boss.color;
      ctx.lineWidth = 3;
      ctx.stroke();
    
      // Armadura central
      ctx.fillStyle = flashActive ? '#fdd' : '#3d2f4c';
      ctx.beginPath();
      ctx.moveTo(-30, 50); ctx.lineTo(-34, -6); ctx.lineTo(0, -30); ctx.lineTo(34, -6); ctx.lineTo(30, 50);
      ctx.closePath();
      ctx.fill();
    
      // Olhos
      const eyeGlow = flashActive ? '#fff' : (getVar('--gold') || '#ffd700');
      ctx.save();
      ctx.shadowColor = eyeGlow;
      ctx.shadowBlur = 10 + glowPhase * 14;
      ctx.fillStyle = eyeGlow;
      ctx.beginPath();
      ctx.ellipse(-14, -30, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(14, -30, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    
      // Chifres
      ctx.fillStyle = flashActive ? '#fff' : (getVar('--wall2') || '#4b5563');
      ctx.beginPath(); ctx.moveTo(-38, -58); ctx.lineTo(-52, -92); ctx.lineTo(-26, -62); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(38, -58); ctx.lineTo(52, -92); ctx.lineTo(26, -62); ctx.closePath(); ctx.fill();
    
      // Ícone do boss
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.boss.icon, 0, 20);
    
      ctx.restore();
    }
    
    function drawShape(c, shape, r, rot, color) {
      c.save();
      c.rotate(rot);
      c.fillStyle = color;
      c.shadowColor = color;
      c.shadowBlur = 16;
      c.beginPath();
      if (shape === 'square') {
        c.rect(-r, -r, r * 2, r * 2);
      } else if (shape === 'diamond') {
        c.moveTo(0, -r); c.lineTo(r, 0); c.lineTo(0, r); c.lineTo(-r, 0); c.closePath();
      } else if (shape === 'pentagon') {
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
          const px = Math.cos(a) * r, py = Math.sin(a) * r;
          if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.closePath();
      } else {
        c.moveTo(0, -r); c.lineTo(r * 0.87, r * 0.6); c.lineTo(-r * 0.87, r * 0.6); c.closePath();
      }
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = 'rgba(255,255,255,0.6)';
      c.stroke();
      c.restore();
    }
    
    function drawProjectile(now) {
      const p = state.projectile;
      if (!p) return;
      let t = (now - p.t0) / (p.t1 - p.t0);
    
      if (p.resolved === 'success') {
        t = Math.min(t, (state.bossFlash - p.t0) / (p.t1 - p.t0));
        const age = now - state.bossFlash;
        if (age > 350) { state.projectile = null; return; }
        const fade = 1 - age / 350;
        const x = lerp(p.fromX, p.toX, Math.max(0, Math.min(1, t))) * TILE;
        const y = lerp(p.fromY, p.toY, Math.max(0, Math.min(1, t))) * TILE;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(x, y);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.save();
          ctx.translate(Math.cos(a) * 14 * (1 - fade) * 3, Math.sin(a) * 14 * (1 - fade) * 3);
          drawShape(ctx, p.shape, 4, now / 200, getVar('--gold') || '#ffd700');
          ctx.restore();
        }
        ctx.restore();
        return;
      }
    
      if (p.resolved === 'fail') {
        const age = now - state.playerFlash;
        if (age > 300) { state.projectile = null; return; }
        const x = PLAYER_HOME.x * TILE + TILE / 2;
        const y = PLAYER_HOME.y * TILE + TILE / 2;
        const fade = 1 - age / 300;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 10 + (age / 300) * 40, 0, Math.PI * 2);
        ctx.strokeStyle = getVar('--accent') || '#e84040';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
        return;
      }
    
      if (t < 0 || t > 1) return;
      const x = lerp(p.fromX, p.toX, t) * TILE;
      const y = lerp(p.fromY, p.toY, t) * TILE;
    
      ctx.save();
      ctx.globalAlpha = 0.35;
      for (let i = 1; i <= 4; i++) {
        const tt = Math.max(0, t - i * 0.03);
        const tx = lerp(p.fromX, p.toX, tt) * TILE;
        const ty = lerp(p.fromY, p.toY, tt) * TILE;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.globalAlpha = 0.35 * (1 - i / 5);
        drawShape(ctx, p.shape, 7 - i, now / 300 + i, getVar('--accent2') || '#ff6b35');
        ctx.restore();
      }
      ctx.restore();
    
      ctx.save();
      ctx.translate(x, y);
      drawShape(ctx, p.shape, 13, now / 220, getVar('--accent') || '#e84040');
      ctx.restore();
    }
    
    function drawCounterShot(now) {
      const c = state.counterShot;
      if (!c) return;
      let t = (now - c.t0) / (c.t1 - c.t0);
      if (t > 1) { state.counterShot = null; return; }
      const x = lerp(c.fromX, c.toX, t) * TILE + TILE / 2;
      const y = lerp(c.fromY, c.toY, t) * TILE;
      ctx.save();
      ctx.translate(x, y);
      drawShape(ctx, 'diamond', 8, now / 150, getVar('--gold') || '#ffd700');
      ctx.restore();
    }
    
    function loop(now) {
      if (!active) return;
      if (!state) { rafId = requestAnimationFrame(loop); return; }
      state.t = now;
      checkTimeout(now);
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFloor();
      drawPuzzleTiles(now);
      drawBoss(now);
      drawPlayer(now);
      drawProjectile(now);
      drawCounterShot(now);
    
      rafId = requestAnimationFrame(loop);
    }
    
    // ============================================================
    // API PÚBLICA
    // ============================================================
    function startBossFight(worldIdx) {
      canvas = $('boss-canvas');
      if (!canvas) { console.error('boss-canvas não encontrado'); return; }
      ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
    
      // Reset overlays
      const d = dom();
      if (d.winOverlay)  d.winOverlay.classList.remove('show');
      if (d.loseOverlay) d.loseOverlay.classList.remove('show');
    
      state = newState(worldIdx);
      active = true;
    
      // Atualiza HUD do chefe
      if (d.bossName)   d.bossName.textContent = state.boss.name;
      if (d.bossStatus) d.bossStatus.textContent = 'AGUARDANDO';
      if (d.roundCount) d.roundCount.textContent = '1';
    
      updateBars();
    
      // Listeners
      window.addEventListener('keydown', onKeyDown);
      canvas.addEventListener('click', onCanvasClick);
    
      // Botões dos overlays são conectados uma única vez (em wireBossButtons)
      // mas garantimos que "próxima" e "abortar" chamem os callbacks corretos
      wireOverlayButtons();
    
      // Loop
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    
      // Inicia o fluxo
      after(700, scheduleIdle);
    }
    
    function stopBossFight() {
      active = false;
      clearTimers();
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      window.removeEventListener('keydown', onKeyDown);
      if (canvas) canvas.removeEventListener('click', onCanvasClick);
      state = null;
    }
    
    function wireOverlayButtons() {
      const d = dom();
      if (d.winOverlay) {
        const nextBtn = $('boss-win-next');
        const retryBtn = $('boss-win-retry');
        if (nextBtn) {
          nextBtn.onclick = () => {
            d.winOverlay.classList.remove('show');
            const wi = state ? state.worldIdx : 0;
            stopBossFight();
            if (typeof window.onBossWin === 'function') window.onBossWin(wi);
          };
        }
        if (retryBtn) {
          retryBtn.onclick = () => {
            d.winOverlay.classList.remove('show');
            const wi = state ? state.worldIdx : 0;
            stopBossFight();
            startBossFight(wi);
          };
        }
      }
      if (d.loseOverlay) {
        const retryBtn = $('boss-lose-retry');
        const backBtn = $('boss-lose-back');
        if (retryBtn) {
          retryBtn.onclick = () => {
            d.loseOverlay.classList.remove('show');
            const wi = state ? state.worldIdx : 0;
            stopBossFight();
            startBossFight(wi);
          };
        }
        if (backBtn) {
          backBtn.onclick = () => {
            d.loseOverlay.classList.remove('show');
            stopBossFight();
            if (typeof window.onBossAbort === 'function') window.onBossAbort();
          };
        }
      }
      // Botão voltar (canto superior)
      const backBtn = $('boss-back');
      if (backBtn && !backBtn._wired) {
        backBtn._wired = true;
        backBtn.addEventListener('click', () => {
          stopBossFight();
          if (typeof window.onBossAbort === 'function') window.onBossAbort();
        });
      }
    }
    
    // Expõe no escopo global
    window.startBossFight = startBossFight;
    window.stopBossFight = stopBossFight;
    
    })();