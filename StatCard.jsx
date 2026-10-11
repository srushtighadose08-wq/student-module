import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = '#10b981' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-sub">{subtitle}</div>}
      </div>
    </div>
  );
};
