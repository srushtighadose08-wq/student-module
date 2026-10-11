import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Building, Key, Lock, CheckCircle2, QrCode } from 'lucide-react';
import { profileApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/Badge';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    classYear: user?.classYear || '',
    rollOrEmpNumber: user?.rollOrEmpNumber || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        classYear: user.classYear || '',
        rollOrEmpNumber: user.rollOrEmpNumber || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await profileApi.updateProfile(profileData);
      showToast('Profile information updated successfully!');
      if (res.data) {
        updateUser(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      setSavingPassword(true);
      await profileApi.changePassword(passwordData);
      showToast('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const roleTitle = user?.role === 'ROLE_HOD' ? 'Head of Department' : (user?.role === 'ROLE_FACULTY' ? 'Faculty Professor' : 'Undergraduate Student');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>My Profile & Digital Identity</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Manage your personal details, college ID card, and security credentials
        </p>
      </div>

      <div className="grid-2">
        {/* Digital ID Card Preview */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '2px solid #a7f3d0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
                COLLEGE OF ENGINEERING
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Official Digital Identity Card</div>
            </div>
            <Badge status="approved">Active</Badge>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '12px',
              background: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{user?.fullName}</h3>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>{roleTitle}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{user?.departmentName || 'Computer Science & Engineering'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div><span style={{ color: '#64748b' }}>ID / Roll:</span> <strong>{user?.rollOrEmpNumber || '2023-CS-042'}</strong></div>
            <div><span style={{ color: '#64748b' }}>Class/Year:</span> <strong>{user?.classYear || '3rd Year'}</strong></div>
            <div><span style={{ color: '#64748b' }}>Email:</span> <strong>{user?.email}</strong></div>
            <div><span style={{ color: '#64748b' }}>Status:</span> <strong style={{ color: '#10b981' }}>Verified</strong></div>
          </div>

          {/* Barcode Mockup */}
          <div style={{ marginTop: '16px', textAlign: 'center', opacity: 0.8 }}>
            <div style={{ height: '30px', background: 'repeating-linear-gradient(90deg, #0f172a 0, #0f172a 2px, transparent 2px, transparent 4px, #0f172a 4px, #0f172a 7px, transparent 7px, transparent 9px)', width: '80%', margin: '0 auto' }}></div>
            <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px', marginTop: '4px' }}>
              *{user?.rollOrEmpNumber || '2023-CS-042'}*
            </div>
          </div>
        </div>

        {/* Edit Personal Details */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <User size={20} color="#10b981" />
              <span>Update Profile Info</span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Class / Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.classYear}
                  onChange={(e) => setProfileData({ ...profileData, classYear: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Roll / Employee ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.rollOrEmpNumber}
                  onChange={(e) => setProfileData({ ...profileData, rollOrEmpNumber: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Security & Change Password Card */}
      <div className="card" style={{ maxWidth: '640px' }}>
        <div className="card-header">
          <div className="card-title">
            <Lock size={20} color="#10b981" />
            <span>Account Password & Security</span>
          </div>
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter new password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-secondary" style={{ marginTop: '8px' }} disabled={savingPassword}>
            {savingPassword ? 'Updating Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
