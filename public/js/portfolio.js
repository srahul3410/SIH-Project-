/* =========================================
   VIDYASETU DIGITAL PORTFOLIO JAVASCRIPT (portfolio.js)
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    if (window.lucide) {
        lucide.createIcons();
    }

    function escapeHTML(str) {
        return (str || "").replace(/[&<>'"]/g, tag => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            "\"": "&quot;"
        }[tag] || tag));
    }

    function saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            alert("Storage limit reached! Please use image links instead of large file uploads.");
        }
    }

    // Sidebar Toggle & Mobile Overlay
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const mainContent = document.querySelector(".main-content");

    if (menuButton && sidebar) {
        menuButton.addEventListener("click", function (e) {
            e.stopPropagation();
            if (window.innerWidth > 950) {
                sidebar.classList.toggle("closed");
                if (mainContent) mainContent.classList.toggle("sidebar-closed");
            } else {
                sidebar.classList.toggle("open");
                if (sidebarOverlay) sidebarOverlay.classList.toggle("active");
            }
        });
    }

    sidebarOverlay?.addEventListener("click", () => {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("active");
    });

    // Tabs Switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tabKey = btn.getAttribute("data-tab");
            document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
            
            const target = document.getElementById("tab-" + tabKey);
            if (target) {
                target.classList.add("active");
            }
        });
    });

    function openModal(modal) { modal?.classList.add("active"); }
    function closeModal(modal) { modal?.classList.remove("active"); }

    // =========================================================
    // DATA STATE (LocalStorage)
    // =========================================================
    let userProjects = JSON.parse(localStorage.getItem("vs_projects")) || [];
    let userSkills = JSON.parse(localStorage.getItem("vs_skills")) || [];
    let userCerts = JSON.parse(localStorage.getItem("vs_certs")) || [];
    let userInternships = JSON.parse(localStorage.getItem("vs_internships")) || [];
    let userExperience = JSON.parse(localStorage.getItem("vs_experience")) || [];
    let userProfile = JSON.parse(localStorage.getItem("vs_profile")) || null;

    // Initial Renders
    loadProfile();
    renderProjects();
    renderSkills();
    renderCerts();
    renderInternships();
    renderExperience();
    updateProfileStrength();

    // =========================================================
    // 0. DIRECT PROFILE PHOTO SELECTION (Click on Avatar)
    // =========================================================
    const directAvatarTrigger = document.getElementById("directAvatarTrigger");
    const directAvatarInput = document.getElementById("directAvatarInput");

    directAvatarTrigger?.addEventListener("click", () => {
        directAvatarInput?.click();
    });

    directAvatarInput?.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const newImg = e.target.result;
                document.getElementById("userImg").src = newImg;
                
                if (!userProfile) {
                    userProfile = { img: newImg };
                } else {
                    userProfile.img = newImg;
                }
                saveToStorage("vs_profile", userProfile);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // =========================================================
    // 1. ADD PROJECT WITH PHOTO
    // =========================================================
    const addProjectModal = document.getElementById("addProjectModal");
    const openAddProjectBtn = document.getElementById("openAddProjectBtn");
    const closeAddProjectBtn = document.getElementById("closeAddProjectBtn");
    const cancelAddProjectBtn = document.getElementById("cancelAddProjectBtn");
    const addProjectForm = document.getElementById("addProjectForm");

    const pPhotoFileInput = document.getElementById("pPhotoFile");
    const pImgUrlInput = document.getElementById("pImg");
    const previewArea = document.getElementById("previewArea");
    const projectPreviewImg = document.getElementById("projectPreviewImg");
    const removePhotoBtn = document.getElementById("removePhotoBtn");

    let currentSelectedProjectImg = "";

    pPhotoFileInput?.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentSelectedProjectImg = e.target.result;
                projectPreviewImg.src = currentSelectedProjectImg;
                previewArea.style.display = "flex";
                if (pImgUrlInput) pImgUrlInput.value = "";
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    pImgUrlInput?.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            currentSelectedProjectImg = this.value.trim();
            projectPreviewImg.src = currentSelectedProjectImg;
            previewArea.style.display = "flex";
        } else {
            previewArea.style.display = "none";
            currentSelectedProjectImg = "";
        }
    });

    removePhotoBtn?.addEventListener("click", function () {
        pPhotoFileInput.value = "";
        if (pImgUrlInput) pImgUrlInput.value = "";
        currentSelectedProjectImg = "";
        previewArea.style.display = "none";
    });

    openAddProjectBtn?.addEventListener("click", () => {
        addProjectForm.reset();
        currentSelectedProjectImg = "";
        if (previewArea) previewArea.style.display = "none";
        openModal(addProjectModal);
    });

    closeAddProjectBtn?.addEventListener("click", () => closeModal(addProjectModal));
    cancelAddProjectBtn?.addEventListener("click", () => closeModal(addProjectModal));

    addProjectForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("pTitle").value.trim();
        const desc = document.getElementById("pDesc").value.trim();
        const github = document.getElementById("pGithub").value.trim() || "#";
        const demo = document.getElementById("pDemo").value.trim() || "#";

        let finalImg = currentSelectedProjectImg.trim() || 
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80";

        userProjects.unshift({ title, img: finalImg, desc, github, demo });
        saveToStorage("vs_projects", userProjects);

        renderProjects();
        updateProfileStrength();
        closeModal(addProjectModal);
    });

    function renderProjects() {
        const container = document.getElementById("projectsContainer");
        const emptyState = document.getElementById("emptyProjectsState");
        if (!container) return;
        container.innerHTML = "";

        if (userProjects.length === 0) {
            if (emptyState) emptyState.style.display = "flex";
            return;
        }

        if (emptyState) emptyState.style.display = "none";
        userProjects.forEach((proj, idx) => {
            const card = document.createElement("div");
            card.className = "project-item";
            card.innerHTML = `
                <div class="project-img-box">
                    <img src="${escapeHTML(proj.img)}" alt="${escapeHTML(proj.title)}" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'">
                </div>
                <div class="project-body">
                    <h4>${escapeHTML(proj.title)}</h4>
                    <p>${escapeHTML(proj.desc)}</p>
                    <div class="project-links">
                        <a href="${escapeHTML(proj.github)}" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>
                        <a href="${escapeHTML(proj.demo)}" target="_blank"><i data-lucide="external-link"></i> Live Demo</a>
                        <button class="btn-delete" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", function () {
                userProjects.splice(parseInt(this.getAttribute("data-idx")), 1);
                saveToStorage("vs_projects", userProjects);
                renderProjects();
                updateProfileStrength();
            });
        });

        if (window.lucide) lucide.createIcons();
    }

    // =========================================================
    // 2. ADD INTERNSHIP (COMPANY NAME + CERTIFICATE PHOTO)
    // =========================================================
    const addInternModal = document.getElementById("addInternModal");
    const openAddInternBtn = document.getElementById("openAddInternBtn");
    const closeAddInternBtn = document.getElementById("closeAddInternBtn");
    const cancelAddInternBtn = document.getElementById("cancelAddInternBtn");
    const addInternForm = document.getElementById("addInternForm");

    const internCertFileInput = document.getElementById("internCertFile");
    const internCertUrlInput = document.getElementById("internCertUrl");
    const internPreviewArea = document.getElementById("internPreviewArea");
    const internPreviewImg = document.getElementById("internPreviewImg");
    const removeInternCertBtn = document.getElementById("removeInternCertBtn");

    let currentSelectedCertData = "";

    internCertFileInput?.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentSelectedCertData = e.target.result;
                internPreviewImg.src = currentSelectedCertData;
                internPreviewArea.style.display = "flex";
                if (internCertUrlInput) internCertUrlInput.value = "";
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    internCertUrlInput?.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            currentSelectedCertData = this.value.trim();
            internPreviewImg.src = currentSelectedCertData;
            internPreviewArea.style.display = "flex";
        } else {
            internPreviewArea.style.display = "none";
            currentSelectedCertData = "";
        }
    });

    removeInternCertBtn?.addEventListener("click", function () {
        internCertFileInput.value = "";
        if (internCertUrlInput) internCertUrlInput.value = "";
        currentSelectedCertData = "";
        internPreviewArea.style.display = "none";
    });

    openAddInternBtn?.addEventListener("click", () => {
        addInternForm.reset();
        currentSelectedCertData = "";
        if (internPreviewArea) internPreviewArea.style.display = "none";
        openModal(addInternModal);
    });

    closeAddInternBtn?.addEventListener("click", () => closeModal(addInternModal));
    cancelAddInternBtn?.addEventListener("click", () => closeModal(addInternModal));

    addInternForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const company = document.getElementById("internCompany").value.trim();

        let finalCert = currentSelectedCertData.trim() || 
            "https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=600&q=80";

        userInternships.unshift({ company, certificate: finalCert });
        saveToStorage("vs_internships", userInternships);

        renderInternships();
        updateProfileStrength();
        closeModal(addInternModal);
    });

    function renderInternships() {
        const container = document.getElementById("internshipsContainer");
        const emptyState = document.getElementById("emptyInternState");
        if (!container) return;
        container.innerHTML = "";

        if (userInternships.length === 0) {
            if (emptyState) emptyState.style.display = "flex";
            return;
        }

        if (emptyState) emptyState.style.display = "none";
        userInternships.forEach((intern, idx) => {
            const card = document.createElement("div");
            card.className = "internship-card";
            card.innerHTML = `
                <div class="internship-cert-box">
                    <img src="${escapeHTML(intern.certificate)}" alt="${escapeHTML(intern.company)} Certificate" onerror="this.src='https://images.unsplash.com/photo-1589330694653-dad6d3240a2b?auto=format&fit=crop&w=600&q=80'">
                </div>
                <div class="internship-body">
                    <div class="intern-header-row">
                        <h4>${escapeHTML(intern.company)}</h4>
                        <button class="btn-delete-sm" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
                    </div>
                    <a href="${escapeHTML(intern.certificate)}" target="_blank" class="btn-view-cert">
                        <i data-lucide="external-link"></i> View Certificate
                    </a>
                </div>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll(".btn-delete-sm").forEach(btn => {
            btn.addEventListener("click", function () {
                userInternships.splice(parseInt(this.getAttribute("data-idx")), 1);
                saveToStorage("vs_internships", userInternships);
                renderInternships();
                updateProfileStrength();
            });
        });

        if (window.lucide) lucide.createIcons();
    }

    // =========================================================
    // 3. ADD WORK EXPERIENCE (COMPANY + ROLE + YEARS)
    // =========================================================
    const addExpModal = document.getElementById("addExpModal");
    const openAddExpBtn = document.getElementById("openAddExpBtn");
    const closeAddExpBtn = document.getElementById("closeAddExpBtn");
    const cancelAddExpBtn = document.getElementById("cancelAddExpBtn");
    const addExpForm = document.getElementById("addExpForm");

    openAddExpBtn?.addEventListener("click", () => {
        addExpForm.reset();
        openModal(addExpModal);
    });

    closeAddExpBtn?.addEventListener("click", () => closeModal(addExpModal));
    cancelAddExpBtn?.addEventListener("click", () => closeModal(addExpModal));

    addExpForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const company = document.getElementById("expCompany").value.trim();
        const role = document.getElementById("expRole").value.trim();
        const duration = document.getElementById("expDuration").value.trim();
        const type = document.getElementById("expType").value;

        userExperience.unshift({ company, role, duration, type });
        saveToStorage("vs_experience", userExperience);

        renderExperience();
        updateProfileStrength();
        closeModal(addExpModal);
    });

    function renderExperience() {
        const container = document.getElementById("experienceContainer");
        const emptyState = document.getElementById("emptyExpState");
        if (!container) return;
        container.innerHTML = "";

        if (userExperience.length === 0) {
            if (emptyState) emptyState.style.display = "flex";
            return;
        }

        if (emptyState) emptyState.style.display = "none";
        userExperience.forEach((exp, idx) => {
            const card = document.createElement("div");
            card.className = "experience-card-item";
            card.innerHTML = `
                <div class="exp-icon"><i data-lucide="briefcase"></i></div>
                <div class="exp-body">
                    <div class="exp-header-row">
                        <h4>${escapeHTML(exp.role)}</h4>
                        <span class="exp-badge">${escapeHTML(exp.type)}</span>
                    </div>
                    <strong class="exp-company">${escapeHTML(exp.company)}</strong>
                    <span class="exp-duration"><i data-lucide="calendar"></i> ${escapeHTML(exp.duration)}</span>
                </div>
                <button class="btn-delete-sm" data-idx="${idx}"><i data-lucide="trash-2"></i></button>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll(".btn-delete-sm").forEach(btn => {
            btn.addEventListener("click", function () {
                userExperience.splice(parseInt(this.getAttribute("data-idx")), 1);
                saveToStorage("vs_experience", userExperience);
                renderExperience();
                updateProfileStrength();
            });
        });

        if (window.lucide) lucide.createIcons();
    }

    // =========================================================
    // 4. ADD SKILL
    // =========================================================
    const addSkillModal = document.getElementById("addSkillModal");
    const openAddSkillBtn = document.getElementById("openAddSkillBtn");
    const closeAddSkillBtn = document.getElementById("closeAddSkillBtn");
    const cancelAddSkillBtn = document.getElementById("cancelAddSkillBtn");
    const addSkillForm = document.getElementById("addSkillForm");

    openAddSkillBtn?.addEventListener("click", () => {
        addSkillForm.reset();
        openModal(addSkillModal);
    });

    closeAddSkillBtn?.addEventListener("click", () => closeModal(addSkillModal));
    cancelAddSkillBtn?.addEventListener("click", () => closeModal(addSkillModal));

    addSkillForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("skillNameInput").value.trim();
        const level = document.getElementById("skillLevelInput").value;

        userSkills.push({ name, level });
        saveToStorage("vs_skills", userSkills);

        renderSkills();
        updateProfileStrength();
        closeModal(addSkillModal);
    });

    function renderSkills() {
        const container = document.getElementById("skillsContainer");
        const emptyState = document.getElementById("emptySkillsState");
        if (!container) return;
        container.innerHTML = "";

        if (userSkills.length === 0) {
            if (emptyState) emptyState.style.display = "flex";
            return;
        }

        emptyState.style.display = "none";
        userSkills.forEach(s => {
            const chip = document.createElement("div");
            chip.className = "skill-chip";
            chip.innerHTML = `<strong>${escapeHTML(s.name)}</strong> <span>${escapeHTML(s.level)}</span>`;
            container.appendChild(chip);
        });
    }

    // =========================================================
    // 5. ADD CERTIFICATE
    // =========================================================
    const addCertModal = document.getElementById("addCertModal");
    const openAddCertBtn = document.getElementById("openAddCertBtn");
    const closeAddCertBtn = document.getElementById("closeAddCertBtn");
    const cancelAddCertBtn = document.getElementById("cancelAddCertBtn");
    const addCertForm = document.getElementById("addCertForm");

    openAddCertBtn?.addEventListener("click", () => {
        addCertForm.reset();
        openModal(addCertModal);
    });

    closeAddCertBtn?.addEventListener("click", () => closeModal(addCertModal));
    cancelAddCertBtn?.addEventListener("click", () => closeModal(addCertModal));

    addCertForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("certTitle").value.trim();
        const org = document.getElementById("certOrg").value.trim();
        const date = document.getElementById("certDate").value.trim();
        const id = document.getElementById("certId").value.trim();

        userCerts.unshift({ title, org, date, id });
        saveToStorage("vs_certs", userCerts);

        renderCerts();
        updateProfileStrength();
        closeModal(addCertModal);
    });

    function renderCerts() {
        const container = document.getElementById("certificationsContainer");
        const emptyState = document.getElementById("emptyCertsState");
        if (!container) return;
        container.innerHTML = "";

        if (userCerts.length === 0) {
            if (emptyState) emptyState.style.display = "flex";
            return;
        }

        emptyState.style.display = "none";
        userCerts.forEach(c => {
            const card = document.createElement("div");
            card.className = "cert-card";
            card.innerHTML = `
                <div class="cert-icon"><i data-lucide="award"></i></div>
                <div class="cert-details">
                    <h4>${escapeHTML(c.title)}</h4>
                    <span>${escapeHTML(c.org)} • Issued ${escapeHTML(c.date)}</span>
                    <p>Credential ID: ${escapeHTML(c.id)}</p>
                </div>
            `;
            container.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    }

    // =========================================================
    // 6. PROFILE & ALL EDUCATION EDIT & SAVE (WITH PHOTO UPLOAD)
    // =========================================================
    const editModal = document.getElementById("editModal");
    const openEditBtn = document.getElementById("openEditBtn");
    const closeEditBtn = document.getElementById("closeEditBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const editForm = document.getElementById("portfolioEditForm");

    // Modal Photo Picker inputs
    const inputAvatarFile = document.getElementById("inputAvatarFile");
    const inputImg = document.getElementById("inputImg");
    const avatarPreviewArea = document.getElementById("avatarPreviewArea");
    const avatarPreviewImg = document.getElementById("avatarPreviewImg");
    const removeAvatarBtn = document.getElementById("removeAvatarBtn");
    let currentSelectedAvatar = "";

    inputAvatarFile?.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentSelectedAvatar = e.target.result;
                avatarPreviewImg.src = currentSelectedAvatar;
                avatarPreviewArea.style.display = "flex";
                if (inputImg) inputImg.value = "";
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    inputImg?.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            currentSelectedAvatar = this.value.trim();
            avatarPreviewImg.src = currentSelectedAvatar;
            avatarPreviewArea.style.display = "flex";
        } else {
            avatarPreviewArea.style.display = "none";
            currentSelectedAvatar = "";
        }
    });

    removeAvatarBtn?.addEventListener("click", function () {
        inputAvatarFile.value = "";
        if (inputImg) inputImg.value = "";
        currentSelectedAvatar = "";
        avatarPreviewArea.style.display = "none";
    });

    function loadProfile() {
        if (!userProfile) return;

        const textMapping = {
            userName: userProfile.name,
            topNavName: userProfile.name,
            userLocation: userProfile.location,
            userEmail: userProfile.email,
            userPhone: userProfile.phone,
            userDegree: userProfile.degree,
            userBio: userProfile.bio,
            userCollege: userProfile.college,
            userYear: userProfile.year,
            userBranch: userProfile.branch,
            userSpec: userProfile.spec,
            userCgpa: userProfile.cgpa,
            eduCollege: userProfile.college,
            eduDegree: userProfile.degree,
            eduDuration: `${userProfile.year || ""} • CGPA: ${userProfile.cgpa || ""}`,
            edu12School: userProfile.school12,
            edu12Board: userProfile.board12,
            edu12Details: `Passing Year: ${userProfile.year12 || ""} • Score: ${userProfile.score12 || ""}`,
            edu10School: userProfile.school10,
            edu10Board: userProfile.board10,
            edu10Details: `Passing Year: ${userProfile.year10 || ""} • Score: ${userProfile.score10 || ""}`
        };

        for (const [id, val] of Object.entries(textMapping)) {
            const el = document.getElementById(id);
            if (el && val) el.innerText = val;
        }

        if (userProfile.img) {
            const userImg = document.getElementById("userImg");
            if (userImg) userImg.src = userProfile.img;
        }

        if (userProfile.name) {
            const parts = userProfile.name.trim().split(" ");
            const avatar = document.getElementById("topNavAvatar");
            if (avatar) avatar.innerText = parts[0][0].toUpperCase() + (parts[1] ? parts[1][0].toUpperCase() : "");
        }
    }

    openEditBtn?.addEventListener("click", () => {
        document.getElementById("inputName").value = document.getElementById("userName")?.innerText || "";
        document.getElementById("inputLocation").value = document.getElementById("userLocation")?.innerText || "";
        document.getElementById("inputEmail").value = document.getElementById("userEmail")?.innerText || "";
        document.getElementById("inputPhone").value = document.getElementById("userPhone")?.innerText || "";
        document.getElementById("inputBio").value = document.getElementById("userBio")?.innerText || "";

        const currentImgSrc = document.getElementById("userImg")?.src || "";
        currentSelectedAvatar = currentImgSrc;
        if (currentImgSrc) {
            avatarPreviewImg.src = currentImgSrc;
            avatarPreviewArea.style.display = "flex";
            inputImg.value = currentImgSrc.startsWith("data:") ? "" : currentImgSrc;
        } else {
            avatarPreviewArea.style.display = "none";
        }

        document.getElementById("inputCollege").value = document.getElementById("userCollege")?.innerText || "";
        document.getElementById("inputDegree").value = document.getElementById("userDegree")?.innerText || "";
        document.getElementById("inputYear").value = document.getElementById("userYear")?.innerText || "";
        document.getElementById("inputBranch").value = document.getElementById("userBranch")?.innerText || "";
        document.getElementById("inputSpec").value = document.getElementById("userSpec")?.innerText || "";
        document.getElementById("inputCgpa").value = document.getElementById("userCgpa")?.innerText || "";

        if (userProfile) {
            document.getElementById("input12School").value = userProfile.school12 || "";
            document.getElementById("input12Board").value = userProfile.board12 || "";
            document.getElementById("input12Year").value = userProfile.year12 || "";
            document.getElementById("input12Score").value = userProfile.score12 || "";

            document.getElementById("input10School").value = userProfile.school10 || "";
            document.getElementById("input10Board").value = userProfile.board10 || "";
            document.getElementById("input10Year").value = userProfile.year10 || "";
            document.getElementById("input10Score").value = userProfile.score10 || "";
        }

        openModal(editModal);
    });

    closeEditBtn?.addEventListener("click", () => closeModal(editModal));
    cancelModalBtn?.addEventListener("click", () => closeModal(editModal));

    editForm?.addEventListener("submit", (e) => {
        e.preventDefault();

        let finalAvatar = currentSelectedAvatar.trim();
        if (!finalAvatar && inputImg.value.trim() !== "") {
            finalAvatar = inputImg.value.trim();
        }
        if (!finalAvatar) {
            finalAvatar = document.getElementById("userImg")?.src || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
        }

        userProfile = {
            name: document.getElementById("inputName").value.trim(),
            img: finalAvatar,
            location: document.getElementById("inputLocation").value.trim(),
            email: document.getElementById("inputEmail").value.trim(),
            phone: document.getElementById("inputPhone").value.trim(),
            bio: document.getElementById("inputBio").value.trim(),
            college: document.getElementById("inputCollege").value.trim(),
            degree: document.getElementById("inputDegree").value.trim(),
            year: document.getElementById("inputYear").value.trim(),
            branch: document.getElementById("inputBranch").value.trim(),
            spec: document.getElementById("inputSpec").value.trim(),
            cgpa: document.getElementById("inputCgpa").value.trim(),
            school12: document.getElementById("input12School").value.trim(),
            board12: document.getElementById("input12Board").value.trim(),
            year12: document.getElementById("input12Year").value.trim(),
            score12: document.getElementById("input12Score").value.trim(),
            school10: document.getElementById("input10School").value.trim(),
            board10: document.getElementById("input10Board").value.trim(),
            year10: document.getElementById("input10Year").value.trim(),
            score10: document.getElementById("input10Score").value.trim()
        };

        saveToStorage("vs_profile", userProfile);
        loadProfile();
        closeModal(editModal);
    });

    // Resume Upload
    const uploadResumeBtn = document.getElementById("uploadResumeBtn");
    const resumeUploadInput = document.getElementById("resumeUploadInput");
    uploadResumeBtn?.addEventListener("click", () => resumeUploadInput.click());
    resumeUploadInput?.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            document.getElementById("resumeName").innerText = e.target.files[0].name;
            alert("Resume uploaded successfully!");
        }
    });

    // =========================================================
    // 7. PROFILE STRENGTH CALCULATION
    // =========================================================
    function updateProfileStrength() {
        let score = 20;

        function setStatus(elId, hasItems, label, count) {
            const el = document.getElementById(elId);
            if (!el) return;
            if (hasItems) {
                el.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${label} (${count})`;
                el.style.color = "var(--teal)";
            } else {
                el.innerHTML = `<i class="fa-regular fa-circle"></i> ${label}`;
                el.style.color = "#57707e";
            }
        }

        if (userSkills.length > 0) score += 20;
        setStatus("chk-skills", userSkills.length > 0, "Skills", userSkills.length);

        if (userProjects.length > 0) score += 20;
        setStatus("chk-projects", userProjects.length > 0, "Projects", userProjects.length);

        if (userInternships.length > 0) score += 20;
        setStatus("chk-interns", userInternships.length > 0, "Internships", userInternships.length);

        if (userExperience.length > 0) score += 20;
        setStatus("chk-exp", userExperience.length > 0, "Experience", userExperience.length);

        if (score > 100) score = 100;
        document.getElementById("strengthScore").innerText = score + "%";

        const circle = document.getElementById("strengthSvgCircle");
        if (circle) circle.style.strokeDashoffset = 264 - (264 * score) / 100;

        const label = document.getElementById("strengthLabel");
        const hint = document.getElementById("strengthHint");
        if (score < 50) {
            label.innerText = "Beginner";
            hint.innerText = "Add your projects and skills to complete your portfolio.";
        } else if (score < 80) {
            label.innerText = "Intermediate";
            hint.innerText = "Good progress! Add your experience and internship certificates to level up.";
        } else {
            label.innerText = "All-Star Profile";
            hint.innerText = "Your portfolio is complete and ready for recruiters!";
        }
    }
});