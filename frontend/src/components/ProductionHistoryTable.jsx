function ProductionHistoryTable({ history }) {
  if (history.length === 0) {
    return (
      <div className="interpretation">
        <p>No production history available.</p>
      </div>
    )
  }

  return (
    <div className="history-table">
      <h3>Monthly Production History</h3>

      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Oil Rate</th>
            <th>Calendar Oil Rate</th>
            <th>WC</th>
            <th>GOR</th>
          </tr>
        </thead>

        <tbody>
          {history.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{row.oilRateProdDays} bopd</td>
              <td>{row.oilRateCalendarDays} bopd</td>
              <td>{row.waterCut}%</td>
              <td>{row.gorScfStb} scf/stb</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductionHistoryTable