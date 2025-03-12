/***************************************************************************
 * Utility Functions for LocalStorage
 ***************************************************************************/
function getWorkers() {
  return JSON.parse(localStorage.getItem('workers')) || [];
}
function setWorkers(workers) {
  localStorage.setItem('workers', JSON.stringify(workers));
}
function getRetailers() {
  return JSON.parse(localStorage.getItem('retailers')) || [];
}
function setRetailers(retailers) {
  localStorage.setItem('retailers', JSON.stringify(retailers));
}

/***************************************************************************
 * Worker Registration
 ***************************************************************************/
document.getElementById('workerForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('workerUsername').value;
  const password = document.getElementById('workerPassword').value;
  const name = document.getElementById('workerName').value;
  const bio = document.getElementById('workerBio').value;
  const category = document.getElementById('workerCategory').value;
  const profession = document.getElementById('workerProfession').value;
  const photoInput = document.getElementById('workerPhoto');
  let workerId = Date.now();
  let photo = '';

  function saveWorker() {
    const workers = getWorkers();
    if (workers.some(w => w.username === username)) {
      alert('Username already taken!');
      return;
    }
    const newWorker = {
      id: workerId,
      username,
      password,
      name,
      photo,
      bio,
      category,
      profession,
      bookings: []
    };
    workers.push(newWorker);
    setWorkers(workers);
    alert('Worker registration successful!');
    // Redirect to index.html (login page)
    window.location.href = 'index.html';
  }

  if (photoInput && photoInput.files && photoInput.files[0]) {
    let file = photoInput.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
      photo = e.target.result;
      saveWorker();
    };
    reader.readAsDataURL(file);
  } else {
    saveWorker();
  }
});

/***************************************************************************
 * Worker Login
 ***************************************************************************/
function workerLogin() {
  const username = document.getElementById('workerLoginUsername').value;
  const password = document.getElementById('workerLoginPassword').value;
  const workers = getWorkers();
  const worker = workers.find(w => w.username === username && w.password === password);
  if (!worker) {
    alert('Invalid worker credentials!');
    return;
  }
  localStorage.setItem('loggedInWorkerId', worker.id);
  alert('Worker logged in successfully!');
  // route to worker dashboard
  window.location.href = 'worker-dashboard.html';
}

/***************************************************************************
 * Retailer Registration
 ***************************************************************************/
document.getElementById('retailerForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('retailerUsername').value;
  const password = document.getElementById('retailerPassword').value;
  const name = document.getElementById('retailerName').value;
  const type = document.getElementById('retailerType').value;
  const details = document.getElementById('retailerDetails').value;
  const retailers = getRetailers();
  if (retailers.some(r => r.username === username)) {
    alert('Username already taken!');
    return;
  }
  const newRetailer = {
    id: Date.now(),
    username,
    password,
    name,
    type,
    details,
    bookings: []
  };
  retailers.push(newRetailer);
  setRetailers(retailers);
  alert('Retailer registration successful!');
  // Redirect to index.html (login page)
  window.location.href = 'index.html';
});

/***************************************************************************
 * Retailer Login
 ***************************************************************************/
function retailerLogin() {
  const username = document.getElementById('retailerLoginUsername').value;
  const password = document.getElementById('retailerLoginPassword').value;
  const retailers = getRetailers();
  const retailer = retailers.find(r => r.username === username && r.password === password);
  if (!retailer) {
    alert('Invalid retailer credentials!');
    return;
  }
  localStorage.setItem('loggedInRetailerId', retailer.id);
  alert('Retailer logged in successfully!');
  // route to retailer dashboard
  window.location.href = 'retailer-dashboard.html';
}

/***************************************************************************
 * Book Page: Render Workers + Booking Logic
 ***************************************************************************/
if (document.getElementById('workersList')) {
  const workersListDiv = document.getElementById('workersList');
  const workers = getWorkers();
  if (workers.length === 0) {
    workersListDiv.innerHTML = '<p>No workers registered yet.</p>';
  } else {
    workers.forEach((worker) => {
      const colDiv = document.createElement('div');
      colDiv.className = 'col';
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card h-100 text-bg-dark';

      // Worker photo
      if (worker.photo) {
        const img = document.createElement('img');
        img.src = worker.photo;
        img.className = 'card-img-top';
        img.alt = worker.name;
        cardDiv.appendChild(img);
      }

      // Card body
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      // Name
      const cardTitle = document.createElement('h5');
      cardTitle.className = 'card-title';
      cardTitle.textContent = worker.name;
      cardBody.appendChild(cardTitle);

      // Bio
      const cardText = document.createElement('p');
      cardText.className = 'card-text';
      cardText.textContent = worker.bio;
      cardBody.appendChild(cardText);

      // Category
      const catText = document.createElement('p');
      catText.className = 'card-text';
      catText.textContent = `Category: ${worker.category}`;
      cardBody.appendChild(catText);

      // Profession
      if (worker.profession) {
        const profText = document.createElement('p');
        profText.className = 'card-text';
        profText.textContent = `Profession: ${worker.profession}`;
        cardBody.appendChild(profText);
      }

      // Book Worker button
      const bookButton = document.createElement('button');
      bookButton.className = 'btn btn-primary';
      bookButton.textContent = 'Book Worker';
      bookButton.onclick = function() {
        handleBooking(worker);
      };
      cardBody.appendChild(bookButton);

      cardDiv.appendChild(cardBody);
      colDiv.appendChild(cardDiv);
      workersListDiv.appendChild(colDiv);
    });
  }
}

