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

// Booking Form Handler
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate mobile number
    const mobile = document.getElementById('userMobile').value;
    if (!/^[6-9]\d{9}$/.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number starting with 6-9');
        return;
    }
    
    // Validate age
    const age = document.getElementById('userAge').value;
    if (age < 5 || age > 120) {
        alert('Please enter a valid age between 5 and 120');
        return;
    }
    
    // Validate date
    const journeyDate = document.getElementById('journeyDate').value;
    const selectedDate = new Date(journeyDate);
    const today = new Date();
    if (selectedDate < today) {
        alert('Please select a future date');
        return;
    }
    
    const bookingData = {
        userId: document.getElementById('userId').value,
        userName: document.getElementById('userName').value,
        userMobile: mobile,
        userAge: age,
        journeyDate: journeyDate,
        boardingStation: document.getElementById('boardingStation').value,
        destinationStation: document.getElementById('destinationStation').value,
        ticketClass: document.getElementById('ticketClass').value,
        numTickets: document.getElementById('numTickets').value
    };
    
    // Store booking data
    localStorage.setItem('currentBooking', JSON.stringify(bookingData));
    
    // Show available trains
    showAvailableTrains();
});

// Show Available Trains
function showAvailableTrains() {
    const trains = [
        {
            id: '12301',
            name: 'Rajdhani Express',
            from: 'New Delhi',
            to: 'Mumbai Central',
            departure: '08:00',
            arrival: '14:00',
            seats: 500,
            price: 2500
        },
        {
            id: '12213',
            name: 'Vande Bharat Express',
            from: 'Howrah',
            to: 'New Delhi',
            departure: '10:00',
            arrival: '16:00',
            seats: 450,
            price: 3000
        }
    ];
    
    const availableTrains = document.getElementById('availableTrains');
    availableTrains.innerHTML = '<h4 class="mb-4">Available Trains</h4>';
    
    const trainsGrid = document.createElement('div');
    trainsGrid.className = 'row';
    
    trains.forEach(train => {
        const trainCard = document.createElement('div');
        trainCard.className = 'col-md-6 mb-4';
        trainCard.innerHTML = `
            <div class="card train-card h-100" data-train-id="${train.id}">
                <div class="card-body">
                    <div class="train-header mb-3">
                        <h5 class="card-title mb-2">${train.name}</h5>
                        <span class="train-id">Train ID: ${train.id}</span>
                    </div>
                    <div class="train-route mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="station">
                                <small class="text-muted">From</small>
                                <div>${train.from}</div>
                                <small class="text-primary" data-time="departure">${train.departure}</small>
                            </div>
                            <div class="route-line">
                                <i class="bi bi-arrow-right"></i>
                            </div>
                            <div class="station text-end">
                                <small class="text-muted">To</small>
                                <div>${train.to}</div>
                                <small class="text-primary" data-time="arrival">${train.arrival}</small>
                            </div>
                        </div>
                    </div>
                    <div class="train-details mb-3">
                        <div class="row">
                            <div class="col-6">
                                <small class="text-muted">Available Seats</small>
                                <div class="text-success">${train.seats}</div>
                            </div>
                            <div class="col-6 text-end">
                                <small class="text-muted">Price per ticket</small>
                                <div class="text-primary">₹${train.price}</div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary w-100" onclick="bookTrain('${train.id}')">
                        Book Now
                    </button>
                </div>
            </div>
        `;
        trainsGrid.appendChild(trainCard);
    });
    
    availableTrains.appendChild(trainsGrid);
}

