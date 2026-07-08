function InjectorDetail({ selectedInjector }) {
  return (
    <aside className="panel detail-panel">
      <h2>{selectedInjector.name}</h2>
      <p className="muted">Selected injector detail</p>

      <dl>
        <div><dt>Type</dt><dd>{selectedInjector.injectorType} Injector</dd></div>
        <div><dt>Reservoir</dt><dd>{selectedInjector.reservoir}</dd></div>
        <div><dt>Water Rate</dt><dd>{selectedInjector.waterInjectionRate.toLocaleString()} bwpd</dd></div>
        <div><dt>Gas Rate</dt><dd>{selectedInjector.gasInjectionRate.toLocaleString()} Mscf/d</dd></div>
        <div><dt>Injection Days</dt><dd>{selectedInjector.injectionDays}</dd></div>
        <div><dt>Status</dt><dd>{selectedInjector.activityStatus}</dd></div>
      </dl>

      <div className="interpretation">
        <h3>First-pass comment</h3>
        <p>
          {selectedInjector.activityStatus === 'Active'
            ? 'Injector appears active based on the current mock injection indicators.'
            : `Injector requires review due to ${selectedInjector.idleReason || 'idle status'}. Check injection history, surface constraints, and well integrity.`}
        </p>
      </div>
    </aside>
  )
}

export default InjectorDetail