// File upload handling
const fileDrop = document.getElementById('fileDrop');
const fileInput = document.getElementById('resumeFile');
const fileLabel = document.getElementById('fileLabel');

fileDrop.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) {
    fileLabel.textContent = `✅ ${fileInput.files[0].name}`;
    fileDrop.classList.add('has-file');
  }
});

// Drag & Drop
fileDrop.addEventListener('dragover', (e) => { e.preventDefault(); fileDrop.classList.add('has-file'); });
fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('has-file'));
fileDrop.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;
    fileLabel.textContent = `✅ ${file.name}`;
  }
});

async function analyzeResume() {
  const file = fileInput.files[0];
  const jobDesc = document.getElementById('jobDesc').value.trim();

  if (!file)    return alert('Please upload a resume.');
  if (!jobDesc) return alert('Please enter a job description.');

  // Show loader, hide results
  document.getElementById('loader').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
  document.getElementById('analyzeBtn').disabled = true;

  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDesc);

  try {
    const res = await fetch('/analyze', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.detail || 'Analysis failed');
    renderResults(data);

  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('analyzeBtn').disabled = false;
  }
}

function renderResults(data) {
  // ATS Score
  const score = data.ats_score || 0;
  document.getElementById('scoreValue').textContent = score;
  document.getElementById('scoreCircle').style.setProperty('--score', `${score}%`);

  // Verdict badge
  const badge = document.getElementById('verdictBadge');
  badge.textContent = data.verdict;
  const colors = {
    'Strong Match': '#4ade80', 'Good Match': '#a78bfa',
    'Partial Match': '#fb923c', 'Weak Match': '#f87171'
  };
  badge.style.background = (colors[data.verdict] || '#888') + '22';
  badge.style.color = colors[data.verdict] || '#888';
  badge.style.border = `1px solid ${colors[data.verdict] || '#888'}44`;

  document.getElementById('summaryText').textContent = data.summary;

  const sl = document.getElementById('strengthsList');
  sl.innerHTML = (data.strengths || []).map(s => `<li>${s}</li>`).join('');

  document.getElementById('skillsFound').innerHTML =
    (data.skills_found || []).map(s => `<span>${s}</span>`).join('');

  document.getElementById('skillsMissing').innerHTML =
    (data.missing_skills || []).map(s => `<span>${s}</span>`).join('');

  document.getElementById('improvementList').innerHTML =
    (data.improvements || []).map(i => `<li>${i}</li>`).join('');

  document.getElementById('results').classList.remove('hidden');
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}