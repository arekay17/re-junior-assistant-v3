const express = require('express')
const { getCalendarDays } = require('../utils/dateUtils')

function createReservoirRoutes(db) {
  const router = express.Router()

  router.get('/:reservoirId/history', (req, res) => {
    const reservoirId = req.params.reservoirId

    const rows = db.prepare(`
      SELECT
        msp.production_month AS productionMonth,
        SUM(msp.oil_volume_stb * msaf.allocation_fraction) AS oilVolumeStb,
        SUM(msp.water_volume_stb * msaf.allocation_fraction) AS waterVolumeStb,
        SUM(msp.gas_volume_mscf * msaf.allocation_fraction) AS gasVolumeMscf
      FROM reservoir_compartments rc
      JOIN monthly_string_allocation_factors msaf
        ON msaf.reservoir_compartment_id = rc.id
      JOIN monthly_string_production msp
        ON msp.string_id = msaf.string_id
        AND msp.production_month = msaf.production_month
      WHERE rc.reservoir_id = ?
      GROUP BY msp.production_month
      ORDER BY msp.production_month
    `).all(reservoirId)

    let cumulativeOilStb = 0

    const history = rows.map((row) => {
      const calendarDays = getCalendarDays(row.productionMonth)
      const oilVolumeStb = row.oilVolumeStb || 0
      const waterVolumeStb = row.waterVolumeStb || 0
      const gasVolumeMscf = row.gasVolumeMscf || 0
      const liquidVolumeStb = oilVolumeStb + waterVolumeStb

      const oilRateCalendarDays = calendarDays > 0 ? oilVolumeStb / calendarDays : 0
      const waterCut = liquidVolumeStb > 0 ? (waterVolumeStb / liquidVolumeStb) * 100 : 0
      const gorScfStb = oilVolumeStb > 0 ? (gasVolumeMscf * 1000) / oilVolumeStb : 0

      cumulativeOilStb += oilVolumeStb

      return {
        month: row.productionMonth,
        oilVolumeStb: Math.round(oilVolumeStb),
        waterVolumeStb: Math.round(waterVolumeStb),
        gasVolumeMscf: Math.round(gasVolumeMscf),
        calendarDays,
        oilRateCalendarDays: Math.round(oilRateCalendarDays),
        waterCut: Math.round(waterCut),
        gorScfStb: Math.round(gorScfStb),
        cumulativeOilStb: Math.round(cumulativeOilStb),
      }
    })

    res.json(history)
  })

  router.get('/:reservoirId/compartment-history', (req, res) => {
    const reservoirId = req.params.reservoirId

    const rows = db.prepare(`
      SELECT
        rc.id AS reservoirCompartmentId,
        rc.name AS reservoirFaultBlock,
        r.name AS reservoir,
        fb.name AS faultBlock,
        msp.production_month AS productionMonth,
        SUM(msp.oil_volume_stb * msaf.allocation_fraction) AS oilVolumeStb,
        SUM(msp.water_volume_stb * msaf.allocation_fraction) AS waterVolumeStb,
        SUM(msp.gas_volume_mscf * msaf.allocation_fraction) AS gasVolumeMscf
      FROM reservoir_compartments rc
      JOIN reservoirs r
        ON r.id = rc.reservoir_id
      JOIN fault_blocks fb
        ON fb.id = rc.fault_block_id
      JOIN monthly_string_allocation_factors msaf
        ON msaf.reservoir_compartment_id = rc.id
      JOIN monthly_string_production msp
        ON msp.string_id = msaf.string_id
        AND msp.production_month = msaf.production_month
      WHERE rc.reservoir_id = ?
      GROUP BY rc.id, rc.name, r.name, fb.name, msp.production_month
      ORDER BY rc.name, msp.production_month
    `).all(reservoirId)

    const history = rows.map((row) => ({
      reservoirCompartmentId: row.reservoirCompartmentId,
      reservoir: row.reservoir,
      faultBlock: row.faultBlock,
      reservoirFaultBlock: row.reservoirFaultBlock,
      month: row.productionMonth,
      oilVolumeStb: Math.round(row.oilVolumeStb || 0),
      waterVolumeStb: Math.round(row.waterVolumeStb || 0),
      gasVolumeMscf: Math.round(row.gasVolumeMscf || 0),
    }))

    res.json(history)
  })

  router.get('/:reservoirId/injection-history', (req, res) => {
    const reservoirId = req.params.reservoirId

    const rows = db.prepare(`
      SELECT
        msi.production_month AS productionMonth,
        SUM(msi.water_injection_bbl * msiaf.allocation_fraction) AS waterInjectionBbl,
        SUM(msi.gas_injection_mscf * msiaf.allocation_fraction) AS gasInjectionMscf
      FROM reservoir_compartments rc
      JOIN monthly_string_injection_allocation_factors msiaf
        ON msiaf.reservoir_compartment_id = rc.id
      JOIN monthly_string_injection msi
        ON msi.string_id = msiaf.string_id
        AND msi.production_month = msiaf.production_month
      WHERE rc.reservoir_id = ?
      GROUP BY msi.production_month
      ORDER BY msi.production_month
    `).all(reservoirId)

    let cumulativeWaterInjectionBbl = 0
    let cumulativeGasInjectionMscf = 0

    const history = rows.map((row) => {
      const calendarDays = getCalendarDays(row.productionMonth)
      const waterInjectionBbl = row.waterInjectionBbl || 0
      const gasInjectionMscf = row.gasInjectionMscf || 0

      const waterInjectionRate = calendarDays > 0 ? waterInjectionBbl / calendarDays : 0
      const gasInjectionRate = calendarDays > 0 ? gasInjectionMscf / calendarDays : 0

      cumulativeWaterInjectionBbl += waterInjectionBbl
      cumulativeGasInjectionMscf += gasInjectionMscf

      return {
        month: row.productionMonth,
        waterInjectionBbl: Math.round(waterInjectionBbl),
        gasInjectionMscf: Math.round(gasInjectionMscf),
        calendarDays,
        waterInjectionRate: Math.round(waterInjectionRate),
        gasInjectionRate: Math.round(gasInjectionRate),
        cumulativeWaterInjectionBbl: Math.round(cumulativeWaterInjectionBbl),
        cumulativeGasInjectionMscf: Math.round(cumulativeGasInjectionMscf),
      }
    })

    res.json(history)
  })

  router.get('/:reservoirId/injection-compartment-history', (req, res) => {
    const reservoirId = req.params.reservoirId

    const rows = db.prepare(`
      SELECT
        rc.id AS reservoirCompartmentId,
        rc.name AS reservoirFaultBlock,
        r.name AS reservoir,
        fb.name AS faultBlock,
        msi.production_month AS productionMonth,
        SUM(msi.water_injection_bbl * msiaf.allocation_fraction) AS waterInjectionBbl,
        SUM(msi.gas_injection_mscf * msiaf.allocation_fraction) AS gasInjectionMscf
      FROM reservoir_compartments rc
      JOIN reservoirs r
        ON r.id = rc.reservoir_id
      JOIN fault_blocks fb
        ON fb.id = rc.fault_block_id
      JOIN monthly_string_injection_allocation_factors msiaf
        ON msiaf.reservoir_compartment_id = rc.id
      JOIN monthly_string_injection msi
        ON msi.string_id = msiaf.string_id
        AND msi.production_month = msiaf.production_month
      WHERE rc.reservoir_id = ?
      GROUP BY rc.id, rc.name, r.name, fb.name, msi.production_month
      ORDER BY rc.name, msi.production_month
    `).all(reservoirId)

    const history = rows.map((row) => ({
      reservoirCompartmentId: row.reservoirCompartmentId,
      reservoir: row.reservoir,
      faultBlock: row.faultBlock,
      reservoirFaultBlock: row.reservoirFaultBlock,
      month: row.productionMonth,
      waterInjectionBbl: Math.round(row.waterInjectionBbl || 0),
      gasInjectionMscf: Math.round(row.gasInjectionMscf || 0),
    }))

    res.json(history)
  })

  return router
}

module.exports = createReservoirRoutes