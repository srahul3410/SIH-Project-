// Questions categorized by Language
const quizQuestions = [
  {
    id: 1,
    lang: "Python",
    question: "Is a Python list mutable or immutable?",
    options: ["Mutable", "Immutable", "Both", "Depends on declaration"],
    correct: 0
  },
  {
    id: 2,
    lang: "Python",
    question: "Which data structure stores key-value pairs in Python?",
    options: ["List", "Tuple", "Dictionary", "Set"],
    correct: 2
  },
  {
    id: 3,
    lang: "JavaScript",
    question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
    options: ["var", "let & const", "function", "define"],
    correct: 1
  },
  {
    id: 4,
    lang: "JavaScript",
    question: "What is the output of '5' - 3 in JavaScript?",
    options: ["2", "'53'", "NaN", "TypeError"],
    correct: 0
  },
  {
    id: 5,
    lang: "Java",
    question: "Which keyword is used for class inheritance in Java?",
    options: ["implements", "extends", "inherits", "super"],
    correct: 1
  },
  {
    id: 6,
    lang: "Java",
    question: "Where are object instances allocated memory in Java?",
    options: ["Stack memory", "Heap memory", "ROM", "Cache"],
    correct: 1
  },
  {
    id: 7,
    lang: "C++",
    question: "What mechanism provides direct memory address handling in C++?",
    options: ["Pointers", "References", "Arrays", "Templates"],
    correct: 0
  },
  {
    id: 8,
    lang: "C++",
    question: "Which operator is used to deallocate dynamically allocated memory in C++?",
    options: ["free()", "delete", "remove", "clear"],
    correct: 1
  }
];

// Dynamically Render Questions into HTML
const wrapper = document.getElementById('questions-wrapper');

quizQuestions.forEach((q, index) => {
  const qBlock = document.createElement('div');
  qBlock.className = 'question-block';
  
  let optionsHTML = '';
  q.options.forEach((opt, optIdx) => {
    optionsHTML += `
      <label>
        <input type="radio" name="q${q.id}" value="${optIdx}" required>
        ${opt}
      </label>
    `;
  });

  qBlock.innerHTML = `
    <div class="question-title">Q${index + 1}. [${q.lang}] ${q.question}</div>
    <div class="options-group">${optionsHTML}</div>
  `;
  wrapper.appendChild(qBlock);
});

// Analyze Answers and Calculate Skill Percentage
document.getElementById('quiz-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const stats = {};

  quizQuestions.forEach(q => {
    if (!stats[q.lang]) {
      stats[q.lang] = { total: 0, correct: 0 };
    }
    stats[q.lang].total += 1;

    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (selected && parseInt(selected.value) === q.correct) {
      stats[q.lang].correct += 1;
    }
  });

  // Hide Quiz Form, Display Page 2 (Skill Analysis)
  document.getElementById('quiz-form').classList.add('hidden');
  const resultCard = document.getElementById('result-card');
  resultCard.classList.remove('hidden');

  const scoresContainer = document.getElementById('scores-container');
  scoresContainer.innerHTML = '';

  // Render Proficiency Percentage Bars
  for (const lang in stats) {
    const total = stats[lang].total;
    const correct = stats[lang].correct;
    const percentage = Math.round((correct / total) * 100);

    const row = document.createElement('div');
    row.className = 'score-row';
    row.innerHTML = `
      <div class="score-label">
        <span>${lang}</span>
        <span>${percentage}% (${correct}/${total} Correct)</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
    `;
    scoresContainer.appendChild(row);
  }
});

// Skill Mapping Toggle
function toggleSkillMap() {
  const mapModal = document.getElementById('skill-map-modal');
  if (mapModal.style.display === 'block') {
    mapModal.style.display = 'none';
  } else {
    mapModal.style.display = 'block';
  }
}