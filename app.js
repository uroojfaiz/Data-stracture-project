// --- Page Navigation ---
function showPage(id){
  document.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// --- Toggle Forms ---
function toggleForm(id){
  let f=document.getElementById(id);
  f.style.display = (f.style.display === 'block') ? 'none' : 'block';
}

// --- Search Overlay ---
function closeSearch(){
  document.getElementById('searchOverlay').style.display = 'none';
}

// --- Global Arrays ---
window.withoutSubmissions = []; // For submissions without DS
let queue = []; // For submissions with DS
let projectCount = {}; // Counter per project in DS

// --- Submit Without DS ---
function submitWithout(){
  let name=w_name.value, id=w_id.value, subject=w_subject.value, project=w_project.value, date=w_date.value;

  if(!name || !id || !subject || !project || !date){
    Swal.fire('Error','Please fill all fields','error');
    return;
  }

  window.withoutSubmissions.push({name,id,subject,project,date});
  Swal.fire('Submitted','Project saved without DS','success');

  // Clear form
  w_name.value=w_id.value=w_subject.value=w_project.value=w_date.value='';

  toggleForm('withoutForm');
}

// --- Submit With DS ---
function enqueue(){
  let name=d_name.value, id=d_id.value, subject=d_subject.value, project=d_project.value, date=d_date.value;

  projectCount[project] = projectCount[project] || 0;

  if(!name || !id || !subject || !project || !date){
    Swal.fire('Error','Please fill all fields','error');
    return;
  }

  if(projectCount[project] >= 10){
    Swal.fire('Limit Reached','Only 10 submissions allowed per project','error');
    return;
  }

  queue.push({name,id,subject,project,date});
  projectCount[project]++;
  Swal.fire('Submitted','Project saved with DS','success');

  // Clear form
  d_name.value=d_id.value=d_subject.value=d_project.value=d_date.value='';

  toggleForm('withForm');
  updateProgress();
}

// --- Update Circular Progress ---
function updateProgress(){
  let total = queue.length;
  let percent = Math.round((total/60)*100); // Assuming 60 submissions max
  const circle = document.getElementById('percentCircle');
  if(circle){
    circle.style.setProperty('--p', percent*3.6+'deg');
    circle.innerText = percent + '%';
  }
}

// --- Search Submissions ---
function searchRecords(){
  let cat=document.getElementById('searchCategory').value;
  let key=document.getElementById('searchKey').value.toLowerCase();

  const allData = [...window.withoutSubmissions, ...queue];
  let res = allData.filter(item =>
    cat === 'subject' ? item.subject.toLowerCase().includes(key) : item.project.toLowerCase().includes(key)
  );

  let html=`<b>Total Records:</b> ${res.length}<br><br>`;
  res.forEach(r=>{
    html += `👨‍🎓 ${r.name} | ${r.id} | ${r.subject} | ${r.project} | ${r.date}<br>`;
  });
  if(!res.length) html += '0 Record Found';

  document.getElementById('searchResults').innerHTML = html;
  document.getElementById('searchOverlay').style.display = 'flex';
}

// --- Render Student Report Table ---
function renderStudentReport(){
  showPage('studentReport'); // Show report page
  const tbody = document.getElementById('reportBody');
  tbody.innerHTML = '';

  const allSubmissions = [...window.withoutSubmissions, ...queue];

  if(allSubmissions.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" style="color:#f87171;text-align:center;">No submissions yet.</td></tr>`;
    return;
  }

  allSubmissions.forEach(s=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:12px; border:1px solid #94a3b8;">${s.name}</td>
      <td style="padding:12px; border:1px solid #94a3b8;">${s.id}</td>
      <td style="padding:12px; border:1px solid #94a3b8;">${s.date}</td>
      <td style="padding:12px; border:1px solid #94a3b8;">${s.project}</td>
      <td style="padding:12px; border:1px solid #94a3b8;">${s.subject}</td>
      <td style="padding:12px; border:1px solid #94a3b8;">Yes</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- Show Submission Data as Cards (Optional) ---
function renderSubmissionCards(){
  const container = document.getElementById('submissionCards');
  container.innerHTML = '';
  container.style.display='grid';
  container.style.gridTemplateColumns = 'repeat(auto-fit,minmax(250px,1fr))';
  container.style.gap='20px';

  const allData = [...window.withoutSubmissions, ...queue];
  if(allData.length === 0){
    container.innerHTML = '<p style="color:#f87171;text-align:center;">No submissions yet.</p>';
    return;
  }

  allData.forEach(s=>{
    const card = document.createElement('div');
    card.className='card animate__animated animate__fadeInUp';
    card.innerHTML = `
      <h3>${s.name} (${s.id})</h3>
      <p>Subject: ${s.subject}</p>
      <p>Project: ${s.project}</p>
      <p>Date: ${s.date}</p>
    `;
    container.appendChild(card);
  });
}