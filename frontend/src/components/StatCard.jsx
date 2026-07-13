import React from 'react';
import { formatCurrency } from '../utils/format';

export default function StatCard({ title, value, change, trend, tone }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__head">
        <p>{title}</p>
        <span className={`stat-trend stat-trend--${trend}`}>{trend === 'up' ? '↑' : '↓'}</span>
      </div>
      <h3>{value}</h3>
      <small>{change}</small>
    </article>
  );
}
