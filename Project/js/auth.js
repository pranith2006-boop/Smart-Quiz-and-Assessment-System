// User management functions
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        // Check if we're on login page
        if (document.getElementById('loginForm')) {
            this.setupLogin();
        }
        
        // Check if we're on register page
        if (document.getElementById('registerForm')) {
            this.setupRegister();
        }
    }

    setupLogin() {
        const loginForm = document.getElementById('loginForm');
        const guestBtn = document.getElementById('guestBtn');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        guestBtn.addEventListener('click', () => {
            this.handleGuestLogin();
        });
    }

    setupRegister() {
        const registerForm = document.getElementById('registerForm');

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    handleRegister() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            alert('An account with this email already exists!');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            scores: {}
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        alert('Registration successful! Please login.');
        window.location.href = 'index.html';
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password!');
        }
    }

    handleGuestLogin() {
        const guestUser = {
            id: 'guest',
            name: 'Guest',
            email: 'guest@quiz.com',
            isGuest: true,
            scores: {}
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
        window.location.href = 'dashboard.html';
    }

    static getCurrentUser() {
        const userStr = sessionStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    static logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Initialize auth manager when the script loads
new AuthManager();