// ----- Enhanced Data Storage -----
let students = JSON.parse(localStorage.getItem("students")) || [];
let studentPhotos = JSON.parse(localStorage.getItem("studentPhotos")) || {};
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};
let userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
  name: "Administrator",
  email: "admin@school.edu",
  role: "admin",
  department: "Information Technology",
  avatar: "https://via.placeholder.com/150",
  notifications: {
    email: true,
    push: true,
    attendance: false
  }
};
let activities = JSON.parse(localStorage.getItem("activities")) || [];

// ----- Enhanced Navigation -----
function showSection(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
  document.getElementById("nav" + id.charAt(0).toUpperCase() + id.slice(1)).classList.add('active');
  
  // Update specific sections
  if (id === 'home') {
    renderHome();
    updateCurrentDate();
  }
  if (id === 'student') renderStudents();
  if (id === 'admin') {
    renderAttendance();
    initializeFaceScanner();
  }
  if (id === 'profile') renderProfile();
}

// ----- Enhanced Home Dashboard -----
function updateCurrentDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("currentDate").textContent = now.toLocaleDateString('en-US', options);
}

function renderHome() {
  // Update stats
  document.getElementById("totalStudents").textContent = students.length;
  
  const today = new Date().toISOString().split("T")[0];
  let present = 0, absent = 0;
  
  students.forEach(student => {
    const key = student.id + "_" + today;
    if (attendance[key] && attendance[key].status === "Present") {
      present++;
    } else {
      absent++;
    }
  });
  
  document.getElementById("attendanceToday").textContent = present;
  document.getElementById("absentStudents").textContent = absent;
  
  // Calculate monthly average (simplified)
  const monthlyAverage = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
  document.getElementById("monthlyAverage").textContent = monthlyAverage + "%";
  
  // Update profile stats
  document.getElementById("profileStudents").textContent = students.length;
  document.getElementById("profileSessions").textContent = Object.keys(attendance).length;
  
  // Render recent activities
  renderRecentActivities();
}

