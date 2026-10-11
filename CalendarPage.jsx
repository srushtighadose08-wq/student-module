import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  FileText,
  Sparkles,
  BookOpen,
  X,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      day: 5,
      month: 9,
      year: 2026,
      title: 'Web Tech Assignment 1 Due',
      type: 'ASSIGNMENT',
      time: '11:59 PM',
      venue: 'Online Student Portal',
      description: 'Submit HTML5, CSS Grid, and JavaScript interactive form validation source files.',
      status: 'Completed'
    },
    {
      id: 2,
      day: 12,
      month: 9,
      year: 2026,
      title: 'Database BCNF Case Study Due',
      type: 'ASSIGNMENT',
      time: '11:59 PM',
      venue: 'Online Student Portal',
      description: 'Normalization case study report up to Boyce-Codd Normal Form with ER diagrams.',
      status: 'Upcoming'
    },
    {
      id: 3,
      day: 15,
      month: 9,
      year: 2026,
      title: 'CodeVerse 2026 Annual Hackathon',
      type: 'EVENT',
      time: '09:00 AM',
      venue: 'Main Auditorium & Innovation Lab',
      description: '24-hour inter-departmental coding hackathon. Registration required.',
      status: 'Upcoming'
    },
    {
      id: 4,
      day: 24,
      month: 9,
      year: 2026,
      title: 'CS301: DSA Mid-Term Examination',
      type: 'EXAM',
      time: '09:30 AM',
      venue: 'Hall 201',
      description: 'Covers Trees, Graphs, Sorting algorithms, and Dynamic Programming fundamentals.',
      status: 'Upcoming'
    },
    {
      id: 5,
      day: 26,
      month: 9,
      year: 2026,
      title: 'CS302: Web Tech Mid-Term Examination',
      type: 'EXAM',
      time: '09:30 AM',
      venue: 'Hall 201',
      description: 'Covers RESTful APIs, React State Management, DOM manipulation, and CSS Layouts.',
      status: 'Upcoming'
    },
    {
      id: 6,
      day: 28,
      month: 9,
      year: 2026,
      title: 'CS303: DBMS Mid-Term Examination',
      type: 'EXAM',
      time: '09:30 AM',
      venue: 'Hall 202',
      description: 'Covers SQL Queries, Relational Algebra, Normalization, and Transaction Processing.',
      status: 'Upcoming'
    },
    {
      id: 7,
      day: 31,
      month: 9,
      year: 2026,
      title: 'Campus Fall Festival & Cultural Evening',
      type: 'EVENT',
      time: '05:00 PM',
      venue: 'Open Amphitheatre',
      description: 'Annual cultural extravaganza featuring music, drama, food stalls, and student performances.',
      status: 'Upcoming'
    }
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formattedMonthYear = `${monthNames[currentMonthIndex]} ${currentYear}`;

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPrefixSlots = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const getEventTypeConfig = (type) => {
    switch (type) {
      case 'EXAM':
        return { color: '#d97706', bg: '#fffbe3', border: '#fef08a', label: 'Examination' };
      case 'ASSIGNMENT':
        return { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', label: 'Assignment' };
      case 'EVENT':
        return { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Campus Event' };
      default:
        return { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', label: 'Schedule' };
    }
  };

  const filteredEvents = events.filter((e) => {
    const isSameMonth = e.month === currentMonthIndex && e.year === currentYear;
    if (!isSameMonth) return false;
    if (selectedFilter === 'ALL') return true;
    return e.type === selectedFilter;
  });

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.pageTitle}>Academic Calendar</h2>
          <p style={styles.pageSubtitle}>
            Semester schedules, mid-term examinations, holidays, and campus events
          </p>
        </div>

        {/* Month Navigation */}
        <div style={styles.monthSelector}>
          <button type="button" onClick={handlePrevMonth} style={styles.navButton}>
            <ChevronLeft size={18} />
          </button>
          <span style={styles.monthText}>{formattedMonthYear}</span>
          <button type="button" onClick={handleNextMonth} style={styles.navButton}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Legend Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterButtons}>
          {[
            { key: 'ALL', label: 'All Schedules' },
            { key: 'EXAM', label: 'Exams' },
            { key: 'ASSIGNMENT', label: 'Assignments' },
            { key: 'EVENT', label: 'Events' }
          ].map((btn) => (
            <button
              type="button"
              key={btn.key}
              onClick={() => setSelectedFilter(btn.key)}
              style={{
                ...styles.filterBtn,
                ...(selectedFilter === btn.key ? styles.activeFilterBtn : {})
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={styles.legendRow}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#10b981' }} />
            Assignment Deadline
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#f59e0b' }} />
            Examination
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#2563eb' }} />
            Campus Event / Workshop
          </span>
        </div>
      </div>

      {/* Interactive Calendar Grid */}
      <div style={styles.calendarWrapper}>
        <div style={styles.dayHeaderGrid}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
            <div key={day} style={styles.dayHeaderCell}>
              {day}
            </div>
          ))}
        </div>

        <div style={styles.calendarGrid}>
          {emptyPrefixSlots.map((_, idx) => (
            <div key={`empty-${idx}`} style={styles.emptyCell} />
          ))}

          {daysArray.map((day) => {
            const dayEvents = filteredEvents.filter((e) => e.day === day);
            const isToday =
              day === 9 && currentMonthIndex === 9 && currentYear === 2026;

            return (
              <div
                key={day}
                style={{
                  ...styles.dayCell,
                  ...(isToday ? styles.todayCell : {})
                }}
              >
                <div style={styles.dayCellHeader}>
                  <span
                    style={{
                      ...styles.dayNumber,
                      ...(isToday ? styles.todayNumber : {})
                    }}
                  >
                    {day}
                  </span>
                  {isToday && <span style={styles.todayBadge}>TODAY</span>}
                </div>

                <div style={styles.eventChipList}>
                  {dayEvents.map((evt) => {
                    const config = getEventTypeConfig(evt.type);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        title={`${evt.title} (${evt.time})`}
                        style={{
                          ...styles.eventChip,
                          background: config.bg,
                          color: config.color,
                          borderLeft: `3px solid ${config.color}`
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{evt.time}</span> • {evt.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Items List Agenda */}
      <div style={styles.agendaWrapper}>
        <div style={styles.agendaHeader}>
          <div style={styles.agendaTitle}>
            <CalendarIcon size={20} color="#10b981" />
            <span>Scheduled Dates for {formattedMonthYear}</span>
          </div>
          <span style={styles.agendaCount}>{filteredEvents.length} Scheduled</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div style={styles.emptyAgenda}>
            <AlertCircle size={32} color="#94a3b8" />
            <p>No events scheduled for this category in {formattedMonthYear}.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredEvents.map((evt) => {
              const config = getEventTypeConfig(evt.type);

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  style={styles.agendaRow}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div style={styles.dateBox}>
                      <span style={styles.dateMonth}>
                        {monthNames[currentMonthIndex].substring(0, 3).toUpperCase()}
                      </span>
                      <span style={styles.dateDay}>{evt.day}</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={styles.evtTitle}>{evt.title}</div>
                      <div style={styles.evtMeta}>
                        <span>
                          <Clock size={12} style={styles.inlineIcon} />
                          {evt.time}
                        </span>
                        <span>
                          <MapPin size={12} style={styles.inlineIcon} />
                          {evt.venue}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      ...styles.typeBadge,
                      background: config.bg,
                      color: config.color
                    }}
                  >
                    {evt.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div style={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
          <div
            style={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color={getEventTypeConfig(selectedEvent.type).color} />
                <h3 style={styles.modalTitle}>{selectedEvent.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                style={styles.closeBtn}
              >
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalMetaGrid}>
                <div style={styles.modalMetaBox}>
                  <CalendarDays size={16} color="#64748b" />
                  <div>
                    <span style={styles.metaLabel}>Date</span>
                    <strong>
                      {monthNames[selectedEvent.month]} {selectedEvent.day},{' '}
                      {selectedEvent.year}
                    </strong>
                  </div>
                </div>

                <div style={styles.modalMetaBox}>
                  <Clock size={16} color="#64748b" />
                  <div>
                    <span style={styles.metaLabel}>Time</span>
                    <strong>{selectedEvent.time}</strong>
                  </div>
                </div>

                <div style={styles.modalMetaBox}>
                  <MapPin size={16} color="#64748b" />
                  <div>
                    <span style={styles.metaLabel}>Venue</span>
                    <strong>{selectedEvent.venue}</strong>
                  </div>
                </div>

                <div style={styles.modalMetaBox}>
                  <CheckCircle2 size={16} color="#64748b" />
                  <div>
                    <span style={styles.metaLabel}>Category</span>
                    <strong style={{ color: getEventTypeConfig(selectedEvent.type).color }}>
                      {selectedEvent.type}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={styles.descriptionBox}>
                <h4 style={styles.descTitle}>Description & Notes</h4>
                <p style={styles.descText}>{selectedEvent.description}</p>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                style={styles.closeModalBtn}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#0f172a'
  },
  pageSubtitle: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '2px'
  },
  monthSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '4px 10px'
  },
  navButton: {
    border: 'none',
    background: 'transparent',
    color: '#475569',
    padding: '4px',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  monthText: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a',
    minWidth: '120px',
    textAlign: 'center'
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    background: '#ffffff',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0'
  },
  filterButtons: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    color: '#475569',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer'
  },
  activeFilterBtn: {
    background: '#10b981',
    borderColor: '#10b981',
    color: '#ffffff'
  },
  legendRow: {
    display: 'flex',
    gap: '14px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#475569'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  calendarWrapper: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px'
  },
  dayHeaderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '10px'
  },
  dayHeaderCell: {
    padding: '4px 0'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px'
  },
  emptyCell: {
    minHeight: '85px',
    background: '#f8fafc',
    borderRadius: '8px',
    opacity: 0.5
  },
  dayCell: {
    minHeight: '85px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  todayCell: {
    background: '#ecfdf5',
    border: '2px solid #10b981'
  },
  dayCellHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dayNumber: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a'
  },
  todayNumber: {
    fontWeight: 800,
    color: '#059669'
  },
  todayBadge: {
    fontSize: '9px',
    fontWeight: 800,
    color: '#059669',
    background: '#d1fae5',
    padding: '1px 4px',
    borderRadius: '4px'
  },
  eventChipList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    marginTop: '4px'
  },
  eventChip: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '3px 5px',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  agendaWrapper: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px'
  },
  agendaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  agendaTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a'
  },
  agendaCount: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    background: '#f1f5f9',
    padding: '3px 8px',
    borderRadius: '6px'
  },
  emptyAgenda: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '24px 10px',
    color: '#64748b',
    fontSize: '12px'
  },
  agendaRow: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  dateBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateMonth: {
    fontSize: '9px',
    fontWeight: 600,
    color: '#64748b'
  },
  dateDay: {
    fontSize: '13px',
    fontWeight: 800,
    color: '#0f172a'
  },
  evtTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#0f172a'
  },
  evtMeta: {
    fontSize: '11px',
    color: '#64748b',
    display: 'flex',
    gap: '12px',
    marginTop: '2px'
  },
  inlineIcon: {
    verticalAlign: 'middle',
    marginRight: '4px'
  },
  typeBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 700
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px'
  },
  modalContainer: {
    background: '#ffffff',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    background: '#f8fafc'
  },
  modalTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0
  },
  closeBtn: {
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px'
  },
  modalBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  modalMetaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  modalMetaBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 12px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #f1f5f9'
  },
  metaLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 600
  },
  descriptionBox: {
    padding: '12px 14px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  descTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 6px 0'
  },
  descText: {
    fontSize: '12px',
    color: '#475569',
    margin: 0,
    lineHeight: 1.5
  },
  modalFooter: {
    padding: '12px 20px',
    borderTop: '1px solid #e2e8f0',
    background: '#ffffff'
  },
  closeModalBtn: {
    width: '100%',
    padding: '8px 16px',
    background: '#059669',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer'
  }
};