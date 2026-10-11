import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  UserX, 
  CheckCircle2, 
  Plus, 
  Megaphone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { hodApi, announcementApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const HodDashboard = ({ setActivePage }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reject faculty modal state
  const [rejectingFaculty, setRejectingFaculty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // Allocate course modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    courseId: '',
    facultyId: ''
  });

  // Post announcement modal state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    category: 'ACADEMIC',
    targetAudience: 'ALL',
    important: false
  });

  useEffect(() => {
    fetchHodDashboard();
  }, []);

  const fetchHodDashboard = async () => {
    try {
      setLoading(true);
      const data = await hodApi.getDashboard();
      setDashboard(data);
      if (data?.departmentCourses?.length > 0 && data?.facultyList?.length > 0) {
        setAssignForm({
          courseId: data.departmentCourses[0].id.toString(),
          facultyId: data.facultyList[0].id.toString()
        });
      }
    } catch (err) {
      console.error('Failed to load HOD dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFaculty = async (facultyId) => {
    try {
      setProcessingAction(true);
      const res = await hodApi.approveFaculty(facultyId);
      showToast(res.message || 'Faculty registration approved successfully!');
      fetchHodDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to approve faculty member', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectFaculty = async () => {
    if (!rejectingFaculty) return;
    try {
      setProcessingAction(true);
      const res = await hodApi.rejectFaculty(rejectingFaculty.id, rejectionReason);
      showToast(res.message || 'Faculty registration rejected.');
      setRejectingFaculty(null);
      setRejectionReason('');
      fetchHodDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to reject faculty member', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!assignForm.courseId || !assignForm.facultyId) {
      showToast('Please select both course and faculty member', 'error');
      return;
    }

    try {
      setProcessingAction(true);
      await hodApi.assignCourse(assignForm.courseId, assignForm.facultyId);
      showToast('Course allocation updated successfully!');
      setShowAssignModal(false);
      fetchHodDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to assign course', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setProcessingAction(true);
      await announcementApi.create(announcementForm);
      showToast('Department circular posted successfully!');
      setShowAnnouncementModal(false);
      setAnnouncementForm({
        title: '',
        content: '',
        category: 'ACADEMIC',
        targetAudience: 'ALL',
        important: false
      });
      fetchHodDashboard();
    } catch (err) {
      showToast(err.message || 'Failed to post announcement', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>Loading HOD Administration Overview...</div>
      </div>
    );
  }

  const hod = dashboard?.hod || user;
  const pendingFaculty = dashboard?.pendingFacultyApprovals || [];
  const facultyList = dashboard?.facultyList || [];
  const departmentCourses = dashboard?.departmentCourses || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HOD Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#34d399' }}>
              Department Head Administration
            </span>
            <Badge status="success">HOD Active</Badge>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
            {hod?.fullName || 'Dr. Robert Sterling'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            {dashboard?.departmentName || 'Computer Science & Engineering'} ({dashboard?.departmentCode || 'CSE'})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }} className="hidden-mobile">
          <button 
            onClick={() => setShowAnnouncementModal(true)}
            className="btn btn-primary"
          >
            <Megaphone size={16} /> Broadcast Circular
          </button>
          <button 
            onClick={() => setShowAssignModal(true)}
            style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
          >
            Allocate Course
          </button>
        </div>
      </div>

      {/* Analytics Stat Cards */}
      <div className="grid-4">
        <StatCard
          title="Total Students"
          value={dashboard?.totalStudents || 120}
          subtitle="Registered in department"
          icon={GraduationCap}
          color="#10b981"
        />
        <StatCard
          title="Department Faculty"
          value={dashboard?.totalFaculty || facultyList.length || 8}
          subtitle="Active professors"
          icon={Users}
          color="#3b82f6"
        />
        <StatCard
          title="Curriculum Subjects"
          value={dashboard?.totalCourses || departmentCourses.length || 12}
          subtitle="Across 8 semesters"
          icon={BookOpen}
          color="#8b5cf6"
        />
        <StatCard
          title="Pending Faculty"
          value={dashboard?.pendingFacultyApprovalsCount || pendingFaculty.length}
          subtitle="Awaiting HOD approval"
          icon={UserCheck}
          color="#f59e0b"
        />
      </div>

      {/* Pending Faculty Approvals Queue */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <UserCheck size={20} color="#f59e0b" />
            <span>Pending Faculty Registration Approvals ({pendingFaculty.length})</span>
          </div>
          {pendingFaculty.length > 0 && (
            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>Action Required</span>
          )}
        </div>

        {pendingFaculty.length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
            <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>No Pending Faculty Registrations</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>When new professors register for your department, their onboarding requests will be listed here.</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Email</th>
                  <th>Employee ID / Assignment</th>
                  <th>Status</th>
                  <th>HOD Authorization</th>
                </tr>
              </thead>
              <tbody>
                {pendingFaculty.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{f.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Requested: {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Today'}</div>
                    </td>
                    <td>{f.email}</td>
                    <td><Badge status="info">{f.rollOrEmpNumber || 'FAC-NEW'}</Badge></td>
                    <td><Badge status="pending">Awaiting HOD</Badge></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApproveFaculty(f.id)}
                          className="btn btn-sm btn-success"
                          disabled={processingAction}
                        >
                          <UserCheck size={14} /> Approve Faculty
                        </button>
                        <button
                          onClick={() => setRejectingFaculty(f)}
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

      {/* Row: Department Faculty List & Course Allocation Matrix */}
      <div className="grid-2">
        {/* Faculty Roster */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Users size={20} color="#10b981" />
              <span>Department Teaching Staff ({facultyList.length})</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {facultyList.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                No faculty members registered in this department yet.
              </div>
            ) : (
              facultyList.map((f) => (
                <div 
                  key={f.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#ecfdf5',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}>
                      {f.fullName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{f.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{f.email} • ID: {f.rollOrEmpNumber || 'FAC-104'}</div>
                    </div>
                  </div>
                  <Badge status="approved">Approved</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Department Subject Allocation */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={20} color="#10b981" />
              <span>Subject & Faculty Allocation</span>
            </div>
            <button 
              onClick={() => setShowAssignModal(true)}
              className="btn btn-sm btn-outline-primary"
            >
              Reassign Subject
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {departmentCourses.map((c) => (
              <div 
                key={c.id}
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
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Code: <strong>{c.code}</strong> • {c.credits} Credits • Sem {c.semester}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: c.facultyName ? '#0f172a' : '#ef4444' }}>
                    {c.facultyName || 'Unassigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reject Faculty Modal */}
      <Modal
        isOpen={!!rejectingFaculty}
        onClose={() => { setRejectingFaculty(null); setRejectionReason(''); }}
        title={`Reject Faculty Registration: ${rejectingFaculty?.fullName || ''}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setRejectingFaculty(null); setRejectionReason(''); }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleRejectFaculty} disabled={processingAction}>
              {processingAction ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            Please state why <strong>{rejectingFaculty?.fullName}</strong> is being rejected from the department faculty roster:
          </p>
          <div className="form-group">
            <label className="form-label">Rejection Reason</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Employee ID not found in department HR records."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Assign Course Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Allocate Course to Faculty Member"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAssignCourse} disabled={processingAction}>
              {processingAction ? 'Assigning...' : 'Save Allocation'}
            </button>
          </>
        }
      >
        <form onSubmit={handleAssignCourse}>
          <div className="form-group">
            <label className="form-label">Select Course</label>
            <select
              className="form-select"
              value={assignForm.courseId}
              onChange={(e) => setAssignForm({ ...assignForm, courseId: e.target.value })}
              required
            >
              {departmentCourses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Assign to Professor</label>
            <select
              className="form-select"
              value={assignForm.facultyId}
              onChange={(e) => setAssignForm({ ...assignForm, facultyId: e.target.value })}
              required
            >
              {facultyList.map(f => (
                <option key={f.id} value={f.id}>{f.fullName} ({f.email})</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Broadcast Announcement Modal */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title="Broadcast Official Department Notice"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAnnouncementModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePostAnnouncement} disabled={processingAction}>
              {processingAction ? 'Broadcasting...' : 'Publish Notice'}
            </button>
          </>
        }
      >
        <form onSubmit={handlePostAnnouncement}>
          <div className="form-group">
            <label className="form-label">Notice Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Schedule for Final Year Project Submissions"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={announcementForm.category}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
              >
                <option value="ACADEMIC">Academic</option>
                <option value="EXAM">Examination</option>
                <option value="EVENT">Event / Workshop</option>
                <option value="GENERAL">General Notice</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-select"
                value={announcementForm.targetAudience}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, targetAudience: e.target.value })}
              >
                <option value="ALL">All Students & Faculty</option>
                <option value="STUDENT">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notice Content</label>
            <textarea
              className="form-textarea"
              placeholder="Write circular details, dates, and instructions..."
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
              rows={4}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
