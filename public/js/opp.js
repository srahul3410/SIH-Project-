const applyButtons =
    document.querySelectorAll(".apply");

applyButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const job =
            button
            .closest(".job")
            .querySelector("h2")
            .textContent;

        alert(
            "You are applying for:\n\n" +
            job
        );

    });

});


const saveButtons =
    document.querySelectorAll(".save");

saveButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        button.textContent = "♥ Saved";

    });

});


const search =
    document.getElementById("search");


search.addEventListener("input", function() {

    const value =
        search.value.toLowerCase();

    document
        .querySelectorAll(".job")
        .forEach(function(job) {

            const text =
                job.textContent.toLowerCase();

            job.style.display =
                text.includes(value)
                ? "flex"
                : "none";

        });

});