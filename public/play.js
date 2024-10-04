let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestions() {
    try {
        const response = await fetch('/api/questions');
        questions = await response.json();
        shuffleQuestions();
        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        document.getElementById('questionContainer').innerHTML = 
            '<p>Erro ao carregar questões. Por favor, tente novamente mais tarde.</p>';
    }
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function displayQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    document.getElementById('scoreValue').textContent = score;

    if (currentQuestionIndex >= questions.length) {
        showGameOver();
        return;
    }

    const question = questions[currentQuestionIndex];
    const options = [question.option1, question.option2];

    questionContainer.innerHTML = `
        <div class="question-card">
            <h2>Questão ${currentQuestionIndex + 1}</h2>
            <p>${question.question}</p>
            ${options.map((option, index) => `
                <button class="option-button" onclick="checkAnswer(${index})">${option}</button>
            `).join('')}
        </div>
    `;
}

function checkAnswer(selectedOption) {
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-button');
    
    buttons.forEach(button => button.disabled = true);
    
    if (selectedOption === question.correct_answer) {
        score++;
        buttons[selectedOption].classList.add('correct');
    } else {
        buttons[selectedOption].classList.add('incorrect');
        buttons[question.correct_answer].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1500);
}

function showGameOver() {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
}

function restartGame() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    shuffleQuestions();
    displayQuestion();
}

fetchQuestions();
