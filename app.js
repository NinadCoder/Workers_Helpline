/******************************************************
 * 1) Worker Registration (unchanged)
 ******************************************************/
document.getElementById('workerForm')?.addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('workerName').value;
  const bio = document.getElementById('workerBio').value;
  const category = document.getElementById('workerCategory').value;
  const profession = document.getElementById('workerProfession').value;
  const photoInput = document.getElementById('workerPhoto');

  if (photoInput && photoInput.files && photoInput.files[0]) {
    let file = photoInput.files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
      let photo = e.target.result;
      const worker = { name, photo, bio, category, profession };
      let workers = JSON.parse(localStorage.getItem('workers')) || [];
      workers.push(worker);
      localStorage.setItem('workers', JSON.stringify(workers));
      alert('Worker registration successful!');
      document.getElementById('workerForm').reset();
    };
    reader.readAsDataURL(file);
  } else {
    const worker = { name, photo: '', bio, category, profession };
    let workers = JSON.parse(localStorage.getItem('workers')) || [];
    workers.push(worker);
    localStorage.setItem('workers', JSON.stringify(workers));
    alert('Worker registration successful!');
    document.getElementById('workerForm').reset();
  }
});

/******************************************************
 * 2) Retailer Registration (unchanged)
 ******************************************************/
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

/******************************************************
 * 3) Book Page: Render Workers (UPDATED for color)
 ******************************************************/
if (document.getElementById('workersList')) {
  const workersListDiv = document.getElementById('workersList');
  const workers = JSON.parse(localStorage.getItem('workers')) || [];
  
  if (workers.length === 0) {
    workersListDiv.innerHTML = '<p>No workers registered yet.</p>';
  } else {
    workers.forEach((worker, index) => {
      // Create a Bootstrap card
      const colDiv = document.createElement('div');
      colDiv.className = 'col';
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card h-100 text-bg-dark';

      if (worker.photo) {
        const img = document.createElement('img');
        img.src = worker.photo;
        img.className = 'card-img-top';
        img.alt = worker.name;
        cardDiv.appendChild(img);
      }
      
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

      // Category (Removed text-muted & small tags)
      const categoryText = document.createElement('p');
      categoryText.className = 'card-text';
      categoryText.textContent = `Category: ${worker.category}`;
      cardBody.appendChild(categoryText);

      // Profession (Removed text-muted & small tags)
      if (worker.profession) {
        const professionText = document.createElement('p');
        professionText.className = 'card-text';
        professionText.textContent = `Profession: ${worker.profession}`;
        cardBody.appendChild(professionText);
      }

      // "Book Worker" button
      const bookButton = document.createElement('button');
      bookButton.className = 'btn btn-primary';
      bookButton.textContent = 'Book Worker';
      bookButton.onclick = function() {
        bookWorker(index);
      };
      cardBody.appendChild(bookButton);

      cardDiv.appendChild(cardBody);
      colDiv.appendChild(cardDiv);
      workersListDiv.appendChild(colDiv);
    });
  }
}

function bookWorker(index) {
  alert(`Worker at index ${index} has been booked!`);
}

/******************************************************
 * 4) Admin Page: Render & Delete Workers
 ******************************************************/
if (document.getElementById('adminWorkersTable')) {
  renderAdminWorkers();
}

function renderAdminWorkers() {
  const workers = JSON.parse(localStorage.getItem('workers')) || [];
  const tableBody = document.querySelector('#adminWorkersTable tbody');

  // Clear the table body
  tableBody.innerHTML = '';

  workers.forEach((worker, index) => {
    const row = document.createElement('tr');
    
    // # (index + 1)
    const indexCell = document.createElement('th');
    indexCell.scope = 'row';
    indexCell.textContent = index + 1;
    row.appendChild(indexCell);

    // Photo
    const photoCell = document.createElement('td');
    if (worker.photo) {
      const img = document.createElement('img');
      img.src = worker.photo;
      img.alt = worker.name;
      img.style.width = '80px';
      photoCell.appendChild(img);
    } else {
      photoCell.textContent = 'No Photo';
    }
    row.appendChild(photoCell);

    // Name
    const nameCell = document.createElement('td');
    nameCell.textContent = worker.name || 'N/A';
    row.appendChild(nameCell);

    // Category
    const categoryCell = document.createElement('td');
    categoryCell.textContent = worker.category || 'N/A';
    row.appendChild(categoryCell);

    // Profession
    const professionCell = document.createElement('td');
    professionCell.textContent = worker.profession || 'N/A';
    row.appendChild(professionCell);

    // Actions
    const actionCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
      deleteWorker(index);
    };
    actionCell.appendChild(deleteBtn);

    row.appendChild(actionCell);
    tableBody.appendChild(row);
  });
}

function deleteWorker(index) {
  let workers = JSON.parse(localStorage.getItem('workers')) || [];
  if (index >= 0 && index < workers.length) {
    // Remove the worker at the given index
    workers.splice(index, 1);
    localStorage.setItem('workers', JSON.stringify(workers));
    // Re-render the admin table to reflect the change
    renderAdminWorkers();
    alert('Worker deleted successfully.');
  }
}
