const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const { createProductionQueries } = require('./data/productionQueries')

const app = express()
const db = new Database('data/re-junior.db')

const productionQueries = createProductionQueries(db)

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

      compartments.reservoirFaultBlocks,

      production.oilVolumeStb,
      production.waterVolumeStb,
      production.gasVolumeMscf,
      production.productionDays,
      production.idleReason,
      production.productionMonth

    FROM wells w

    LEFT JOIN (
      SELECT
        ws.well_id,

        SUM(msp.oil_volume_stb) AS oilVolumeStb,
        SUM(msp.water_volume_stb) AS waterVolumeStb,
        SUM(msp.gas_volume_mscf) AS gasVolumeMscf,

        MAX(msp.production_days) AS productionDays,
        MAX(msp.idle_reason) AS idleReason,
        msp.production_month AS productionMonth

      FROM well_strings ws

      JOIN monthly_string_production msp
        ON msp.string_id = ws.id

      JOIN (
        SELECT
          ws.well_id,
          MAX(msp.production_month) AS latestMonth
        FROM well_strings ws
        JOIN monthly_string_production msp
          ON msp.string_id = ws.id
        GROUP BY ws.well_id
      ) latest
        ON latest.well_id = ws.well_id
        AND latest.latestMonth = msp.production_month

      GROUP BY
        ws.well_id,
        msp.production_month
    ) production
      ON production.well_id = w.id

    LEFT JOIN (
      SELECT
        ws.well_id,

        GROUP_CONCAT(
          DISTINCT rc.name
        ) AS reservoirFaultBlocks

      FROM well_strings ws

      JOIN monthly_string_allocation_factors msaf
        ON msaf.string_id = ws.id

      JOIN reservoir_compartments rc
        ON rc.id = msaf.reservoir_compartment_id

      JOIN (
        SELECT
          ws.well_id,
          MAX(msaf.production_month) AS latestMonth
        FROM well_strings ws
        JOIN monthly_string_allocation_factors msaf
          ON msaf.string_id = ws.id
        GROUP BY ws.well_id
      ) latest
        ON latest.well_id = ws.well_id
        AND latest.latestMonth = msaf.production_month

      GROUP BY ws.well_id
    ) compartments
      ON compartments.well_id = w.id

    WHERE w.field_id = ?
      AND w.well_role = 'Producer'

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

    const totalVolume =
      (well.oilVolumeStb || 0) +
      (well.waterVolumeStb || 0) +
      (well.gasVolumeMscf || 0)

    const activityStatus =
      totalVolume > 0 && well.productionDays > 0
        ? 'Active'
        : 'Idle'

    let status = 'Normal'

    if (activityStatus === 'Idle') {
      status = 'Idle'
    } else if (waterCut >= 60) {
      status = 'High water cut'
    } else if (gor >= 1500) {
      status = 'High GOR'
    }

    return {
      id: well.id,
      name: well.name,
      reservoir: well.reservoirFaultBlocks || '-',
      oilRate: Math.round(oilRateProdDays),
      oilRateCalendarDays: Math.round(oilRateCalendarDays),
      waterCut: Math.round(waterCut),
      gor: Math.round(gor),
      status,

      productionDays: well.productionDays,
      activityStatus,
      idleReason: activityStatus === 'Idle' ? well.idleReason || 'Unknown' : null,
    }
  })

  res.json(calculatedWells)
})

  app.get('/api/wells/:wellId/history', (req, res) => {
    const wellId = req.params.wellId

  const rows = db.prepare(`
    SELECT
      msp.production_month AS productionMonth,

      SUM(msp.oil_volume_stb) AS oilVolumeStb,
      SUM(msp.water_volume_stb) AS waterVolumeStb,
      SUM(msp.gas_volume_mscf) AS gasVolumeMscf,

      MAX(msp.production_days) AS productionDays,
      MAX(msp.idle_reason) AS idleReason

    FROM well_strings ws

    JOIN monthly_string_production msp
      ON msp.string_id = ws.id

    WHERE ws.well_id = ?

    GROUP BY
      msp.production_month

    ORDER BY
      msp.production_month
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

app.get('/api/wells/:wellId/reservoir-history', (req, res) => {
  const wellId = req.params.wellId

  const rows = db.prepare(`
    SELECT
      r.name AS reservoir,
      fb.name AS faultBlock,
      msp.production_month AS productionMonth,

      SUM(
        msp.oil_volume_stb *
        msaf.allocation_fraction
      ) AS oilVolumeStb,

      SUM(
        msp.water_volume_stb *
        msaf.allocation_fraction
      ) AS waterVolumeStb,

      SUM(
        msp.gas_volume_mscf *
        msaf.allocation_fraction
      ) AS gasVolumeMscf

    FROM well_strings ws

    JOIN monthly_string_production msp
      ON msp.string_id = ws.id

    JOIN monthly_string_allocation_factors msaf
      ON msaf.string_id = msp.string_id
      AND msaf.production_month = msp.production_month

    JOIN reservoir_compartments rc
      ON rc.id = msaf.reservoir_compartment_id

    JOIN reservoirs r
      ON r.id = rc.reservoir_id

    JOIN fault_blocks fb
      ON fb.id = rc.fault_block_id

    WHERE ws.well_id = ?

    GROUP BY
      r.id,
      r.name,
      fb.id,
      fb.name,
      msp.production_month

    ORDER BY
      r.name,
      fb.name,
      msp.production_month
  `).all(wellId)

  res.json(
    rows.map((row) => ({
      reservoir: row.reservoir,
      faultBlock: row.faultBlock,
      reservoirFaultBlock: `${row.reservoir} - ${row.faultBlock}`,
      month: row.productionMonth,
      oilVolumeStb: Math.round(row.oilVolumeStb),
      waterVolumeStb: Math.round(row.waterVolumeStb),
      gasVolumeMscf: Math.round(row.gasVolumeMscf),
    }))
  )
})

app.get('/api/fields/:fieldId/history', (req, res) => {
  const fieldId = req.params.fieldId

  const rows = db.prepare(`
    SELECT
      mpa.production_month AS productionMonth,
      SUM(mpa.oil_volume_stb) AS oilVolumeStb,
      SUM(mpa.water_volume_stb) AS waterVolumeStb,
      SUM(mpa.gas_volume_mscf) AS gasVolumeMscf,
      SUM(wms.production_days) AS totalProductionDays
    FROM monthly_production_allocations mpa
    INNER JOIN wells w
      ON w.id = mpa.well_id
    INNER JOIN well_monthly_status wms
      ON wms.well_id = mpa.well_id
      AND wms.production_month = mpa.production_month
    WHERE w.field_id = ?
    GROUP BY mpa.production_month
    ORDER BY mpa.production_month
  `).all(fieldId)

  let cumulativeOilStb = 0

  const history = rows.map((row) => {
    const calendarDays = getCalendarDays(row.productionMonth)

    cumulativeOilStb += row.oilVolumeStb || 0

    const liquidVolume =
      (row.oilVolumeStb || 0) + (row.waterVolumeStb || 0)

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
      oilRateCalendarDays: Math.round(oilRateCalendarDays),
      waterCut: Math.round(waterCut),
      gorScfStb: Math.round(gorScfStb),
      cumulativeOilStb: Math.round(cumulativeOilStb),
    }
  })

  res.json(history)
})

app.get('/api/fields/:fieldId/injectors', (req, res) => {
  const fieldId = req.params.fieldId

  const injectors = db.prepare(`
    SELECT
      w.id,
      w.name,
      w.injector_type AS injectorType,

      compartments.reservoirFaultBlocks,

      injection.waterInjectionBbl,
      injection.gasInjectionMscf,
      injection.injectionDays,
      injection.productionMonth,
      injection.idleReason

    FROM wells w

    LEFT JOIN (
      SELECT
        ws.well_id,

        SUM(msi.water_injection_bbl) AS waterInjectionBbl,
        SUM(msi.gas_injection_mscf) AS gasInjectionMscf,

        MAX(msi.injection_days) AS injectionDays,
        msi.production_month AS productionMonth,
        MAX(msi.idle_reason) AS idleReason

      FROM well_strings ws

      JOIN monthly_string_injection msi
        ON msi.string_id = ws.id

      JOIN (
        SELECT
          ws.well_id,
          MAX(msi.production_month) AS latestMonth
        FROM well_strings ws
        JOIN monthly_string_injection msi
          ON msi.string_id = ws.id
        GROUP BY ws.well_id
      ) latest
        ON latest.well_id = ws.well_id
        AND latest.latestMonth = msi.production_month

      GROUP BY
        ws.well_id,
        msi.production_month
    ) injection
      ON injection.well_id = w.id

    LEFT JOIN (
      SELECT
        ws.well_id,

        GROUP_CONCAT(
          DISTINCT rc.name
        ) AS reservoirFaultBlocks

      FROM well_strings ws

      JOIN monthly_string_injection_allocation_factors msiaf
        ON msiaf.string_id = ws.id

      JOIN reservoir_compartments rc
        ON rc.id = msiaf.reservoir_compartment_id

      JOIN (
        SELECT
          ws.well_id,
          MAX(msiaf.production_month) AS latestMonth
        FROM well_strings ws
        JOIN monthly_string_injection_allocation_factors msiaf
          ON msiaf.string_id = ws.id
        GROUP BY ws.well_id
      ) latest
        ON latest.well_id = ws.well_id
        AND latest.latestMonth = msiaf.production_month

      GROUP BY ws.well_id
    ) compartments
      ON compartments.well_id = w.id

    WHERE w.field_id = ?
      AND w.well_role = 'Injector'

    ORDER BY w.name
  `).all(fieldId)

  const result = injectors.map((well) => {
    const calendarDays = well.productionMonth
      ? getCalendarDays(well.productionMonth)
      : 0

    const totalInjection =
      (well.waterInjectionBbl || 0) + (well.gasInjectionMscf || 0)

    const activityStatus =
      totalInjection > 0 && well.injectionDays > 0
        ? 'Active'
        : 'Idle'

    return {
      id: well.id,
      name: well.name,
      injectorType: well.injectorType,
      reservoir: well.reservoirFaultBlocks || '-',
      waterInjectionBbl: Math.round(well.waterInjectionBbl || 0),
      gasInjectionMscf: Math.round(well.gasInjectionMscf || 0),
      waterInjectionRate:
        well.injectionDays > 0
          ? Math.round((well.waterInjectionBbl || 0) / well.injectionDays)
          : 0,
      gasInjectionRate:
        well.injectionDays > 0
          ? Math.round((well.gasInjectionMscf || 0) / well.injectionDays)
          : 0,
      waterInjectionCalendarRate:
        calendarDays > 0
          ? Math.round((well.waterInjectionBbl || 0) / calendarDays)
          : 0,
      gasInjectionCalendarRate:
        calendarDays > 0
          ? Math.round((well.gasInjectionMscf || 0) / calendarDays)
          : 0,
      injectionDays: well.injectionDays || 0,
      activityStatus,
      idleReason: activityStatus === 'Idle' ? well.idleReason || 'Unknown' : null,
    }
  })

  res.json(result)
})

app.get('/api/fields/:fieldId/injection-history', (req, res) => {
  const fieldId = req.params.fieldId

  const rows = db.prepare(`
    SELECT
      mia.production_month AS productionMonth,
      SUM(mia.water_injection_bbl) AS waterInjectionBbl,
      SUM(mia.gas_injection_mscf) AS gasInjectionMscf
    FROM monthly_injection_allocations mia
    INNER JOIN wells w
      ON w.id = mia.well_id
    WHERE w.field_id = ?
      AND w.well_role = 'Injector'
    GROUP BY mia.production_month
    ORDER BY mia.production_month
  `).all(fieldId)

  const history = rows.map((row) => {
    const calendarDays = getCalendarDays(row.productionMonth)

    const waterInjectionRate =
      calendarDays > 0
        ? row.waterInjectionBbl / calendarDays
        : 0

    const gasInjectionRate =
      calendarDays > 0
        ? row.gasInjectionMscf / calendarDays
        : 0

    return {
      month: row.productionMonth,
      waterInjectionBbl: Math.round(row.waterInjectionBbl || 0),
      gasInjectionMscf: Math.round(row.gasInjectionMscf || 0),
      waterInjectionRate: Math.round(waterInjectionRate),
      gasInjectionRate: Math.round(gasInjectionRate),
    }
  })

  res.json(history)
})

app.get('/api/injectors/:injectorId/history', (req, res) => {
  const injectorId = req.params.injectorId

  const rows = db.prepare(`
    SELECT
      msi.production_month AS productionMonth,

      SUM(msi.water_injection_bbl) AS waterInjectionBbl,
      SUM(msi.gas_injection_mscf) AS gasInjectionMscf,

      MAX(msi.injection_days) AS injectionDays,
      MAX(msi.idle_reason) AS idleReason

    FROM well_strings ws

    JOIN monthly_string_injection msi
      ON msi.string_id = ws.id

    WHERE ws.well_id = ?

    GROUP BY
      msi.production_month

    ORDER BY
      msi.production_month
  `).all(injectorId)

  const history = rows.map((row) => {
    const calendarDays = getCalendarDays(row.productionMonth)

    const waterInjectionRate =
      row.injectionDays > 0
        ? row.waterInjectionBbl / row.injectionDays
        : 0

    const gasInjectionRate =
      row.injectionDays > 0
        ? row.gasInjectionMscf / row.injectionDays
        : 0

    const waterInjectionCalendarRate =
      calendarDays > 0
        ? row.waterInjectionBbl / calendarDays
        : 0

    const gasInjectionCalendarRate =
      calendarDays > 0
        ? row.gasInjectionMscf / calendarDays
        : 0

    return {
      month: row.productionMonth,
      waterInjectionBbl: Math.round(row.waterInjectionBbl || 0),
      gasInjectionMscf: Math.round(row.gasInjectionMscf || 0),
      injectionDays: row.injectionDays || 0,
      calendarDays,
      waterInjectionRate: Math.round(waterInjectionRate),
      gasInjectionRate: Math.round(gasInjectionRate),
      waterInjectionCalendarRate: Math.round(waterInjectionCalendarRate),
      gasInjectionCalendarRate: Math.round(gasInjectionCalendarRate),
    }
  })

  res.json(history)
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

app.get('/api/fields/:fieldId/compartment-production', (req, res) => {
  try {
    const { fieldId } = req.params

    const production =
      productionQueries.getCompartmentProduction(fieldId)

    res.json(production)
  } catch (error) {
    console.error(
      'Failed to load compartment production:',
      error
    )

    res.status(500).json({
      error: 'Failed to load compartment production',
    })
  }
})

app.get('/api/fields/:fieldId/field-production', (req, res) => {
  try {
    const rows = productionQueries.getFieldProduction(
      req.params.fieldId
    )

    let cumulativeOilStb = 0

    const history = rows.map((row) => {
      const calendarDays = getCalendarDays(
        row.productionMonth
      )

      cumulativeOilStb += row.oilVolumeStb

      const liquidVolume =
        row.oilVolumeStb + row.waterVolumeStb

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
          ? (row.gasVolumeMscf * 1000) /
            row.oilVolumeStb
          : 0

      return {
        month: row.productionMonth,
        oilVolumeStb: Math.round(row.oilVolumeStb),
        waterVolumeStb: Math.round(row.waterVolumeStb),
        gasVolumeMscf: Math.round(row.gasVolumeMscf),
        oilRateCalendarDays: Math.round(
          oilRateCalendarDays
        ),
        waterCut: Math.round(waterCut),
        gorScfStb: Math.round(gorScfStb),
        cumulativeOilStb: Math.round(
          cumulativeOilStb
        ),
      }
    })

    res.json(history)
  } catch (error) {
    console.error(
      'Failed to load field production:',
      error
    )

    res.status(500).json({
      error: 'Failed to load field production',
    })
  }
})

app.get('/api/fields/:fieldId/compartment-injection', (req, res) => {
  const fieldId = req.params.fieldId

  const result =
    productionQueries.getCompartmentInjection(fieldId)

  res.json(result)
})

app.get('/api/fields/:fieldId/field-injection', (req, res) => {
  try {
    const rows = productionQueries.getFieldInjection(
      req.params.fieldId
    )

    const history = rows.map((row) => {
      const calendarDays = getCalendarDays(
        row.productionMonth
      )

      const waterInjectionRate =
        calendarDays > 0
          ? row.waterInjectionBbl / calendarDays
          : 0

      const gasInjectionRate =
        calendarDays > 0
          ? row.gasInjectionMscf / calendarDays
          : 0

      return {
        month: row.productionMonth,
        waterInjectionBbl: Math.round(
          row.waterInjectionBbl
        ),
        gasInjectionMscf: Math.round(
          row.gasInjectionMscf
        ),
        waterInjectionRate: Math.round(
          waterInjectionRate
        ),
        gasInjectionRate: Math.round(
          gasInjectionRate
        ),
      }
    })

    res.json(history)
  } catch (error) {
    console.error(
      'Failed to load field injection:',
      error
    )

    res.status(500).json({
      error: 'Failed to load field injection',
    })
  }
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})