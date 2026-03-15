// ─── DOM refs ─────────────────────────────────────────────────────────────────
const regInput        = document.getElementById('regInput');
const searchBtn       = document.getElementById('searchBtn');
const errorBox        = document.getElementById('errorBox');
const errorMsg        = document.getElementById('errorMsg');
const loadingBox      = document.getElementById('loadingBox');
const resultCard      = document.getElementById('resultCard');
const rName           = document.getElementById('rName');
const rRegNo          = document.getElementById('rRegNo');
const rDept           = document.getElementById('rDept');
const semContainer    = document.getElementById('semesterContainer');

// ─── Grade → CSS class mapping ────────────────────────────────────────────────
function gradeClass(grade) {
  const map = {
    'O':   'grade-O',
    'A+':  'grade-Aplus',
    'A':   'grade-A',
    'B+':  'grade-Bplus',
    'B':   'grade-B',
    'C+':  'grade-Cplus',
    'C':   'grade-C',
    'U':   'grade-U',
    'UA':  'grade-UA',
  };
  return map[grade] || 'grade-other';
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function renderSemester(semKey, subjects) {
  const semNum = semKey.replace('sem', '');
  const entries = Object.entries(subjects);
  if (entries.length === 0) return '';

  const rows = entries.map(([code, grade]) => `
    <tr>
      <td>${code}</td>
      <td><span class="grade-pill ${gradeClass(grade)}">${grade}</span></td>
    </tr>
  `).join('');

  return `
    <div class="sem-block">
      <div class="sem-title">Semester ${semNum}</div>
      <table class="grade-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function deptFullName(dept) {
  if (dept === 'CSE') return 'B.E. Computer Science & Engineering';
  if (dept === 'IT')  return 'B.Tech. Information Technology';
  return dept;
}

// ─── UI state helpers ─────────────────────────────────────────────────────────

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

function hideLoading() {
  loadingBox.classList.add('hidden');
}

function showResult(data) {
  hideLoading();
  errorBox.classList.add('hidden');

  rName.textContent  = data.name  || '—';
  rRegNo.textContent = data.regNo || '—';
  rDept.textContent  = deptFullName(data.department) || '—';

  // Sort semesters numerically
  const semKeys = Object.keys(data.semesters || {}).sort((a, b) => {
    return parseInt(a.replace('sem', '')) - parseInt(b.replace('sem', ''));
  });

  if (semKeys.length === 0) {
    semContainer.innerHTML = '<p style="color:var(--muted);padding:8px 0">No subject-level data available.</p>';
  } else {
    semContainer.innerHTML = semKeys
      .map(k => renderSemester(k, data.semesters[k]))
      .join('');
  }

  resultCard.classList.remove('hidden');

  // Scroll to result
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Core search ─────────────────────────────────────────────────────────────

async function searchResult() {
  const raw = regInput.value.trim();

  if (!raw) {
    showError('Please enter a register number.');
    return;
  }
  if (!/^\d{12}$/.test(raw)) {
    showError('Register number must be exactly 12 digits.');
    return;
  }

  showLoading();

  try {
    const res = await fetch(`/api/result/${raw}`);
    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Register number not found.');
      return;
    }

    showResult(data);
  } catch (err) {
    showError('Could not connect to server. Please try again.');
    console.error(err);
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

// Enter key triggers search
regInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchResult();
});

// Auto-uppercase and digits only
regInput.addEventListener('input', () => {
  regInput.value = regInput.value.replace(/[^0-9]/g, '');
});