// Book Train
function bookTrain(trainId) {
    const bookingData = JSON.parse(localStorage.getItem('currentBooking'));
    const trainCard = document.querySelector(`[data-train-id="${trainId}"]`);
    
    // Create ticket details for confirmation
    const ticketDetails = {
        ticketId: 'TKT' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        trainId: trainId,
        userId: bookingData.userId,
        userName: bookingData.userName,
        boardingStation: bookingData.boardingStation,
        destinationStation: bookingData.destinationStation,
        boardingDate: bookingData.journeyDate,
        boardingTime: trainCard.querySelector('[data-time="departure"]').textContent,
        arrivalTime: trainCard.querySelector('[data-time="arrival"]').textContent,
        ticketClass: bookingData.ticketClass,
        numTickets: bookingData.numTickets,
        status: 'Confirmed'
    };

    // Create and show confirmation modal
    const modalHtml = `
        <div class="modal fade" id="bookingConfirmationModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Ticket Booking</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="ticket-preview">
                            <h6 class="mb-3">Ticket Details</h6>
                            <div class="ticket-info">
                                <p><strong>Ticket ID:</strong> ${ticketDetails.ticketId}</p>
                                <p><strong>Train ID:</strong> ${ticketDetails.trainId}</p>
                                <p><strong>Passenger Name:</strong> ${ticketDetails.userName}</p>
                                <p><strong>From:</strong> ${ticketDetails.boardingStation}</p>
                                <p><strong>To:</strong> ${ticketDetails.destinationStation}</p>
                                <p><strong>Date:</strong> ${ticketDetails.boardingDate}</p>
                                <p><strong>Time:</strong> ${ticketDetails.boardingTime} - ${ticketDetails.arrivalTime}</p>
                                <p><strong>Class:</strong> ${ticketDetails.ticketClass}</p>
                                <p><strong>Number of Tickets:</strong> ${ticketDetails.numTickets}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="confirmBooking(${JSON.stringify(ticketDetails).replace(/"/g, '&quot;')})">Confirm Booking</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('bookingConfirmationModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('bookingConfirmationModal'));
    modal.show();
}

// Confirm Booking
function confirmBooking(ticketDetails) {
    // Store ticket
    let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    tickets.push(ticketDetails);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingConfirmationModal'));
    modal.hide();
    
    // Show success message
    const successToast = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        Ticket booked successfully!
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successToast);
    const toast = new bootstrap.Toast(document.querySelector('.toast'));
    toast.show();
    
    // Update tickets list
    loadTickets();
    
    // Switch to My Tickets section
    document.querySelector('[data-section="my-tickets"]').click();
}

// Load Tickets
function loadTickets() {
    const ticketsContainer = document.getElementById('ticketsContainer');
    let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    
    // Add dummy tickets if no tickets exist
    if (tickets.length === 0) {
        const dummyTickets = [
            {
                ticketId: 'TKT001',
                trainId: '12301',
                userId: 'USER001',
                userName: 'Demo User',
                boardingStation: 'New Delhi',
                destinationStation: 'Mumbai Central',
                boardingDate: '2024-04-15',
                boardingTime: '08:00',
                arrivalTime: '14:00',
                ticketClass: 'AC 3 Tier',
                numTickets: 2,
                status: 'Confirmed'
            },
            {
                ticketId: 'TKT002',
                trainId: '12213',
                userId: 'USER001',
                userName: 'Demo User',
                boardingStation: 'Howrah',
                destinationStation: 'New Delhi',
                boardingDate: '2024-04-20',
                boardingTime: '10:00',
                arrivalTime: '16:00',
                ticketClass: 'AC 2 Tier',
                numTickets: 1,
                status: 'Confirmed'
            }
        ];
        localStorage.setItem('tickets', JSON.stringify(dummyTickets));
        tickets = dummyTickets;
    }
    
    ticketsContainer.innerHTML = '';
    tickets.forEach(ticket => {
        const ticketCard = document.createElement('div');
        ticketCard.className = 'col-md-6 col-lg-4 mb-4';
        ticketCard.innerHTML = `
            <div class="card ticket-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${ticket.trainId}</h5>
                        <span class="badge bg-success">${ticket.status}</span>
                    </div>
                    <div class="ticket-details">
                        <p class="mb-2"><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
                        <p class="mb-2"><strong>Train ID:</strong> ${ticket.trainId}</p>
                        <p class="mb-2"><strong>User ID:</strong> ${ticket.userId}</p>
                        <p class="mb-2"><strong>User Name:</strong> ${ticket.userName}</p>
                        <p class="mb-2"><strong>From:</strong> ${ticket.boardingStation}</p>
                        <p class="mb-2"><strong>To:</strong> ${ticket.destinationStation}</p>
                        <p class="mb-2"><strong>Date:</strong> ${ticket.boardingDate}</p>
                        <p class="mb-2"><strong>Time:</strong> ${ticket.boardingTime} - ${ticket.arrivalTime}</p>
                        <p class="mb-2"><strong>Class:</strong> ${ticket.ticketClass}</p>
                        <p class="mb-2"><strong>Number of Tickets:</strong> ${ticket.numTickets}</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary btn-sm" onclick="downloadTicket('${ticket.ticketId}')">
                            <i class="bi bi-download me-1"></i> Download
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="cancelTicket('${ticket.ticketId}')">
                            <i class="bi bi-x-circle me-1"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        ticketsContainer.appendChild(ticketCard);
    });
}

