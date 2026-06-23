const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('RE Junior Backend Running')
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is healthy',
  })
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})