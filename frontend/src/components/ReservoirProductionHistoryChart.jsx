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

function ReservoirProductionHistoryChart({ history }) {
  if (history.length === 0) {
    return null
  }

  return (
    <div className="chart-container">
      <h3>Reservoir Oil Rate and Cumulative Oil</h3>

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
            dataKey="oilRateCalendarDays"
            name="Oil Rate, Calendar Days"
            strokeWidth={3}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativeOilStb"
            name="Cumulative Oil"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ReservoirProductionHistoryChart