let n = 16;
let speedMs = [600, 350, 180, 80, 20];
let speedNames = ['Slow', 'Moderate', 'Normal', 'Fast', 'Very fast'];
let speedIdx = 2;

let bfState = null;
let dcState = null;
let bfTimer = null;
let dcTimer = null;
let bfDone = false;
let dcDone = false;

const nSlider = document.getElementById('nSlider');
const speedSlider = document.getElementById('speedSlider');

nSlider.oninput = () => {
  n = parseInt(nSlider.value);
  document.getElementById('nVal').textContent = n;
  resetAll();
};

speedSlider.oninput = () => {
  speedIdx = parseInt(speedSlider.value) - 1;
  document.getElementById('speedLabel').textContent = speedNames[speedIdx];
};

function makeLockersHTML(containerId, count) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const d = document.createElement('div');
    d.className = 'locker closed';
    d.id = containerId + '_l' + i;
    d.innerHTML = '<i class="ti ti-lock" style="font-size:13px" aria-hidden="true"></i><span class="locker-num">' + i + '</span>';
    el.appendChild(d);
  }
}

function setLocker(containerId, idx, state) {
  const el = document.getElementById(containerId + '_l' + idx);
  if (!el) return;
  el.className = 'locker ' + state;
  if (state === 'open') {
    el.innerHTML = '<i class="ti ti-lock-open" style="font-size:13px" aria-hidden="true"></i><span class="locker-num">' + idx + '</span>';
  } else if (state === 'closed') {
    el.innerHTML = '<i class="ti ti-lock" style="font-size:13px" aria-hidden="true"></i><span class="locker-num">' + idx + '</span>';
  } else {
    el.innerHTML = '<i class="ti ti-arrows-exchange" style="font-size:13px" aria-hidden="true"></i><span class="locker-num">' + idx + '</span>';
  }
}

function resetAll() {
  clearTimeout(bfTimer);
  clearTimeout(dcTimer);
  bfDone = false;
  dcDone = false;

  bfState = { doors: new Array(n + 1).fill(false), pass: 0, j: 0, toggles: 0, open: 0, phase: 'idle' };
  dcState = { doors: new Array(n + 1).fill(false), l: 0, checks: 0, open: 0, phase: 'idle', lastSquare: 0 };

  makeLockersHTML('bfLockers', n);
  makeLockersHTML('dcLockers', n);

  document.getElementById('bfPass').textContent = '0';
  document.getElementById('bfToggles').textContent = '0';
  document.getElementById('bfOpen').textContent = '0';
  document.getElementById('bfPassInfo').textContent = 'Ready - press Run or Step';
  document.getElementById('bfProgress').style.width = '0%';
  document.getElementById('bfResult').style.display = 'none';

  document.getElementById('dcStep').textContent = '0';
  document.getElementById('dcChecks').textContent = '0';
  document.getElementById('dcOpen').textContent = '0';
  document.getElementById('dcPassInfo').textContent = 'Ready - press Run or Step';
  document.getElementById('dcProgress').style.width = '0%';
  document.getElementById('dcResult').style.display = 'none';

  document.getElementById('bfN').textContent = n;
  document.getElementById('dcN').textContent = n;
  document.getElementById('bfActual').textContent = '-';
  document.getElementById('dcActual').textContent = '-';

  document.getElementById('runBtn').innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Run both';
  document.getElementById('runBtn').className = 'btn primary';
}

function bfCountOpen(doors) {
  let c = 0;
  for (let i = 1; i <= n; i++) if (doors[i]) c++;
  return c;
}

function getOpenDoorPositions(doors) {
  const positions = [];
  for (let i = 1; i <= n; i++) {
    if (doors[i]) positions.push(i);
  }
  return positions;
}

