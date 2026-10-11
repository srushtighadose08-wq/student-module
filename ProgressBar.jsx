import React from 'react';

export const ProgressBar = ({ percentage = 0, showLabel = true, height = '8px' }) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
          <span>Completion</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="progress-bar-container" style={{ height }}>
        <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
};
