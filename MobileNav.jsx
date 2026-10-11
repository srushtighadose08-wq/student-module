import React from 'react';
import { LayoutDashboard, BookOpen, FileText, GraduationCap, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNav = ({ activePage, setActivePage }) => {
  const { user } = useAuth();
  if (!user) return null;

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assignments', label: 'Tasks', icon: FileText },
    { id: 'exams', label: 'Exams', icon: GraduationCap },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
