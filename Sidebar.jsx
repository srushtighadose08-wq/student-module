import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Bell, 
  Megaphone, 
  Library, 
  UserCheck, 
  Users, 
  User, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activePage, setActivePage, isMobileOpen, closeMobileSidebar }) => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const role = user.role;

  const getNavItems = () => {
    if (role === 'ROLE_FACULTY') {
      return [
        { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'Assigned Courses', icon: BookOpen },
        { id: 'assignments', label: 'Assignments & Grading', icon: FileText },
        { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
        { id: 'announcements', label: 'Notice Board', icon: Megaphone },
        { id: 'library', label: 'Digital Library', icon: Library },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    if (role === 'ROLE_HOD') {
      return [
        { id: 'dashboard', label: 'HOD Overview', icon: LayoutDashboard },
        { id: 'courses', label: 'Department Courses', icon: BookOpen },
        { id: 'assignments', label: 'Assignments', icon: FileText },
        
        { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
        { id: 'announcements', label: 'Notice Board', icon: Megaphone },
        { id: 'library', label: 'Digital Library', icon: Library },
        { id: 'profile', label: 'HOD Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    // Default: Student
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
       { id: 'announcements', label: 'Notice Board', icon: Megaphone },
      { id: 'courses', label: 'My Courses', icon: BookOpen },
      { id: 'assignments', label: 'Assignments', icon: FileText },
      { id: 'calendar', label: 'Academic Calendar', icon: Calendar },   
      { id: 'library', label: 'Digital Library', icon: Library },
    
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    setActivePage(id);
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  const roleLabel = role === 'ROLE_HOD' ? 'HOD' : (role === 'ROLE_FACULTY' ? 'Faculty' : 'Student');

  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <div className="brand-text">
          <h2>College LMS</h2>
          <span>{roleLabel} Portal</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="sidebar-menu">
        <div className="sidebar-category">Main Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer with User Card */}
      <div className="sidebar-footer">
        <div className="user-snippet">
          <div className="user-avatar">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-meta">
            <div className="user-name" title={user.fullName}>{user.fullName}</div>
            <span className="user-role-badge">{roleLabel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
