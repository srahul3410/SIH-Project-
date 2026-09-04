
const notificationBtn =
    document.getElementById("notificationBtn");
notificationBtn.addEventListener("click", function () {
    alert("You have 1 new notification.");
});
// ===============================
// APPLY BUTTON
// ===============================
const applyButtons =
    document.querySelectorAll(".apply-btn");
applyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const job =
            button
                .closest(".job")
                .querySelector("h3")
                .textContent;
        alert(
            "You selected:\n\n" +
            job +
            "\n\nApplication page will open soon."
        );
    });
});
// =============================
// SEARCH
// ===============================
const searchInput =
    document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
    const searchValue =
        searchInput.value.toLowerCase().trim();
    const jobs =
        document.querySelectorAll(".job");
    jobs.forEach(function (job) {
        const jobText =
            job.textContent.toLowerCase();
        if (jobText.includes(searchValue)) {
            job.style.display = "flex";
        } else {
            job.style.display = "none";
        }
    });
});