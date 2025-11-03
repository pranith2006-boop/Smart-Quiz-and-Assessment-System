class QuizManager {
    constructor(questions, quizType) {
        this.questions = questions;
        this.quizType = quizType;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.displayQuestion();
        this.setupEventListeners();
    }

    checkAuthentication() {
        const user = AuthManager.getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
        }
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const progressElement = document.getElementById('progress');

        // Update progress
        progressElement.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;

        // Display question
        questionElement.textContent = question.question;

        // Display options
        optionsElement.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.onclick = () => this.selectOption(index);
            
            // Check if this option was previously selected
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionsElement.appendChild(optionElement);
        });

        // Update navigation buttons
        this.updateNavigation();
    }

    selectOption(optionIndex) {
        // Remove selected class from all options
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        
        // Add selected class to clicked option
        options[optionIndex].classList.add('selected');
        
        // Store user's answer
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        // Previous button
        prevBtn.style.visibility = this.currentQuestionIndex > 0 ? 'visible' : 'hidden';

        // Next/Submit button
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    submitQuiz() {
        this.calculateScore();
        this.showResults();
        this.saveResults();
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.score++;
            }
        });
    }

    showResults() {
        const quizContainer = document.getElementById('quizContainer');
        const resultsContainer = document.getElementById('resultsContainer');
        const scoreElement = document.getElementById('finalScore');
        const messageElement = document.getElementById('message');

        // Calculate percentage
        const percentage = (this.score / this.questions.length) * 100;

        // Display score
        scoreElement.textContent = `${this.score}/${this.questions.length}`;

        // Display message based on performance
        let message = '';
        if (percentage >= 90) {
            message = 'Excellent! You are a master! 🎉';
        } else if (percentage >= 70) {
            message = 'Great job! You have good knowledge! 👍';
        } else if (percentage >= 50) {
            message = 'Good effort! Keep practicing! 💪';
        } else {
            message = 'Keep learning! You can do better! 📚';
        }
        messageElement.textContent = message;

        // Show results, hide quiz
        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
    }

    saveResults() {
        const user = AuthManager.getCurrentUser();
        if (!user) return;

        // Update user's scores
        if (!user.scores) user.scores = {};
        
        // Only update if this is a better score
        const currentBest = user.scores[this.quizType] || 0;
        if (this.score > currentBest) {
            user.scores[this.quizType] = this.score;
            
            // Update in sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update in localStorage if not guest
            if (!user.isGuest) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex].scores[this.quizType] = this.score;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }
        }
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        
        document.getElementById('quizContainer').classList.remove('hidden');
        document.getElementById('resultsContainer').classList.add('hidden');
        
        this.displayQuestion();
    }

    backToDashboard() {
        window.location.href = 'dashboard.html';
    }
}

// Setup event listeners
function setupQuizEventListeners(quizManager) {
    document.getElementById('prevBtn').addEventListener('click', () => {
        quizManager.previousQuestion();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        quizManager.nextQuestion();
    });

    document.getElementById('submitBtn').addEventListener('click', () => {
        quizManager.submitQuiz();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        quizManager.restartQuiz();
    });

    document.getElementById('dashboardBtn').addEventListener('click', () => {
        quizManager.backToDashboard();
    });
}