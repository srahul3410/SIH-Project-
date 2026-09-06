// ============ COMPANY DATABASE ============
// "domain" = the company's real website domain, used to fetch their
// official logo from Clearbit's public logo API (logo.clearbit.com).
// This shows the real brand logo without us hosting/recreating it ourselves.
const companies = [
  {
    name: "TCS",
    domain: "tcs.com",
    roles: [
      { title: "Junior Web Developer", skills: ["HTML", "CSS", "JavaScript", "Git", "React"], package: "₹3.5 - 4.5 LPA" },
      { title: "System Engineer", skills: ["Java", "SQL", "Problem Solving", "Communication"], package: "₹3.36 - 4 LPA" }
    ]
  },
  {
    name: "Infosys",
    domain: "infosys.com",
    roles: [
      { title: "Software Engineer Trainee", skills: ["Java", "SQL", "Python", "Problem Solving", "Git"], package: "₹3.6 - 4.5 LPA" },
      { title: "Data Analyst", skills: ["Excel", "SQL", "Python", "Power BI"], package: "₹4 - 5.5 LPA" }
    ]
  },
  {
    name: "Wipro",
    domain: "wipro.com",
    roles: [
      { title: "Frontend Developer", skills: ["HTML", "CSS", "JavaScript", "React", "Figma"], package: "₹3.5 - 4.5 LPA" }
    ]
  },
  {
    name: "Accenture",
    domain: "accenture.com",
    roles: [
      { title: "Data Analyst", skills: ["Excel", "SQL", "Python", "Power BI", "Statistics"], package: "₹4.5 - 6 LPA" },
      { title: "Associate Software Engineer", skills: ["Java", "SQL", "HTML", "CSS", "JavaScript"], package: "₹4 - 5 LPA" }
    ]
  },
  {
    name: "Zoho",
    domain: "zoho.com",
    roles: [
      { title: "Full Stack Developer", skills: ["JavaScript", "Node.js", "React", "MongoDB", "Git"], package: "₹6 - 9 LPA" }
    ]
  },
  {
    name: "Amazon",
    domain: "amazon.com",
    roles: [
      { title: "SDE Intern", skills: ["Data Structures", "Java", "Python", "Problem Solving", "SQL"], package: "₹80K - 1L /month (stipend)" },
      { title: "SDE-1", skills: ["Data Structures", "Algorithms", "Java", "System Design", "SQL"], package: "₹18 - 28 LPA" }
    ]
  },
  {
    name: "Adobe",
    domain: "adobe.com",
    roles: [
      { title: "UI/UX Designer", skills: ["Figma", "Adobe XD", "CSS", "Prototyping", "User Research"], package: "₹8 - 12 LPA" }
    ]
  },
  {
    name: "Capgemini",
    domain: "capgemini.com",
    roles: [
      { title: "Associate Developer", skills: ["Java", "SQL", "HTML", "CSS", "JavaScript"], package: "₹3.8 - 4.5 LPA" }
    ]
  },
  {
    name: "Cognizant",
    domain: "cognizant.com",
    roles: [
      { title: "Cloud Support Engineer", skills: ["AWS", "Linux", "Python", "Networking", "SQL"], package: "₹4 - 5 LPA" }
    ]
  },
  {
    name: "Freshworks",
    domain: "freshworks.com",
    roles: [
      { title: "Backend Developer", skills: ["Node.js", "MongoDB", "SQL", "Git", "API Design"], package: "₹6 - 8.5 LPA" }
    ]
  }
];

// Flatten every company+role into one "opportunity" list — used for skill matching
const opportunities = companies.flatMap(c =>
  c.roles.map(r => ({
    companyName: c.name,
    domain: c.domain,
    title: r.title,
    skills: r.skills,
    package: r.package
  }))
);

// All unique skills, used for the suggestion pills
const allSkills = [...new Set(opportunities.flatMap(o => o.skills))].sort();

// User's currently chosen skills
let chosenSkills = [];

// Helper: build a Clearbit logo URL from a domain
function logoUrl(domain) {
  return `https://logo.clearbit.com/${domain}?size=80`;
}

// ============ ELEMENT REFERENCES ============
const modeSkillBtn = document.getElementById("modeSkillBtn");
const modeCompanyBtn = document.getElementById("modeCompanyBtn");
const skillMode = document.getElementById("skillMode");
const companyMode = document.getElementById("companyMode");

const skillInput = document.getElementById("skillInput");
const addSkillBtn = document.getElementById("addSkillBtn");
const suggestedSkillsEl = document.getElementById("suggestedSkills");
const chosenSkillsEl = document.getElementById("chosenSkills");
const findMatchBtn = document.getElementById("findMatchBtn");
const skillResultsEl = document.getElementById("skillResults");

const companySelect = document.getElementById("companySelect");
const roleSelect = document.getElementById("roleSelect");
const companyResultEl = document.getElementById("companyResult");

// ============ MODE SWITCHING ============
modeSkillBtn.addEventListener("click", () => {
  modeSkillBtn.classList.add("active");
  modeCompanyBtn.classList.remove("active");
  skillMode.classList.remove("hidden");
  companyMode.classList.add("hidden");
});

modeCompanyBtn.addEventListener("click", () => {
  modeCompanyBtn.classList.add("active");
  modeSkillBtn.classList.remove("active");
  companyMode.classList.remove("hidden");
  skillMode.classList.add("hidden");
});

