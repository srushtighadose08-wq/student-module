import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, UserX, Users, CheckCircle2, AlertCircle, Search, Lock, Key } from 'lucide-react';
import { hodApi } from '../api/client';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const FacultyApprovalsPage = () => {
  const { showToast } = useNotification();
  const [pendingFaculty, setPendingFaculty] = useState([]);
  const [activeFaculty, setActiveFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
  
  // Rejection modal
  const [rejectingFaculty, setRejectingFaculty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dashboard = await hodApi.getDashboard();
      setPendingFaculty(dashboard.pendingFacultyApprovals || []);
      setActiveFaculty(dashboard.facultyList || []);
    } catch (err) {
      console.error('Failed to load faculty approvals data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPermission = async (facultyId) => {
    try {
      setProcessingAction(true);
      const res = await hodApi.approveFaculty(facultyId);
      showToast(res.message || 'Faculty member granted login permissions successfully!');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to grant permission', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectFaculty = async () => {
    if (!rejectingFaculty) return;
    try {
      setProcessingAction(true);
      const res = await hodApi.rejectFaculty(rejectingFaculty.id, rejectionReason);
      showToast(res.message || 'Faculty login request rejected.');
      setRejectingFaculty(null);
      setRejectionReason('');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to reject faculty member', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HOD Authority Header */}
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
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#34d399' }}>
              HOD Administrative Security
            </span>
            <span style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
              Access Control
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px' }}>
            Faculty Login Permissions & Approvals
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            As Head of Department, review and grant login credentials to newly registered professors and lecturers.
          </p>
        </div>

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#34d399'
        }} className="hidden-mobile">
          <Key size={28} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('pending')}
            className={`auth-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Pending Authorization</span>
            <span style={{
              background: pendingFaculty.length > 0 ? '#ef4444' : '#cbd5e1',
              color: '#ffffff',
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '999px',
              fontWeight: 700
            }}>
              {pendingFaculty.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`auth-tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Authorized Faculty</span>
            <span style={{ background: '#10b981', color: '#ffffff', fontSize: '11px', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
              {activeFaculty.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          Loading faculty permissions registry...
        </div>
      ) : activeTab === 'pending' ? (
        /* PENDING FACULTY APPROVALS */
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <UserCheck size={20} color="#f59e0b" />
              <span>Pending Faculty Registrations Awaiting Login Permission ({pendingFaculty.length})</span>
            </div>
          </div>

          {pendingFaculty.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
              <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>All Faculty Requests Authorized</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                There are currently no professors or lecturers awaiting HOD login approval.
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Faculty Member</th>
                    <th>Email Address</th>
                    <th>Department</th>
                    <th>Staff / Employee ID</th>
                    <th>Registration Date</th>
                    <th>Permission Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingFaculty.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{f.fullName}</div>
                        <div style={{ fontSize: '11px', color: '#10b981' }}>Role: Faculty Instructor</div>
                      </td>
                      <td>{f.email}</td>
                      <td>{f.departmentName || 'Computer Science & Engineering'}</td>
                      <td><Badge status="info">{f.rollOrEmpNumber || 'FAC-NEW'}</Badge></td>
                      <td>{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Today'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleGrantPermission(f.id)}
                            className="btn btn-sm btn-success"
                            disabled={processingAction}
                          >
                            <UserCheck size={14} /> Grant Access
                          </button>
                          <button
                            onClick={() => setRejectingFaculty(f)}
                            className="btn btn-sm btn-danger"
                            disabled={processingAction}
                          >
                            <UserX size={14} /> Deny
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
      ) : (
        /* ACTIVE / AUTHORIZED FACULTY LIST */
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Users size={20} color="#10b981" />
              <span>Active Department Faculty ({activeFaculty.length})</span>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Official Email</th>
                  <th>Staff ID</th>
                  <th>Department</th>
                  <th>Login Status</th>
                </tr>
              </thead>
              <tbody>
                {activeFaculty.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{f.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{f.phoneNumber || '+1 (555) 345-6789'}</div>
                    </td>
                    <td>{f.email}</td>
                    <td><Badge status="info">{f.rollOrEmpNumber || 'FAC-CSE-104'}</Badge></td>
                    <td>{f.departmentName || 'Computer Science & Engineering'}</td>
                    <td>
                      <Badge status="approved">
                        <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Authorized & Active
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deny Faculty Modal */}
      <Modal
        isOpen={!!rejectingFaculty}
        onClose={() => { setRejectingFaculty(null); setRejectionReason(''); }}
        title={`Deny Login Access: ${rejectingFaculty?.fullName || ''}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setRejectingFaculty(null); setRejectionReason(''); }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleRejectFaculty} disabled={processingAction}>
              {processingAction ? 'Processing...' : 'Confirm Denial'}
            </button>
          </>
        }
      >
        <div>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            Please specify why <strong>{rejectingFaculty?.fullName}</strong>'s faculty registration is being denied access to the department portal:
          </p>
          <div className="form-group">
            <label className="form-label">Reason for Denial</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Employee credentials could not be verified in college records."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
