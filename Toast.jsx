import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const Toast = () => {
  const { toast } = useNotification();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: '#ffffff',
      border: `1px solid ${isSuccess ? '#a7f3d0' : (isError ? '#fecaca' : '#bfdbfe')}`,
      borderRadius: '12px',
      padding: '14px 18px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 200,
      maxWidth: '380px',
      animation: 'slideUp 0.25s ease-out'
    }}>
      {isSuccess && <CheckCircle2 size={20} color="#10b981" />}
      {isError && <AlertCircle size={20} color="#ef4444" />}
      {!isSuccess && !isError && <Info size={20} color="#3b82f6" />}
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{toast.message}</span>
    </div>
  );
};
