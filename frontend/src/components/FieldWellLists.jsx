function FieldWellLists({ wells }) {
  const flowingWells = wells.filter((well) => well.activityStatus === 'Active')
  const idleWells = wells.filter((well) => well.activityStatus === 'Idle')

  const topProducers = [...flowingWells]
    .sort((a, b) => b.oilRate - a.oilRate)
    .slice(0, 5)

  const highWaterCutWells = flowingWells.filter((well) => well.waterCut >= 60)
  const highGorWells = flowingWells.filter((well) => well.gor >= 1500)

  return (
    <section className="field-lists">
      <div className="panel">
        <h3>Top Oil Producers</h3>
        {topProducers.map((well) => (
          <p key={well.id}>
            <strong>{well.name}</strong> — {well.oilRate} bopd
          </p>
        ))}
      </div>

      <div className="panel">
        <h3>High Water Cut Wells</h3>
        {highWaterCutWells.length === 0 && <p>No high water cut wells.</p>}
        {highWaterCutWells.map((well) => (
          <p key={well.id}>
            <strong>{well.name}</strong> — {well.waterCut}%
          </p>
        ))}
      </div>

      <div className="panel">
        <h3>High GOR Wells</h3>
        {highGorWells.length === 0 && <p>No high GOR wells.</p>}
        {highGorWells.map((well) => (
          <p key={well.id}>
            <strong>{well.name}</strong> — {well.gor} scf/stb
          </p>
        ))}
      </div>

      <div className="panel">
        <h3>Idle Wells</h3>
        {idleWells.length === 0 && <p>No idle wells.</p>}
        {idleWells.map((well) => (
          <p key={well.id}>
            <strong>{well.name}</strong> — {well.idleReason || 'Unknown reason'}
          </p>
        ))}
      </div>
    </section>
  )
}

export default FieldWellLists