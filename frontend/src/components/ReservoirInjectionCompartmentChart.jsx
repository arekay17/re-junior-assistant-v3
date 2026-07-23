import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function ReservoirInjectionCompartmentChart({ compartmentHistory }) {
  if (compartmentHistory.length === 0) {
    return null
  }

  const labels = [...new Set(compartmentHistory.map((row) => row.reservoirFaultBlock))]

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2', '#db2777', '#4b5563']

  const waterData = Object.values(
    compartmentHistory.reduce((acc, row) => {
      if (!acc[row.month]) {
        acc[row.month] = { month: row.month }
      }

      acc[row.month][row.reservoirFaultBlock] = row.waterInjectionBbl

      return acc
    }, {})
  )

  const gasData = Object.values(
    compartmentHistory.reduce((acc, row) => {
      if (!acc[row.month]) {
        acc[row.month] = { month: row.month }
      }

      acc[row.month][row.reservoirFaultBlock] = row.gasInjectionMscf

      return acc
    }, {})
  )

  const hasWaterInjection = compartmentHistory.some((row) => row.waterInjectionBbl > 0)
  const hasGasInjection = compartmentHistory.some((row) => row.gasInjectionMscf > 0)

  return (
    <>
      {hasWaterInjection && (
        <div className="chart-container">
          <h3>Fault Block Water Injection Contribution</h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {labels.map((label, index) => (
                <Line
                  key={label}
                  type="monotone"
                  dataKey={label}
                  name={label}
                  stroke={colors[index % colors.length]}
                  strokeWidth={3}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasGasInjection && (
        <div className="chart-container">
          <h3>Fault Block Gas Injection Contribution</h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={gasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {labels.map((label, index) => (
                <Line
                  key={label}
                  type="monotone"
                  dataKey={label}
                  name={label}
                  stroke={colors[index % colors.length]}
                  strokeWidth={3}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  )
}

export default ReservoirInjectionCompartmentChart