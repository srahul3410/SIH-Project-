const rows = document.querySelectorAll("tbody tr");

rows.forEach(function(row) {

    row.addEventListener("click", function() {

        const skill = row.children[0].textContent;

        alert(
            skill +
            " selected.\n\nDetailed skill analysis will open here."
        );

    });

});