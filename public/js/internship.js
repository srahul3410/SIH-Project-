let currentActiveApplyBtn = null;
let currentStatFilter = 'high-match';

document.addEventListener('DOMContentLoaded', () => {
  // Bookmark toggle
  const bookmarkButtons = document.querySelectorAll('.btn-save');
  bookmarkButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('saved');
      const icon = btn.querySelector('svg');
      if (icon) {
        const isSaved = btn.classList.contains('saved');
        icon.style.fill = isSaved ? '#0d826a' : 'none';
        icon.style.stroke = isSaved ? '#0d826a' : 'currentColor';
      }
    });
  });
});

// Sidebar Toggle: Handles mobile drawer and desktop slide-away
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (window.innerWidth <= 820) {
    sidebar.classList.toggle('mobile-open');
    if (overlay) overlay.classList.toggle('active');
  } else {
    sidebar.classList.toggle('collapsed');
  }
}

// Reset sidebar filter checkboxes
function resetFilters() {
  const checkboxes = document.querySelectorAll('.filter-panel input[type="checkbox"]');
  checkboxes.forEach((cb) => (cb.checked = false));
}

// Filter cards based on clicked stat button
function filterByStat(buttonElement) {
  currentStatFilter = buttonElement.getAttribute('data-filter');
  const statButtons = document.querySelectorAll('.stat-card');
  const cards = document.querySelectorAll('.internship-card');
  const feed = document.querySelector('.jobs-feed');

  statButtons.forEach(btn => btn.classList.remove('active'));
  buttonElement.classList.add('active');

  const existingMsg = document.getElementById('empty-feed-state');
  if (existingMsg) existingMsg.remove();

  let visibleCount = 0;

  cards.forEach(card => {
    const cardStatus = card.getAttribute('data-status');
    const isApplied = card.querySelector('.btn-apply').classList.contains('applied');

    let match = false;
    if (currentStatFilter === 'high-match') {
      match = true;
    } else if (currentStatFilter === 'applied') {
      match = isApplied;
    } else if (currentStatFilter === 'review') {
      match = cardStatus === 'review' || isApplied;
    } else if (currentStatFilter === 'interview') {
      match = cardStatus === 'interview';
    }

    if (match) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });

  if (visibleCount === 0) {
    const emptyNotice = document.createElement('div');
    emptyNotice.id = 'empty-feed-state';
    emptyNotice.className = 'empty-feed-msg';
    emptyNotice.innerHTML = `
      <p>No internships found under <strong>${buttonElement.querySelector('.stat-label').innerText}</strong>.</p>
      <button class="btn-apply" style="margin-top:12px;" onclick="document.querySelector('[data-filter=high-match]').click()">View Available Internships</button>
    `;
    feed.appendChild(emptyNotice);
  }
}

// Live Search Filter
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.internship-card');

  cards.forEach(card => {
    const role = card.getAttribute('data-role').toLowerCase();
    const company = card.getAttribute('data-company').toLowerCase();
    const textContent = card.innerText.toLowerCase();

    if (role.includes(query) || company.includes(query) || textContent.includes(query)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Open application modal
function openApplyModal(buttonElement) {
  if (buttonElement.classList.contains('applied')) return;

  currentActiveApplyBtn = buttonElement;
  const card = buttonElement.closest('.internship-card');
  const role = card.getAttribute('data-role');
  const company = card.getAttribute('data-company');

  document.getElementById('modal-role').innerText = role;
  document.getElementById('modal-company').innerText = company;

  document.getElementById('modal-form-content').style.display = 'block';
  document.getElementById('modal-success-content').style.display = 'none';

  const modal = document.getElementById('apply-modal');
  modal.classList.add('open');
}

// Close application modal
function closeApplyModal() {
  const modal = document.getElementById('apply-modal');
  modal.classList.remove('open');
}

// Handle Form Submission
function handleApplySubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerText = 'Submitting...';
  submitBtn.disabled = true;

  setTimeout(() => {
    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success-content').style.display = 'block';

    if (currentActiveApplyBtn) {
      currentActiveApplyBtn.classList.add('applied');
      currentActiveApplyBtn.innerText = 'Applied ✓';
      currentActiveApplyBtn.disabled = true;

      const card = currentActiveApplyBtn.closest('.internship-card');
      card.setAttribute('data-status', 'applied');
    }

    const counter = document.getElementById('app-counter');
    if (counter) {
      counter.innerText = parseInt(counter.innerText, 10) + 1;
    }

    submitBtn.innerText = 'Submit Application';
    submitBtn.disabled = false;
  }, 700);
}