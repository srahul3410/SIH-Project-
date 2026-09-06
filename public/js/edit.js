// javascript
document.addEventListener("DOMContentLoaded", function () {

    const saveBtn = document.getElementById("saveBtn");
    const addLinkBtn = document.getElementById("addLink");


    /* ================= SAVE PROFILE ================= */

    saveBtn.addEventListener("click", function () {

        const name = document.getElementById("name").value.trim();

        if (name === "") {
            alert("Please enter your full name.");
            return;
        }


        showMessage("Profile updated successfully!");

    });


    /* ================= ADD NEW LINK ================= */

    addLinkBtn.addEventListener("click", function () {

        const linkRow = document.createElement("div");

        linkRow.classList.add("link-row");

        linkRow.innerHTML = `
            <label>New Link</label>

            <input
                type="url"
                placeholder="https://example.com/your-profile"
            >
        `;


        addLinkBtn.before(linkRow);

    });


    /* ================= SUCCESS MESSAGE ================= */

    function showMessage(message) {

        const oldMessage =
            document.querySelector(".success-message");

        if (oldMessage) {
            oldMessage.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className = "success-message";

        messageBox.textContent = message;

        document.body.appendChild(messageBox);


        setTimeout(function () {

            messageBox.remove();

        }, 2500);

    }

});
