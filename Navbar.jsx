import React, { useState } from 'react';
import { Menu, Bell, LogOut, Search, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Navbar = ({ pageTitle, toggleSidebar, setActivePage }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar Menu">
          <Menu size={20} />
        </button>
        <div className="page-title">
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="nav-right">
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="badge-counter">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              zIndex: 100,
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) setActivePage(n.link.replace('/', ''));
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        background: n.isRead ? '#ffffff' : '#ecfdf5',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: n.isRead ? '#cbd5e1' : '#10b981',
                        marginTop: '5px',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{n.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineClamp: 2 }}>{n.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{
                padding: '8px 12px',
                borderTop: '1px solid #e2e8f0',
                textAlign: 'center',
                background: '#ffffff'
              }}>
                <button 
                  onClick={() => {
                    setActivePage('notifications');
                    setShowNotifications(false);
                  }}
                  style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Quick Shortcut */}
        <button 
          className="icon-btn"
          onClick={() => setActivePage('profile')}
          title="My Profile"
        >
          <User size={18} />
        </button>

        {/* Logout Button */}
        <button className="logout-nav-btn" onClick={logout} title="Sign Out">
          <LogOut size={16} />
          <span className="hidden-mobile">Logout</span>
        </button>
      </div>
    </header>
  );
};
