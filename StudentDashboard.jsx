import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  Megaphone,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { studentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

export const StudentDashboard = ({ setActivePage }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Error loading student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>Loading your academic workspace...</div>
      </div>
    );
  }

  const student = dashboard?.student || user;
  const announcements = dashboard?.recentAnnouncements || dashboard?.announcements || [];
  
  const rawTimetable = 
    dashboard?.timetable || 
    dashboard?.schedule || 
    dashboard?.weeklyTimetable || 
    dashboard?.classes || 
    dashboard?.enrolledCourses || 
    [];

  // Augment timetable data to include standard short and long breaks if not already present
  const timetable = rawTimetable.length > 0 ? [
    { type: 'class', ...rawTimetable[0], timeSlot: '09:00 AM - 10:00 AM' },
    { type: 'class', ...rawTimetable[1] || rawTimetable[0], timeSlot: '10:00 AM - 11:00 AM' },
    { type: 'break', title: '☕ Short Break (Tea / Refreshment)', timeSlot: '11:00 AM - 11:15 AM' },
    { type: 'class', ...rawTimetable[2] || rawTimetable[0], timeSlot: '11:15 AM - 12:15 PM' },
    { type: 'break', title: '🍽️ Long Break (Lunch)', timeSlot: '12:15 PM - 01:00 PM' },
    { type: 'class', ...rawTimetable[3] || rawTimetable[0], timeSlot: '01:00 PM - 02:00 PM' },
    { type: 'class', ...rawTimetable[4] || rawTimetable[0], timeSlot: '02:00 PM - 03:00 PM' }
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .notice-ticker-wrapper:hover .notice-ticker-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
            Welcome back
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>
            {student?.fullName || 'Student'} 👋
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
            {student?.departmentName || 'Computer Science & Engineering'} • {student?.classYear || '3rd Year'} • Roll: {student?.rollOrEmpNumber || '2023-CS-042'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }} className="hidden-mobile">
          <button 
            onClick={() => setActivePage('courses')}
            style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, backdropFilter: 'blur(4px)', cursor: 'pointer', border: 'none' }}
          >
            My Courses
          </button>
          <button 
            onClick={() => setActivePage('calendar')}
            style={{ background: '#ffffff', color: '#059669', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none' }}
          >
            Academic Calendar
          </button>
        </div>
      </div>

      {/* Automatically Scrolling Notices Ticker at the Top (Slowed down to 40s) */}
      {announcements.length > 0 && (
        <div 
          className="notice-ticker-wrapper"
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', zIndex: 2, background: '#ecfdf5', paddingRight: '12px' }}>
            <Megaphone size={16} /> Notice :
          </div>
          <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
            <div 
              className="notice-ticker-track"
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                animation: 'marquee 40s linear infinite',
                fontSize: '13px',
                color: '#065f46',
                fontWeight: 600
              }}
            >
              {announcements.map((item, idx) => (
                <span key={item.id || idx} style={{ marginRight: '50px' }}>
                  📢 <strong style={{ color: '#047857' }}>{item.title}:</strong> {item.content} {item.category ? `[${item.category}]` : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Timetable Section with Date, Time, and Breaks */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Calendar size={20} color="#10b981" />
            <span>My Timetable & Daily Schedule</span>
          </div>
        </div>

        {timetable.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={28} color="#94a3b8" />
            <span>No timetable available at this time.</span>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date & Day</th>
                  <th>Time Slot</th>
                  <th>Course Code</th>
                  <th>Subject Name</th>
                  <th>Room</th>
                  <th>Faculty</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((t, index) => {
                  if (t.type === 'break') {
                    return (
                      <tr key={index} style={{ background: '#f1f5f9', fontStyle: 'italic', color: '#64748b' }}>
                        <td><strong>{t.day || 'Today'}</strong></td>
                        <td><strong>{t.timeSlot}</strong></td>
                        <td colSpan="4" style={{ textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                          {t.title}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={t.id || index}>
                      <td><strong>{t.day || t.dayOfWeek || 'Monday, Oct 12'}</strong></td>
                      <td><span style={{ fontWeight: 600, color: '#059669' }}>{t.timeSlot}</span></td>
                      <td><Badge status="info">{t.code || t.courseCode || 'CS301'}</Badge></td>
                      <td><div style={{ fontWeight: 600 }}>{t.name || t.courseName || t.subjectName || 'Course'}</div></td>
                      <td>{t.roomNumber || t.room || 'Hall 201'}</td>
                      <td>{t.facultyName || t.faculty || 'Professor'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};