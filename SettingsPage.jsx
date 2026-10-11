import React, { useState, useEffect } from 'react';
import { Settings, Smartphone, Bell, Shield, Info, CheckCircle2, Download } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const SettingsPage = () => {
  const { showToast } = useNotification();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('Thank you for installing College LMS!');
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      showToast('To install on iOS: Tap Share -> Add to Home Screen. On Chrome: Use browser menu -> Install App.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Portal Settings & Application</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Configure notifications, install mobile PWA, and review environment parameters
        </p>
      </div>

      {/* PWA Installation Card */}
      <div className="card" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#ffffff',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Smartphone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#065f46' }}>
                {isInstalled ? 'Portal Installed on this Device' : 'Install as Progressive Web App (PWA)'}
              </h3>
              <p style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
                Fast offline launch on Android, iOS, Windows, and macOS with native feel.
              </p>
            </div>
          </div>

          {!isInstalled && (
            <button onClick={handleInstallPwa} className="btn btn-primary">
              <Download size={16} /> Install App
            </button>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Bell size={20} color="#10b981" />
            <span>Notification & Alert Preferences</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Assignment Due Date Alerts</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Receive reminders 24 hours before submission deadlines.</div>
            </div>
            <input
              type="checkbox"
              checked={assignmentReminders}
              onChange={(e) => {
                setAssignmentReminders(e.target.checked);
                showToast('Preferences updated');
              }}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Instant Approval Notifications</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Get notified as soon as account reviews or grades are finalized.</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => {
                setEmailAlerts(e.target.checked);
                showToast('Preferences updated');
              }}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* System Technical Specs */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Info size={20} color="#10b981" />
            <span>Platform Information</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px' }}>
            <span style={{ color: '#64748b' }}>Backend Runtime:</span><br />
            <strong>Java 21 (Spring Boot 3.3.0)</strong>
          </div>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px' }}>
            <span style={{ color: '#64748b' }}>Frontend Framework:</span><br />
            <strong>React 18 + Vite (ES6+)</strong>
          </div>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px' }}>
            <span style={{ color: '#64748b' }}>Database Engine:</span><br />
            <strong>MySQL 8.0 (InnoDB)</strong>
          </div>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px' }}>
            <span style={{ color: '#64748b' }}>Security Layer:</span><br />
            <strong>Spring Security 6 (Stateless JJWT)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
