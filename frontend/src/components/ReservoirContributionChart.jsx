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

function ReservoirContributionChart({ reservoirHistory }) {
  if (reservoirHistory.length === 0) {
    return null
  }

  const labels = [
    ...new Set(reservoirHistory.map((row) => row.reservoirFaultBlock)),
  ]

  const pivotedData = Object.values(
    reservoirHistory.reduce((acc, row) => {
      if (!acc[row.month]) {
        acc[row.month] = { month: row.month }
      }

      acc[row.month][row.reservoirFaultBlock] = row.oilVolumeStb

      return acc
    }, {})
  )

  return (
    <div className="chart-container">
      <h3>Reservoir / Fault Block Oil Contribution</h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={pivotedData}>
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
  )
}

export default ReservoirContributionChart