function InjectorTable({
  injectors,
  selectedInjector,
  onSelectInjector,
}) {
  return (
    <section className="panel">
      <h2>Injector Wells</h2>

      <table className="well-table">
        <thead>
          <tr>
            <th>Injector</th>
            <th>Type</th>
            <th>Reservoir</th>
            <th>Water Rate</th>
            <th>Gas Rate</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {injectors.map((injector) => (
            <tr
              key={injector.id}
              className={
                selectedInjector?.id === injector.id
                  ? 'selected-row'
                  : ''
              }
              onClick={() => onSelectInjector(injector)}
            >
              <td>{injector.name}</td>

              <td>{injector.injectorType}</td>

              <td>{injector.reservoir}</td>

              <td>
                {injector.waterInjectionRate.toLocaleString()} bwpd
              </td>

              <td>
                {injector.gasInjectionRate.toLocaleString()} Mscf/d
              </td>

              <td>{injector.activityStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default InjectorTable