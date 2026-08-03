// Initialize EmailJS
emailjs.init("iqQBcfitXfQUrSt29");
console.log("EmailJS Loaded");

// Global variables
let allQuestions = [];
let quizQuestions = [];
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let timeRemaining = 0;
let timerInterval = null;
let currentUser = null;

//HTML linkage

// Authentication page 
const registerSection = document.getElementById("registerSection");
const loginSection = document.getElementById("loginSection");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");
const registerBtn = document.getElementById("registerBtn");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeUser = document.getElementById("welcomeUser");
const userName = document.getElementById("userName");

//Quiz setup page
const setupSection = document.getElementById("setup");
const subjectDropdown = document.getElementById("subject");
const questionCountInput = document.getElementById("questionCount");
const startBtn = document.getElementById("startBtn");

//Quizing page
const quizSection = document.getElementById("quiz");
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const currentQuestionNumber = document.getElementById("currentQuestionNumber");
const questionNumbers = document.getElementById("questionNumbers");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const submitQuizBtn = document.getElementById("submitQuizBtn");

// Timer element
const timer = document.getElementById("timer");
const timerBox = document.getElementById("timerBox");

//Results
const resultSection = document.getElementById("result");
const finalScore = document.getElementById("finalScore");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const percentage = document.getElementById("percentage");
const reviewContainer = document.getElementById("reviewContainer");
const restartBtn = document.getElementById("restartBtn");
const emailResultBtn =document.getElementById("emailResultBtn");

// Submita modal
const submitModal = document.getElementById("submitModal");
const unansweredWarning = document.getElementById("unansweredWarning");
const cancelSubmitBtn = document.getElementById("cancelSubmitBtn");
const confirmSubmitBtn = document.getElementById("confirmSubmitBtn");

//Time up Modal
const timeUpModal = document.getElementById("timeUpModal");

// Page Load
window.addEventListener("load", function () {
    loadQuestions();});

// Load the questions from the json file (side note: async cuz time lagbe)
async function loadQuestions() {
    try {const response =await fetch("questions.json");
        if (!response.ok) {
            throw new Error( "Unable to load questions.");}
        allQuestions = await response.json();
        console.log( "Questions loaded:",allQuestions);
        loadSubjects();}
    catch (error) {console.error(error);
        alert("Unable to load quiz questions.");}
    }

// Load the subjects
function loadSubjects() {
    const subjects = [...new Set(allQuestions.map(question => question.Subject))];
    subjectDropdown.innerHTML ='<option value="">Select a subject</option>';
    subjects.forEach(function (subject) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectDropdown.appendChild(option);
    });
}

//Switch between register page and login page
showLoginBtn.addEventListener("click",function () {
     registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");}
);

showRegisterBtn.addEventListener("click",function () {
        loginSection.classList.add("hidden");
        registerSection.classList.remove("hidden");}
);

// Register with an api.. the clauses of accepting the user info
registerBtn.addEventListener("click",registerUser);
async function registerUser() {
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;
    // Validation

    // Check if any field is empty
    if (name === "" ||email === "" ||password === "" ||confirm === "") {
        alert("Please fill in all fields.");
        return;
    }
    //Check if email is an email
    function isValidEmail(email) {const emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);}
    if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;}
    // Username must contain at least 5 characters
    if (name.length < 5) {
        alert("Username must be at least 5 characters long.");
        return;
    }
    // Password must contain at least 8 characters
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }
    // Password must contain at least one number
    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
        alert("Password must contain at least one number.");
        return;
    }
    // Password must contain at least one special character
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);
    if (!hasSpecialCharacter) {
        alert("Password must contain at least one special character.");
        return;
    }
    // Confirm password must match password
    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    // Get existing users for checking
    let registeredUsers =JSON.parse(localStorage.getItem("registeredUsers")) || [];
    // Check if repetative username
    const usernameExists =registeredUsers.some(function (user) {
            return (user.name.toLowerCase() ===name.toLowerCase());});
    if (usernameExists) {alert("This username is already registered.");
        return;
    }
    //Check repetative email
    const emailExists =registeredUsers.some(function (user) {
            return (user.email.toLowerCase() ===email.toLowerCase());});
    if (emailExists) { alert("An account with this email already exists.");
        return;
    }
    // Send user information to DummyJSON API
    try {
    const response = await fetch("https://dummyjson.com/users/add",
        { method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username: name,
                email: email,
                password: password })
        }
    );
    // Check whether API accepted the request
    if (!response.ok) {throw new Error("API registration failed.");}
    // Get response from API
    const data = await response.json();
    console.log("API accepted user:");
    console.log(data);}
    catch (error) {
    console.error("Registration API error:", error);
    alert("Registration failed. Please try again.");
    return;
    }
    //Create new user
    const newUser = {
        name: name,
        email: email,
        password: password
    };
    registeredUsers.push(newUser);
    // Save all registered users
    localStorage.setItem(
        "registeredUsers",
        JSON.stringify(registeredUsers)
 );
    // Make this the current logged in user
    currentUser = {
        name: name,
        email: email
    };
    localStorage.setItem(
        "quizUser",
        JSON.stringify(currentUser)
    );alert("Registration successful!");
    // Open quiz setup
    openQuizSetup();
}

