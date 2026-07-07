import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function FieldWaterCutChart({ history }) {
  if (history.length === 0) {
    return null
  }

  return (
    <div className="chart-container">
      <h3>Field Water Cut</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis unit="%" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="waterCut"
            name="Water Cut"
            stroke="#dc2626"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FieldWaterCutChart