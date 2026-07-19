const express = require('express')
const { getCalendarDays } = require('../utils/dateUtils')

function createInjectorRoutes(db) {
  const router = express.Router()

  router.get('/:injectorId/history', (req, res) => {
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
        waterInjectionBbl: Math.round(
          row.waterInjectionBbl || 0
        ),
        gasInjectionMscf: Math.round(
          row.gasInjectionMscf || 0
        ),
        injectionDays: row.injectionDays || 0,
        calendarDays,
        waterInjectionRate: Math.round(
          waterInjectionRate
        ),
        gasInjectionRate: Math.round(
          gasInjectionRate
        ),
        waterInjectionCalendarRate: Math.round(
          waterInjectionCalendarRate
        ),
        gasInjectionCalendarRate: Math.round(
          gasInjectionCalendarRate
        ),
      }
    })

    res.json(history)
  })

  return router
}

module.exports = createInjectorRoutes