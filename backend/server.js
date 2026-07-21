const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const { createProductionQueries } = require('./data/productionQueries')
const createInjectorRoutes = require('./routes/injectorRoutes')
const createWellRoutes = require('./routes/wellRoutes')
const createFieldRoutes = require('./routes/fieldRoutes')

const app = express()
const db = new Database('data/re-junior.db')

const productionQueries = createProductionQueries(db)

app.use(cors())
app.use(express.json())
app.use('/api/fields',createFieldRoutes(db, productionQueries))
app.use('/api/injectors', createInjectorRoutes(db))
app.use('/api/wells', createWellRoutes(db))


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