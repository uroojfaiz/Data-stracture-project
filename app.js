// ================= PAGE NAVIGATION =================
function showPage(id) {
  // sab sections hide
  document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');

  // required section show
  const page = document.getElementById(id);
  if (page) page.style.display = 'block';
}

// ================= ON PAGE LOAD =================
document.addEventListener('DOMContentLoaded', () => {
  // default home
  showPage('home');

  // Open Form buttons
  document.querySelectorAll('.btn-open-form').forEach(btn => {
    btn.addEventListener('click', () => {
      const formId = btn.getAttribute('data-target');
      const form = document.getElementById(formId);
      if (!form) return;

      // Toggle form display as flex
      form.style.display = (form.style.display === 'flex') ? 'none' : 'flex';
    });
  });
});

// ================= CLOSE SEARCH =================
function closeSearch() {
  document.getElementById('searchOverlay').style.display = 'none';
}

// ================= SEARCH =================
function searchRecords() {
  const category = document.getElementById('searchCategory').value;
  const key = document.getElementById('searchKey').value.toLowerCase();

  if (!category || !key) {
    Swal.fire('Error', 'Select category and enter keyword', 'error');
    return;
  }

  const allData = [...withoutSubmissions, ...queue];
  const results = allData.filter(item =>
    item[category].toLowerCase().includes(key)
  );

  let html = `<b>Total Records:</b> ${results.length}<br><br>`;
  results.forEach(r => {
    html += `👨‍🎓 ${r.name} | ${r.id} | ${r.subject} | ${r.project} | ${r.date}<br>`;
  });

  if (results.length === 0) html += 'No record found';
  document.getElementById('searchResults').innerHTML = html;
  document.getElementById('searchOverlay').style.display = 'flex';
}

// ================= STUDENT REPORT =================
function renderStudentReport() {
  showPage('studentReport');
  const tbody = document.getElementById('reportBody');
  tbody.innerHTML = '';

  const allData = [...withoutSubmissions, ...queue];
  if (allData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">No submissions yet</td></tr>`;
    return;
  }

  allData.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.id}</td>
        <td>${s.date}</td>
        <td>${s.project}</td>
        <td>${s.subject}</td>
        <td>Yes</td>
      </tr>
    `;
  });
}

// ================= ARRAYS =================
window.withoutSubmissions = [];
let queue = [];
let projectCount = {};

// ================= SUBMIT WITHOUT DS =================
function submitWithout() {
  const name = document.getElementById('w_name').value.trim();
  const id = document.getElementById('w_id').value.trim();
  const subject = document.getElementById('w_subject').value;
  const project = document.getElementById('w_project').value;
  const date = document.getElementById('w_date').value;

  if (!name || !id || !subject || !project || !date) {
    Swal.fire('Error', 'Please fill all fields', 'error');
    return;
  }

  // push directly, duplicates allowed
  withoutSubmissions.push({ name, id, subject, project, date });
  Swal.fire('Success', 'Project saved WITHOUT DS (duplicates allowed)', 'success');

  // Clear and close form
  document.getElementById('withoutForm').reset();
  document.getElementById('withoutForm').style.display = 'none';
}

// ================= SUBMIT WITH DS =================
function enqueue() {
  const name = document.getElementById('d_name').value.trim();
  const id = document.getElementById('d_id').value.trim();
  const subject = document.getElementById('d_subject').value;
  const project = document.getElementById('d_project').value;
  const date = document.getElementById('d_date').value;

  if (!name || !id || !subject || !project || !date) {
    Swal.fire('Error', 'Please fill all fields', 'error');
    return;
  }

  projectCount[project] = projectCount[project] || 0;

  if (projectCount[project] >= 10) {
    Swal.fire('Error', 'Maximum 10 submissions allowed per project', 'error');
    return;
  }

  // Check for duplicates (same Name + ID + Subject + Project)
  const duplicate = queue.find(s =>
    s.name.toLowerCase() === name.toLowerCase() &&
    s.id === id &&
    s.subject === subject &&
    s.project === project
  );

  if (duplicate) {
    Swal.fire('Error', 'Duplicate submission detected! Cannot submit again.', 'error');
    return;
  }

  // Push to queue
  queue.push({ name, id, subject, project, date });
  projectCount[project]++;
  Swal.fire('Success', 'Project saved WITH DS (duplicates blocked)', 'success');

  // Clear and close form
  document.getElementById('withForm').reset();
  document.getElementById('withForm').style.display = 'none';
}
