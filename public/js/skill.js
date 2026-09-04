const questions = [

    {
        question: "Which language is mainly used for web page structure?",
        options: ["Python", "HTML", "C++", "Java"],
        answer: "HTML"
    },

    {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: "Queue"
    },

    {
        question: "Which language runs directly in the browser?",
        options: ["C", "C++", "JavaScript", "Python"],
        answer: "JavaScript"
    }

];


let currentQuestion = 0;

const startBtn =
    document.getElementById("startBtn");

const quiz =
    document.getElementById("quiz");

const question =
    document.getElementById("question");

const options =
    document.getElementById("options");

const nextBtn =
    document.getElementById("nextBtn");


startBtn.addEventListener("click", function() {

    quiz.classList.remove("hidden");

    showQuestion();

    quiz.scrollIntoView({
        behavior: "smooth"
    });

});


function showQuestion() {

    const q = questions[currentQuestion];

    question.textContent = q.question;

    options.innerHTML = "";

    q.options.forEach(function(option) {

        const div = document.createElement("div");

        div.className = "option";

        div.textContent = option;

        div.addEventListener("click", function() {

            document.querySelectorAll(".option")
                .forEach(x => x.style.background = "");

            div.style.background = "#eeeaff";

            div.dataset.selected = option;

        });

        options.appendChild(div);

    });

}


nextBtn.addEventListener("click", function() {

    currentQuestion++;

    if (currentQuestion >= questions.length) {

        question.textContent =
            "Assessment Completed!";

        options.innerHTML =
            "<p>Your skill assessment has been recorded.</p>";

        nextBtn.style.display = "none";

        return;
    }

    showQuestion();

});