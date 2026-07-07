import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function FieldGasInjectionChart({ history }) {
  if (history.length === 0) {
    return null
  }

  return (
    <div className="chart-container">
      <h3>Field Gas Injection Rate</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="gasInjectionRate"
            name="Gas Injection Rate"
            stroke="#f97316"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FieldGasInjectionChart