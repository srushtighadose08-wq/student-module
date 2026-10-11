// Standalone In-Browser Mock Backend & Persistent Storage Service
// Runs 100% on the frontend using localStorage without needing a Java/MySQL backend!

const STORAGE_KEYS = {
  USERS: 'college_lms_users',
  APPROVALS: 'college_lms_approvals',
  COURSES: 'college_lms_courses',
  ENROLLMENTS: 'college_lms_enrollments',
  ASSIGNMENTS: 'college_lms_assignments',
  SUBMISSIONS: 'college_lms_submissions',
  EXAMS: 'college_lms_exams',
  GRADES: 'college_lms_grades',
  ANNOUNCEMENTS: 'college_lms_announcements',
  NOTIFICATIONS: 'college_lms_notifications',
  ATTENDANCE: 'college_lms_attendance'
};

// Initial Seed Data
const initialDepartments = [
  { id: 1, code: 'CSE', name: 'Computer Science & Engineering', hodId: 1, hodName: 'Dr. Robert Sterling' },
  { id: 2, code: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 3, code: 'IT', name: 'Information Technology' },
  { id: 4, code: 'MECH', name: 'Mechanical Engineering' }
];

const initialClasses = [
  { id: 1, name: 'CS-3A', departmentId: 1, semester: 5, academicYear: 3 },
  { id: 2, name: 'CS-3B', departmentId: 1, semester: 5, academicYear: 3 },
  { id: 3, name: 'CS-4A', departmentId: 1, semester: 7, academicYear: 4 },
  { id: 4, name: 'EC-3A', departmentId: 2, semester: 5, academicYear: 3 }
];

const initialUsers = [
  {
    id: 1,
    fullName: 'Dr. Robert Sterling',
    email: 'hod.cse@college.edu',
    password: 'HodPass@123',
    role: 'ROLE_HOD',
    approvalStatus: 'APPROVED',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    rollOrEmpNumber: 'HOD-CSE-01',
    phoneNumber: '+1 (555) 234-5678',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    fullName: 'Prof. John Mitchell',
    email: 'faculty.john@college.edu',
    password: 'FacultyPass@123',
    role: 'ROLE_FACULTY',
    approvalStatus: 'APPROVED',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    classYear: '3rd Year CSE',
    rollOrEmpNumber: 'FAC-CSE-104',
    phoneNumber: '+1 (555) 345-6789',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    fullName: 'Alex Morgan',
    email: 'student.alex@college.edu',
    password: 'StudentPass@123',
    role: 'ROLE_STUDENT',
    approvalStatus: 'APPROVED',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    classYear: '3rd Year (CS-3A)',
    rollOrEmpNumber: '2023-CS-042',
    phoneNumber: '+1 (555) 456-7890',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    fullName: 'Sarah Jenkins',
    email: 'student.pending@college.edu',
    password: 'PendingPass@123',
    role: 'ROLE_STUDENT',
    approvalStatus: 'PENDING',
    departmentId: 1,
    departmentName: 'Computer Science & Engineering',
    classYear: '3rd Year (CS-3A)',
    rollOrEmpNumber: '2023-CS-088',
    phoneNumber: '+1 (555) 567-8901',
    createdAt: new Date().toISOString()
  }
];

