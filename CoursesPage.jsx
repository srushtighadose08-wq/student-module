import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  User,
  FileText,
  Youtube,
  Download,
  ExternalLink,
  GraduationCap,
  Library,
  ClipboardList
} from 'lucide-react';

import { studentApi } from '../api/client';
import { Modal } from '../components/Modal';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const openFile = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const downloadFile = (url, fileName) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'study-material';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderMaterials = (materials, emptyMessage) => {
    if (!Array.isArray(materials) || materials.length === 0) {
      return <p style={styles.empty}>{emptyMessage}</p>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {materials.map((material, index) => {
          const isLink =
            material.type === 'youtube' || material.type === 'link';

          return (
            <div
              key={material.id || `${material.title}-${index}`}
              style={styles.materialRow}
            >
              <div style={styles.materialIcon}>
                {material.type === 'youtube' ? (
                  <Youtube size={20} color="#dc2626" />
                ) : (
                  <FileText size={20} color="#059669" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.materialTitle}>
                  {material.title || material.fileName || 'Study Material'}
                </div>

                <div style={styles.materialSubtitle}>
                  {material.fileName ||
                    (material.type || 'Study Resource').toUpperCase()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => openFile(material.url)}
                disabled={!material.url}
                style={styles.actionButton}
              >
                <ExternalLink size={15} />
                View
              </button>

              {!isLink && (
                <button
                  type="button"
                  onClick={() =>
                    downloadFile(
                      material.url,
                      material.fileName || material.title
                    )
                  }
                  disabled={!material.url}
                  style={styles.actionButton}
                >
                  <Download size={15} />
                  Download
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const unitData = selectedCourse?.units?.find(
    (unit) => Number(unit.unitNumber) === selectedUnit
  );

  const notesMaterials = unitData?.notesPdf
    ? [
        {
          ...unitData.notesPdf,
          title: `Unit ${selectedUnit} Notes`,
          fileName:
            unitData.notesPdf.fileName || `Unit-${selectedUnit}-Notes.pdf`,
          type:
            unitData.notesPdf.type ||
            (unitData.notesPdf.fileName?.toLowerCase().endsWith('.docx')
              ? 'docx'
              : 'pdf')
        }
      ]
    : unitData?.notesMaterials || [];

  const documentSections = [
  
    {
      title: 'Syllabus Copy',
      description: 'Official subject syllabus and unit details',
      icon: <BookOpen size={20} color="#2563eb" />,
      materials:
        selectedCourse?.syllabusMaterials ||
        (selectedCourse?.syllabusUrl
          ? [
              {
                title: 'Subject Syllabus',
                fileName:
                  selectedCourse.syllabusFileName || 'Syllabus.pdf',
                url: selectedCourse.syllabusUrl,
                type: 'pdf'
              }
            ]
          : [])
    },
    {
      title: 'Program Outcomes (POs)',
      description: 'Program outcomes and PO mapping documents',
      icon: <GraduationCap size={20} color="#7c3aed" />,
      materials:
        selectedCourse?.poMaterials ||
        (selectedCourse?.poUrl
          ? [
              {
                title: 'Program Outcomes',
                fileName: selectedCourse.poFileName || 'POs.pdf',
                url: selectedCourse.poUrl,
                type: 'pdf'
              }
            ]
          : [])
    },
    {
      title: 'Course Outcomes (COs)',
      description: 'Course outcomes and CO mapping documents',
      icon: <ClipboardList size={20} color="#d97706" />,
      materials:
        selectedCourse?.coMaterials ||
        (selectedCourse?.coUrl
          ? [
              {
                title: 'Course Outcomes',
                fileName: selectedCourse.coFileName || 'COs.pdf',
                url: selectedCourse.coUrl,
                type: 'pdf'
              }
            ]
          : [])
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Heading */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
          Academic Courses
        </h2>

        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Semester 5 • Computer Science & Engineering curriculum
        </p>
      </div>

      {/* Course Cards */}
      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          No courses available.
        </div>
      ) : (
        <div className="grid-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}
                >
                  <div style={styles.courseIcon}>
                    <BookOpen size={20} />
                  </div>

                  <span style={styles.courseCode}>{course.code}</span>
                </div>

                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: '1.3'
                  }}
                >
                  {course.name}
                </h3>

                <p
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginTop: '6px',
                    lineHeight: '1.4',
                    minHeight: '34px'
                  }}
                >
                  {course.description ||
                    'Course notes, syllabus, reference materials and learning resources.'}
                </p>

                <div style={styles.courseDetails}>
                  <div style={styles.detailRow}>
                    <User size={14} color="#10b981" />
                    <span>
                      <strong>Faculty:</strong>{' '}
                      {course.facultyName || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.courseFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedUnit(1);
                  }}
                  className="btn btn-sm btn-outline-primary"
                  style={{ width: '100%' }}
                >
                  View Syllabus & Materials
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Syllabus and Study Materials Modal */}
      <Modal
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        title={`${selectedCourse?.code || ''}: ${selectedCourse?.name || ''}`}
        maxWidth="760px"
        footer={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setSelectedCourse(null)}
          >
            Close
          </button>
        }
      >
        {selectedCourse && (
          <div>
            {/* Course Information */}
            <div style={styles.courseSummary}>
              <strong>Credits:</strong> {selectedCourse.credits ?? 'N/A'}
              {' | '}
              <strong>Instructor:</strong>{' '}
              {selectedCourse.facultyName || 'Not specified'}
            </div>

            {/* Subject-Level Curriculum, Syllabus, POs and COs (Shown once at subject level) */}
            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>
                <GraduationCap size={19} color="#059669" />
                Subject Curriculum & Framework Documents
              </h4>

              {documentSections.map((section) => (
                <div key={section.title} style={styles.documentSection}>
                  <div style={styles.documentHeading}>
                    {section.icon}

                    <div>
                      <h5
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0f172a'
                        }}
                      >
                        {section.title}
                      </h5>

                      <p
                        style={{
                          fontSize: '11px',
                          color: '#64748b',
                          marginTop: '3px'
                        }}
                      >
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {renderMaterials(
                    section.materials,
                    `${section.title} has not been uploaded yet.`
                  )}
                </div>
              ))}

       
            </section>

            {/* Unit-wise Study Materials */}
            <section style={styles.section}>
              <h4 style={styles.sectionTitle}>
                <BookOpen size={19} color="#059669" />
                Unit-wise Notes & Study Materials
              </h4>

              <div style={styles.unitTabs}>
                {[1, 2, 3, 4, 5].map((unit) => (
                  <button
                    type="button"
                    key={unit}
                    onClick={() => setSelectedUnit(unit)}
                    style={{
                      ...styles.unitButton,
                      ...(selectedUnit === unit ? styles.activeUnit : {})
                    }}
                  >
                    Unit {unit}
                  </button>
                ))}
              </div>

              {/* Notes PDF/DOCX */}
              <div style={styles.subsection}>
                <h5 style={styles.subsectionTitle}>
                  <FileText size={17} color="#dc2626" />
                  Unit {selectedUnit} Notes
                </h5>

                {renderMaterials(
                  notesMaterials,
                  'Notes PDF/DOCX has not been added for this unit yet.'
                )}
              </div>

              {/* YouTube Links */}
              <div style={styles.subsection}>
                <h5 style={styles.subsectionTitle}>
                  <Youtube size={18} color="#dc2626" />
                  YouTube Video References
                </h5>

                {renderMaterials(
                  (unitData?.youtubeLinks || []).map((item) => ({
                    ...item,
                    type: 'youtube'
                  })),
                  'No YouTube links added for this unit yet.'
                )}
              </div>

       

              {/* Reference Books */}
              <div style={styles.subsection}>
                <h5 style={styles.subsectionTitle}>
                  <BookOpen size={18} color="#7c3aed" />
                  Reference Books
                </h5>

                {renderMaterials(
                  unitData?.referenceBooks || [],
                  'No reference books added for this unit yet.'
                )}
              </div>

              {/* Previous Year Papers */}
              <div style={styles.subsection}>
                <h5 style={styles.subsectionTitle}>
                  <FileText size={18} color="#2563eb" />
                  Previous-Year Question Papers
                </h5>

                {renderMaterials(
                  unitData?.previousYearPapers || [],
                  'No previous-year papers added for this unit yet.'
                )}
              </div>
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  courseIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#ecfdf5',
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  courseCode: {
    fontSize: '11px',
    fontWeight: 700,
    background: '#f1f5f9',
    color: '#475569',
    padding: '4px 8px',
    borderRadius: '6px'
  },

  courseDetails: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12px',
    color: '#475569'
  },

  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  courseFooter: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9'
  },

  courseSummary: {
    padding: '12px',
    background: '#ecfdf5',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '12px',
    color: '#065f46',
    lineHeight: '1.8'
  },

  section: {
    marginTop: '22px'
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '14px'
  },

  unitTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '18px'
  },

  unitButton: {
    padding: '8px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600
  },

  activeUnit: {
    background: '#059669',
    borderColor: '#059669',
    color: '#ffffff'
  },

  subsection: {
    padding: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    marginBottom: '12px'
  },

  materialRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '10px',
    border: '1px solid #f1f5f9',
    borderRadius: '8px'
  },

  materialIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  materialTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a',
    overflowWrap: 'anywhere'
  },

  materialSubtitle: {
    fontSize: '10px',
    color: '#64748b',
    marginTop: '4px',
    overflowWrap: 'anywhere'
  },

  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    padding: '7px 9px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: '#ffffff',
    color: '#334155',
    cursor: 'pointer',
    fontSize: '11px'
  },

  empty: {
    fontSize: '12px',
    color: '#94a3b8',
    padding: '8px 0'
  },

  documentSection: {
    padding: '14px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    marginBottom: '12px'
  },

  documentHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  },

  subsectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '12px'
  }
};