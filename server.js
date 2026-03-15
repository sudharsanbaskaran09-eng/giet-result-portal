const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Load results data once at startup
let resultsData = {};
const resultsPath = path.join(__dirname, 'results.json');

if (fs.existsSync(resultsPath)) {
  try {
    resultsData = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    console.log(`✅ Loaded results for ${Object.keys(resultsData).length} students`);
  } catch (err) {
    console.error('❌ Failed to parse results.json:', err.message);
  }
} else {
  console.warn('⚠️  results.json not found. Run: node parsePdf.js first.');
}

// API: search by register number
app.get('/api/result/:regNo', (req, res) => {
  const regNo = req.params.regNo.trim().toUpperCase();

  if (!resultsData[regNo]) {
    return res.status(404).json({ error: 'Register number not found.' });
  }

  res.json({ regNo, ...resultsData[regNo] });
});

// API: health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', totalStudents: Object.keys(resultsData).length });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 GIET Result Portal running at http://localhost:${PORT}`);
});