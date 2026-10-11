import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { HodDashboard } from './pages/HodDashboard';
import { CoursesPage } from './pages/CoursesPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { ExamsGradesPage } from './pages/ExamsGradesPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { Toast } from './components/Toast';

export function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        color: '#64748b',
        fontSize: '15px',
        fontWeight: 600
      }}>
        Loading College Student Portal...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthPage />
        <Toast />
      </>
    );
  }

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return user.role === 'ROLE_HOD' ? 'Department Head Overview' : (user.role === 'ROLE_FACULTY' ? 'Faculty Portal' : 'Student Dashboard');
      case 'courses':
        return 'Academic Courses';
      case 'assignments':
        return 'Assignments & Tasks';
      case 'exams':
        return 'Examinations & Grades';
      case 'calendar':
        return 'Academic Calendar';
      case 'announcements':
        return 'Notice Board';
      case 'notifications':
        return 'Notification Center';
      case 'library':
        return 'Digital Library';
      case 'profile':
        return 'My Profile';
      case 'settings':
        return 'Portal Settings';
      default:
        return 'College LMS Portal';
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        if (user.role === 'ROLE_HOD') return <HodDashboard setActivePage={setActivePage} />;
        if (user.role === 'ROLE_FACULTY') return <FacultyDashboard setActivePage={setActivePage} />;
        return <StudentDashboard setActivePage={setActivePage} />;
      case 'courses':
        return <CoursesPage />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'exams':
        return <ExamsGradesPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'notifications':
        return <NotificationsPage setActivePage={setActivePage} />;
      case 'library':
        return <LibraryPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <StudentDashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage} pageTitle={getPageTitle()}>
      {renderContent()}
      <Toast />
    </MainLayout>
  );
}

export default App;