// ============ SUGGESTED SKILL PILLS ============
function renderSuggestedSkills() {
  suggestedSkillsEl.innerHTML = "";
  allSkills.forEach(skill => {
    if (chosenSkills.includes(skill)) return;
    const pill = document.createElement("span");
    pill.className = "suggest-pill";
    pill.textContent = "+ " + skill;
    pill.addEventListener("click", () => addSkill(skill));
    suggestedSkillsEl.appendChild(pill);
  });
}

// ============ CHOSEN SKILL CHIPS ============
function renderChosenSkills() {
  chosenSkillsEl.innerHTML = "";
  chosenSkills.forEach(skill => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${skill} <button aria-label="remove">✕</button>`;
    chip.querySelector("button").addEventListener("click", () => removeSkill(skill));
    chosenSkillsEl.appendChild(chip);
  });
}

function addSkill(rawSkill) {
  const skill = rawSkill.trim();
  if (!skill) return;
  const exists = chosenSkills.some(s => s.toLowerCase() === skill.toLowerCase());
  if (!exists) {
    chosenSkills.push(skill);
    renderChosenSkills();
    renderSuggestedSkills();
  }
  skillInput.value = "";
}

function removeSkill(skill) {
  chosenSkills = chosenSkills.filter(s => s !== skill);
  renderChosenSkills();
  renderSuggestedSkills();
}

addSkillBtn.addEventListener("click", () => addSkill(skillInput.value));
skillInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addSkill(skillInput.value);
  }
});

// ============ MATCHING LOGIC ============
function calculateMatch(userSkills, requiredSkills) {
  const userLower = userSkills.map(s => s.toLowerCase());
  const have = requiredSkills.filter(s => userLower.includes(s.toLowerCase()));
  const missing = requiredSkills.filter(s => !userLower.includes(s.toLowerCase()));
  const percent = Math.round((have.length / requiredSkills.length) * 100);
  return { have, missing, percent };
}

function matchClass(percent) {
  if (percent >= 70) return "match-high";
  if (percent >= 40) return "match-mid";
  return "match-low";
}

findMatchBtn.addEventListener("click", () => {
  if (chosenSkills.length === 0) {
    skillResultsEl.innerHTML = `<div class="no-results">Please add at least one skill first.</div>`;
    return;
  }

  const results = opportunities
    .map(o => ({ o, ...calculateMatch(chosenSkills, o.skills) }))
    .sort((a, b) => b.percent - a.percent);

  skillResultsEl.innerHTML = "";

  results.forEach(r => {
    const card = document.createElement("div");
    card.className = "result-card";

    const haveTags = r.have.map(s => `<span class="tag have">✓ ${s}</span>`).join("");
    const missingTags = r.missing.map(s => `<span class="tag missing">Need: ${s}</span>`).join("");

    card.innerHTML = `
      <div class="result-top">
        <div class="result-top-left">
          <img class="company-logo small" src="${logoUrl(r.o.domain)}" alt="${r.o.companyName} logo"
               onerror="this.style.display='none'">
          <div>
            <h4>${r.o.companyName}</h4>
            <div class="position">${r.o.title}</div>
          </div>
        </div>
        <span class="match-badge ${matchClass(r.percent)}">${r.percent}% match</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${r.percent}%"></div>
      </div>
      <div class="skill-tags">${haveTags}${missingTags}</div>
      <div class="package-line">💰 ${r.o.package}</div>
    `;
    skillResultsEl.appendChild(card);
  });
});

// ============ COMPANY MODE (2-step: company -> role) ============
function populateCompanyDropdown() {
  companies.forEach((c, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = c.name;
    companySelect.appendChild(opt);
  });
}

companySelect.addEventListener("change", () => {
  const index = companySelect.value;
  roleSelect.innerHTML = `<option value="">-- Select a role --</option>`;
  companyResultEl.classList.add("hidden");

  if (index === "") {
    roleSelect.classList.add("hidden");
    return;
  }

  const company = companies[index];
  company.roles.forEach((r, rIndex) => {
    const opt = document.createElement("option");
    opt.value = rIndex;
    opt.textContent = r.title;
    roleSelect.appendChild(opt);
  });
  roleSelect.classList.remove("hidden");
});

roleSelect.addEventListener("change", () => {
  const companyIndex = companySelect.value;
  const roleIndex = roleSelect.value;

  if (companyIndex === "" || roleIndex === "") {
    companyResultEl.classList.add("hidden");
    return;
  }

  const company = companies[companyIndex];
  const role = company.roles[roleIndex];
  companyResultEl.classList.remove("hidden");

  const skillTags = role.skills.map(s => `<span class="tag have">${s}</span>`).join("");

  companyResultEl.innerHTML = `
    <div class="company-detail-top">
      <img class="company-icon" src="${logoUrl(company.domain)}" alt="${company.name} logo"
           onerror="this.style.display='none'">
      <div>
        <h3>${company.name}</h3>
        <div class="position-line">Hiring for: ${role.title}</div>
      </div>
    </div>
    <div class="detail-section">
      <h5>Required Skills</h5>
      <div class="skill-tags">${skillTags}</div>
    </div>
    <div class="detail-section">
      <h5>Rough Package</h5>
      <div class="package-line">💰 ${role.package}</div>
    </div>
    <div class="detail-section">
      <h5>Tip</h5>
      <p class="muted">Switch to "I'll Give My Skills" to see your match % for this exact role.</p>
    </div>
  `;
});

// ============ INIT ============
renderSuggestedSkills();
renderChosenSkills();
populateCompanyDropdown();