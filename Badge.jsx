import React from 'react';

export const Badge = ({ status, children }) => {
  const normalized = (status || children || '').toString().toLowerCase();

  let badgeClass = 'badge-info';
  if (['approved', 'present', 'graded', 'active', 'completed', 'success'].includes(normalized)) {
    badgeClass = 'badge-success';
  } else if (['pending', 'submitted', 'review', 'warning'].includes(normalized)) {
    badgeClass = 'badge-warning';
  } else if (['rejected', 'absent', 'late', 'failed', 'danger'].includes(normalized)) {
    badgeClass = 'badge-danger';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {children || status}
    </span>
  );
};
