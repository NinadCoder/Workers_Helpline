// Worker Registration with File Upload for Photo
document.getElementById('workerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('workerName').value;
    const bio = document.getElementById('workerBio').value;
    const category = document.getElementById('workerCategory').value;
    const profession = document.getElementById('workerProfession').value;
    const photoInput = document.getElementById('workerPhoto');
  
    if (photoInput.files && photoInput.files[0]) {
      let file = photoInput.files[0];
      let reader = new FileReader();
      reader.onload = function(e) {
        let photo = e.target.result;
        // Create worker object with base64 image data
        const worker = { name, photo, bio, category, profession };
        let workers = JSON.parse(localStorage.getItem('workers')) || [];
        workers.push(worker);
        localStorage.setItem('workers', JSON.stringify(workers));
        alert('Worker registration successful!');
        document.getElementById('workerForm').reset();
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, store an empty string or use a default placeholder
      const worker = { name, photo: '', bio, category, profession };
      let workers = JSON.parse(localStorage.getItem('workers')) || [];
      workers.push(worker);
      localStorage.setItem('workers', JSON.stringify(workers));
      alert('Worker registration successful!');
      document.getElementById('workerForm').reset();
    }
  });
  
  // Retailer Registration (unchanged)
  document.getElementById('retailerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('retailerName').value;
    const type = document.getElementById('retailerType').value;
    const details = document.getElementById('retailerDetails').value;
  
    const retailer = { name, type, details };
  
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
    alert(`Worker at index ${index} has been booked!`);
  }
  