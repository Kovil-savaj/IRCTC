// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('onclick')) return; // Skip for logout
        
        e.preventDefault();
        const section = this.getAttribute('data-section');
        
        // Update active states
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Show selected section
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
    });
});

// Dummy user data
const dummyUsers = [
    { 
        id: 'USR001',
        name: 'Harshit',
        email: 'harshit@example.com',
        mobile: '9876543210',
        ticketsBooked: 5
    },
    { 
        id: 'USR002',
        name: 'Jainam',
        email: 'jainam@example.com',
        mobile: '9876543211',
        ticketsBooked: 3
    },
    {
        id: 'USR003',
        name: 'Kovil',
        email: 'kovil@example.com',
        mobile: '9913961701',
        ticketsBooked: 7
    }
];

// Load users into the table
function loadUsers() {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';

    dummyUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td>${user.ticketsBooked}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

let currentEditingUser = null;

// Delete user
function deleteUser(userId) {
    currentEditingUser = dummyUsers.find(u => u.id === userId);
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    deleteModal.show();
}

// Confirm delete
function confirmDelete() {
    if (currentEditingUser) {
        const index = dummyUsers.findIndex(u => u.id === currentEditingUser.id);
        if (index !== -1) {
            dummyUsers.splice(index, 1);
            loadUsers();
            
            // Show success message
            document.getElementById('successMessage').textContent = 'User deleted successfully!';
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            successModal.show();
            
            // Close delete modal
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
            deleteModal.hide();
        }
    }
}

// Dummy trains data
const dummyTrains = [
    {
        number: '12301',
        name: 'Rajdhani Express',
        from: 'New Delhi',
        to: 'Mumbai Central',
        seats: 500,
        ownership: 'Indian Railways'
    },
    {
        number: '12213',
        name: 'Vande Bharat Express',
        from: 'Howrah',
        to: 'New Delhi',
        seats: 450,
        ownership: 'Indian Railways'
    },
    {
        number: '12259',
        name: 'Duronto Express',
        from: 'Mumbai Central',
        to: 'Howrah',
        seats: 480,
        ownership: 'Indian Railways'
    }
];

// Train Form Handler
document.getElementById('trainForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const train = {
        number: document.getElementById('trainNumber').value,
        name: document.getElementById('trainName').value,
        from: document.getElementById('fromStation').value,
        to: document.getElementById('toStation').value,
        seats: document.getElementById('seats').value,
        ownership: document.getElementById('ownership').value
    };
    
    // Store train
    let trains = JSON.parse(localStorage.getItem('trains') || '[]');
    trains.push(train);
    localStorage.setItem('trains', JSON.stringify(trains));
    
    // Reset form
    this.reset();
    
    // Update trains list
    loadTrains();
});

// Load Trains
function loadTrains() {
    const trainsTableBody = document.getElementById('trainsTableBody');
    let trains = JSON.parse(localStorage.getItem('trains') || '[]');
    
    // If no trains exist, initialize with dummy trains
    if (trains.length === 0) {
        trains = dummyTrains;
        localStorage.setItem('trains', JSON.stringify(trains));
    }
    
    trainsTableBody.innerHTML = '';
    
    trains.forEach(train => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${train.number}</td>
            <td>${train.name}</td>
            <td>${train.from}</td>
            <td>${train.to}</td>
            <td>${train.seats}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteTrain('${train.number}')">Delete</button>
            </td>
        `;
        trainsTableBody.appendChild(row);
    });
}

// Delete Train
function deleteTrain(trainNumber) {
    if (confirm(`Are you sure you want to delete train ${trainNumber}?`)) {
        let trains = JSON.parse(localStorage.getItem('trains') || '[]');
        trains = trains.filter(train => train.number !== trainNumber);
        localStorage.setItem('trains', JSON.stringify(trains));
        
        loadTrains();
    }
}

// Logout
function logout() {
    window.location.href = '../user/login.html';
}

// Admin Profile Functions
function toggleAdminEditMode() {
    const form = document.getElementById('adminProfileForm');
    const inputs = form.querySelectorAll('input:not([type="checkbox"]), textarea');
    const editBtn = document.querySelector('.edit-profile-btn');
    const saveBtn = document.getElementById('saveAdminProfileBtn');
    const changePasswordCheckbox = document.getElementById('changeAdminPassword');
    
    // Toggle disabled state of inputs
    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });
    
    // Toggle button visibility
    editBtn.style.display = 'none';
    saveBtn.style.display = 'flex';
    
    // Enable password fields if checkbox is checked
    if (changePasswordCheckbox.checked) {
        const passwordFields = document.querySelectorAll('#adminPasswordFields input');
        passwordFields.forEach(input => {
            input.disabled = false;
        });
    }
}

// Add event listener for admin password change checkbox
document.getElementById('changeAdminPassword').addEventListener('change', function() {
    const passwordFields = document.querySelectorAll('#adminPasswordFields input');
    const isEditing = !document.getElementById('adminEmail').disabled;
    
    if (this.checked && isEditing) {
        document.getElementById('adminPasswordFields').style.display = 'block';
        passwordFields.forEach(input => {
            input.disabled = false;
        });
    } else {
        document.getElementById('adminPasswordFields').style.display = 'none';
        passwordFields.forEach(input => {
            input.disabled = true;
            input.value = '';
        });
    }
});

// Add form submit handler for admin profile
document.getElementById('adminProfileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    // For now, we'll just show a success message and reset the form
    alert('Profile updated successfully!');
    
    // Reset form to view mode
    const inputs = this.querySelectorAll('input:not([type="checkbox"]), textarea');
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    document.querySelector('.edit-profile-btn').style.display = 'flex';
    document.getElementById('saveAdminProfileBtn').style.display = 'none';
    document.getElementById('changeAdminPassword').checked = false;
    document.getElementById('adminPasswordFields').style.display = 'none';
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadTrains();
}); 