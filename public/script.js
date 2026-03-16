const regInput     = document.getElementById('regInput');
const errorBox     = document.getElementById('errorBox');
const errorMsg     = document.getElementById('errorMsg');
const loadingBox   = document.getElementById('loadingBox');
const resultCard   = document.getElementById('resultCard');
const rName        = document.getElementById('rName');
const rRegNo       = document.getElementById('rRegNo');
const rDept        = document.getElementById('rDept');
const rAvatar      = document.getElementById('rAvatar');
const rBadge       = document.getElementById('rBadge');
const semContainer = document.getElementById('semesterContainer');

function gradeClass(g) {
  const m = { 'O':'gO','A+':'gAp','A':'gA','B+':'gBp','B':'gB','C+':'gCp','C':'gC','U':'gU','UA':'gUA','S':'gS' };
  return m[g] || 'gOther';
}

function deptFullName(dept) {
  const map = {
    'CSE':    'B.E. Computer Science & Engineering',
    'IT':     'B.Tech. Information Technology',
    'AIML':   'B.E. CSE (AI & Machine Learning)',
    'AIDS':   'B.Tech. Artificial Intelligence & Data Science',
    'ME-CSE': 'M.E. Computer Science & Engineering',
  };
  return map[dept] || dept;
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function renderSemester(semKey, subjects, index) {
  const semNum = semKey.replace('sem', '');
  const entries = Object.entries(subjects);
  if (entries.length === 0) return '';

  const tiles = entries.map(([code, grade]) => `
    <div class="grade-tile">
      <span class="grade-code">${code}</span>
      <span class="grade-val ${gradeClass(grade)}">${grade}</span>
    </div>
  `).join('');

  const id = `sem-body-${semKey}`;
  return `
    <div class="sem-block" style="animation-delay:${index * 0.07}s">
      <div class="sem-header" onclick="toggleSem('${id}', this)">
        <span class="sem-num">${semNum.padStart(2,'0')}</span>
        <span class="sem-label">Semester ${semNum}</span>
        <span class="sem-count">${entries.length} subjects</span>
        <span class="sem-chevron">▼</span>
      </div>
      <div class="sem-body" id="${id}">${tiles}</div>
    </div>
  `;
}

function toggleSem(id, header) {
  const body = document.getElementById(id);
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'grid';
  header.classList.toggle('open', !isOpen);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.remove('hidden');
  loadingBox.classList.add('hidden');
  resultCard.classList.add('hidden');
}

function showLoading() {
  errorBox.classList.add('hidden');
  resultCard.classList.add('hidden');
  loadingBox.classList.remove('hidden');
}

function showResult(data) {
  loadingBox.classList.add('hidden');
  errorBox.classList.add('hidden');

  const cleanName = data.name.replace(/\s+/g, ' ').trim();
  rName.textContent  = cleanName.toUpperCase();
  rRegNo.textContent = data.regNo;
  rDept.textContent  = deptFullName(data.department);
  rAvatar.textContent = getInitials(cleanName);
  rBadge.textContent = data.department;

  const semKeys = Object.keys(data.semesters || {}).sort((a, b) =>
    parseInt(a.replace('sem','')) - parseInt(b.replace('sem',''))
  );

  if (semKeys.length === 0) {
    semContainer.innerHTML = '<div style="padding:24px 28px;color:#6b7280;font-size:14px">No semester data recorded.</div>';
  } else {
    semContainer.innerHTML = semKeys.map((k, i) => renderSemester(k, data.semesters[k], i)).join('');
    // Open first semester by default
    const firstId = `sem-body-${semKeys[0]}`;
    const firstBody = document.getElementById(firstId);
    const firstHeader = firstBody?.previousElementSibling;
    if (firstBody) { firstBody.style.display = 'grid'; firstHeader?.classList.add('open'); }
    // Collapse others
    semKeys.slice(1).forEach(k => {
      const b = document.getElementById(`sem-body-${k}`);
      if (b) b.style.display = 'none';
    });
  }

  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function searchResult() {
  const raw = regInput.value.trim();
  if (!raw) { showError('Please enter a register number.'); return; }
  if (!/^\d{12}$/.test(raw)) { showError('Register number must be exactly 12 digits.'); return; }

  showLoading();
  try {
    const res  = await fetch(`/api/result/${raw}`);
    const data = await res.json();
    if (!res.ok) { showError(data.error || 'Register number not found.'); return; }
    showResult(data);
  } catch (err) {
    showError('Could not connect to server. Please try again.');
  }
}

regInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchResult(); });
regInput.addEventListener('input',   e => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); });