const initialCourses = [
  { id: 1, code: 'CS301', name: 'Data Structures and Algorithms', credits: 4, departmentId: 1, departmentName: 'Computer Science & Engineering', facultyId: 2, facultyName: 'Prof. John Mitchell', semester: 5, description: 'Fundamental data structures, trees, graphs, sorting and asymptotic analysis.', schedule: 'Mon, Wed (10:00 AM - 11:30 AM)', roomNumber: 'Room 301, Tech Block', progressPercentage: 78, grade: 'A+' },
  { id: 2, code: 'CS302', name: 'Web Technology', credits: 3, departmentId: 1, departmentName: 'Computer Science & Engineering', facultyId: 2, facultyName: 'Prof. John Mitchell', semester: 5, description: 'Modern full-stack web architecture, React, RESTful services, and asynchronous web applications.', schedule: 'Tue, Thu (09:00 AM - 10:30 AM)', roomNumber: 'Lab 3B, Tech Block', progressPercentage: 85, grade: 'A' },
  { id: 3, code: 'CS303', name: 'Database Management Systems', credits: 4, departmentId: 1, departmentName: 'Computer Science & Engineering', facultyId: 2, facultyName: 'Prof. John Mitchell', semester: 5, description: 'Relational databases, SQL, normalization, transactions, and indexing.', schedule: 'Mon, Wed (02:00 PM - 03:30 PM)', roomNumber: 'Room 304, Tech Block', progressPercentage: 70, grade: 'B+' },
  { id: 4, code: 'CS304', name: 'Computer Networks', credits: 4, departmentId: 1, departmentName: 'Computer Science & Engineering', facultyId: 2, facultyName: 'Prof. John Mitchell', semester: 5, description: 'OSI & TCP/IP stack, routing protocols, transport layer, and network security.', schedule: 'Tue, Thu (11:00 AM - 12:30 PM)', roomNumber: 'Room 302, Tech Block', progressPercentage: 62, grade: 'B' },
  { id: 5, code: 'CS305', name: 'Software Engineering', credits: 3, departmentId: 1, departmentName: 'Computer Science & Engineering', facultyId: 2, facultyName: 'Prof. John Mitchell', semester: 5, description: 'Agile development methodologies, software design patterns, testing, and CI/CD.', schedule: 'Fri (10:00 AM - 01:00 PM)', roomNumber: 'Seminar Hall B', progressPercentage: 90, grade: 'A+' },
  { id: 6, code: 'HU301', name: 'Environmental Studies', credits: 2, departmentId: 1, departmentName: 'Computer Science & Engineering', facultyId: 2, facultyName: 'Prof. John Mitchell', semester: 5, description: 'Ecosystem sustainability, renewable energy, and environmental impact assessment.', schedule: 'Fri (02:00 PM - 04:00 PM)', roomNumber: 'Hall 101', progressPercentage: 95, grade: 'O' }
];

const initialAssignments = [
  { id: 1, courseId: 1, courseName: 'Data Structures and Algorithms', courseCode: 'CS301', facultyId: 2, facultyName: 'Prof. John Mitchell', title: 'Binary Search Trees & AVL Balancing', description: 'Implement an AVL tree in Java/C++ with insert, delete, and automatic left/right rotation methods.', dueDate: '2026-10-18', totalMarks: 100, submitted: true, submissionStatus: 'SUBMITTED', marksObtained: 92, feedback: 'Clean AVL rotation implementation and test cases.' },
  { id: 2, courseId: 2, courseName: 'Web Technology', courseCode: 'CS302', facultyId: 2, facultyName: 'Prof. John Mitchell', title: 'Responsive LMS UI with React & Vite', description: 'Design a responsive student portal dashboard layout with clean light-green theme and mobile drawer.', dueDate: '2026-10-22', totalMarks: 100, submitted: false, submissionStatus: 'PENDING' },
  { id: 3, courseId: 3, courseName: 'Database Management Systems', courseCode: 'CS303', facultyId: 2, facultyName: 'Prof. John Mitchell', title: 'Database Normalization to BCNF', description: 'Normalize the college hostel management schema from 1NF through 3NF and Boyce-Codd Normal Form.', dueDate: '2026-10-25', totalMarks: 50, submitted: false, submissionStatus: 'PENDING' }
];

const initialExams = [
  { id: 1, courseId: 1, courseName: 'Data Structures and Algorithms', courseCode: 'CS301', title: 'Mid-Term Theory Examination', examDate: '2026-10-24', timeSlot: '09:30 AM - 11:30 AM', roomNumber: 'Hall 201, Tech Block', totalMarks: 100 },
  { id: 2, courseId: 2, courseName: 'Web Technology', courseCode: 'CS302', title: 'Mid-Term Theory Examination', examDate: '2026-10-26', timeSlot: '09:30 AM - 11:30 AM', roomNumber: 'Hall 201, Tech Block', totalMarks: 100 },
  { id: 3, courseId: 3, courseName: 'Database Management Systems', courseCode: 'CS303', title: 'Mid-Term Theory Examination', examDate: '2026-10-28', timeSlot: '09:30 AM - 11:30 AM', roomNumber: 'Hall 202, Tech Block', totalMarks: 100 },
  { id: 4, courseId: 4, courseName: 'Computer Networks', courseCode: 'CS304', title: 'Mid-Term Theory Examination', examDate: '2026-10-30', timeSlot: '09:30 AM - 11:30 AM', roomNumber: 'Hall 202, Tech Block', totalMarks: 100 }
];

