class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadUserData();
        this.updateProgress();
    }

    checkAuthentication() {
        this.currentUser = AuthManager.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
    }

    loadUserData() {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (this.currentUser.isGuest) {
            welcomeMessage.innerHTML = `<h2>Welcome, Guest!</h2><p>Continue as guest - progress will be saved temporarily</p>`;
        } else {
            welcomeMessage.innerHTML = `<h2>Welcome back, ${this.currentUser.name}!</h2><p>Ready to test your knowledge?</p>`;
        }
    }

    updateProgress() {
        const quizzes = ['html', 'css', 'js'];
        
        quizzes.forEach(quiz => {
            const scoreElement = document.getElementById(quiz + 'Score');
            const progressElement = document.getElementById(quiz + 'Progress');
            
            if (this.currentUser.scores && this.currentUser.scores[quiz]) {
                const score = this.currentUser.scores[quiz];
                const percentage = (score / 10) * 100;
                
                scoreElement.textContent = `Best Score: ${score}/10`;
                progressElement.style.width = percentage + '%';
            }
        });
    }
}

function startQuiz(quizType) {
    switch(quizType) {
        case 'html':
            window.location.href = 'quiz_html.html';
            break;
        case 'css':
            window.location.href = 'quiz_css.html';
            break;
        case 'js':
            window.location.href = 'quiz_js.html';
            break;
    }
}

function logout() {
    AuthManager.logout();
}

// Initialize dashboard when page loads
new DashboardManager();