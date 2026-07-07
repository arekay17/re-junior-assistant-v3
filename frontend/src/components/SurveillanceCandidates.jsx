function SurveillanceCandidates({ wells }) {
  const candidates = wells
    .filter((well) => well.activityStatus === 'Active')
    .filter((well) => well.waterCut >= 60 || well.gor >= 1500)
    .map((well) => {
      let issue = 'Normal'
      let severity = 'Low'

      if (well.waterCut >= 60) {
        issue = 'High water cut'
        severity = 'Medium'
      }

      if (well.gor >= 1500) {
        issue = 'High GOR'
        severity = 'High'
      }

      return {
        ...well,
        issue,
        severity,
      }
    })

  return (
    <section className="panel surveillance-candidates">
      <h3>Surveillance Candidates</h3>

      {candidates.length === 0 && <p>No immediate surveillance candidates.</p>}

      {candidates.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Well</th>
              <th>Issue</th>
              <th>Oil Rate</th>
              <th>WC</th>
              <th>GOR</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((well) => (
              <tr key={well.id}>
                <td>{well.name}</td>
                <td>{well.issue}</td>
                <td>{well.oilRate} bopd</td>
                <td>{well.waterCut}%</td>
                <td>{well.gor} scf/stb</td>
                <td>{well.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default SurveillanceCandidates