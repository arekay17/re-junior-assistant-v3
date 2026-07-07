function SummaryCards({ wells }) {
  const flowingWells = wells.filter((well) => well.activityStatus === 'Active')
  const idleWells = wells.filter((well) => well.activityStatus === 'Idle')

  const totalOilRate = flowingWells.reduce(
    (sum, well) => sum + well.oilRate,
    0
  )

  const averageWaterCut =
    flowingWells.length > 0
      ? flowingWells.reduce((sum, well) => sum + well.waterCut, 0) /
        flowingWells.length
      : 0

  return (
    <section className="summary-grid">
      <div className="summary-card">
        <span>Active Producers</span>
        <strong>{flowingWells.length}</strong>
      </div>

      <div className="summary-card">
        <span>Idle Producers</span>
        <strong>{idleWells.length}</strong>
      </div>

      <div className="summary-card">
        <span>Field Oil Rate</span>
        <strong>{totalOilRate}</strong>
        <small>bopd</small>
      </div>

      <div className="summary-card">
        <span>Average Water Cut</span>
        <strong>{Math.round(averageWaterCut)}</strong>
        <small>%</small>
      </div>
    </section>
  )
}

export default SummaryCards