// Login page 
loginBtn.addEventListener("click", loginUser);
function loginUser() {
    // Get information entered in login form
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    // Check empty fields
    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    // Search for user with entered email
    const foundUser = registeredUsers.find(function (user) {
        return (user.email.toLowerCase() ===email.toLowerCase());
    });
    // Email not registered
    if (!foundUser) {
        alert("No account exists with this email.");
        return;
    }
    // Check password
    if (foundUser.password !== password) {
        alert("Incorrect password.");
        return;
    }
    // Login successful
    currentUser = {
        name: foundUser.name,
        email: foundUser.email
    };
    // Remember currently logged-in user
    localStorage.setItem("quizUser",JSON.stringify(currentUser));
    alert("Login successful!");
    // Open quiz setup
    openQuizSetup();
}

// Open quiz after login
function openQuizSetup() {
    registerSection.classList.add("hidden");
    loginSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    setupSection.classList.remove("hidden");
    welcomeUser.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    userName.textContent = currentUser.name;
}

// Logout
logoutBtn.addEventListener("click",logoutUser);
function logoutUser() {
    clearInterval(timerInterval);
    currentUser = null;
    localStorage.removeItem("quizUser");
    setupSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
    welcomeUser.classList.add("hidden");
    logoutBtn.classList.add("hidden");
}

// Start quiz
startBtn.addEventListener("click",startQuiz);
function startQuiz() {
    const selectedSubject = subjectDropdown.value;
    const numberOfQuestions = parseInt(questionCountInput.value);
    // Validation
    if (selectedSubject === "") {
        alert("Please select a subject.");
        return;
    }
    if (isNaN(numberOfQuestions) ||numberOfQuestions <= 0) {
        alert("Please enter a valid number of questions.");
        return;
    }

    // Filter subject
    let filteredQuestions =
        allQuestions.filter(function (question) {
                return (question.Subject ===selectedSubject);});
    if (numberOfQuestions >filteredQuestions.length) {
        alert("Only " +filteredQuestions.length +" questions are available.");
        return;
    }

    // Shuffle questions
    filteredQuestions.sort(function () {return Math.random() - 0.5;});

    // Select required questions
    quizQuestions =filteredQuestions.slice(0,numberOfQuestions);

    // Reset quiz
    currentQuestion = 0;
    score = 0;

    /* user stores answers in here*/
    userAnswers =
        new Array( quizQuestions.length).fill(null);

    // Change screen
    setupSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    quizSection.classList.remove("hidden");

    // Generate question toggle buttons
    createQuestionNavigation();

    // Display first question
    showQuestion();

    // Start timer
    startTimer();
}

// Creating question number buttons
function createQuestionNavigation() {
    questionNumbers.innerHTML = "";
    quizQuestions.forEach(function (question, index) {
            const button =document.createElement("button");
            button.textContent =index + 1;
            button.addEventListener("click",function () {
                    currentQuestion = index;
                    showQuestion();}
            );
            questionNumbers.appendChild(button);
        }
    );
}

