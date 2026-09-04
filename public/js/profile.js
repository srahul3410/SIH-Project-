const editButton = document.getElementById("editProfile");

editButton.addEventListener("click", function () {

    window.location.href = "../edit/index.html";

});


const tabs = document.querySelectorAll(".tab");

tabs.forEach(function(tab) {

    tab.addEventListener("click", function() {

        tabs.forEach(function(item) {
            item.classList.remove("active");
        });

        tab.classList.add("active");

    });

});