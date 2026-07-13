function ReservoirTable({
  reservoirs,
  selectedReservoir,
  onSelectReservoir,
}) {
  return (
    <section className="panel">
      <h2>Reservoirs</h2>

      <table className="well-table">
        <thead>
          <tr>
            <th>Reservoir</th>
            <th>STOIIP</th>
            <th>RF</th>
            <th>Latest Pressure</th>
            <th>WC</th>
            <th>GOR</th>
          </tr>
        </thead>

        <tbody>
          {reservoirs.map((reservoir) => (
            <tr
              key={reservoir.id}
              className={
                selectedReservoir?.id === reservoir.id
                  ? 'selected-row'
                  : ''
              }
              onClick={() => onSelectReservoir(reservoir)}
            >
              <td>{reservoir.name}</td>
              <td>{reservoir.stoiipMmstb} MMstb</td>
              <td>{reservoir.recoveryFactor}%</td>
              <td>{reservoir.latestPressurePsia} psia</td>
              <td>{reservoir.waterCut}%</td>
              <td>{reservoir.gor} scf/stb</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default ReservoirTable