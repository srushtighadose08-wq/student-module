import React from 'react';
import { Bell, CheckCheck, CheckCircle2, AlertCircle, Award, FileText } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';

export const NotificationsPage = ({ setActivePage }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'APPROVAL': return <CheckCircle2 size={20} color="#10b981" />;
      case 'GRADE': return <Award size={20} color="#3b82f6" />;
      case 'ASSIGNMENT': return <FileText size={20} color="#f59e0b" />;
      default: return <Bell size={20} color="#64748b" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Notification Center</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            System updates, approval confirmations, grading alerts, and deadlines
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button onClick={markAllAsRead} className="btn btn-sm btn-secondary">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <Bell size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>No notifications</div>
            <div style={{ fontSize: '12px' }}>You are completely caught up!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.isRead) markAsRead(n.id);
                  if (n.link && setActivePage) setActivePage(n.link.replace('/', ''));
                }}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #f1f5f9',
                  background: n.isRead ? '#ffffff' : '#ecfdf5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{n.title}</span>
                      {!n.isRead && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'inline-block' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                </div>

                <Badge status={n.isRead ? 'info' : 'success'}>
                  {n.isRead ? 'Read' : 'New'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