const initialGrades = [
  { id: 1, studentId: 3, studentName: 'Alex Morgan', courseId: 1, courseCode: 'CS301', courseName: 'Data Structures and Algorithms', credits: 4, marksObtained: 92, totalMarks: 100, gradeLetter: 'A+', gpaPoint: 9.5, semester: 'Semester 4', remarks: 'Excellent performance in problem solving.' },
  { id: 2, studentId: 3, studentName: 'Alex Morgan', courseId: 2, courseCode: 'CS302', courseName: 'Web Technology', credits: 3, marksObtained: 88, totalMarks: 100, gradeLetter: 'A', gpaPoint: 8.8, semester: 'Semester 4', remarks: 'High quality UI and architecture.' },
  { id: 3, studentId: 3, studentName: 'Alex Morgan', courseId: 3, courseCode: 'CS303', courseName: 'Database Management Systems', credits: 4, marksObtained: 84, totalMarks: 100, gradeLetter: 'B+', gpaPoint: 8.2, semester: 'Semester 4', remarks: 'Strong SQL and relational modeling.' }
];

const initialAnnouncements = [
  { id: 1, title: 'Mid-Term Examination Schedule Released (Fall 2026)', content: 'The mid-term examination timetable for 3rd and 4th year B.Tech students has been published. All examinations begin at 09:30 AM in designated examination halls.', category: 'EXAM', authorName: 'Office of Examination Cell', authorRole: 'ADMIN', targetAudience: 'ALL', important: true, createdAt: new Date().toISOString() },
  { id: 2, title: "Annual Hackathon 'CodeVerse 2026' Registrations Open", content: 'Join the 36-hour inter-college hackathon focusing on AI, Cloud, and Sustainable Tech. Cash prizes up to $5,000 for winning teams. Register your team today.', category: 'EVENT', authorName: 'Dr. Robert Sterling', authorRole: 'HOD', targetAudience: 'ALL', important: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Library Digital Portal Maintenance & E-Book Expansion', content: 'The central digital library server has been updated with 1,200+ new technical e-books and research journals covering Distributed Systems and Machine Learning.', category: 'ACADEMIC', authorName: 'Central Library Team', authorRole: 'ADMIN', targetAudience: 'ALL', important: false, createdAt: new Date().toISOString() }
];

const initialNotifications = [
  { id: 1, userId: 3, title: 'Welcome to College LMS', message: 'Your student account is active. Explore courses, assignments, and exams.', type: 'SYSTEM', isRead: false, link: '/dashboard', createdAt: new Date().toISOString() },
  { id: 2, userId: 3, title: 'New Assignment Posted', message: "Prof. John Mitchell published 'Binary Search Trees & AVL Balancing'.", type: 'ASSIGNMENT', isRead: false, link: '/assignments', createdAt: new Date().toISOString() },
  { id: 3, userId: 3, title: 'Exam Hall Ticket Ready', message: 'Mid-term exam schedule and seating arrangements are now available in the Exams tab.', type: 'EXAM', isRead: true, link: '/exams', createdAt: new Date().toISOString() }
];

// Helper Functions for LocalStorage Persistence
const getItem = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage quota exceeded', e);
  }
};

// Initialize Storage on First Load
const initStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) setItem(STORAGE_KEYS.USERS, initialUsers);
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) setItem(STORAGE_KEYS.COURSES, initialCourses);
  if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) setItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) setItem(STORAGE_KEYS.EXAMS, initialExams);
  if (!localStorage.getItem(STORAGE_KEYS.GRADES)) setItem(STORAGE_KEYS.GRADES, initialGrades);
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) setItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) setItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
};

initStore();

