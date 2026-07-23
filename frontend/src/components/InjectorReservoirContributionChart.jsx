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

function InjectorReservoirContributionChart({
  injectorReservoirHistory,
}) {
  if (injectorReservoirHistory.length === 0) {
    return null
  }

  const labels = [
    ...new Set(
      injectorReservoirHistory.map(
        (row) => row.reservoirFaultBlock
      )
    ),
  ]

  const waterData = Object.values(
    injectorReservoirHistory.reduce((acc, row) => {
      if (!acc[row.month]) {
        acc[row.month] = { month: row.month }
      }

      acc[row.month][row.reservoirFaultBlock] =
        row.waterInjectionBbl

      return acc
    }, {})
  )

  const gasData = Object.values(
    injectorReservoirHistory.reduce((acc, row) => {
      if (!acc[row.month]) {
        acc[row.month] = { month: row.month }
      }

      acc[row.month][row.reservoirFaultBlock] =
        row.gasInjectionMscf

      return acc
    }, {})
  )

  const hasWaterInjection = injectorReservoirHistory.some(
    (row) => row.waterInjectionBbl > 0
  )

  const hasGasInjection = injectorReservoirHistory.some(
    (row) => row.gasInjectionMscf > 0
  )

  return (
    <>
      {hasWaterInjection && (
        <div className="chart-container">
          <h3>
            Reservoir / Fault Block Water Injection Contribution
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {labels.map((label) => (
                <Line
                  key={label}
                  type="monotone"
                  dataKey={label}
                  name={label}
                  strokeWidth={3}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasGasInjection && (
        <div className="chart-container">
          <h3>
            Reservoir / Fault Block Gas Injection Contribution
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={gasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {labels.map((label) => (
                <Line
                  key={label}
                  type="monotone"
                  dataKey={label}
                  name={label}
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

export default InjectorReservoirContributionChart