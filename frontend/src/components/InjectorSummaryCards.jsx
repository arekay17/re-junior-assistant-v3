function InjectorSummaryCards({ injectors }) {
  const activeInjectors = injectors.filter(
    (well) => well.activityStatus === 'Active'
  )

  const idleInjectors = injectors.filter(
    (well) => well.activityStatus === 'Idle'
  )

  const totalWaterInjectionRate = activeInjectors.reduce(
    (sum, well) => sum + well.waterInjectionRate,
    0
  )

  const totalGasInjectionRate = activeInjectors.reduce(
    (sum, well) => sum + well.gasInjectionRate,
    0
  )

  return (
    <section className="summary-grid injector-summary-grid">
      <div className="summary-card">
        <span>Active Injectors</span>
        <strong>{activeInjectors.length}</strong>
      </div>

      <div className="summary-card">
        <span>Idle Injectors</span>
        <strong>{idleInjectors.length}</strong>
      </div>

      <div className="summary-card">
        <span>Water Injection Rate</span>
        <strong>{totalWaterInjectionRate}</strong>
        <small>bwpd</small>
      </div>

      <div className="summary-card">
        <span>Gas Injection Rate</span>
        <strong>{totalGasInjectionRate}</strong>
        <small>Mscf/d</small>
      </div>
    </section>
  )
}

export default InjectorSummaryCards