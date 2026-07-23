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

function ReservoirInjectionHistoryChart({ history }) {
  if (history.length === 0) {
    return null
  }

  const hasWaterInjection = history.some((row) => row.waterInjectionBbl > 0)
  const hasGasInjection = history.some((row) => row.gasInjectionMscf > 0)

  return (
    <>
      {hasWaterInjection && (
        <div className="chart-container">
          <h3>Reservoir Water Injection Rate and Cumulative Injection</h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="waterInjectionRate"
                name="Water Injection Rate"
                stroke="#0ea5e9"
                strokeWidth={3}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeWaterInjectionBbl"
                name="Cumulative Water Injection"
                stroke="#1d4ed8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasGasInjection && (
        <div className="chart-container">
          <h3>Reservoir Gas Injection Rate and Cumulative Injection</h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="gasInjectionRate"
                name="Gas Injection Rate"
                stroke="#f97316"
                strokeWidth={3}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeGasInjectionMscf"
                name="Cumulative Gas Injection"
                stroke="#b45309"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  )
}

export default ReservoirInjectionHistoryChart