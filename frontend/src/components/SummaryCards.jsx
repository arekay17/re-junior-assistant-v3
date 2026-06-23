function SummaryCards({ wells }) {
  const totalOilRate = wells.reduce(
    (sum, well) => sum + well.oilRate,
    0
  )

  const issueCount = wells.filter(
    (well) => well.status !== 'Normal'
  ).length

  return (
    <section className="summary-grid">
      <div className="summary-card">
        <span>Total Wells</span>
        <strong>{wells.length}</strong>
      </div>

      <div className="summary-card">
        <span>Total Oil Rate</span>
        <strong>{totalOilRate} bopd</strong>
      </div>

      <div className="summary-card">
        <span>Wells With Issues</span>
        <strong>{issueCount}</strong>
      </div>
    </section>
  )
}

export default SummaryCards