// Show questions
function showQuestion() {
    const question = quizQuestions[currentQuestion];
    questionText.textContent = question.Question;
    currentQuestionNumber.textContent = currentQuestion + 1;
    progressText.textContent = "Question " +(currentQuestion + 1) + " / " + quizQuestions.length;
    // Progress percentage
    const progress =((currentQuestion + 1) /quizQuestions.length) * 100;
    progressFill.style.width = progress + "%";
    // Clear old options
    optionsDiv.innerHTML = "";
    const options = [
        question.Option1,
        question.Option2,
        question.Option3,
        question.Option4
    ];
    // Create option buttons
    options.forEach(function (option) {const button =document.createElement("button");
            button.textContent =option;
            button.classList.add("option");
            /* If user already answered this question, restore selection.*/
            if (userAnswers[currentQuestion]=== option) {
                button.classList.add("selected");
            }
            button.addEventListener("click",function () {selectAnswer(option);});
            optionsDiv.appendChild( button);

        }
    );
    updateNavigation();
    updatePreviousNextButtons();
}

// Select and save answer
function selectAnswer(option) {
    userAnswers[currentQuestion] =option;
    // Refresh question
    showQuestion();
}

// Update question naviigation
function updateNavigation() {
    const buttons =questionNumbers.querySelectorAll("button");
    buttons.forEach(
        function (button, index) {
            button.classList.remove("active","answered");
            // Current question
            if (index === currentQuestion) {
                button.classList.add("active");
            }
            // Already answered
            if (userAnswers[index] !== null) {
                button.classList.add("answered");
            }
        }
    );
}

// Previous Question
previousBtn.addEventListener("click", function () {
    if (currentQuestion > 0) {
        currentQuestion--;
            showQuestion();
        }
    }
);

//Next Question
nextBtn.addEventListener("click",function () {
        if (currentQuestion <quizQuestions.length - 1) {
            currentQuestion++;
            showQuestion();
        }
    }
);

// Previous and next buttons
function updatePreviousNextButtons() {
    previousBtn.disabled =currentQuestion === 0;
    nextBtn.disabled = currentQuestion === quizQuestions.length - 1;
}

// Timer
function startTimer() {
    clearInterval(timerInterval);
    // minutes to seconds 
    timeRemaining = quizQuestions.length * 60;
    displayTimer();
    timerInterval = setInterval( function () {timeRemaining--;
                displayTimer();
                // Warning below 1 minute
                if (timeRemaining <= 60) {
                    timerBox.classList.add("warning");
                }
                // Warning below 30 seconds
                if (timeRemaining <= 30) {
                    timerBox.classList.remove("warning");
                }
                // Time finished
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    timeRemaining = 0;
                    displayTimer();
                    timeUp();
                }
            },
            1000
        );
}

