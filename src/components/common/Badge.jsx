import React from 'react';

export default function Badge({ status, text }) {
  const label = text || status;
  const s = String(status || '').toLowerCase().trim();

  let badgeClass = 'badge-secondary';

  if (s.includes('retenid') || s.includes('rechazad') || s.includes('peligro')) {
    badgeClass = 'badge-retenida';
  } else if (s.includes('liberad') || s.includes('aprobada') || s.includes('activo')) {
    badgeClass = 'badge-liberada';
  } else if (s.includes('inspeccion') || s.includes('observacion') || s.includes('pendiente')) {
    badgeClass = 'badge-inspeccion';
  } else if (s.includes('transito') || s.includes('cuarentena') || s.includes('deposito')) {
    badgeClass = 'badge-transito';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
      {label}
    </span>
  );
}