// ==========================================================
// REST API Mock Implementation
// ==========================================================

export const authApi = {
  login: async (credentials) => {
    await new Promise(r => setTimeout(r, 200));
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const email = credentials.email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === email);

    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    if (user.approvalStatus === 'PENDING') {
      const reviewer = user.role === 'ROLE_STUDENT' ? 'faculty' : 'HOD';
      throw new Error(`Your account registration is currently PENDING approval by your ${reviewer}. Please check back later.`);
    }

    if (user.approvalStatus === 'REJECTED') {
      throw new Error(`Your account registration was REJECTED: ${user.rejectionReason || 'Requirements not met'}. Please contact your department.`);
    }

    const token = 'mock_jwt_token_' + user.id + '_' + Date.now();
    return {
      token,
      tokenType: 'Bearer',
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
      departmentId: user.departmentId,
      departmentName: user.departmentName,
      classYear: user.classYear,
      rollOrEmpNumber: user.rollOrEmpNumber,
      phoneNumber: user.phoneNumber
    };
  },

  register: async (data) => {
    await new Promise(r => setTimeout(r, 200));
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const email = data.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === email)) {
      throw new Error('Email address is already registered. Please log in instead.');
    }

    let role = 'ROLE_STUDENT';
    if (data.role === 'FACULTY') role = 'ROLE_FACULTY';
    if (data.role === 'HOD') role = 'ROLE_HOD';

    const newUser = {
      id: users.length + 1,
      fullName: data.fullName.trim(),
      email,
      password: data.password,
      role,
      approvalStatus: 'PENDING',
      departmentId: data.departmentId || 1,
      departmentName: data.departmentName || 'Computer Science & Engineering',
      classYear: data.classYear || '3rd Year (CS-3A)',
      rollOrEmpNumber: data.rollOrEmpNumber || `STU-2026-0${users.length + 1}`,
      phoneNumber: data.phoneNumber || '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);

    const message = (role === 'ROLE_STUDENT')
      ? 'Registration submitted successfully! Your account is pending faculty approval before you can log in.'
      : 'Registration submitted successfully! Your faculty account is pending HOD approval before you can log in.';

    return { success: true, message, data: newUser };
  },

  getDepartments: async () => {
    return initialDepartments;
  },

  getClasses: async () => {
    return initialClasses;
  },

  getCurrentUser: async () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    const current = JSON.parse(savedUser);
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const refreshed = users.find(u => u.id === current.id);
    return refreshed || current;
  }
};

export const studentApi = {
  getDashboard: async () => {
    const courses = getItem(STORAGE_KEYS.COURSES, initialCourses);
    const assignments = getItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    const exams = getItem(STORAGE_KEYS.EXAMS, initialExams);
    const grades = getItem(STORAGE_KEYS.GRADES, initialGrades);
    const announcements = getItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    const notifications = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);

    return {
      currentGpa: 8.65,
      totalCreditsEnrolled: 20,
      overallAttendancePercentage: 89.5,
      pendingAssignmentsCount: assignments.filter(a => !a.submitted).length,
      enrolledCourses: courses,
      upcomingAssignments: assignments,
      upcomingExams: exams,
      recentGrades: grades,
      recentAnnouncements: announcements,
      unreadNotificationsCount: notifications.filter(n => !n.isRead).length
    };
  },

  getCourses: async () => {
    return getItem(STORAGE_KEYS.COURSES, initialCourses);
  },

  getAssignments: async () => {
    return getItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
  },

  submitAssignment: async (assignmentId, data) => {
    await new Promise(r => setTimeout(r, 200));
    const assignments = getItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    const idx = assignments.findIndex(a => a.id === Number(assignmentId));
    if (idx !== -1) {
      assignments[idx].submitted = true;
      assignments[idx].submissionStatus = 'SUBMITTED';
      assignments[idx].submissionContent = data.submissionContent;
      setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    }
    return { success: true, message: 'Assignment submitted successfully!' };
  },

  getExams: async () => {
    return getItem(STORAGE_KEYS.EXAMS, initialExams);
  },

  getGrades: async () => {
    return getItem(STORAGE_KEYS.GRADES, initialGrades);
  },

  getAttendance: async () => {
    return [];
  }
};

