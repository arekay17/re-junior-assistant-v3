function createProductionQueries(db) {
  const getCompartmentProductionStatement = db.prepare(`
    SELECT
      r.field_id AS fieldId,
      r.name AS reservoirName,
      fb.name AS faultBlockName,
      rc.id AS compartmentId,
      rc.name AS compartmentName,
      msp.production_month AS productionMonth,

      ROUND(
        SUM(msp.oil_volume_stb * msaf.allocation_fraction),
        2
      ) AS oilVolumeStb,

      ROUND(
        SUM(msp.water_volume_stb * msaf.allocation_fraction),
        2
      ) AS waterVolumeStb,

      ROUND(
        SUM(msp.gas_volume_mscf * msaf.allocation_fraction),
        2
      ) AS gasVolumeMscf

    FROM monthly_string_production msp

    JOIN monthly_string_allocation_factors msaf
      ON msaf.string_id = msp.string_id
      AND msaf.production_month = msp.production_month

    JOIN reservoir_compartments rc
      ON rc.id = msaf.reservoir_compartment_id

    JOIN reservoirs r
      ON r.id = rc.reservoir_id

    JOIN fault_blocks fb
      ON fb.id = rc.fault_block_id

    WHERE r.field_id = ?

    GROUP BY
      r.field_id,
      r.name,
      fb.name,
      rc.id,
      rc.name,
      msp.production_month

    ORDER BY
      msp.production_month,
      r.name,
      fb.name
  `)

  const getCompartmentInjectionStatement = db.prepare(`
    SELECT
      r.field_id AS fieldId,
      r.name AS reservoirName,
      fb.name AS faultBlockName,
      rc.id AS compartmentId,
      rc.name AS compartmentName,
      msi.production_month AS productionMonth,

      ROUND(
        SUM(
          msi.water_injection_bbl *
          msiaf.allocation_fraction
        ),
        2
      ) AS waterInjectionBbl,

      ROUND(
        SUM(
          msi.gas_injection_mscf *
          msiaf.allocation_fraction
        ),
        2
      ) AS gasInjectionMscf

    FROM monthly_string_injection msi

    JOIN monthly_string_injection_allocation_factors msiaf
      ON msiaf.string_id = msi.string_id
      AND msiaf.production_month = msi.production_month

    JOIN reservoir_compartments rc
      ON rc.id = msiaf.reservoir_compartment_id

    JOIN reservoirs r
      ON r.id = rc.reservoir_id

    JOIN fault_blocks fb
      ON fb.id = rc.fault_block_id

    WHERE r.field_id = ?

    GROUP BY
      r.field_id,
      r.name,
      fb.name,
      rc.id,
      rc.name,
      msi.production_month

    ORDER BY
      msi.production_month,
      r.name,
      fb.name
  `)

  function getCompartmentProduction(fieldId) {
    return getCompartmentProductionStatement.all(fieldId)
  }

  function getCompartmentInjection(fieldId) {
    return getCompartmentInjectionStatement.all(fieldId)
  }

  function getFieldProduction(fieldId) {
    const compartmentRows = getCompartmentProduction(fieldId)

    const productionByMonth = {}

    for (const row of compartmentRows) {
      const month = row.productionMonth

      if (!productionByMonth[month]) {
        productionByMonth[month] = {
          productionMonth: month,
          oilVolumeStb: 0,
          waterVolumeStb: 0,
          gasVolumeMscf: 0,
        }
      }

      productionByMonth[month].oilVolumeStb += row.oilVolumeStb
      productionByMonth[month].waterVolumeStb += row.waterVolumeStb
      productionByMonth[month].gasVolumeMscf += row.gasVolumeMscf
    }

    return Object.values(productionByMonth).map((row) => ({
      ...row,
      oilVolumeStb: Number(row.oilVolumeStb.toFixed(2)),
      waterVolumeStb: Number(row.waterVolumeStb.toFixed(2)),
      gasVolumeMscf: Number(row.gasVolumeMscf.toFixed(2)),
    }))
  }

  function getFieldInjection(fieldId) {
    const compartmentRows = getCompartmentInjection(fieldId)

    const injectionByMonth = {}

    for (const row of compartmentRows) {
      const month = row.productionMonth

      if (!injectionByMonth[month]) {
        injectionByMonth[month] = {
          productionMonth: month,
          waterInjectionBbl: 0,
          gasInjectionMscf: 0,
        }
      }

      injectionByMonth[month].waterInjectionBbl +=
        row.waterInjectionBbl

      injectionByMonth[month].gasInjectionMscf +=
        row.gasInjectionMscf
    }

    return Object.values(injectionByMonth).map((row) => ({
      ...row,
      waterInjectionBbl: Number(
        row.waterInjectionBbl.toFixed(2)
      ),
      gasInjectionMscf: Number(
        row.gasInjectionMscf.toFixed(2)
      ),
    }))
  }

  return {
    getCompartmentProduction,
    getFieldProduction,
    getCompartmentInjection,
    getFieldInjection,
  }
}

module.exports = {
  createProductionQueries,
}