function handleBooking(worker) {
  // Must be a retailer
  const retailerId = localStorage.getItem('loggedInRetailerId');
  if (!retailerId) {
    alert('You must log in as a retailer to book a worker!');
    return;
  }

  // Prompt for booking details
  const wage = prompt('Enter wage (e.g., 500/day):');
  if (!wage) return;
  const date = prompt('Enter date (YYYY-MM-DD):');
  if (!date) return;
  const location = prompt('Enter location:');
  if (!location) return;

  const bookingId = Date.now();
  const newBooking = {
    bookingId,
    workerId: worker.id,
    retailerId: parseInt(retailerId),
    wage,
    date,
    location,
    status: 'pending'
  };

  // Update retailer's bookings
  const retailers = getRetailers();
  const rIndex = retailers.findIndex(r => r.id === parseInt(retailerId));
  if (rIndex !== -1) {
    retailers[rIndex].bookings.push(newBooking);
    setRetailers(retailers);
  }

  // Update worker's bookings
  const workers = getWorkers();
  const wIndex = workers.findIndex(w => w.id === worker.id);
  if (wIndex !== -1) {
    workers[wIndex].bookings.push(newBooking);
    setWorkers(workers);
  }

  alert('Booking request sent to worker!');
}

/***************************************************************************
 * Worker Dashboard: Display Bookings & Accept/Reject
 ***************************************************************************/
if (window.location.pathname.endsWith('worker-dashboard.html')) {
  const loggedInWorkerId = parseInt(localStorage.getItem('loggedInWorkerId'));
  if (!loggedInWorkerId) {
    alert('You must be logged in as a worker!');
    window.location.href = 'index.html';
  }

  const workers = getWorkers();
  const currentWorker = workers.find(w => w.id === loggedInWorkerId);
  if (!currentWorker) {
    alert('Worker not found!');
    return;
  }

  // Show worker's name
  document.getElementById('workerNameDisplay')?.innerText = currentWorker.name;

  // Filter bookings
  const pending = currentWorker.bookings.filter(b => b.status === 'pending');
  const accepted = currentWorker.bookings.filter(b => b.status === 'accepted');
  const rejected = currentWorker.bookings.filter(b => b.status === 'rejected');

  renderBookings('pendingBookings', pending, currentWorker, 'pending');
  renderBookings('acceptedBookings', accepted, currentWorker, 'accepted');
  renderBookings('rejectedBookings', rejected, currentWorker, 'rejected');
}

function renderBookings(containerId, bookingsArray, currentWorker, statusType) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (bookingsArray.length === 0) {
    container.innerHTML = `<p>No ${statusType} bookings.</p>`;
    return;
  }

  let html = '';
  bookingsArray.forEach(b => {
    html += `
      <div class="p-2 mb-2" style="border:1px solid #ccc;">
        <p>Booking ID: ${b.bookingId}</p>
        <p>Wage: ${b.wage}</p>
        <p>Date: ${b.date}</p>
        <p>Location: ${b.location}</p>
        <p>Status: ${b.status}</p>
        ${
          b.status === 'pending'
            ? `<button class="btn btn-success btn-sm" onclick="acceptBooking(${b.bookingId}, ${currentWorker.id})">Accept</button>
               <button class="btn btn-danger btn-sm" onclick="rejectBooking(${b.bookingId}, ${currentWorker.id})">Reject</button>`
            : ''
        }
      </div>
    `;
  });
  container.innerHTML = html;
}

function acceptBooking(bookingId, workerId) {
  updateBookingStatus(bookingId, workerId, 'accepted');
}
function rejectBooking(bookingId, workerId) {
  updateBookingStatus(bookingId, workerId, 'rejected');
}

function updateBookingStatus(bookingId, workerId, newStatus) {
  const workers = getWorkers();
  const wIndex = workers.findIndex(w => w.id === workerId);
  if (wIndex === -1) return;
  let booking = workers[wIndex].bookings.find(b => b.bookingId === bookingId);
  if (!booking) return;

  booking.status = newStatus;
  setWorkers(workers);

  const retailers = getRetailers();
  const rIndex = retailers.findIndex(r => r.id === booking.retailerId);
  if (rIndex !== -1) {
    let rBooking = retailers[rIndex].bookings.find(b => b.bookingId === bookingId);
    if (rBooking) {
      rBooking.status = newStatus;
    }
    setRetailers(retailers);
  }

  alert(`Booking ${newStatus}!`);
  window.location.reload();
}

/***************************************************************************
 * Retailer Dashboard: Display Bookings
 ***************************************************************************/
if (window.location.pathname.endsWith('retailer-dashboard.html')) {
  const loggedInRetailerId = parseInt(localStorage.getItem('loggedInRetailerId'));
  if (!loggedInRetailerId) {
    alert('You must be logged in as a retailer!');
    window.location.href = 'index.html';
  }

  const retailers = getRetailers();
  const currentRetailer = retailers.find(r => r.id === loggedInRetailerId);
  if (!currentRetailer) {
    alert('Retailer not found!');
    return;
  }

  document.getElementById('retailerNameDisplay')?.innerText = currentRetailer.name;

  const container = document.getElementById('retailerBookings');
  if (!container) return;

  if (!currentRetailer.bookings || currentRetailer.bookings.length === 0) {
    container.innerHTML = '<p>No bookings yet.</p>';
    return;
  }

  let html = '';
  currentRetailer.bookings.forEach(b => {
    html += `
      <div class="p-2 mb-2" style="border:1px solid #ccc;">
        <p>Booking ID: ${b.bookingId}</p>
        <p>Worker ID: ${b.workerId}</p>
        <p>Wage: ${b.wage}</p>
        <p>Date: ${b.date}</p>
        <p>Location: ${b.location}</p>
        <p>Status: ${b.status}</p>
      </div>
    `;
  });
  container.innerHTML = html;
}
