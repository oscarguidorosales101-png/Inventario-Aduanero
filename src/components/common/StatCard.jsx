import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary' }) {
  return (
    <div className="kpi-card fade-in">
      <div className="kpi-top">
        <span className="kpi-title">{title}</span>
        {Icon && (
          <div className="kpi-icon-wrap" style={{ color: color === 'primary' ? 'var(--primary)' : color }}>
            <Icon size={22} strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div>
        <div className="kpi-value">{value}</div>
        {subtitle && <div className="kpi-meta">{subtitle}</div>}
      </div>
    </div>
  );
}
