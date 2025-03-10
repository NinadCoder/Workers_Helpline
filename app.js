// Worker Registration
document.getElementById('workerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('workerName').value;
    const photo = document.getElementById('workerPhoto').value;
    const bio = document.getElementById('workerBio').value;
    const category = document.getElementById('workerCategory').value;
    const profession = document.getElementById('workerProfession').value;
  
    // Create worker object
    const worker = { name, photo, bio, category, profession };
  
    // Retrieve existing workers or initialize an empty array
    let workers = JSON.parse(localStorage.getItem('workers')) || [];
    workers.push(worker);
    localStorage.setItem('workers', JSON.stringify(workers));
  
    alert('Worker registration successful!');
    this.reset();
  });
  
  // Retailer Registration
  document.getElementById('retailerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('retailerName').value;
    const type = document.getElementById('retailerType').value;
    const details = document.getElementById('retailerDetails').value;
  
    // Create retailer object
    const retailer = { name, type, details };
  
    // Retrieve existing retailers or initialize an empty array
    let retailers = JSON.parse(localStorage.getItem('retailers')) || [];
    retailers.push(retailer);
    localStorage.setItem('retailers', JSON.stringify(retailers));
  
    alert('Retailer registration successful!');
    this.reset();
  });
  
  // Render workers on the booking page
  if (document.getElementById('workersList')) {
    const workersListDiv = document.getElementById('workersList');
    const workers = JSON.parse(localStorage.getItem('workers')) || [];
    
    if (workers.length === 0) {
      workersListDiv.innerHTML = '<p>No workers registered yet.</p>';
    } else {
      workers.forEach((worker, index) => {
        const workerDiv = document.createElement('div');
        workerDiv.className = 'worker-card';
        workerDiv.innerHTML = `
          <img src="${worker.photo || 'placeholder.jpg'}" alt="${worker.name}" width="100">
          <h3>${worker.name}</h3>
          <p>${worker.bio}</p>
          <p>Category: ${worker.category}</p>
          ${worker.profession ? `<p>Profession: ${worker.profession}</p>` : ''}
          <button onclick="bookWorker(${index})">Book Worker</button>
        `;
        workersListDiv.appendChild(workerDiv);
      });
    }
  }
  
  function bookWorker(index) {
    // This function simulates booking a worker.
    // In a real app, you might capture more details like date/time.
    alert(`Worker at index ${index} has been booked!`);
  }
  