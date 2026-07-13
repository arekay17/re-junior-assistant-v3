function ReservoirDetail({ selectedReservoir }) {
  if (!selectedReservoir) {
    return (
      <aside className="panel detail-panel">
        <p>Select a reservoir to view details.</p>
      </aside>
    )
  }

  return (
    <aside className="panel detail-panel">
      <h2>{selectedReservoir.name}</h2>
      <p className="muted">Reservoir dossier</p>

      <h3>Reservoir Description</h3>
      <dl>
        <div><dt>STOIIP</dt><dd>{selectedReservoir.stoiipMmstb} MMstb</dd></div>
        <div><dt>GIIP</dt><dd>{selectedReservoir.giipBscf} Bscf</dd></div>
        <div><dt>Gas Cap m</dt><dd>{selectedReservoir.gasCapM}</dd></div>
        <div><dt>Drive</dt><dd>{selectedReservoir.driveMechanism}</dd></div>
        <div><dt>Fluid</dt><dd>{selectedReservoir.fluidType}</dd></div>
        <div><dt>Temperature</dt><dd>{selectedReservoir.temperatureF} °F</dd></div>
      </dl>

      <h3>Reservoir Performance</h3>
      <dl>
        <div><dt>Initial Pressure</dt><dd>{selectedReservoir.initialPressurePsia} psia</dd></div>
        <div><dt>Latest Pressure</dt><dd>{selectedReservoir.latestPressurePsia} psia</dd></div>
        <div><dt>Latest Survey</dt><dd>{selectedReservoir.latestPressureType} / {selectedReservoir.latestPressureDate}</dd></div>
        <div><dt>Recovery Factor</dt><dd>{selectedReservoir.recoveryFactor}%</dd></div>
        <div><dt>Cum Oil</dt><dd>{selectedReservoir.oilVolumeStb.toLocaleString()} stb</dd></div>
        <div><dt>Water Cut</dt><dd>{selectedReservoir.waterCut}%</dd></div>
        <div><dt>GOR</dt><dd>{selectedReservoir.gor} scf/stb</dd></div>
      </dl>
    </aside>
  )
}

export default ReservoirDetail