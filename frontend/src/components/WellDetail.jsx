function WellDetail({ selectedWell }) {
  return (
    <aside className="panel detail-panel">
      <h2>{selectedWell.name}</h2>
      <p className="muted">Selected well detail</p>

      <dl>
        <div><dt>Reservoir</dt><dd>{selectedWell.reservoir}</dd></div>
        <div><dt>Oil Rate</dt><dd>{selectedWell.oilRate} bopd</dd></div>
        <div><dt>Water Cut</dt><dd>{selectedWell.waterCut}%</dd></div>
        <div><dt>GOR</dt><dd>{selectedWell.gor} scf/stb</dd></div>
        <div><dt>Status</dt><dd>{selectedWell.status}</dd></div>
      </dl>

      <div className="interpretation">
        <h3>First-pass comment</h3>
        <p>
          {selectedWell.status === 'Normal'
            ? 'Well appears stable based on the current mock surveillance indicators.'
            : `Well requires review due to ${selectedWell.status.toLowerCase()}. Check latest trend, pressure data, and operating history.`}
        </p>
      </div>
    </aside>
  )
}

export default WellDetail