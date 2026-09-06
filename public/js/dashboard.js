/* =========================================
   VIDYASETU DASHBOARD JAVASCRIPT
========================================= */


/* =========================================
   INITIALIZE LUCIDE ICONS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    lucide.createIcons();

});


/* =========================================
   SIDEBAR HAMBURGER
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    lucide.createIcons();

    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");

    if (!menuButton || !sidebar) {
        console.log("Hamburger or sidebar not found");
        return;
    }

    menuButton.addEventListener("click", function () {

        if (window.innerWidth > 950) {

            sidebar.classList.toggle("closed");
            mainContent.classList.toggle("sidebar-closed");

        } else {

            sidebar.classList.toggle("open");

        }

    });

});


/* =========================================
   CLOSE SIDEBAR WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener("click", function (event) {

    if (
        window.innerWidth <= 950 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
    ) {

        sidebar.classList.remove("open");

    }

});


/* =========================================
   SIDEBAR ACTIVE ITEM
========================================= */

const navItems = document.querySelectorAll(".nav-item");


navItems.forEach(function (item) {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        navItems.forEach(function (nav) {

            nav.classList.remove("active");

        });

        item.classList.add("active");

    });

});


/* =========================================
   BOOKMARK BUTTONS
========================================= */

const bookmarkIcons =
    document.querySelectorAll(
        ".opportunity-title svg"
    );


bookmarkIcons.forEach(function (icon) {

    icon.addEventListener("click", function () {

        icon.classList.toggle("bookmarked");

        if (icon.classList.contains("bookmarked")) {

            icon.style.color = "#0f766e";

        } else {

            icon.style.color = "";

        }

    });

});


/* =========================================
   SIMPLE SEARCH
========================================= */

const searchInput =
    document.querySelector(".search-box input");


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function () {

            const searchValue =
                searchInput.value.toLowerCase();

            const opportunities =
                document.querySelectorAll(
                    ".opportunity"
                );


            opportunities.forEach(function (item) {

                const text =
                    item.textContent.toLowerCase();


                if (text.includes(searchValue)) {

                    item.style.display = "flex";

                } else {

                    item.style.display = "none";

                }

            });

        }
    );

}


/* =========================================
   ANIMATED NUMBER COUNTERS
========================================= */

function animateNumber(element, target) {

    let current = 0;

    const duration = 800;

    const stepTime = 20;

    const increment =
        target / (duration / stepTime);


    const timer = setInterval(function () {

        current += increment;


        if (current >= target) {

            current = target;

            clearInterval(timer);

        }


        element.textContent =
            Math.floor(current);

    }, stepTime);

}


const analyticsNumbers =
    document.querySelectorAll(
        ".analytics-card strong"
    );


analyticsNumbers.forEach(function (element) {

    const value =
        parseInt(
            element.textContent.replace(
                /[^0-9]/g,
                ""
            )
        );


    if (!isNaN(value)) {

        element.textContent = "0";

        animateNumber(element, value);

    }

});


/* =========================================
   BUTTON INTERACTION
========================================= */

const buttons =
    document.querySelectorAll("button");


buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (
            button.classList.contains(
                "outline-button"
            )
        ) {

            console.log(
                "Navigation button clicked"
            );

        }

    });

});