const navButtons = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('view-' + btn.dataset.view).classList.add('active');
    });
  });

  // ---------- Trainee form (in-memory only, per skill-brief guidance) ----------
  const traineeRecords = [];
  const historyBody = document.querySelector('#traineeHistory tbody');
  const toast = document.getElementById('toast');

  document.getElementById('traineeForm').addEventListener('submit', e => {
    e.preventDefault();
    const record = {
      name: document.getElementById('t-name').value,
      institute: document.getElementById('t-institute').value,
      course: document.getElementById('t-course').value,
      status: document.getElementById('t-status').value,
      relevance: document.getElementById('t-relevance').value
    };
    traineeRecords.push(record);

    const row = document.createElement('tr');
    row.innerHTML = `<td>${record.course}</td>
      <td><span class="pill ${record.status}">${record.status}</span></td>
      <td>${record.relevance}/10</td>`;
    historyBody.appendChild(row);

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
    e.target.reset();
  });

  // ---------- Institute chart ----------
  new Chart(document.getElementById('chartInstitute'), {
    type: 'bar',
    data: {
      labels: ['Electrician', 'Web Dev', 'Welding', 'Solar Install', 'Office Asst'],
      datasets: [{
        label: 'Placement %',
        data: [78, 64, 55, 82, 41],
        backgroundColor: '#F2A93B',
        borderRadius: 6
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#97A0B8' }, grid: { display: false } },
        y: { ticks: { color: '#97A0B8' }, grid: { color: 'rgba(255,255,255,.06)' }, beginAtZero: true, max: 100 }
      }
    }
  });

  // ---------- Admin: skill demand vs supply ----------
  new Chart(document.getElementById('chartGap'), {
    type: 'bar',
    data: {
      labels: ['Web Dev', 'Data Entry', 'Electrician', 'Solar Install', 'Welding'],
      datasets: [
        { label: 'Job postings (demand)', data: [4200, 1800, 3100, 3800, 2600], backgroundColor: '#3FA796', borderRadius: 6 },
        { label: 'Trainees produced (supply)', data: [1600, 3900, 2900, 1200, 2400], backgroundColor: '#E6604C', borderRadius: 6 }
      ]
    },
    options: {
      plugins: { legend: { labels: { color: '#EAEBF2' } } },
      scales: {
        x: { ticks: { color: '#97A0B8' }, grid: { display: false } },
        y: { ticks: { color: '#97A0B8' }, grid: { color: 'rgba(255,255,255,.06)' } }
      }
    }
  });

  // ---------- Admin: scheme table ----------
  const schemes = [
    { name: 'PMKVY 4.0', trained: '96,400', placed: '68%' },
    { name: 'DAKSH Maharashtra', trained: '58,120', placed: '74%' },
    { name: 'CM Kaushalya Vikas', trained: '41,900', placed: '52%' },
    { name: 'District Skill Mission', trained: '30,290', placed: '61%' }
  ];
  document.getElementById('schemeTable').innerHTML = schemes.map(s =>
    `<tr><td>${s.name}</td><td>${s.trained}</td><td>${s.placed}</td></tr>`
  ).join('');

  // ---------- ML hook: replace the inside of this function with your friend's API ----------
  async function predictEmployability(course, district) {
    try {
      // Example of the real call once your friend's Flask/FastAPI service is running:
      // const res = await fetch('http://localhost:5000/predict', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ course, district })
      // });
      // const data = await res.json();
      // return data.score;

      // Fallback heuristic so the demo works without a live backend:
      const base = { 'Web Development': 72, 'Electrician': 80, 'Welding Technology': 66, 'Solar Panel Installation': 85 };
      const districtBoost = { 'Pune': 6, 'Nagpur': 2, 'Nashik': 3, 'Aurangabad': -2 };
      const score = Math.min(99, (base[course] || 60) + (districtBoost[district] || 0));
      await new Promise(r => setTimeout(r, 400)); // simulate network latency
      return score;
    } catch (err) {
      console.error('Prediction failed', err);
      return null;
    }
  }

  document.getElementById('predictBtn').addEventListener('click', async () => {
    const course = document.getElementById('p-course').value;
    const district = document.getElementById('p-district').value;
    const resultEl = document.getElementById('predictResult');
    resultEl.textContent = '…';
    const score = await predictEmployability(course, district);
    resultEl.textContent = score !== null ? score + '%' : 'Error';
  });
