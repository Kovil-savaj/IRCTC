// Validation patterns
const patterns = {
    username: /^[a-zA-Z]{6,}$/,
    password: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
};

// Admin credentials
const adminCredentials = {
    username: 'admin',
    password: 'Admin@17'
};

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger mt-3';
    errorDiv.textContent = message;
    
    const form = document.getElementById('loginForm');
    const existingError = form.querySelector('.alert-danger');
    if (existingError) {
        existingError.remove();
    }
    form.insertBefore(errorDiv, form.firstChild);
}

function validateLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    if (userType === 'admin') {
        if (username === adminCredentials.username && password === adminCredentials.password) {
            localStorage.setItem('userType', 'admin');
            window.location.href = '../admin/dashboard.html';
            return false;
        }
        showError('Invalid admin credentials');
        return false;
    }
    
    // Validate username and password against patterns
    if (!patterns.username.test(username)) {
        showError('Username must be at least 6 characters long and contain only letters');
        return false;
    }
    
    if (!patterns.password.test(password)) {
        showError('Password must be at least 8 characters long and contain 1 uppercase, 1 number, and 1 special character');
        return false;
    }
    
    // If validation passes, allow login
    const user = { username: username };
    localStorage.setItem('userType', 'user');
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
    return false;
}

// Add error message element after each input
document.querySelectorAll('.form-control').forEach(input => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
});

// Real-time validation
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.trim() === '') {
            showError('This field is required');
        } else {
            const errorDiv = this.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.textContent = '';
            }
        }
    });
}); 