function WellTable({
  wells,
  selectedWell,
  onSelectWell,
}) {
  return (
    <div className="panel">
      <h2>Producer Wells</h2>

      <table>
        <thead>
          <tr>
            <th>Well</th>
            <th>Reservoir</th>
            <th>Oil Rate</th>
            <th>WC</th>
            <th>GOR</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {wells.map((well) => (
            <tr
              key={well.id}
              onClick={() => onSelectWell(well)}
              className={
                selectedWell.id === well.id
                  ? 'selected'
                  : ''
              }
            >
              <td>{well.name}</td>
              <td>{well.reservoir}</td>
              <td>{well.oilRate} bopd</td>
              <td>{well.waterCut}%</td>
              <td>{well.gor} scf/stb</td>
              <td>{well.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WellTable