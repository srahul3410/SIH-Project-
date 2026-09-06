```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* ================= EDIT PROFILE ================= */

    const editProfile = document.getElementById("editProfile");

    if (editProfile) {

        editProfile.addEventListener("click", function () {

            alert("Edit Profile feature coming soon!");

        });

    }


    /* ================= ADD SKILL ================= */

    const addSkill = document.getElementById("addSkill");

    if (addSkill) {

        addSkill.addEventListener("click", function () {

            const skill = prompt("Enter your skill:");

            if (!skill || skill.trim() === "") {
                return;
            }

            const skillsContainer = document.querySelector(".skills");

            if (!skillsContainer) {
                return;
            }


            // Create new skill
            const skillElement = document.createElement("span");

            skillElement.textContent = skill.trim();

            skillsContainer.appendChild(skillElement);


            alert("Skill added successfully!");

        });

    }


    /* ================= SOCIAL LINKS ================= */

    const socialLinks = document.querySelectorAll(".social-link");

    socialLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            if (link.getAttribute("href") === "#") {

                event.preventDefault();

                const platform =
                    link.querySelector("span")?.textContent || "profile";

                alert("Add your " + platform + " link from Edit Profile.");

            }

        });

    });


    /* ================= NOTIFICATION ================= */

    const notification = document.querySelector(".notification");

    if (notification) {

        notification.addEventListener("click", function () {

            alert("No new notifications.");

        });

    }


    /* ================= UPLOAD RESUME ================= */

    const uploadResume = document.querySelector(".upload-btn");

    if (uploadResume) {

        uploadResume.addEventListener("click", function () {

            const input = document.createElement("input");

            input.type = "file";
            input.accept = ".pdf,.doc,.docx";

            input.click();


            input.addEventListener("change", function () {

                if (input.files.length > 0) {

                    const fileName = input.files[0].name;

                    const resumeTitle =
                        document.querySelector(".resume-box h3");

                    const resumeDescription =
                        document.querySelector(".resume-box p");

                    if (resumeTitle) {
                        resumeTitle.textContent = fileName;
                    }

                    if (resumeDescription) {
                        resumeDescription.textContent =
                            "Resume selected successfully.";
                    }

                    uploadResume.textContent = "Change Resume";

                }

            });

        });

    }


    /* ================= TAB / MENU EFFECT ================= */

    const menus = document.querySelectorAll(".menu");

    menus.forEach(function (menu) {

        menu.addEventListener("click", function () {

            if (menu.getAttribute("href") === "#") {

                menus.forEach(function (item) {
                    item.classList.remove("active");
                });

                menu.classList.add("active");

            }

        });

    });


    /* ================= SEARCH ================= */

    const searchInput = document.querySelector(".search input");

    if (searchInput) {

        searchInput.addEventListener("keyup", function () {

            const searchValue =
                searchInput.value.toLowerCase().trim();

            const cards = document.querySelectorAll(".card");

            cards.forEach(function (card) {

                const text =
                    card.textContent.toLowerCase();

                if (searchValue === "" || text.includes(searchValue)) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    }

});
```