function stepBF() {
  if (bfDone) return;
  const s = bfState;

  if (s.phase === 'idle') {
    s.pass = 1;
    s.j = 1;
    s.phase = 'toggling';
  }

  if (s.phase === 'toggling') {
    if (s.pass > n) {
      finishBF();
      return;
    }

    if (s.j <= n) {
      s.doors[s.j] = !s.doors[s.j];
      s.toggles++;
      setLocker('bfLockers', s.j, 'toggled');
      setTimeout(() => {
        if (s.doors[s.j]) setLocker('bfLockers', s.j, 'open');
        else setLocker('bfLockers', s.j, 'closed');
      }, speedMs[speedIdx] * 0.6);
      s.j += s.pass;
    }

    if (s.j > n) {
      s.open = bfCountOpen(s.doors);
      document.getElementById('bfPass').textContent = s.pass;
      document.getElementById('bfToggles').textContent = s.toggles;
      document.getElementById('bfOpen').textContent = s.open;
      document.getElementById('bfProgress').style.width = Math.round((s.pass / n) * 100) + '%';
      document.getElementById('bfPassInfo').textContent = 'Pass ' + s.pass + ' of ' + n + ' complete';
      s.pass++;
      s.j = s.pass;
      if (s.pass > n) {
        finishBF();
        return;
      }
    } else {
      document.getElementById('bfPassInfo').textContent = 'Pass ' + s.pass + ': toggling locker ' + (s.j - s.pass);
    }
  }
}

function finishBF() {
  bfDone = true;
  const open = bfCountOpen(bfState.doors);
  const positions = getOpenDoorPositions(bfState.doors);
  document.getElementById('bfPass').textContent = n;
  document.getElementById('bfOpen').textContent = open;
  document.getElementById('bfProgress').style.width = '100%';
  document.getElementById('bfPassInfo').textContent = 'Done! All ' + n + ' passes complete.';
  document.getElementById('bfActual').textContent = bfState.toggles;
  const r = document.getElementById('bfResult');
  r.style.display = 'block';
  r.textContent = open + ' locker(s) open: positions ' + positions.join(', ');
  checkBothDone();
}

function stepDC() {
  if (dcDone) return;
  const s = dcState;

  if (s.phase === 'idle') {
    s.l = 1;
    s.phase = 'stepping';
  }

  if (s.phase === 'stepping') {
    if (s.l * s.l > n) {
      finishDC();
      return;
    }
    const sq = s.l * s.l;
    s.doors[sq] = true;
    s.checks++;
    s.open++;
    s.lastSquare = sq;
    setLocker('dcLockers', sq, 'toggled');
    setTimeout(() => setLocker('dcLockers', sq, 'open'), speedMs[speedIdx] * 0.6);
    document.getElementById('dcStep').textContent = s.l;
    document.getElementById('dcChecks').textContent = s.checks;
    document.getElementById('dcOpen').textContent = s.open;
    document.getElementById('dcProgress').style.width = Math.round((s.l / Math.floor(Math.sqrt(n))) * 100) + '%';
    document.getElementById('dcPassInfo').textContent = 'l = ' + s.l + ' -> position ' + sq + ' is open (perfect square)';
    s.l++;
    if (s.l * s.l > n) {
      setTimeout(finishDC, speedMs[speedIdx]);
    }
  }
}

function finishDC() {
  dcDone = true;
  document.getElementById('dcProgress').style.width = '100%';
  document.getElementById('dcPassInfo').textContent = 'Done! All perfect squares found.';
  document.getElementById('dcActual').textContent = dcState.checks;
  const r = document.getElementById('dcResult');
  r.style.display = 'block';
  r.textContent = dcState.open + ' locker(s) open: positions ' + getOpenDoorPositions(dcState.doors).join(', ');
  checkBothDone();
}

function getPerfectSquares(n) {
  const res = [];
  for (let l = 1; l * l <= n; l++) res.push(l * l);
  return res;
}

function checkBothDone() {
  if (bfDone && dcDone) {
    document.getElementById('runBtn').innerHTML = '<i class="ti ti-check" aria-hidden="true"></i> Complete';
    document.getElementById('runBtn').className = 'btn';
  }
}

function runBFLoop() {
  if (bfDone) return;
  stepBF();
  bfTimer = setTimeout(runBFLoop, speedMs[speedIdx]);
}

function runDCLoop() {
  if (dcDone) return;
  stepDC();
  dcTimer = setTimeout(runDCLoop, speedMs[speedIdx]);
}

let running = false;

function startBoth() {
  if (bfDone && dcDone) {
    resetAll();
    return;
  }
  if (running) {
    clearTimeout(bfTimer);
    clearTimeout(dcTimer);
    running = false;
    document.getElementById('runBtn').innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Resume';
    return;
  }
  running = true;
  document.getElementById('runBtn').innerHTML = '<i class="ti ti-player-pause" aria-hidden="true"></i> Pause';
  runBFLoop();
  runDCLoop();
}

function stepBoth() {
  clearTimeout(bfTimer);
  clearTimeout(dcTimer);
  running = false;
  document.getElementById('runBtn').innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Resume';
  stepBF();
  stepDC();
}

resetAll();