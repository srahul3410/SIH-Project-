const localPlacementData = {
  eligibleOpportunities: [
    { id: 101, company: 'Microsoft', role: 'Software Engineer', ctc: '₹18 - 22 LPA', minCGPA: 7.5, english: 'Fluent (C1)', skills: 'C++, DSA, System Design' },
    { id: 102, company: 'Tata Consultancy Services', role: 'Graduate Engineer Trainee', ctc: '₹7 - 9 LPA', minCGPA: 6.5, english: 'Intermediate', skills: 'Java, SQL, OOP' },
    { id: 103, company: 'Deloitte', role: 'Technology Analyst', ctc: '₹9 - 11 LPA', minCGPA: 7.0, english: 'Fluent (C1)', skills: 'Python, Excel, Cloud' },
    { id: 104, company: 'Google', role: 'Associate Cloud Engineer', ctc: '₹22 - 28 LPA', minCGPA: 8.0, english: 'Fluent (C1)', skills: 'GCP, Networking, Go' },
    { id: 105, company: 'Amazon', role: 'SDE Intern & FTE', ctc: '₹24 - 30 LPA', minCGPA: 7.8, english: 'Fluent (C1)', skills: 'Data Structures, Java, AWS' },
    { id: 106, company: 'Infosys', role: 'Specialist Programmer', ctc: '₹9.5 LPA', minCGPA: 6.8, english: 'Conversational', skills: 'Java, DSA, DBMS' }
  ],
  
  // Companies with status and round reached
  allCompanies: [
    { name: 'Microsoft', given: true, round: 'Technical Round 1' },
    { name: 'Tata Consultancy Services (TCS)', given: true, round: 'Managerial Round' },
    { name: 'Deloitte', given: false, round: 'Aptitude / Online Assessment' },
    { name: 'Google', given: false, round: 'Aptitude / Online Assessment' },
    { name: 'Amazon', given: false, round: 'Aptitude / Online Assessment' },
    { name: 'Infosys', given: false, round: 'Aptitude / Online Assessment' }
  ],

  student: { cgpa: 8.4, english: 'Fluent (Level C1)', skills: ['C++', 'DSA', 'SQL', 'Python'] }
};

document.addEventListener('DOMContentLoaded', () => {
  updateInterviewCountDisplay();
});

function updateInterviewCountDisplay() {
  const givenCount = localPlacementData.allCompanies.filter(c => c.given).length;
  document.getElementById('count-interviews').innerText = givenCount;
}

// 1. Open Eligible Modal (18 items)
function openEligibleModal() {
  const container = document.getElementById('eligible-list-container');
  container.innerHTML = '';
  localPlacementData.eligibleOpportunities.forEach((item, index) => {
    container.innerHTML += `
      <div class="modal-item-row">
        <div class="modal-item-header"><strong>${index + 1}. ${item.company} — ${item.role}</strong><span class="modal-item-ctc">${item.ctc}</span></div>
        <p class="modal-item-desc">Required CGPA: ${item.minCGPA} | Skills: ${item.skills}</p>
      </div>`;
  });
  document.getElementById('modal-eligible').classList.add('show');
}

// 2. Open Interview Selection & Round Reached Modal
function openInterviewSelectionModal() {
  const container = document.getElementById('interview-selection-container');
  container.innerHTML = '';

  const roundOptions = [
    'Aptitude / Online Assessment',
    'Technical Round 1',
    'Technical Round 2',
    'Managerial Round',
    'HR / Final Round',
    'Selected / Offer Received'
  ];

  localPlacementData.allCompanies.forEach((comp, idx) => {
    let optionsHTML = '';
    roundOptions.forEach(rnd => {
      const selected = comp.round === rnd ? 'selected' : '';
      optionsHTML += `<option value="${rnd}" ${selected}>${rnd}</option>`;
    });

    container.innerHTML += `
      <div class="selection-row">
        <label>
          <input type="checkbox" id="comp-chk-${idx}" ${comp.given ? 'checked' : ''} onchange="toggleRoundSelect(${idx})" style="width: 18px; height: 18px; accent-color: #0f766e;">
          <span>${comp.name}</span>
        </label>
        <select class="round-select" id="round-sel-${idx}" ${!comp.given ? 'disabled style="opacity:0.5;"' : ''}>
          ${optionsHTML}
        </select>
      </div>`;
  });

  document.getElementById('modal-interview-selection').classList.add('show');
}

function toggleRoundSelect(idx) {
  const chk = document.getElementById(`comp-chk-${idx}`);
  const sel = document.getElementById(`round-sel-${idx}`);
  if (chk.checked) {
    sel.disabled = false;
    sel.style.opacity = '1';
  } else {
    sel.disabled = true;
    sel.style.opacity = '0.5';
  }
}

function saveInterviewSelections() {
  localPlacementData.allCompanies.forEach((comp, idx) => {
    const chk = document.getElementById(`comp-chk-${idx}`);
    const sel = document.getElementById(`round-sel-${idx}`);
    if (chk && sel) {
      comp.given = chk.checked;
      comp.round = chk.checked ? sel.value : 'Not Started';
    }
  });

  updateInterviewCountDisplay();
  closeModal('modal-interview-selection');
  alert('✅ Interview progress updated successfully!');
}

// 3. Toggle Side Drawer (Detailed Progress View)
function toggleInterviewDrawer() {
  const drawer = document.getElementById('interview-drawer');
  const content = document.getElementById('drawer-rounds-content');
  
  if (!drawer.classList.contains('show')) {
    content.innerHTML = '';
    const attended = localPlacementData.allCompanies.filter(c => c.given);

    if (attended.length === 0) {
      content.innerHTML = `<p style="font-size: 13px; color: var(--text-sub); text-align: center; margin-top: 40px;">No interviews attended yet. Click on the Interviews card to select completed interviews.</p>`;
    } else {
      attended.forEach(comp => {
        content.innerHTML += `
          <div class="drawer-card-item">
            <div class="drawer-card-top">
              <strong>${comp.name}</strong>
              <span class="round-tag">${comp.round}</span>
            </div>
            <p style="font-size: 11.5px; color: var(--text-sub);">Status: Active Evaluation</p>
          </div>`;
      });
    }
    drawer.classList.add('show');
  } else {
    drawer.classList.remove('show');
  }
}

// 4. Criteria Breakdown Modal
function openCriteriaModal(driveId) {
  const drive = localPlacementData.eligibleOpportunities.find(d => d.id === driveId);
  if (!drive) return;
  document.getElementById('crit-company-title').innerText = `${drive.company} — Criteria Breakdown`;
  document.getElementById('criteria-modal-content').innerHTML = `
    <p style="font-size: 13px; margin-bottom: 10px;"><strong>Required CGPA:</strong> ${drive.minCGPA} (Your CGPA: 8.4 — <span style="color:green; font-weight:bold;">Eligible</span>)</p>
    <p style="font-size: 13px; margin-bottom: 14px;"><strong>Required English:</strong> ${drive.english} (Your Level: Fluent — <span style="color:green; font-weight:bold;">Eligible</span>)</p>
    <button class="action-teal-btn" style="width:100%;" onclick="closeModal('modal-criteria'); alert('Interview slot successfully confirmed!');">Confirm Slot</button>`;
  document.getElementById('modal-criteria').classList.add('show');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}