export const facultyApi = {
  getDashboard: async () => {
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const pendingStudents = users.filter(u => u.role === 'ROLE_STUDENT' && u.approvalStatus === 'PENDING');
    const courses = getItem(STORAGE_KEYS.COURSES, initialCourses);
    const assignments = getItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);

    return {
      totalCoursesTaught: courses.length,
      totalStudentsEnrolled: 48,
      pendingStudentApprovalsCount: pendingStudents.length,
      activeAssignmentsCount: assignments.length,
      assignedCourses: courses,
      pendingStudentApprovals: pendingStudents,
      activeAssignments: assignments
    };
  },

  getPendingStudents: async () => {
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    return users.filter(u => u.role === 'ROLE_STUDENT' && u.approvalStatus === 'PENDING');
  },

  approveStudent: async (studentId) => {
    await new Promise(r => setTimeout(r, 200));
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const user = users.find(u => u.id === Number(studentId));
    if (user) {
      user.approvalStatus = 'APPROVED';
      user.rejectionReason = null;
      setItem(STORAGE_KEYS.USERS, users);

      // Add notification for student
      const notifs = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
      notifs.unshift({
        id: notifs.length + 1,
        userId: user.id,
        title: 'Account Approved!',
        message: 'Welcome to College LMS! Your student registration has been approved.',
        type: 'APPROVAL',
        isRead: false,
        link: '/dashboard',
        createdAt: new Date().toISOString()
      });
      setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
    return { success: true, message: `Student ${user?.fullName || ''} approved successfully!` };
  },

  rejectStudent: async (studentId, reason) => {
    await new Promise(r => setTimeout(r, 200));
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const user = users.find(u => u.id === Number(studentId));
    if (user) {
      user.approvalStatus = 'REJECTED';
      user.rejectionReason = reason || 'Registration requirements not met.';
      setItem(STORAGE_KEYS.USERS, users);
    }
    return { success: true, message: `Student ${user?.fullName || ''} rejected.` };
  },

  createAssignment: async (data) => {
    await new Promise(r => setTimeout(r, 200));
    const assignments = getItem(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
    const courses = getItem(STORAGE_KEYS.COURSES, initialCourses);
    const course = courses.find(c => c.id === Number(data.courseId));

    const newAssign = {
      id: assignments.length + 1,
      courseId: data.courseId,
      courseName: course?.name || 'Computer Science',
      courseCode: course?.code || 'CS301',
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      totalMarks: data.totalMarks || 100,
      submitted: false,
      submissionStatus: 'PENDING'
    };
    assignments.push(newAssign);
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return { success: true, message: 'Assignment published successfully!', data: newAssign };
  },

  recordAttendance: async (data) => {
    return { success: true, message: 'Attendance recorded successfully!' };
  },

  recordGrade: async (data) => {
    await new Promise(r => setTimeout(r, 200));
    const grades = getItem(STORAGE_KEYS.GRADES, initialGrades);
    const courses = getItem(STORAGE_KEYS.COURSES, initialCourses);
    const course = courses.find(c => c.id === Number(data.courseId));

    const newGrade = {
      id: grades.length + 1,
      studentId: data.studentId,
      studentName: 'Alex Morgan',
      courseId: data.courseId,
      courseCode: course?.code || 'CS301',
      courseName: course?.name || 'Data Structures',
      credits: 4,
      marksObtained: data.marksObtained,
      totalMarks: 100,
      gradeLetter: data.gradeLetter,
      gpaPoint: data.gpaPoint,
      semester: 'Semester 5',
      remarks: data.remarks
    };
    grades.push(newGrade);
    setItem(STORAGE_KEYS.GRADES, grades);
    return { success: true, message: 'Grade published to student transcript!' };
  }
};

export const hodApi = {
  getDashboard: async () => {
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const pendingFaculty = users.filter(u => u.role === 'ROLE_FACULTY' && u.approvalStatus === 'PENDING');
    const facultyList = users.filter(u => u.role === 'ROLE_FACULTY' && u.approvalStatus === 'APPROVED');
    const students = users.filter(u => u.role === 'ROLE_STUDENT' && u.approvalStatus === 'APPROVED');
    const courses = getItem(STORAGE_KEYS.COURSES, initialCourses);

    return {
      departmentName: 'Computer Science & Engineering',
      departmentCode: 'CSE',
      totalStudents: students.length,
      totalFaculty: facultyList.length,
      totalCourses: courses.length,
      pendingFacultyApprovalsCount: pendingFaculty.length,
      pendingFacultyApprovals: pendingFaculty,
      facultyList: facultyList,
      departmentCourses: courses
    };
  },

  getPendingFaculty: async () => {
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    return users.filter(u => u.role === 'ROLE_FACULTY' && u.approvalStatus === 'PENDING');
  },

  approveFaculty: async (facultyId) => {
    await new Promise(r => setTimeout(r, 200));
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const user = users.find(u => u.id === Number(facultyId));
    if (user) {
      user.approvalStatus = 'APPROVED';
      user.rejectionReason = null;
      setItem(STORAGE_KEYS.USERS, users);
    }
    return { success: true, message: `Faculty ${user?.fullName || ''} approved successfully!` };
  },

  rejectFaculty: async (facultyId, reason) => {
    await new Promise(r => setTimeout(r, 200));
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const user = users.find(u => u.id === Number(facultyId));
    if (user) {
      user.approvalStatus = 'REJECTED';
      user.rejectionReason = reason || 'Department criteria not met.';
      setItem(STORAGE_KEYS.USERS, users);
    }
    return { success: true, message: `Faculty ${user?.fullName || ''} rejected.` };
  },

  assignCourse: async (courseId, facultyId) => {
    await new Promise(r => setTimeout(r, 200));
    const courses = getItem(STORAGE_KEYS.COURSES, initialCourses);
    const users = getItem(STORAGE_KEYS.USERS, initialUsers);
    const course = courses.find(c => c.id === Number(courseId));
    const faculty = users.find(u => u.id === Number(facultyId));

    if (course && faculty) {
      course.facultyId = faculty.id;
      course.facultyName = faculty.fullName;
      setItem(STORAGE_KEYS.COURSES, courses);
    }
    return { success: true, message: 'Subject allocation updated!' };
  }
};

export const announcementApi = {
  getAll: async (category) => {
    const list = getItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    if (!category || category === 'ALL') return list;
    return list.filter(a => a.category.toUpperCase() === category.toUpperCase());
  },

  create: async (data) => {
    await new Promise(r => setTimeout(r, 200));
    const list = getItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    const newA = {
      id: list.length + 1,
      title: data.title,
      content: data.content,
      category: data.category || 'ACADEMIC',
      authorName: 'College Administration',
      authorRole: 'FACULTY',
      targetAudience: data.targetAudience || 'ALL',
      important: data.important || false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newA);
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return { success: true, message: 'Circular broadcasted successfully!', data: newA };
  }
};

export const notificationApi = {
  getAll: async () => {
    return getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  },

  getUnreadCount: async () => {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    return list.filter(n => !n.isRead).length;
  },

  markAsRead: async (id) => {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    const item = list.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
    return { success: true };
  },

  markAllAsRead: async () => {
    const list = getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    list.forEach(n => n.isRead = true);
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    return { success: true };
  }
};

export const profileApi = {
  getProfile: async () => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : initialUsers[2];
  },

  updateProfile: async (data) => {
    await new Promise(r => setTimeout(r, 200));
    const saved = localStorage.getItem('user');
    if (saved) {
      const user = JSON.parse(saved);
      Object.assign(user, data);
      localStorage.setItem('user', JSON.stringify(user));

      const users = getItem(STORAGE_KEYS.USERS, initialUsers);
      const u = users.find(item => item.id === user.id);
      if (u) {
        Object.assign(u, data);
        setItem(STORAGE_KEYS.USERS, users);
      }
      return { success: true, message: 'Profile updated!', data: user };
    }
    return { success: true, message: 'Profile updated!' };
  },

  changePassword: async (data) => {
    await new Promise(r => setTimeout(r, 200));
    return { success: true, message: 'Password updated successfully!' };
  }
};