function renderRecentActivities() {
  const container = document.getElementById("recentActivity");
  container.innerHTML = "";
  
  // Generate sample activities if none exist
  if (activities.length === 0) {
    activities = [
      {
        type: "registration",
        message: "New student John Doe registered",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: "user-plus",
        color: "success"
      },
      {
        type: "attendance",
        message: "Face recognition scan completed",
        time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: "camera",
        color: "info"
      },
      {
        type: "system",
        message: "System backup completed successfully",
        time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        icon: "shield-alt",
        color: "warning"
      }
    ];
    localStorage.setItem("activities", JSON.stringify(activities));
  }
  
  activities.slice(0, 5).forEach(activity => {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";
    
    const timeAgo = getTimeAgo(activity.time);
    
    activityItem.innerHTML = `
      <div class="activity-icon ${activity.color}">
        <i class="fas fa-${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <p>${activity.message}</p>
        <div class="activity-time">${timeAgo}</div>
      </div>
    `;
    
    container.appendChild(activityItem);
  });
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// ----- Enhanced Student CRUD -----
function addStudent() {
  const id = document.getElementById("studentId").value.trim();
  const name = document.getElementById("studentName").value.trim();
  const cls = document.getElementById("studentClass").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  
  if (!id || !name || !cls) {
    showToast("Please fill all required fields", "error");
    return;
  }
  
  // Check if student ID already exists
  if (students.some(s => s.id === id)) {
    showToast("Student ID already exists", "error");
    return;
  }
  
  const newStudent = { id, name, cls, email, registrationDate: new Date().toISOString() };
  students.push(newStudent);
  localStorage.setItem("students", JSON.stringify(students));
  
  // Add activity
  activities.unshift({
    type: "registration",
    message: `New student ${name} registered`,
    time: new Date(),
    icon: "user-plus",
    color: "success"
  });
  localStorage.setItem("activities", JSON.stringify(activities));
  
  showToast("Student registered successfully! Please capture their photo.", "success");
  
  // Clear form
  document.getElementById("studentId").value = "";
  document.getElementById("studentName").value = "";
  document.getElementById("studentClass").value = "";
  document.getElementById("studentEmail").value = "";
  
  renderStudents();
  renderHome();
}

function renderStudents() {
  const grid = document.getElementById("studentsGrid");
  grid.innerHTML = "";
  
  if (students.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-users fa-3x"></i>
        <h3>No Students Registered</h3>
        <p>Register your first student to get started</p>
        <button class="btn-primary" onclick="showSection('register')">
          <i class="fas fa-user-plus"></i>
          Register Student
        </button>
      </div>
    `;
    return;
  }
  
  students.forEach(student => {
    const photo = studentPhotos[student.id] || "https://via.placeholder.com/100";
    const card = document.createElement("div");
    card.className = "student-card";
    
    card.innerHTML = `
      <img src="${photo}" alt="${student.name}">
      <h3>${student.name}</h3>
      <p><strong>ID:</strong> ${student.id}</p>
      <p><strong>Class:</strong> ${student.cls}</p>
      ${student.email ? `<p><strong>Email:</strong> ${student.email}</p>` : ''}
      <div class="student-actions">
        <button class="btn-primary" onclick="viewStudent('${student.id}')">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn-danger" onclick="deleteStudent('${student.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

function viewStudent(id) {
  const student = students.find(s => s.id === id);
  if (student) {
    showToast(`Viewing ${student.name}'s profile`, "info");
    // In a real app, you would show a detailed view modal
  }
}

function searchStudent() {
  const query = document.getElementById("searchStudent").value.toLowerCase();
  const grid = document.getElementById("studentsGrid");
  grid.innerHTML = "";
  
  const filteredStudents = students.filter(s => 
    s.id.toLowerCase().includes(query) || 
    s.name.toLowerCase().includes(query) ||
    s.cls.toLowerCase().includes(query)
  );
  
  if (filteredStudents.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search fa-3x"></i>
        <h3>No Students Found</h3>
        <p>Try adjusting your search terms</p>
      </div>
    `;
    return;
  }
  
  filteredStudents.forEach(student => {
    const photo = studentPhotos[student.id] || "https://via.placeholder.com/100";
    const card = document.createElement("div");
    card.className = "student-card";
    
    card.innerHTML = `
      <img src="${photo}" alt="${student.name}">
      <h3>${student.name}</h3>
      <p><strong>ID:</strong> ${student.id}</p>
      <p><strong>Class:</strong> ${student.cls}</p>
      <div class="student-actions">
        <button class="btn-primary" onclick="viewStudent('${student.id}')">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn-danger" onclick="deleteStudent('${student.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (student && confirm(`Are you sure you want to delete ${student.name}?`)) {
    students = students.filter(s => s.id !== id);
    delete studentPhotos[id];
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("studentPhotos", JSON.stringify(studentPhotos));
    
    // Add activity
    activities.unshift({
      type: "deletion",
      message: `Student ${student.name} deleted`,
      time: new Date(),
      icon: "user-minus",
      color: "danger"
    });
    localStorage.setItem("activities", JSON.stringify(activities));
    
    showToast("Student deleted successfully", "success");
    renderStudents();
    renderHome();
  }
}

// ----- Enhanced Camera Functions -----
let registerWebcam = document.getElementById("registerWebcam");
let registerStream = null;

navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
  .then(stream => { 
    registerWebcam.srcObject = stream;
    registerStream = stream;
  })
  .catch(err => {
    console.error("Camera access denied:", err);
    showToast("Camera access is required for photo capture", "error");
  });

function capturePhoto() {
  if (students.length === 0) {
    showToast("Please register a student first", "error");
    return;
  }
  
  const student = students[students.length - 1];
  const canvas = document.createElement("canvas");
  canvas.width = registerWebcam.videoWidth;
  canvas.height = registerWebcam.videoHeight;
  canvas.getContext("2d").drawImage(registerWebcam, 0, 0, canvas.width, canvas.height);
  
  studentPhotos[student.id] = canvas.toDataURL("image/png");
  localStorage.setItem("studentPhotos", JSON.stringify(studentPhotos));
  
  document.getElementById("photoStatus").innerHTML = `
    <i class="fas fa-check-circle"></i>
    Photo captured successfully for ${student.name}
  `;
  document.getElementById("photoStatus").className = "status-message success";
  
  // Add activity
  activities.unshift({
    type: "photo",
    message: `Photo captured for ${student.name}`,
    time: new Date(),
    icon: "camera",
    color: "success"
  });
  localStorage.setItem("activities", JSON.stringify(activities));
  
  showToast("Student photo captured successfully!", "success");
  renderStudents();
}

function retakePhoto() {
  document.getElementById("photoStatus").innerHTML = `
    <i class="fas fa-info-circle"></i>
    No photo captured
  `;
  document.getElementById("photoStatus").className = "status-message";
  showToast("Ready to take new photo", "info");
}

// ----- Enhanced Attendance Management -----
function renderAttendance() {
  const container = document.getElementById("attendanceTableContainer");
  const date = document.getElementById("attendanceDate").value || new Date().toISOString().split("T")[0];
  
  if (students.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list fa-3x"></i>
        <h3>No Students Available</h3>
        <p>Register students to manage attendance</p>
      </div>
    `;
    return;
  }
  
  let table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Class</th>
        <th>Status</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      ${students.map(student => {
        const key = student.id + "_" + date;
        const record = attendance[key];
        const status = record?.status || "Absent";
        const time = record?.time || "-";
        
        return `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.cls}</td>
            <td>
              <select onchange="updateAttendance('${student.id}', this.value, '${date}')" 
                      class="status-select ${status.toLowerCase()}">
                <option value="Present" ${status === "Present" ? "selected" : ""}>Present</option>
                <option value="Absent" ${status === "Absent" ? "selected" : ""}>Absent</option>
                <option value="Late" ${status === "Late" ? "selected" : ""}>Late</option>
              </select>
            </td>
            <td>${time}</td>
          </tr>
        `;
      }).join('')}
    </tbody>
  `;
  
  container.innerHTML = "";
  container.appendChild(table);
}

function updateAttendance(id, status, date) {
  const student = students.find(s => s.id === id);
  const attendanceDate = date || document.getElementById("attendanceDate").value || new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString();
  
  attendance[id + "_" + attendanceDate] = { 
    status, 
    date: attendanceDate, 
    time: status === "Present" ? time : "-"
  };
  
  localStorage.setItem("attendance", JSON.stringify(attendance));
  
  // Add activity for present marks
  if (status === "Present") {
    activities.unshift({
      type: "attendance",
      message: `${student.name} marked present`,
      time: new Date(),
      icon: "check-circle",
      color: "success"
    });
    localStorage.setItem("activities", JSON.stringify(activities));
  }
  
  showToast(`Attendance updated for ${student.name}`, "success");
  renderHome();
}

function markAllPresent() {
  const date = document.getElementById("attendanceDate").value || new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString();
  
  students.forEach(student => {
    attendance[student.id + "_" + date] = { 
      status: "Present", 
      date, 
      time 
    };
  });
  
  localStorage.setItem("attendance", JSON.stringify(attendance));
  
  // Add activity
  activities.unshift({
    type: "attendance",
    message: "All students marked present",
    time: new Date(),
    icon: "check-double",
    color: "success"
  });
  localStorage.setItem("activities", JSON.stringify(activities));
  
  showToast("All students marked as present", "success");
  renderAttendance();
  renderHome();
}

function markAllAbsent() {
  const date = document.getElementById("attendanceDate").value || new Date().toISOString().split("T")[0];
  
  students.forEach(student => {
    attendance[student.id + "_" + date] = { 
      status: "Absent", 
      date, 
      time: "-"
    };
  });
  
  localStorage.setItem("attendance", JSON.stringify(attendance));
  showToast("All students marked as absent", "warning");
  renderAttendance();
  renderHome();
}

// ----- Enhanced Face Scanning -----
let scanVideo = document.getElementById("webcam");
let scanCanvas = document.getElementById("scanCanvas");
let scanCtx = scanCanvas.getContext("2d");
let scanStream = null;
let isScanning = false;

function initializeFaceScanner() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(stream => { 
      scanVideo.srcObject = stream;
      scanStream = stream;
      scanCanvas.width = scanVideo.videoWidth;
      scanCanvas.height = scanVideo.videoHeight;
      document.getElementById("scanStatus").innerHTML = `
        <i class="fas fa-check-circle"></i>
        Scanner ready - Click Start Scan to begin
      `;
    })
    .catch(err => {
      console.error("Scanner camera error:", err);
      document.getElementById("scanStatus").innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        Camera not accessible - Please allow camera access
      `;
    });
}

function startFaceScan() {
  if (!scanStream) {
    showToast("Camera not available", "error");
    return;
  }
  
  isScanning = true;
  document.getElementById("scanStatus").innerHTML = `
    <i class="fas fa-sync fa-spin"></i>
    Scanning for faces...
  `;
  
  showToast("Face scanning started", "info");
  animateScan();
  
  // Simulate face detection (in real app, use face-api.js or similar)
  setTimeout(() => {
    if (isScanning) {
      simulateFaceDetection();
    }
  }, 2000);
}

function stopFaceScan() {
  isScanning = false;
  document.getElementById("scanStatus").innerHTML = `
    <i class="fas fa-pause-circle"></i>
    Scanning stopped
  `;
  showToast("Face scanning stopped", "warning");
}

function animateScan() {
  if (!isScanning) return;
  
  scanCtx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
  
  // Draw scanning animation
  const now = Date.now();
  const scale = 0.9 + 0.1 * Math.sin(now * 0.01);
  const centerX = scanCanvas.width / 2;
  const centerY = scanCanvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.6 * scale;
  
  scanCtx.strokeStyle = "#00ff00";
  scanCtx.lineWidth = 3;
  scanCtx.beginPath();
  scanCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  scanCtx.stroke();
  
  // Draw scanning lines
  for (let i = 0; i < 8; i++) {
    const angle = (now * 0.002 + i * Math.PI / 4) % (2 * Math.PI);
    scanCtx.beginPath();
    scanCtx.moveTo(centerX, centerY);
    scanCtx.lineTo(
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle)
    );
    scanCtx.stroke();
  }
  
  requestAnimationFrame(animateScan);
}

function simulateFaceDetection() {
  if (!isScanning) return;
  
  // Simulate random face detection
  const detected = Math.random() > 0.3; // 70% chance of detection
  const student = students[Math.floor(Math.random() * students.length)];
  
  if (detected && student) {
    const date = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString();
    
    attendance[student.id + "_" + date] = { 
      status: "Present", 
      date, 
      time 
    };
    
    localStorage.setItem("attendance", JSON.stringify(attendance));
    
    document.getElementById("scanStatus").innerHTML = `
      <i class="fas fa-check-circle"></i>
      Face recognized: ${student.name}
    `;
    
    // Add activity
    activities.unshift({
      type: "face-recognition",
      message: `${student.name} recognized via face scan`,
      time: new Date(),
      icon: "face",
      color: "success"
    });
    localStorage.setItem("activities", JSON.stringify(activities));
    
    showToast(`Face recognized: ${student.name}`, "success");
    
    // Continue scanning after a delay
    setTimeout(() => {
      if (isScanning) {
        document.getElementById("scanStatus").innerHTML = `
          <i class="fas fa-sync fa-spin"></i>
          Scanning for faces...
        `;
      }
    }, 3000);
  }
}

// ----- Enhanced Profile Management -----
function renderProfile() {
  document.getElementById("profileName").textContent = userProfile.name;
  document.getElementById("profileAvatar").src = userProfile.avatar;
  document.getElementById("userAvatar").src = userProfile.avatar;
  document.getElementById("userName").textContent = userProfile.name;
  document.getElementById("profileFullName").value = userProfile.name;
  document.getElementById("profileEmail").value = userProfile.email;
  document.getElementById("profileRole").value = userProfile.role;
  document.getElementById("profileDepartment").value = userProfile.department;
  
  // Update notification toggles
  document.getElementById("emailNotifications").checked = userProfile.notifications.email;
  document.getElementById("pushNotifications").checked = userProfile.notifications.push;
  document.getElementById("attendanceAlerts").checked = userProfile.notifications.attendance;
  
  // Update stats
  document.getElementById("profileStudents").textContent = students.length;
  document.getElementById("profileSessions").textContent = Object.keys(attendance).length;
}

function updateProfilePicture(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      userProfile.avatar = e.target.result;
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      renderProfile();
      showToast("Profile picture updated successfully", "success");
    };
    reader.readAsDataURL(file);
  }
}

function updateProfile() {
  const name = document.getElementById("profileFullName").value;
  const email = document.getElementById("profileEmail").value;
  const role = document.getElementById("profileRole").value;
  const department = document.getElementById("profileDepartment").value;
  
  userProfile.name = name;
  userProfile.email = email;
  userProfile.role = role;
  userProfile.department = department;
  userProfile.notifications = {
    email: document.getElementById("emailNotifications").checked,
    push: document.getElementById("pushNotifications").checked,
    attendance: document.getElementById("attendanceAlerts").checked
  };
  
  localStorage.setItem("userProfile", JSON.stringify(userProfile));
  renderProfile();
  showToast("Profile updated successfully", "success");
}

// ----- Utility Functions -----
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle"
  };
  
  toast.innerHTML = `
    <i class="fas fa-${icons[type]}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove toast after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function generateReport() {
  showToast("Generating attendance report...", "info");
  // In a real app, this would generate and download a PDF/Excel report
  setTimeout(() => {
    showToast("Report generated successfully", "success");
  }, 2000);
}

function generateAttendanceReport() {
  showToast("Generating detailed attendance report...", "info");
  // In a real app, this would generate a comprehensive report
  setTimeout(() => {
    showToast("Attendance report generated successfully", "success");
  }, 2000);
}

function exportStudentData() {
  showToast("Exporting student data...", "info");
  // In a real app, this would export to CSV/Excel
  setTimeout(() => {
    showToast("Student data exported successfully", "success");
  }, 2000);
}

// ----- Initialize Application -----
document.addEventListener('DOMContentLoaded', function() {
  updateCurrentDate();
  renderHome();
  renderStudents();
  renderAttendance();
  renderProfile();
  
  // Set today's date as default for attendance
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("attendanceDate").value = today;
  
  showToast("Smart Attendance System loaded successfully!", "success");
});

// Clean up camera streams when leaving the page
window.addEventListener('beforeunload', function() {
  if (registerStream) {
    registerStream.getTracks().forEach(track => track.stop());
  }
  if (scanStream) {
    scanStream.getTracks().forEach(track => track.stop());
  }
});