console.log("quiz.js loaded");

// Cybersecurity-focused quiz questions
let quiz = [
    {
        question: "Q1: What is a transposition cipher?",
        choices: [
            "A cipher that substitutes letters with other letters",
            "A cipher that rearranges the order of letters",
            "A cipher that uses mathematical algorithms only",
            "A cipher that requires a physical key"
        ],
        correct: "A cipher that rearranges the order of letters",
        explanation: "A transposition cipher rearranges the positions of characters in the plaintext according to a specific system, without changing the actual characters. This is different from substitution ciphers which replace characters."
    },
    {
        question: "Q2: In the puzzle, what was the keyword used to decrypt the message?",
        choices: [
            "CODE",
            "LOCK",
            "CLUE",
            "KEYS"
        ],
        correct: "CLUE",
        explanation: "The keyword was CLUE, which was found by rearranging the keyboard keys (C, L, U, E) found at the scene."
    },
    {
        question: "Q3: What is the main advantage of transposition ciphers over simple substitution ciphers?",
        choices: [
            "They are impossible to break",
            "They hide letter frequency patterns",
            "They don't require a key",
            "They work only with numbers"
        ],
        correct: "They hide letter frequency patterns",
        explanation: "Transposition ciphers maintain the same letter frequencies as the original text but hide the patterns by rearranging them, making frequency analysis less effective than with substitution ciphers."
    },
    {
        question: "Q4: In our decryption table, why did we need exactly 4 columns?",
        choices: [
            "Because the cipher text had 4 words",
            "Because the keyword CLUE has 4 letters",
            "Because 4 is a common number in cryptography",
            "Because the table looks better with 4 columns"
        ],
        correct: "Because the keyword CLUE has 4 letters",
        explanation: "In a columnar transposition cipher, the number of columns equals the number of letters in the keyword. The keyword CLUE has 4 letters, so we needed 4 columns."
    },
    {
        question: "Q5: What is the first step in breaking an unknown transposition cipher?",
        choices: [
            "Try all possible keys",
            "Determine the likely length of the keyword",
            "Use a brute force attack",
            "Contact the sender for the key"
        ],
        correct: "Determine the likely length of the keyword",
        explanation: "When breaking a transposition cipher, cryptanalysts first try to determine the keyword length by looking for patterns and testing different column counts, as this significantly narrows down the search space."
    }
];

var currentQuestion = 0;
var score = 0;
var askingQuestion = true;

function loadQuestion() {
    //set temporary variable for creating radio buttons
    var radioButton;

    //clear out radio buttons from previous question
    document.getElementById("content").innerHTML = "";

    //loop through choices, and create radio buttons
    for (var i = 0; i < quiz[currentQuestion]["choices"].length; i++) {
        radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "quiz";
        radioButton.id = "choice" + (i + 1);
        radioButton.value = quiz[currentQuestion]["choices"][i];

        //create label tag, which hold the actual text of the choices
        var label = document.createElement("label");
        label.setAttribute("for", "choice" + (i + 1));
        label.innerHTML = quiz[currentQuestion]["choices"][i];

        //attach them to content
        document.getElementById("content").appendChild(radioButton);
        document.getElementById("content").appendChild(label);
        document.getElementById("content").appendChild(document.createElement("br"));
    }

    //load the question
    document.getElementById("question").innerHTML =
        quiz[currentQuestion]["question"];

    //setup score for first time
    if (currentQuestion == 0) {
        document.getElementById("score").innerHTML =
            "<p>score: 0 right answers out of " + quiz.length + " possible</p>";
    }
}

function checkAnswer() {
    //are we asking a question, or proceeding to next question?
    if (askingQuestion) {
        //change button text to next question, so next time they click it, it goes to next question
        document.getElementById("check").innerHTML = "Next Question →";
        askingQuestion = false;

        //determine which radio button they clicked
        var userpick;
        var correctIndex;
        var radios = document.getElementsByName("quiz");
        var answered = false;
        
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                //if this radio button is checked
                userpick = radios[i].value;
                answered = true;
            }
            //get index of correct answer
            if (radios[i].value == quiz[currentQuestion]["correct"]) {
                correctIndex = i;
            }
        }
        
        // Check if user selected an answer
        if (!answered) {
            alert("Please select an answer before submitting.");
            document.getElementById("check").innerHTML = "Submit Answer";
            askingQuestion = true;
            return;
        }

        //set the color if they got it right, or wrong
        if (userpick == quiz[currentQuestion]["correct"]) {
            score++;
            document.getElementsByTagName("label")[correctIndex].style.color =
                "#28a745";
            document.getElementsByTagName("label")[correctIndex].style.fontWeight =
                "bold";
            document.getElementById("explanation").innerHTML = "<h3 style='color: #28a745;'>✓ Correct!</h3>";
        } else {
            document.getElementsByTagName("label")[correctIndex].style.color = "#dc3545";
            document.getElementsByTagName("label")[correctIndex].style.fontWeight =
                "bold";
            document.getElementById("explanation").innerHTML = "<h3 style='color: #dc3545;'>✗ Incorrect</h3>";
        }

        document.getElementById("explanation").innerHTML +=
            "<p style='color: #ccc; margin-top: 10px;'>" + quiz[currentQuestion]["explanation"] + "</p>";
        document.getElementById("score").innerHTML =
            "<p>score: " +
            score +
            " right answers out of " +
            quiz.length +
            " possible</p>";
    } else {
        //reset form and move to next question

        //setting up so user can ask a question
        askingQuestion = true;

        //change button text back to 'submit answer'
        document.getElementById("check").innerHTML = "Submit Answer";

        document.getElementById("explanation").innerHTML = "";

        //if we're not on last question, increase question number
        if (currentQuestion < quiz.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            showFinalResults();
        }
    }
}

function showFinalResults() {
    const percentage = Math.round((score / quiz.length) * 100);
    let message = "";
    let emoji = "";
    
    if (percentage >= 80) {
        emoji = "🏆";
        message = "Excellent work, Agent! You have mastered the basics of transposition ciphers.";
    } else if (percentage >= 60) {
        emoji = "🥈";
        message = "Good job! You have a solid understanding of cryptography concepts.";
    } else {
        emoji = "📚";
        message = "Keep learning! Review the puzzle steps to improve your understanding.";
    }
    
    document.getElementById("content").innerHTML =
        `<div class="quiz-complete">
            <h2>${emoji} Quiz Complete!</h2>
            <p style="color: #ccc; margin-bottom: 20px;">${message}</p>
            <div class="score-display">${score}/${quiz.length}</div>
            <p style="font-size: 24px; color: var(--primary-color);">${percentage}%</p>
        </div>`;

    //delete the button
    var button = document.getElementById("check");
    button.parentNode.removeChild(button);

    //remove question
    document.getElementById("question").innerHTML = "";
    document.getElementById("score").innerHTML = "";
    
    // Add back link
    const backLink = document.createElement("a");
    backLink.href = "./puzzle1.html";
    backLink.className = "back-link";
    backLink.innerHTML = "← Back to Puzzle 1";
    document.getElementById("content").appendChild(backLink);
    
    // Save quiz completion
    if (window.GameState) {
        const progress = GameState.getProgress();
        progress['quiz'] = {
            completed: true,
            score: score,
            total: quiz.length,
            percentage: percentage,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('cyberpuzzle_progress', JSON.stringify(progress));
    }
}

window.onload = loadQuestion;
