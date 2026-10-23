import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  const bgColor = isError ? 'var(--status-danger-bg)' : isWarning ? 'var(--status-warning-bg)' : 'var(--status-success-bg)';
  const borderColor = isError ? 'var(--status-danger-border)' : isWarning ? 'var(--status-warning-border)' : 'var(--status-success-border)';
  const textColor = isError ? 'var(--status-danger)' : isWarning ? 'var(--status-warning)' : 'var(--status-success)';

  const Icon = isError ? AlertTriangle : isWarning ? Info : CheckCircle2;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 200,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        padding: '12px 20px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 14,
        fontWeight: 600,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <Icon size={18} />
      <span>{toast.message}</span>
    </div>
  );
}
