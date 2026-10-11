import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, Calendar, Download, Printer, CheckCircle2, FileText } from 'lucide-react';
import { studentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const ExamsGradesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('exams'); // 'exams' | 'grades'
  const [exams, setExams] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHallTicket, setShowHallTicket] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [exData, grData] = await Promise.all([
          studentApi.getExams(),
          studentApi.getGrades()
        ]);
        setExams(exData || []);
        setGrades(grData || []);
      } catch (err) {
        console.error('Failed to load exams & grades:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateCgpa = () => {
    if (grades.length === 0) return 8.65;
    let totalPoints = 0;
    let totalCredits = 0;
    for (const g of grades) {
      const cr = g.credits || 4;
      const pt = g.gpaPoint || 8.5;
      totalPoints += (cr * pt);
      totalCredits += cr;
    }
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '8.65';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Examinations & Academic Transcripts</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Official exam timetables, room seating, and semester evaluation reports
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('exams')}
            className={`auth-tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Exam Timetable
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`auth-tab-btn ${activeTab === 'grades' ? 'active' : ''}`}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Grades & Transcripts
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading records...</div>
      ) : (
        <>
          {/* ==========================================================
              EXAMS VIEW
              ========================================================== */}
          {activeTab === 'exams' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    Mid-Term Examination Hall Ticket
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Candidate: {user?.fullName} • Roll: {user?.rollOrEmpNumber || '2023-CS-042'} • Verification: Valid
                  </div>
                </div>
                <button
                  onClick={() => setShowHallTicket(true)}
                  className="btn btn-sm btn-primary"
                >
                  <FileText size={14} /> View Hall Ticket
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <Calendar size={20} color="#10b981" />
                    <span>Fall 2026 Examination Schedule</span>
                  </div>
                </div>

                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Course Code</th>
                        <th>Subject Title</th>
                        <th>Exam Date</th>
                        <th>Time Slot</th>
                        <th>Seating Venue</th>
                        <th>Max Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((e) => (
                        <tr key={e.id}>
                          <td><strong>{e.courseCode}</strong></td>
                          <td>{e.courseName}</td>
                          <td>{e.examDate || 'Oct 24, 2026'}</td>
                          <td>{e.timeSlot || '09:30 AM - 11:30 AM'}</td>
                          <td><Badge status="info">{e.roomNumber || 'Hall 201'}</Badge></td>
                          <td>{e.totalMarks || 100}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              GRADES VIEW
              ========================================================== */}
          {activeTab === 'grades' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* GPA Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                padding: '20px 24px',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>
                    Cumulative Grade Point Average
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '2px' }}>
                    {calculateCgpa()} / 10.0
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>
                    Academic Standing: First Class with Distinction
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  style={{ background: '#ffffff', color: '#059669', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={16} /> Print Grade Card
                </button>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <Award size={20} color="#10b981" />
                    <span>Semester 4 Grade Statement</span>
                  </div>
                </div>

                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Subject Name</th>
                        <th>Credits</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Grade Point</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g) => (
                        <tr key={g.id}>
                          <td><strong>{g.courseCode}</strong></td>
                          <td>{g.courseName}</td>
                          <td>{g.credits || 4}</td>
                          <td>{g.marksObtained} / {g.totalMarks}</td>
                          <td><Badge status="graded">{g.gradeLetter}</Badge></td>
                          <td><strong>{g.gpaPoint}</strong></td>
                          <td style={{ fontSize: '12px', color: '#64748b' }}>{g.remarks || 'Passed'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Hall Ticket Modal */}
      <Modal
        isOpen={showHallTicket}
        onClose={() => setShowHallTicket(false)}
        title="Official Examination Hall Ticket"
        maxWidth="600px"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowHallTicket(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={14} /> Print Hall Ticket
            </button>
          </>
        }
      >
        <div style={{ border: '2px solid #10b981', borderRadius: '10px', padding: '20px', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>COLLEGE OF ENGINEERING & TECHNOLOGY</h3>
            <p style={{ fontSize: '11px', color: '#64748b' }}>Mid-Term Examinations Admit Card • Fall 2026</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px', marginBottom: '16px' }}>
            <div><strong>Student Name:</strong> {user?.fullName}</div>
            <div><strong>Roll Number:</strong> {user?.rollOrEmpNumber || '2023-CS-042'}</div>
            <div><strong>Department:</strong> {user?.departmentName || 'Computer Science'}</div>
            <div><strong>Class:</strong> {user?.classYear || '3rd Year'}</div>
          </div>

          <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
            <strong>Instructions to Candidate:</strong><br />
            1. Candidates must arrive at the examination hall 15 minutes prior to start time.<br />
            2. Electronic gadgets and smartwatches are strictly prohibited in the exam hall.<br />
            3. Must bring this hall ticket and official College Student ID card.
          </div>
        </div>
      </Modal>
    </div>
  );
};
