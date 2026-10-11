import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  BookOpen, 
  FilePlus, 
  CheckCircle2, 
  ClipboardCheck, 
  Clock, 
  Plus,
  AlertCircle,
  Eye,
  Megaphone
} from 'lucide-react';
import { facultyApi, announcementApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const FacultyDashboard = ({ setActivePage }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approval / Rejection state
  const [rejectingStudent, setRejectingStudent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Create Assignment modal state
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    totalMarks: 100
  });

  // Record Attendance modal state
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    courseId: '',
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT'
  });

  // Record Grade modal state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    courseId: '',
    studentId: '',
    marksObtained: 85,
    gradeLetter: 'A',
    gpaPoint: 9.0,
    remarks: 'Consistent performance'
  });

  useEffect(() => {
    fetchFacultyDashboard();
  }, []);

  const fetchFacultyDashboard = async () => {
    try {
      setLoading(true);
      const data = await facultyApi.getDashboard();
      setDashboard(data);
      if (data?.assignedCourses?.length > 0) {
        setAssignmentForm(prev => ({ ...prev, courseId: data.assignedCourses[0].id.toString() }));
        setAttendanceForm(prev => ({ ...prev, courseId: data.assignedCourses[0].id.toString() }));
        setGradeForm(prev => ({ ...prev, courseId: data.assignedCourses[0].id.toString() }));
      }
    } catch (err) {
      console.error('Failed to load faculty dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      setProcessingAction(true);
      const res = await facultyApi.approveStudent(studentId);
      showToast(res.message || 'Student registration approved successfully!');
      fetchFacultyDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to approve student', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectStudent = async () => {
    if (!rejectingStudent) return;
    try {
      setProcessingAction(true);
      const res = await facultyApi.rejectStudent(rejectingStudent.id, rejectionReason);
      showToast(res.message || 'Student registration rejected.');
      setRejectingStudent(null);
      setRejectionReason('');
      fetchFacultyDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to reject student', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentForm.courseId || !assignmentForm.title || !assignmentForm.dueDate) {
      showToast('Please fill all required assignment fields', 'error');
      return;
    }

    try {
      setProcessingAction(true);
      await facultyApi.createAssignment({
        courseId: Number(assignmentForm.courseId),
        title: assignmentForm.title,
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate,
        totalMarks: Number(assignmentForm.totalMarks)
      });
      showToast('Assignment published to students successfully!');
      setShowCreateAssignment(false);
      setAssignmentForm({
        courseId: dashboard?.assignedCourses?.[0]?.id?.toString() || '',
        title: '',
        description: '',
        dueDate: '',
        totalMarks: 100
      });
      fetchFacultyDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to create assignment', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRecordAttendance = async (e) => {
    e.preventDefault();
    try {
      setProcessingAction(true);
      await facultyApi.recordAttendance({
        courseId: Number(attendanceForm.courseId),
        studentId: Number(attendanceForm.studentId),
        date: attendanceForm.date,
        status: attendanceForm.status
      });
      showToast('Attendance recorded successfully!');
      setShowAttendanceModal(false);
    } catch (err) {
      showToast(err.message || 'Failed to record attendance', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRecordGrade = async (e) => {
    e.preventDefault();
    try {
      setProcessingAction(true);
      await facultyApi.recordGrade({
        courseId: Number(gradeForm.courseId),
        studentId: Number(gradeForm.studentId),
        marksObtained: Number(gradeForm.marksObtained),
        gradeLetter: gradeForm.gradeLetter,
        gpaPoint: Number(gradeForm.gpaPoint),
        remarks: gradeForm.remarks
      });
      showToast('Grade recorded and notified to student!');
      setShowGradeModal(false);
    } catch (err) {
      showToast(err.message || 'Failed to record grade', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>Loading Faculty Dashboard...</div>
      </div>
    );
  }

  const faculty = dashboard?.faculty || user;
  const pendingStudents = dashboard?.pendingStudentApprovals || [];
  const assignedCourses = dashboard?.assignedCourses || [];
  const activeAssignments = dashboard?.activeAssignments || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Faculty Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)'
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
            Faculty Portal
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
            {faculty?.fullName || 'Faculty Member'}
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
            {faculty?.departmentName || 'Computer Science & Engineering'} • Faculty ID: {faculty?.rollOrEmpNumber || 'FAC-104'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }} className="hidden-mobile">
          <button 
            onClick={() => setShowCreateAssignment(true)}
            className="btn btn-primary"
            style={{ background: '#ffffff', color: '#047857', fontWeight: 700 }}
          >
            <Plus size={16} /> New Assignment
          </button>
          <button 
            onClick={() => setShowAttendanceModal(true)}
            style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
          >
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid-4">
        <StatCard
          title="Pending Approvals"
          value={dashboard?.pendingStudentApprovalsCount || pendingStudents.length}
          subtitle="New Student Registrations"
          icon={UserCheck}
          color="#f59e0b"
        />
        <StatCard
          title="Assigned Subjects"
          value={dashboard?.totalCoursesTaught || assignedCourses.length}
          subtitle="Active lecture batches"
          icon={BookOpen}
          color="#10b981"
        />
        <StatCard
          title="Enrolled Students"
          value={dashboard?.totalStudentsEnrolled || 48}
          subtitle="In Department"
          icon={Users}
          color="#3b82f6"
        />
        <StatCard
          title="Active Assignments"
          value={dashboard?.activeAssignmentsCount || activeAssignments.length}
          subtitle="Submissions open"
          icon={ClipboardCheck}
          color="#8b5cf6"
        />
      </div>

      {/* Pending Student Registrations Review Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <UserCheck size={20} color="#f59e0b" />
            <span>Pending Student Registration Approvals ({pendingStudents.length})</span>
          </div>
          {pendingStudents.length > 0 && (
            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>Action Required</span>
          )}
        </div>

        {pendingStudents.length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
            <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>All Student Registrations Reviewed</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>New student registration requests will appear here for faculty review and verification.</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Department / Class</th>
                  <th>Roll / Temp ID</th>
                  <th>Status</th>
                  <th>Approval Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Registered: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Today'}</div>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.departmentName || 'CSE'} • {s.classYear || '3rd Year'}</td>
                    <td><Badge status="info">{s.rollOrEmpNumber || `STU-${s.id}`}</Badge></td>
                    <td><Badge status="pending">Pending Review</Badge></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApproveStudent(s.id)}
                          className="btn btn-sm btn-success"
                          disabled={processingAction}
                        >
                          <UserCheck size={14} /> Approve
                        </button>
                        <button
                          onClick={() => setRejectingStudent(s)}
                          className="btn btn-sm btn-danger"
                          disabled={processingAction}
                        >
                          <UserX size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Faculty Assigned Courses & Assignments Row */}
      <div className="grid-2">
        {/* Assigned Courses */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={20} color="#10b981" />
              <span>Assigned Subjects & Teaching Load</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assignedCourses.map((c) => (
              <div 
                key={c.id}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Code: <strong>{c.code}</strong> • {c.credits} Credits • {c.schedule || 'MWF 10:00 AM'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>
                    📍 {c.roomNumber || 'Tech Block Hall 301'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGradeForm(prev => ({ ...prev, courseId: c.id.toString() }));
                    setShowGradeModal(true);
                  }}
                  className="btn btn-sm btn-outline-primary"
                >
                  Enter Grades
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Assignments Management */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ClipboardCheck size={20} color="#10b981" />
              <span>Active Course Assignments</span>
            </div>
            <button 
              onClick={() => setShowCreateAssignment(true)}
              className="btn btn-sm btn-primary"
            >
              <Plus size={14} /> New Task
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeAssignments.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No assignments created yet. Click "+ New Task" to create one.
              </div>
            ) : (
              activeAssignments.map((a) => (
                <div 
                  key={a.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{a.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {a.courseName} • Due: {a.dueDate} • Total Marks: {a.totalMarks}
                    </div>
                  </div>
                  <Badge status="info">Active</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reject Student Modal */}
      <Modal
        isOpen={!!rejectingStudent}
        onClose={() => { setRejectingStudent(null); setRejectionReason(''); }}
        title={`Reject Student Registration: ${rejectingStudent?.fullName || ''}`}
        footer={
          <>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setRejectingStudent(null); setRejectionReason(''); }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleRejectStudent}
              disabled={processingAction}
            >
              {processingAction ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            Please state the specific reason for rejecting <strong>{rejectingStudent?.fullName}</strong>'s account registration. The student will be shown this feedback when attempting to sign in.
          </p>
          <div className="form-group">
            <label className="form-label">Rejection Reason</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Department records do not match, or prerequisites are incomplete."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        title="Publish New Course Assignment"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowCreateAssignment(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateAssignment} disabled={processingAction}>
              {processingAction ? 'Publishing...' : 'Publish to Students'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateAssignment}>
          <div className="form-group">
            <label className="form-label">Target Course</label>
            <select
              className="form-select"
              value={assignmentForm.courseId}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, courseId: e.target.value })}
              required
            >
              {assignedCourses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assignment Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Binary Search Tree Implementation"
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Instructions</label>
            <textarea
              className="form-textarea"
              placeholder="Provide problem statement, guidelines, submission format..."
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={assignmentForm.dueDate}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Marks</label>
              <input
                type="number"
                className="form-input"
                value={assignmentForm.totalMarks}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, totalMarks: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Record Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title="Mark Student Lecture Attendance"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAttendanceModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRecordAttendance} disabled={processingAction}>
              {processingAction ? 'Saving...' : 'Record Attendance'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRecordAttendance}>
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={attendanceForm.courseId}
              onChange={(e) => setAttendanceForm({ ...attendanceForm, courseId: e.target.value })}
              required
            >
              {assignedCourses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter student ID (e.g. 3)"
              value={attendanceForm.studentId}
              onChange={(e) => setAttendanceForm({ ...attendanceForm, studentId: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={attendanceForm.date}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={attendanceForm.status}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
              >
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
                <option value="LATE">LATE</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Enter Grade Modal */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title="Publish Course Grade & Evaluation"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowGradeModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRecordGrade} disabled={processingAction}>
              {processingAction ? 'Publishing...' : 'Record & Notify Student'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRecordGrade}>
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={gradeForm.courseId}
              onChange={(e) => setGradeForm({ ...gradeForm, courseId: e.target.value })}
              required
            >
              {assignedCourses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 3"
              value={gradeForm.studentId}
              onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
              required
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Marks (100)</label>
              <input
                type="number"
                className="form-input"
                value={gradeForm.marksObtained}
                onChange={(e) => setGradeForm({ ...gradeForm, marksObtained: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Grade Letter</label>
              <select
                className="form-select"
                value={gradeForm.gradeLetter}
                onChange={(e) => setGradeForm({ ...gradeForm, gradeLetter: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">GPA Point</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={gradeForm.gpaPoint}
                onChange={(e) => setGradeForm({ ...gradeForm, gpaPoint: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Remarks / Feedback</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Exceptional comprehension and analytical skills."
              value={gradeForm.remarks}
              onChange={(e) => setGradeForm({ ...gradeForm, remarks: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