// Download Ticket
function downloadTicket(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const ticket = tickets.find(t => t.ticketId === ticketId);
    
    if (ticket) {
        // Create ticket content
        const ticketContent = `
            IRCTC E-Ticket
            ===============
            
            Ticket ID: ${ticket.ticketId}
            Train ID: ${ticket.trainId}
            Status: ${ticket.status}
            
            Train Details:
            -------------
            Train: ${ticket.trainId}
            From: ${ticket.boardingStation}
            To: ${ticket.destinationStation}
            Date: ${ticket.boardingDate}
            Departure: ${ticket.boardingTime}
            Arrival: ${ticket.arrivalTime}
            Class: ${ticket.ticketClass}
            
            Passenger Details:
            -----------------
            Name: ${ticket.userName}
            Number of Tickets: ${ticket.numTickets}
            
            Thank you for choosing IRCTC!
        `;
        
        // Create blob and download
        const blob = new Blob([ticketContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket_${ticket.ticketId}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

// Cancel Ticket
function cancelTicket(ticketId) {
    if (confirm('Are you sure you want to cancel this ticket?')) {
        let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        tickets = tickets.filter(ticket => ticket.ticketId !== ticketId);
        localStorage.setItem('tickets', JSON.stringify(tickets));
        loadTickets();
        alert('Ticket has been cancelled and removed from your list.');
    }
}

// Profile Form Handler
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profileData = {
        email: document.getElementById('profileEmail').value,
        mobile: document.getElementById('profileMobile').value,
        address: document.getElementById('profileAddress').value
    };
    
    if (document.getElementById('changePassword').checked) {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }
        
        profileData.password = newPassword;
    }
    
    // Update profile (in localStorage for demo)
    localStorage.setItem('profileData', JSON.stringify(profileData));
    alert('Profile updated successfully!');
});

// Password Fields Toggle
document.getElementById('changePassword').addEventListener('change', function() {
    const passwordFields = document.getElementById('passwordFields');
    passwordFields.style.display = this.checked ? 'block' : 'none';
});

// Logout
function logout() {
    window.location.href = '../user/login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set simple user ID
    const userId = localStorage.getItem('userId') || 'USER' + Math.floor(Math.random() * 1000);
    localStorage.setItem('userId', userId);
    document.getElementById('userId').value = userId;
    
    loadTickets();
    
    // Load profile data if exists
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    if (profileData) {
        document.getElementById('profileEmail').value = profileData.email || '';
        document.getElementById('profileMobile').value = profileData.mobile || '';
        document.getElementById('profileAddress').value = profileData.address || '';
    }
});

function toggleEditMode() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input:not([type="checkbox"]), textarea');
    const editBtn = document.querySelector('.edit-profile-btn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const changePasswordCheckbox = document.getElementById('changePassword');
    
    // Toggle disabled state of inputs
    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });
    
    // Toggle button visibility
    editBtn.style.display = 'none';
    saveBtn.style.display = 'flex';
    
    // Enable password fields if checkbox is checked
    if (changePasswordCheckbox.checked) {
        const passwordFields = document.querySelectorAll('#passwordFields input');
        passwordFields.forEach(input => {
            input.disabled = false;
        });
    }
}

// Add event listener for password change checkbox
document.getElementById('changePassword').addEventListener('change', function() {
    const passwordFields = document.querySelectorAll('#passwordFields input');
    const isEditing = !document.getElementById('profileEmail').disabled;
    
    if (this.checked && isEditing) {
        document.getElementById('passwordFields').style.display = 'block';
        passwordFields.forEach(input => {
            input.disabled = false;
        });
    } else {
        document.getElementById('passwordFields').style.display = 'none';
        passwordFields.forEach(input => {
            input.disabled = true;
            input.value = '';
        });
    }
});

// Add form submit handler
document.getElementById('profileForm').addEventListener('submit', function(e) {
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
    document.getElementById('saveProfileBtn').style.display = 'none';
    document.getElementById('changePassword').checked = false;
    document.getElementById('passwordFields').style.display = 'none';
}); 