function StatCard({ title, value, change, trend, tone }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <div className={`stat-card__icon stat-card__icon--${tone}`} aria-hidden="true" />
        <div className="stat-card__meta">
          <p className="stat-card__label">{title}</p>
          <button type="button" className="stat-card__menu" aria-label={`${title} options`}>
            ...
          </button>
        </div>
      </div>
      <p className="stat-card__value">{value}</p>
      <p className={`stat-card__change stat-card__change--${trend}`}>{change}</p>
    </article>
  );
}
