import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Users, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { facultyApi } from '../api/client';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const StudentApprovalsPage = () => {
  const { showToast } = useNotification();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject student modal
  const [rejectingStudent, setRejectingStudent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      setLoading(true);
      const data = await facultyApi.getPendingStudents();
      setPendingStudents(data || []);
    } catch (err) {
      console.error('Failed to load pending students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      setProcessingAction(true);
      const res = await facultyApi.approveStudent(studentId);
      showToast(res.message || 'Student registration approved successfully!');
      fetchPendingStudents();
    } catch (err) {
      showToast(err.message || 'Failed to approve student', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingStudent) return;
    try {
      setProcessingAction(true);
      const res = await facultyApi.rejectStudent(rejectingStudent.id, rejectionReason);
      showToast(res.message || 'Student registration rejected.');
      setRejectingStudent(null);
      setRejectionReason('');
      fetchPendingStudents();
    } catch (err) {
      showToast(err.message || 'Failed to reject student', 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Student Registration Approvals</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Review and approve new student enrollments to grant access to coursework and the student portal
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <UserCheck size={20} color="#f59e0b" />
            <span>Pending Student Registration Queue ({pendingStudents.length})</span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading requests...</div>
        ) : pendingStudents.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '10px' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>All Student Registrations Reviewed</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              No pending student account verification requests at this time.
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email Address</th>
                  <th>Class / Year</th>
                  <th>Department</th>
                  <th>Roll / Temp ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Applied: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Today'}</div>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.classYear || '2rd Year (DS-3A)'}</td>
                    <td>{s.departmentName || 'Data  Science & Engineering'}</td>
                    <td><Badge status="info">{s.rollOrEmpNumber || `STU-${s.id}`}</Badge></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleApprove(s.id)}
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

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectingStudent}
        onClose={() => { setRejectingStudent(null); setRejectionReason(''); }}
        title={`Reject Student Registration: ${rejectingStudent?.fullName || ''}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setRejectingStudent(null); setRejectionReason(''); }}>Cancel</button>
            <button className="btn btn-danger" onClick={handleReject} disabled={processingAction}>
              {processingAction ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            Provide the reason why <strong>{rejectingStudent?.fullName}</strong>'s registration is being rejected:
          </p>
          <div className="form-group">
            <label className="form-label">Rejection Feedback</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Enrollment credentials or student ID could not be verified."
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
