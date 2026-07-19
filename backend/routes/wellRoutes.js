const express = require('express')
const { getCalendarDays } = require('../utils/dateUtils')

function createWellRoutes(db) {
  const router = express.Router()

  router.get('/:wellId/history', (req, res) => {
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
      GROUP BY msp.production_month
      ORDER BY msp.production_month
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

  router.get('/:wellId/reservoir-history', (req, res) => {
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
        reservoirFaultBlock:
          `${row.reservoir} - ${row.faultBlock}`,
        month: row.productionMonth,
        oilVolumeStb: Math.round(row.oilVolumeStb),
        waterVolumeStb: Math.round(row.waterVolumeStb),
        gasVolumeMscf: Math.round(row.gasVolumeMscf),
      }))
    )
  })

  return router
}

module.exports = createWellRoutes