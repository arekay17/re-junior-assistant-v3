const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')

const app = express()
const db = new Database('data/re-junior.db')

app.use(cors())
app.use(express.json())

function getCalendarDays(productionMonth) {
  const [year, month] = productionMonth.split('-').map(Number)
  return new Date(year, month, 0).getDate()
}

app.get('/', (req, res) => {
  res.send('RE Junior Backend Running')
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is healthy',
  })
})

app.get('/api/fields', (req, res) => {
  const fields = db.prepare(`
    SELECT id, name, description
    FROM fields
    ORDER BY name
  `).all()

  res.json(fields)
})

app.get('/api/fields/:fieldId/wells', (req, res) => {
  const fieldId = req.params.fieldId

  const wells = db.prepare(`
  SELECT
    w.id,
    w.name,
    GROUP_CONCAT(DISTINCT r.name) AS reservoirs,
    SUM(mpa.oil_volume_stb) AS oilVolumeStb,
    SUM(mpa.water_volume_stb) AS waterVolumeStb,
    SUM(mpa.gas_volume_mscf) AS gasVolumeMscf,
    wms.production_days AS productionDays,
    latest.latest_month AS productionMonth
  FROM wells w
  LEFT JOIN (
    SELECT
      well_id,
      MAX(production_month) AS latest_month
    FROM monthly_production_allocations
    GROUP BY well_id
  ) latest
    ON latest.well_id = w.id
  LEFT JOIN monthly_production_allocations mpa
    ON mpa.well_id = w.id
    AND mpa.production_month = latest.latest_month
  LEFT JOIN reservoirs r
    ON r.id = mpa.reservoir_id
  LEFT JOIN well_monthly_status wms
    ON wms.well_id = w.id
    AND wms.production_month = latest.latest_month
  WHERE w.field_id = ?
  GROUP BY
    w.id,
    w.name,
    wms.production_days,
    latest.latest_month
  ORDER BY w.name
  `).all(fieldId)

  const calculatedWells = wells.map((well) => {
    const calendarDays = well.productionMonth
      ? getCalendarDays(well.productionMonth)
      : 0

    const liquidVolume =
      (well.oilVolumeStb || 0) + (well.waterVolumeStb || 0)

    const oilRateProdDays =
      well.productionDays > 0
        ? well.oilVolumeStb / well.productionDays
        : 0

    const oilRateCalendarDays =
      calendarDays > 0
        ? well.oilVolumeStb / calendarDays
        : 0

    const waterCut =
      liquidVolume > 0
        ? (well.waterVolumeStb / liquidVolume) * 100
        : 0

    const gor =
      well.oilVolumeStb > 0
        ? well.gasVolumeMscf * 1000 / well.oilVolumeStb
        : 0

    let status = 'Normal'

    if (waterCut >= 60) {
      status = 'High water cut'
    } else if (gor >= 1500) {
      status = 'High GOR'
    }

    return {
      id: well.id,
      name: well.name,
      reservoir: well.reservoirs || '-',
      oilRate: Math.round(oilRateProdDays),
      oilRateCalendarDays: Math.round(oilRateCalendarDays),
      waterCut: Math.round(waterCut),
      gor: Math.round(gor),
      status,
    }
  })

  res.json(calculatedWells)
})

app.get('/api/wells/:wellId/history', (req, res) => {
  const wellId = req.params.wellId

  const rows = db.prepare(`
    SELECT
      mpa.production_month AS productionMonth,
      SUM(mpa.oil_volume_stb) AS oilVolumeStb,
      SUM(mpa.water_volume_stb) AS waterVolumeStb,
      SUM(mpa.gas_volume_mscf) AS gasVolumeMscf,
      wms.production_days AS productionDays
    FROM monthly_production_allocations mpa
    LEFT JOIN well_monthly_status wms
      ON wms.well_id = mpa.well_id
      AND wms.production_month = mpa.production_month
    WHERE mpa.well_id = ?
    GROUP BY
      mpa.production_month,
      wms.production_days
    ORDER BY mpa.production_month
  `).all(wellId)

  const history = rows.map((row) => {
    const calendarDays = getCalendarDays(row.productionMonth)

    const liquidVolume =
      (row.oilVolumeStb || 0) + (row.waterVolumeStb || 0)

    const oilRateProdDays =
      row.productionDays > 0
        ? row.oilVolumeStb / row.productionDays
        : 0

    const oilRateCalendarDays =
      calendarDays > 0
        ? row.oilVolumeStb / calendarDays
        : 0

    const waterCut =
      liquidVolume > 0
        ? (row.waterVolumeStb / liquidVolume) * 100
        : 0

    const gorScfStb =
      row.oilVolumeStb > 0
        ? (row.gasVolumeMscf * 1000) / row.oilVolumeStb
        : 0

    return {
      month: row.productionMonth,
      oilVolumeStb: Math.round(row.oilVolumeStb),
      waterVolumeStb: Math.round(row.waterVolumeStb),
      gasVolumeMscf: Math.round(row.gasVolumeMscf),
      productionDays: row.productionDays,
      calendarDays,
      oilRateProdDays: Math.round(oilRateProdDays),
      oilRateCalendarDays: Math.round(oilRateCalendarDays),
      waterCut: Math.round(waterCut),
      gorScfStb: Math.round(gorScfStb),
    }
  })

  res.json(history)
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})