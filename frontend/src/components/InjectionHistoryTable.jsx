function InjectionHistoryTable({ history }) {
  if (history.length === 0) {
    return (
      <div className="interpretation">
        <p>No injection history available.</p>
      </div>
    )
  }

  return (
    <div className="history-table">
      <h3>Monthly Injection History</h3>

      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Water Inj. Rate</th>
            <th>Gas Inj. Rate</th>
            <th>Water Volume</th>
            <th>Gas Volume</th>
            <th>Days</th>
          </tr>
        </thead>

        <tbody>
          {history.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{row.waterInjectionCalendarRate.toLocaleString()} bwpd</td>
              <td>{row.gasInjectionCalendarRate.toLocaleString()} Mscf/d</td>
              <td>{row.waterInjectionBbl.toLocaleString()} bbl</td>
              <td>{row.gasInjectionMscf.toLocaleString()} Mscf</td>
              <td>{row.injectionDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InjectionHistoryTable