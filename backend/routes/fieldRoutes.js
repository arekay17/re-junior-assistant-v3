const express = require('express')
const { getCalendarDays } = require('../utils/dateUtils')

function createFieldRoutes(db, productionQueries) {
  const router = express.Router()

  router.get('/', (req, res) => {
    const fields = db.prepare(`
      SELECT
        id,
        name,
        description
      FROM fields
      ORDER BY name
    `).all()

    res.json(fields)
  })

  router.get('/:fieldId/wells', (req, res) => {
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
        (well.oilVolumeStb || 0) +
        (well.waterVolumeStb || 0)

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
          ? (well.gasVolumeMscf * 1000) /
            well.oilVolumeStb
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
        oilRateCalendarDays: Math.round(
          oilRateCalendarDays
        ),
        waterCut: Math.round(waterCut),
        gor: Math.round(gor),
        status,
        productionDays: well.productionDays,
        activityStatus,
        idleReason:
          activityStatus === 'Idle'
            ? well.idleReason || 'Unknown'
            : null,
      }
    })

    res.json(calculatedWells)
  })

  router.get('/:fieldId/injectors', (req, res) => {
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
        (well.waterInjectionBbl || 0) +
        (well.gasInjectionMscf || 0)

      const activityStatus =
        totalInjection > 0 && well.injectionDays > 0
          ? 'Active'
          : 'Idle'

      return {
        id: well.id,
        name: well.name,
        injectorType: well.injectorType,
        reservoir: well.reservoirFaultBlocks || '-',

        waterInjectionBbl: Math.round(
          well.waterInjectionBbl || 0
        ),

        gasInjectionMscf: Math.round(
          well.gasInjectionMscf || 0
        ),

        waterInjectionRate:
          well.injectionDays > 0
            ? Math.round(
                (well.waterInjectionBbl || 0) /
                  well.injectionDays
              )
            : 0,

        gasInjectionRate:
          well.injectionDays > 0
            ? Math.round(
                (well.gasInjectionMscf || 0) /
                  well.injectionDays
              )
            : 0,

        waterInjectionCalendarRate:
          calendarDays > 0
            ? Math.round(
                (well.waterInjectionBbl || 0) /
                  calendarDays
              )
            : 0,

        gasInjectionCalendarRate:
          calendarDays > 0
            ? Math.round(
                (well.gasInjectionMscf || 0) /
                  calendarDays
              )
            : 0,

        injectionDays: well.injectionDays || 0,
        activityStatus,

        idleReason:
          activityStatus === 'Idle'
            ? well.idleReason || 'Unknown'
            : null,
      }
    })

    res.json(result)
  })

  router.get('/:fieldId/field-production', (req, res) => {
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
          waterVolumeStb: Math.round(
            row.waterVolumeStb
          ),
          gasVolumeMscf: Math.round(
            row.gasVolumeMscf
          ),
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

  router.get('/:fieldId/field-injection', (req, res) => {
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

  router.get('/:fieldId/compartment-production', (req, res) => {
    try {
      const production =
        productionQueries.getCompartmentProduction(
          req.params.fieldId
        )

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

  router.get('/:fieldId/compartment-injection', (req, res) => {
    try {
      const injection =
        productionQueries.getCompartmentInjection(
          req.params.fieldId
        )

      res.json(injection)
    } catch (error) {
      console.error(
        'Failed to load compartment injection:',
        error
      )

      res.status(500).json({
        error: 'Failed to load compartment injection',
      })
    }
  })

  router.get('/:fieldId/reservoir-summary', (req, res) => {
    const fieldId = req.params.fieldId

    try {
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

          production.oilVolumeStb,
          production.waterVolumeStb,
          production.gasVolumeMscf,

          latestPressure.pressure_psia AS latestPressurePsia,
          latestPressure.survey_date AS latestPressureDate,
          latestPressure.survey_type AS latestPressureType

        FROM reservoirs r

        LEFT JOIN (
          SELECT
            rc.reservoir_id AS reservoirId,

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

          FROM monthly_string_production msp

          JOIN monthly_string_allocation_factors msaf
            ON msaf.string_id = msp.string_id
            AND msaf.production_month = msp.production_month

          JOIN well_strings ws
            ON ws.id = msp.string_id

          JOIN wells w
            ON w.id = ws.well_id
            AND w.well_role = 'Producer'

          JOIN reservoir_compartments rc
            ON rc.id = msaf.reservoir_compartment_id

          GROUP BY rc.reservoir_id
        ) production
          ON production.reservoirId = r.id

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

        ORDER BY r.name
      `).all(fieldId)

      const result = rows.map((row) => {
        const oilVolumeStb = row.oilVolumeStb || 0
        const waterVolumeStb = row.waterVolumeStb || 0
        const gasVolumeMscf = row.gasVolumeMscf || 0

        const liquidVolume = oilVolumeStb + waterVolumeStb

        const waterCut =
          liquidVolume > 0
            ? (waterVolumeStb / liquidVolume) * 100
            : 0

        const gor =
          oilVolumeStb > 0
            ? (gasVolumeMscf * 1000) / oilVolumeStb
            : 0

        const recoveryFactor =
          row.stoiipMmstb > 0
            ? (
                oilVolumeStb /
                1_000_000 /
                row.stoiipMmstb
              ) * 100
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
          recoveryFactor: Number(
            recoveryFactor.toFixed(2)
          ),
          waterCut: Math.round(waterCut),
          gor: Math.round(gor),
        }
      })

      res.json(result)
    } catch (error) {
      console.error(
        'Failed to load reservoir summary:',
        error
      )

      res.status(500).json({
        error: 'Failed to load reservoir summary',
      })
    }
  })

  return router
}

module.exports = createFieldRoutes