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

app.get('/api/fields/:fieldId/reservoir-summary', (req, res) => {
  const fieldId = req.params.fieldId

  const rows = db.prepare(`
    SELECT
      r.id,
      r.name,
      r.stoiip_mmstb AS stoiipMmstb,
      r.giip_bscf AS giipBscf,
      r.gas_cap_m AS gasCapM,
      r.initial_pressure_psia AS initialPressurePsia,
      r.drive_mechanism AS driveMechanism,
      r.fluid_type AS fluidType,
      r.temperature_f AS temperatureF,
      SUM(mpa.oil_volume_stb) AS oilVolumeStb,
      SUM(mpa.water_volume_stb) AS waterVolumeStb,
      SUM(mpa.gas_volume_mscf) AS gasVolumeMscf,
      latestPressure.pressure_psia AS latestPressurePsia,
      latestPressure.survey_date AS latestPressureDate,
      latestPressure.survey_type AS latestPressureType
    FROM reservoirs r
    LEFT JOIN monthly_production_allocations mpa
      ON mpa.reservoir_id = r.id
    LEFT JOIN wells w
      ON w.id = mpa.well_id
      AND w.well_role = 'Producer'
    LEFT JOIN (
      SELECT
        rps.reservoir_id,
        rps.pressure_psia,
        rps.survey_date,
        rps.survey_type
      FROM reservoir_pressure_surveys rps
      INNER JOIN (
        SELECT
          reservoir_id,
          MAX(survey_date) AS latest_date
        FROM reservoir_pressure_surveys
        GROUP BY reservoir_id
      ) latest
        ON latest.reservoir_id = rps.reservoir_id
        AND latest.latest_date = rps.survey_date
    ) latestPressure
      ON latestPressure.reservoir_id = r.id
    WHERE r.field_id = ?
    GROUP BY
      r.id,
      r.name,
      r.stoiip_mmstb,
      r.giip_bscf,
      r.gas_cap_m,
      r.initial_pressure_psia,
      r.drive_mechanism,
      r.fluid_type,
      r.temperature_f,
      latestPressure.pressure_psia,
      latestPressure.survey_date,
      latestPressure.survey_type
    ORDER BY r.name
  `).all(fieldId)

  const result = rows.map((row) => {
    const oilVolumeStb = row.oilVolumeStb || 0
    const waterVolumeStb = row.waterVolumeStb || 0
    const gasVolumeMscf = row.gasVolumeMscf || 0

    const liquidVolume = oilVolumeStb + waterVolumeStb

    const waterCut =
      liquidVolume > 0 ? (waterVolumeStb / liquidVolume) * 100 : 0

    const gor =
      oilVolumeStb > 0 ? (gasVolumeMscf * 1000) / oilVolumeStb : 0

    const recoveryFactor =
      row.stoiipMmstb > 0
        ? (oilVolumeStb / 1_000_000 / row.stoiipMmstb) * 100
        : 0

    return {
      id: row.id,
      name: row.name,
      stoiipMmstb: row.stoiipMmstb,
      giipBscf: row.giipBscf,
      gasCapM: row.gasCapM,
      initialPressurePsia: row.initialPressurePsia,
      latestPressurePsia: row.latestPressurePsia,
      latestPressureDate: row.latestPressureDate,
      latestPressureType: row.latestPressureType,
      driveMechanism: row.driveMechanism,
      fluidType: row.fluidType,
      temperatureF: row.temperatureF,
      oilVolumeStb: Math.round(oilVolumeStb),
      waterVolumeStb: Math.round(waterVolumeStb),
      gasVolumeMscf: Math.round(gasVolumeMscf),
      recoveryFactor: Number(recoveryFactor.toFixed(2)),
      waterCut: Math.round(waterCut),
      gor: Math.round(gor),
    }
  })
  res.json(result)
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})