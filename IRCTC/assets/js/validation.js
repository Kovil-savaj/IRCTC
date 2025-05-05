// Validation patterns
const patterns = {
    username: /^[a-zA-Z]{6,}$/,
    password: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    mobile: /^\d{10}$/,
    aadhar: /^\d{12}$/
};

// Error messages
const errorMessages = {
    username: 'Username must be at least 6 characters long and contain only letters',
    password: 'Password must be at least 8 characters long and contain 1 uppercase, 1 number, and 1 special character',
    confirmPassword: 'Passwords do not match',
    email: 'Please enter a valid email address',
    mobile: 'Please enter a valid 10-digit mobile number',
    aadhar: 'Please enter a valid 12-digit Aadhar number'
};

// Add error message element after each input
document.querySelectorAll('.form-control').forEach(input => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
});

function showError(input, message) {
    input.classList.add('error');
    input.nextElementSibling.textContent = message;
}

function clearError(input) {
    input.classList.remove('error');
    input.nextElementSibling.textContent = '';
}

function validateField(input, pattern, errorMessage) {
    if (!pattern.test(input.value)) {
        showError(input, errorMessage);
        return false;
    }
    clearError(input);
    return true;
}

function validateForm(event) {
    event.preventDefault();
    let isValid = true;

    // Username validation
    const username = document.getElementById('username');
    if (!validateField(username, patterns.username, errorMessages.username)) {
        isValid = false;
    }

    // Password validation
    const password = document.getElementById('password');
    if (!validateField(password, patterns.password, errorMessages.password)) {
        isValid = false;
    }

    // Confirm password validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, errorMessages.confirmPassword);
        isValid = false;
    } else {
        clearError(confirmPassword);
    }

    // Email validation
    const email = document.getElementById('email');
    if (!validateField(email, patterns.email, errorMessages.email)) {
        isValid = false;
    }

    // Mobile validation
    const mobile = document.getElementById('mobile');
    if (!validateField(mobile, patterns.mobile, errorMessages.mobile)) {
        isValid = false;
    }

    // Aadhar validation
    const aadhar = document.getElementById('aadhar');
    if (!validateField(aadhar, patterns.aadhar, errorMessages.aadhar)) {
        isValid = false;
    }

    if (isValid) {
        // Store user data in localStorage (for demo purposes)
        const userData = {
            username: username.value,
            email: email.value,
            mobile: mobile.value,
            aadhar: aadhar.value
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Redirect to login page
        window.location.href = 'login.html';
    }

    return false;
}

// Real-time validation
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        const field = this.id;
        if (field === 'confirmPassword') {
            const password = document.getElementById('password');
            if (this.value !== password.value) {
                showError(this, errorMessages.confirmPassword);
            } else {
                clearError(this);
            }
        } else if (patterns[field]) {
            validateField(this, patterns[field], errorMessages[field]);
        }
    });
}); 