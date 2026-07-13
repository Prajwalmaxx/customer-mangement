function StatsGrid({ totalOutstanding }) {
  return (
    <section className="stats-grid">
      <StatCard
        title="Total Outstanding"
        value={formatCurrency(totalOutstanding)}
        change="+2.3% from the last month"
        trend="up"
        tone="blue"
      />
      <StatCard
        title="Overdue"
        value="$2,460"
        change="-1.2% from the last month"
        trend="down"
        tone="orange"
      />
      <StatCard
        title="In Draft"
        value="$6,840"
        change="-2.0% from the last month"
        trend="down"
        tone="green"
      />
      <StatCard
        title="Projects"
        value="$3,850"
        change="-1.3% from the last month"
        trend="down"
        tone="purple"
      />
    </section>
  );
}
