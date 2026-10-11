import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Upload,
  ArrowRight,
  AlertCircle,
  BookOpen,
  ClipboardList,
  Eye,
  X,
  FileUp,
  Download
} from 'lucide-react';

import { studentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const AssignmentsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ASSIGNMENTS');
  const [loading, setLoading] = useState(true);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Case study state
  const [caseStudyTitle, setCaseStudyTitle] = useState('');
  const [caseStudyCourse, setCaseStudyCourse] = useState('');
  const [caseStudyFile, setCaseStudyFile] = useState(null);
  const [caseStudySubmitting, setCaseStudySubmitting] = useState(false);
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    fetchAssignments();
    fetchCaseStudies();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getAssignments();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseStudies = async () => {
    try {
      if (typeof studentApi.getCaseStudies === 'function') {
        const data = await studentApi.getCaseStudies();
        setCaseStudies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load case studies:', err);
    }
  };

  const handleOpenModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionFile(null);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setSelectedAssignment(null);
    setSubmissionFile(null);
  };

  const validateFile = (file) => {
    if (!file) return true;

    const allowedExtensions = ['pdf', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      showToast('Only PDF and DOCX files are allowed', 'error');
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size must be less than 10 MB', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionFile) {
      showToast('Please upload a PDF or DOCX solution file', 'error');
      return;
    }

    if (!validateFile(submissionFile)) return;
    if (!selectedAssignment) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('studentId', user?.id || '');
      formData.append('file', submissionFile);

      await studentApi.submitAssignment(selectedAssignment.id, formData);

      showToast('Assignment submitted successfully!', 'success');
      setSelectedAssignment(null);
      setSubmissionFile(null);
      await fetchAssignments();
    } catch (err) {
      showToast(err.message || 'Failed to submit assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCaseStudySubmit = async (e) => {
    e.preventDefault();

    if (!caseStudyTitle.trim()) {
      showToast('Please enter the case study title', 'error');
      return;
    }

    if (!caseStudyCourse.trim()) {
      showToast('Please select or enter the course/subject', 'error');
      return;
    }

    if (!caseStudyFile) {
      showToast('Please select a PDF or DOCX file', 'error');
      return;
    }

    if (!validateFile(caseStudyFile)) return;

    try {
      setCaseStudySubmitting(true);

      const formData = new FormData();
      formData.append('title', caseStudyTitle);
      formData.append('courseName', caseStudyCourse);
      formData.append('studentId', user?.id || '');
      formData.append('file', caseStudyFile);

      if (typeof studentApi.submitCaseStudy !== 'function') {
        showToast(
          'Case study upload API is not configured in backend client.',
          'error'
        );
        return;
      }

      await studentApi.submitCaseStudy(formData);

      showToast('Case study uploaded successfully!', 'success');
      setCaseStudyTitle('');
      setCaseStudyCourse('');
      setCaseStudyFile(null);
      await fetchCaseStudies();
    } catch (err) {
      showToast(err.message || 'Failed to upload case study', 'error');
    } finally {
      setCaseStudySubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'PENDING') return !a.submitted;
    if (filter === 'SUBMITTED') return a.submitted;
    return true;
  });

  const availableCourses = Array.from(
    new Set(
      [
        ...assignments.map((a) => a.courseName || a.courseCode),
        ...caseStudies.map((c) => c.courseName || c.courseCode)
      ].filter(Boolean)
    )
  );

  const groupedCaseStudies = caseStudies.reduce((acc, item) => {
    const course = item.courseName || item.courseCode || 'General / Unspecified';
    if (!acc[course]) {
      acc[course] = [];
    }
    acc[course].push(item);
    return acc;
  }, {});

  const openDocument = (url) => {
    if (!url) {
      showToast('Document URL is not available', 'error');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const downloadDocument = (url, filename = 'document') => {
    if (!url) {
      showToast('Document URL is not available', 'error');
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getQuestionUrl = (assignment) =>
    assignment.questionFileUrl ||
    assignment.questionUrl ||
    assignment.attachmentUrl ||
    assignment.questionsPdf ||
    '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
          Assignments & Coursework
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          View assignment question papers, submit solutions, and manage subject-wise case studies.
        </p>
      </div>

      <div style={styles.mainTabs}>
        <button
          type="button"
          onClick={() => setActiveTab('ASSIGNMENTS')}
          style={{
            ...styles.mainTab,
            ...(activeTab === 'ASSIGNMENTS' ? styles.activeMainTab : {})
          }}
        >
          <ClipboardList size={16} />
          Assignments
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('CASE_STUDIES')}
          style={{
            ...styles.mainTab,
            ...(activeTab === 'CASE_STUDIES' ? styles.activeMainTab : {})
          }}
        >
          <BookOpen size={16} />
          Case Studies
        </button>
      </div>

      {activeTab === 'ASSIGNMENTS' && (
        <>
          <div style={styles.filterRow}>
            {[
              { value: 'ALL', label: 'All', count: assignments.length },
              {
                value: 'PENDING',
                label: 'Pending',
                count: assignments.filter((a) => !a.submitted).length
              },
              {
                value: 'SUBMITTED',
                label: 'Submitted',
                count: assignments.filter((a) => a.submitted).length
              }
            ].map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => setFilter(item.value)}
                style={{
                  ...styles.filterButton,
                  ...(filter === item.value ? styles.activeFilterButton : {})
                }}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>

          {loading ? (
            <div style={styles.emptyState}>Loading assignments...</div>
          ) : filteredAssignments.length === 0 ? (
            <div style={styles.emptyState}>
              <CheckCircle2 size={36} color="#10b981" />
              <h3 style={styles.emptyTitle}>No assignments found</h3>
              <p style={styles.mutedText}>
                No assignments are available in this category.
              </p>
            </div>
          ) : (
            <div className="grid-2">
              {filteredAssignments.map((a) => {
                const questionUrl = getQuestionUrl(a);

                return (
                  <div
                    key={a.id}
                    className="card"
                    style={styles.assignmentCard}
                  >
                    <div>
                      <div style={styles.cardTop}>
                        <span style={styles.courseTag}>
                          {a.courseCode} {a.courseName}
                        </span>

                        <Badge
                          status={
                            a.submitted
                              ? a.submissionStatus || 'submitted'
                              : 'pending'
                          }
                        >
                          {a.submitted ? 'Submitted' : 'Pending'}
                        </Badge>
                      </div>

                      <h3 style={styles.assignmentTitle}>{a.title}</h3>

                      <p style={styles.description}>
                        {a.description || 'No description provided.'}
                      </p>

                      <div style={styles.questionBox}>
                        <div style={styles.questionHeader}>
                          <FileText size={18} color="#2563eb" />
                          <strong>Assignment Question Paper</strong>
                        </div>

                        {questionUrl ? (
                          <div style={styles.questionActions}>
                            <button
                              type="button"
                              style={styles.outlineButton}
                              onClick={() => openDocument(questionUrl)}
                            >
                              <Eye size={14} /> View Questions
                            </button>

                            <button
                              type="button"
                              style={styles.outlineButton}
                              onClick={() =>
                                downloadDocument(
                                  questionUrl,
                                  `${a.title || 'assignment'}-questions.pdf`
                                )
                              }
                            >
                              <Download size={14} /> Download Questions
                            </button>
                          </div>
                        ) : (
                          <p style={{ ...styles.mutedText, color: '#b91c1c' }}>
                            Question paper PDF not attached
                          </p>
                        )}
                      </div>

                      <div style={styles.infoRow}>
                        <span>
                          <Calendar size={13} style={styles.inlineIcon} />
                          <strong>Due:</strong> {a.dueDate || 'Not specified'}
                        </span>
                      </div>

                      {a.submissionFileUrl && (
                        <button
                          type="button"
                          style={{ ...styles.outlineButton, marginTop: '10px' }}
                          onClick={() => openDocument(a.submissionFileUrl)}
                        >
                          <FileText size={14} /> View Submitted File
                        </button>
                      )}
                    </div>

                    <div style={styles.cardFooter}>
                      {a.submitted ? (
                        <div style={styles.submittedLabel}>
                          <CheckCircle2 size={16} />
                          Solution Submitted
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenModal(a)}
                          className="btn btn-sm btn-primary"
                          style={{ width: '100%' }}
                        >
                          <Upload size={14} /> Submit Assignment
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'CASE_STUDIES' && (
        <div style={styles.caseStudyLayout}>
          <div className="card" style={styles.caseStudyCard}>
            <div style={styles.caseStudyHeading}>
              <BookOpen size={22} color="#2563eb" />
              <div>
                <h3 style={styles.assignmentTitle}>Upload Case Study</h3>
                <p style={styles.mutedText}>
                  Submit your case study document (PDF or DOCX) categorized by subject.
                </p>
              </div>
            </div>

            <form onSubmit={handleCaseStudySubmit}>
              <div className="form-group">
                <label className="form-label">Case Study Title</label>
                <input
                  className="form-input"
                  type="text"
                  value={caseStudyTitle}
                  onChange={(e) => setCaseStudyTitle(e.target.value)}
                  placeholder="Enter case study title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Course</label>
                <select
                  className="form-input"
                  value={caseStudyCourse}
                  onChange={(e) => setCaseStudyCourse(e.target.value)}
                  required
                >
                  <option value="">Select Subject / Course</option>
                  {availableCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Case Study Document</label>
                <label style={styles.fileDropZone}>
                  <FileUp size={30} color="#2563eb" />
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>
                    {caseStudyFile ? caseStudyFile.name : 'Choose PDF or DOCX file'}
                  </span>
                  <span style={styles.mutedText}>Maximum file size: 10 MB</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file && validateFile(file)) {
                        setCaseStudyFile(file);
                      } else {
                        setCaseStudyFile(null);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {caseStudyFile && (
                <div style={styles.selectedFile}>
                  <FileText size={18} color="#2563eb" />
                  <span style={{ flex: 1, overflowWrap: 'anywhere' }}>
                    {caseStudyFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCaseStudyFile(null)}
                    style={styles.iconButton}
                    aria-label="Remove selected file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '12px' }}
                disabled={caseStudySubmitting}
              >
                <Upload size={16} />
                {caseStudySubmitting ? 'Uploading...' : 'Upload Case Study'}
              </button>
            </form>
          </div>

          <div className="card" style={styles.caseStudyCard}>
            <div style={styles.caseStudyHeading}>
              <FileText size={22} color="#2563eb" />
              <div>
                <h3 style={styles.assignmentTitle}>Subject-Wise Case Studies</h3>
                <p style={styles.mutedText}>
                  Your uploaded case studies grouped by subject.
                </p>
              </div>
            </div>

            {Object.keys(groupedCaseStudies).length === 0 ? (
              <div style={styles.caseStudyEmpty}>
                <AlertCircle size={24} color="#94a3b8" />
                <p style={styles.mutedText}>No case studies uploaded yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(groupedCaseStudies).map(([subjectName, items]) => (
                  <div key={subjectName} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={styles.subjectHeading}>📚 {subjectName}</h4>
                    {items.map((item) => {
                      const fileUrl = item.fileUrl || item.documentUrl;
                      return (
                        <div key={item.id} style={styles.caseStudyItem}>
                          <FileText size={20} color="#2563eb" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong>{item.title}</strong>
                            {item.submittedAt && (
                              <p style={styles.mutedText}>
                                Uploaded: {item.submittedAt}
                              </p>
                            )}
                          </div>
                          {fileUrl && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                style={styles.outlineButton}
                                onClick={() => openDocument(fileUrl)}
                              >
                                <Eye size={14} /> View
                              </button>
                              <button
                                type="button"
                                style={styles.outlineButton}
                                onClick={() =>
                                  downloadDocument(
                                    fileUrl,
                                    `${item.title || 'case-study'}.pdf`
                                  )
                                }
                              >
                                <Download size={14} /> Download
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedAssignment}
        onClose={handleCloseModal}
        title={`Submit Assignment: ${selectedAssignment?.title || ''}`}
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="assignment-submission-form"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Upload size={14} />
              {submitting ? 'Submitting...' : 'Upload & Confirm'}
            </button>
          </>
        }
      >
        <form id="assignment-submission-form" onSubmit={handleSubmit}>
          <div style={styles.modalInfo}>
            <p>
              <strong>Course:</strong>{' '}
              {selectedAssignment?.courseName} ({selectedAssignment?.courseCode})
            </p>
            <p>
              <strong>Due Date:</strong>{' '}
              {selectedAssignment?.dueDate || 'Not specified'}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Solution (PDF/DOCX)</label>
            <label style={styles.fileDropZone}>
              <FileUp size={28} color="#2563eb" />
              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                {submissionFile ? submissionFile.name : 'Choose your solution file'}
              </span>
              <span style={styles.mutedText}>PDF or DOCX • Maximum 10 MB</span>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && validateFile(file)) {
                    setSubmissionFile(file);
                  } else {
                    setSubmissionFile(null);
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          {submissionFile && (
            <div style={styles.selectedFile}>
              <FileText size={18} color="#2563eb" />
              <span style={{ flex: 1, overflowWrap: 'anywhere' }}>
                {submissionFile.name}
              </span>
              <button
                type="button"
                onClick={() => setSubmissionFile(null)}
                style={styles.iconButton}
                aria-label="Remove selected file"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

const styles = {
  mainTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px'
  },
  mainTab: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#475569',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer'
  },
  activeMainTab: {
    background: '#eff6ff',
    borderColor: '#93c5fd',
    color: '#1d4ed8'
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    background: '#f1f5f9',
    padding: '5px',
    borderRadius: '8px',
    alignSelf: 'flex-start'
  },
  filterButton: {
    border: 'none',
    background: 'transparent',
    color: '#475569',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  activeFilterButton: {
    background: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 1px 3px rgba(15,23,42,0.10)'
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0
  },
  mutedText: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0',
    lineHeight: 1.5
  },
  assignmentCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '10px'
  },
  courseTag: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#047857',
    background: '#ecfdf5',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  assignmentTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0
  },
  description: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '6px',
    lineHeight: 1.5
  },
  questionBox: {
    marginTop: '14px',
    padding: '12px',
    border: '1px solid #bfdbfe',
    background: '#f8fbff',
    borderRadius: '8px'
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1e3a8a',
    fontSize: '13px'
  },
  questionActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px'
  },
  outlineButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '7px 10px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    background: '#ffffff',
    color: '#334155',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  infoRow: {
    marginTop: '14px',
    padding: '10px 12px',
    background: '#f8fafc',
    borderRadius: '8px',
    fontSize: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '8px',
    color: '#475569'
  },
  inlineIcon: {
    verticalAlign: 'middle',
    marginRight: '4px'
  },
  cardFooter: {
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9'
  },
  submittedLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#059669',
    fontWeight: 700
  },
  caseStudyLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '20px',
    alignItems: 'start'
  },
  caseStudyCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  caseStudyHeading: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    paddingBottom: '14px',
    borderBottom: '1px solid #f1f5f9'
  },
  subjectHeading: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1e3a8a',
    background: '#eff6ff',
    padding: '6px 10px',
    borderRadius: '6px',
    margin: 0
  },
  fileDropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textAlign: 'center',
    padding: '24px 14px',
    border: '2px dashed #bfdbfe',
    borderRadius: '10px',
    background: '#f8fbff',
    cursor: 'pointer',
    overflowWrap: 'anywhere'
  },
  selectedFile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#334155'
  },
  iconButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    padding: '4px',
    cursor: 'pointer'
  },
  caseStudyEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '30px 10px',
    textAlign: 'center'
  },
  caseStudyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff'
  },
  modalInfo: {
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px',
    fontSize: '12px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    color: '#475569'
  }
};