// Display timer
function displayTimer() {
    const minutes = Math.floor( timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timer.textContent = String(minutes).padStart(2, "0")+":" + String(seconds).padStart(2, "0");
}

// Time uppp
function timeUp() {
    timeUpModal.classList.remove("hidden");
    // pause screen for slow bhondus
    setTimeout(function () {
            timeUpModal.classList.add("hidden");
             finishQuiz(); },
        1500
    );
}

// manual submit button
submitQuizBtn.addEventListener("click",openSubmitModal);
function openSubmitModal() {
    const unanswered =userAnswers.filter(answer => answer === null).length;
    if (unanswered > 0) {
        unansweredWarning.textContent ="You still have " + unanswered + " unanswered question(s)."; }
    else {
        unansweredWarning.textContent ="You have answered all questions.";}
    submitModal.classList.remove( "hidden" );
}

// Cancel the submission
cancelSubmitBtn.addEventListener("click",
    function () {
        submitModal.classList.add("hidden");
    }
);

// Confirm submission
confirmSubmitBtn.addEventListener( "click",
    function () {
        submitModal.classList.add("hidden" );
        finishQuiz(); }
);


// Finish the quiz
function finishQuiz() {
    clearInterval(timerInterval);
    timerBox.classList.remove("warning","danger" );
    score = 0;
    // Calculate score ONLY NOW
    quizQuestions.forEach(
        function (question, index) {
            if ( userAnswers[index] === question.Answer) 
               {score++;}
        }
    );

    // Change screen
    quizSection.classList.add("hidden");
    resultSection.classList.remove("hidden" );

    // Score
    finalScore.textContent = score + " / " + quizQuestions.length;
    correctCount.textContent = score;
    wrongCount.textContent =quizQuestions.length - score;
    const percent =(score / quizQuestions.length) * 100;
    percentage.textContent = percent.toFixed(2) + "%";

    // Generate answer review
    displayReview();

    // Scroll to result
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Answers and questions review page
function displayReview() { reviewContainer.innerHTML = "";
    quizQuestions.forEach(
        function (question, index) {
            const reviewCard = document.createElement("div");
            reviewCard.classList.add( "review-card");
            // Question heading
            const heading = document.createElement("h3");
            heading.textContent = (index + 1) + ". " + question.Question;
            reviewCard.appendChild( heading);
            // Options container
            const reviewOptions = document.createElement("div");
            reviewOptions.classList.add( "review-options");
            const options = [
                question.Option1,
                question.Option2,
                question.Option3,
                question.Option4
            ];
            options.forEach(
                function (option) {
                    const optionDiv =document.createElement( "div");
                    optionDiv.classList.add( "review-option");
                    const optionText = document.createElement("span" );
                    optionText.textContent =option;
                    optionDiv.appendChild( optionText );
                    const userAnswer = userAnswers[index];
                    // if answer is correct
                    if ( option === question.Answer && option === userAnswer ) {
                        optionDiv.classList.add( "selected-correct" );
                        const label = document.createElement( "span");
                        label.textContent = "Your Answer ✓";
                        optionDiv.appendChild( label);
                    }
                    // if answer is correct but user didnt choose it
                    else if (option === question.Answer) {
                        optionDiv.classList.add("correct-answer");
                        const label =document.createElement("span");
                        label.textContent ="Correct Answer";
                        optionDiv.appendChild(label);
                    }
                    // User puro bhul bhal koreche
                    else if ( option === userAnswer) {
                        optionDiv.classList.add( "selected-wrong" );
                        const label =document.createElement( "span" );
                        label.textContent ="Your Answer ✕";
                        optionDiv.appendChild( label);
                    }
                    reviewOptions.appendChild( optionDiv);
                }
            );
            // if no answer was attempted
            if (userAnswers[index] === null) {
                const unanswered = document.createElement("div");
                unanswered.classList.add("review-option","unanswered");
                unanswered.textContent ="Not Answered";
                reviewOptions.appendChild(unanswered);
            }
            reviewCard.appendChild(reviewOptions);
            reviewContainer.appendChild(reviewCard);
        }
    );
}

// Restart and initialise
restartBtn.addEventListener("click",restartQuiz);
emailResultBtn.addEventListener("click",sendResultEmail);
function restartQuiz() {
    clearInterval(timerInterval);
    currentQuestion = 0;
    score = 0;
    quizQuestions = [];
    userAnswers = [];
    timeRemaining = 0;
    questionCountInput.value = "";
    subjectDropdown.selectedIndex = 0;
    resultSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    setupSection.classList.remove("hidden");
    progressFill.style.width = "0%";
    reviewContainer.innerHTML = "";
    timer.textContent ="00:00";
    timerBox.classList.remove( "warning","danger");
    emailResultBtn.addEventListener("click",sendResultEmail);
}

async function sendResultEmail() {
    const templateParams = {
        user_name: currentUser.name,
        user_email: currentUser.email,
        subject: subjectDropdown.value,
        total_questions: quizQuestions.length,
        score: score + " / " + quizQuestions.length,
        percentage: percentage.textContent
    };
    try {
        await emailjs.send("service_dnbon7s","template_v9us0y8",templateParams);
        alert("Overview sent successfully!");
    }
    catch (error) {console.error(error);
        alert("Unable to send email.");
    }
}
