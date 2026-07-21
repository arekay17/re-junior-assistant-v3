function createDbHelpers(db) {
  // =========================================================
  // Prepared statements: master data
  // =========================================================

  const insertField = db.prepare(`
    INSERT INTO fields (
      id,
      name,
      description
    )
    VALUES (?, ?, ?)
  `)

  const insertWell = db.prepare(`
    INSERT INTO wells (
      field_id,
      name,
      well_role,
      injector_type
    )
    VALUES (?, ?, ?, ?)
  `)

  const insertReservoir = db.prepare(`
    INSERT INTO reservoirs (
      field_id,
      name,
      stoiip_mmstb,
      giip_bscf,
      gas_cap_m,
      initial_pressure_psia,
      drive_mechanism,
      fluid_type,
      temperature_f
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertFaultBlock = db.prepare(`
    INSERT INTO fault_blocks (
      field_id,
      name
    )
    VALUES (?, ?)
  `)

  // =========================================================
  // Prepared statements: well monthly status
  // =========================================================

  const insertWellMonthlyStatus = db.prepare(`
    INSERT OR REPLACE INTO well_monthly_status (
      well_id,
      production_month,
      production_days,
      idle_reason
    )
    VALUES (?, ?, ?, ?)
  `)

  // =========================================================
  // Prepared statements: reservoir pressure
  // =========================================================

  const insertPressureSurvey = db.prepare(`
    INSERT INTO reservoir_pressure_surveys (
      reservoir_id,
      well_id,
      survey_date,
      pressure_psia,
      survey_type,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  // =========================================================
  // Prepared statements: string-level model
  // =========================================================

  const insertWellString = db.prepare(`
    INSERT INTO well_strings (
      well_id,
      name,
      string_type
    )
    VALUES (?, ?, ?)
  `)

  const insertReservoirCompartment = db.prepare(`
    INSERT INTO reservoir_compartments (
      reservoir_id,
      fault_block_id,
      name,
      stoiip_mmstb,
      giip_bscf,
      gas_cap_m,
      initial_pressure_psia,
      drive_mechanism,
      fluid_type,
      temperature_f
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertStringProduction = db.prepare(`
    INSERT INTO monthly_string_production (
      string_id,
      production_month,
      oil_volume_stb,
      water_volume_stb,
      gas_volume_mscf,
      production_days,
      idle_reason
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const insertStringInjection = db.prepare(`
    INSERT INTO monthly_string_injection (
      string_id,
      production_month,
      water_injection_bbl,
      gas_injection_mscf,
      injection_days,
      idle_reason
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const insertStringAllocationFactor = db.prepare(`
    INSERT INTO monthly_string_allocation_factors (
      string_id,
      reservoir_compartment_id,
      production_month,
      allocation_fraction,
      allocation_source,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const insertStringInjectionAllocationFactor = db.prepare(`
    INSERT INTO monthly_string_injection_allocation_factors (
      string_id,
      reservoir_compartment_id,
      production_month,
      allocation_fraction,
      allocation_source,
      remarks
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  // =========================================================
  // Lookup statements
  // =========================================================

  const getWell = db.prepare(`
    SELECT id
    FROM wells
    WHERE name = ?
  `)

  const getReservoir = db.prepare(`
    SELECT id
    FROM reservoirs
    WHERE name = ?
  `)

  const getFaultBlock = db.prepare(`
    SELECT id
    FROM fault_blocks
    WHERE name = ?
  `)

  const getWellString = db.prepare(`
    SELECT id
    FROM well_strings
    WHERE name = ?
  `)

  const getReservoirCompartment = db.prepare(`
    SELECT id
    FROM reservoir_compartments
    WHERE name = ?
  `)

  // =========================================================
  // Master data helpers
  // =========================================================

  function addField(fieldId, fieldName, description = null) {
    insertField.run(fieldId, fieldName, description)
  }

  function addWell(
    fieldId,
    wellName,
    wellRole,
    injectorType = null
  ) {
    insertWell.run(
      fieldId,
      wellName,
      wellRole,
      injectorType
    )
  }

  function addReservoir(
    fieldId,
    reservoirName,
    stoiipMmstb,
    giipBscf,
    gasCapM,
    initialPressurePsia,
    driveMechanism,
    fluidType,
    temperatureF
  ) {
    insertReservoir.run(
      fieldId,
      reservoirName,
      stoiipMmstb,
      giipBscf,
      gasCapM,
      initialPressurePsia,
      driveMechanism,
      fluidType,
      temperatureF
    )
  }

  function addFaultBlock(fieldId, faultBlockName) {
    insertFaultBlock.run(
      fieldId,
      faultBlockName
    )
  }

  // =========================================================
  // Well monthly status helper
  // =========================================================

  function addWellMonthlyStatus(
    wellName,
    month,
    productionDays,
    idleReason = null
  ) {
    const well = getWell.get(wellName)

    insertWellMonthlyStatus.run(
      well.id,
      month,
      productionDays,
      idleReason
    )
  }

  // =========================================================
  // Pressure survey helper
  // =========================================================

  function addPressureSurvey(
    reservoirName,
    wellName,
    surveyDate,
    pressurePsia,
    surveyType,
    remarks = null
  ) {
    const reservoir = getReservoir.get(reservoirName)
    const well = getWell.get(wellName)

    insertPressureSurvey.run(
      reservoir.id,
      well.id,
      surveyDate,
      pressurePsia,
      surveyType,
      remarks
    )
  }

  // =========================================================
  // Well string helper
  // =========================================================

  function addWellString(
    wellName,
    stringName,
    stringType
  ) {
    const well = getWell.get(wellName)

    insertWellString.run(
      well.id,
      stringName,
      stringType
    )
  }

  // =========================================================
  // Reservoir compartment helper
  // =========================================================

  function addReservoirCompartment(
    reservoirName,
    faultBlockName,
    compartmentName,
    stoiipMmstb,
    giipBscf,
    gasCapM,
    initialPressurePsia,
    driveMechanism,
    fluidType,
    temperatureF
  ) {
    const reservoir = getReservoir.get(reservoirName)
    const faultBlock = getFaultBlock.get(faultBlockName)

    insertReservoirCompartment.run(
      reservoir.id,
      faultBlock.id,
      compartmentName,
      stoiipMmstb,
      giipBscf,
      gasCapM,
      initialPressurePsia,
      driveMechanism,
      fluidType,
      temperatureF
    )
  }

  // =========================================================
  // String production helper
  // =========================================================

  function addStringProduction(
    stringName,
    month,
    oilVolumeStb,
    waterVolumeStb,
    gasVolumeMscf,
    productionDays,
    idleReason = null
  ) {
    const wellString = getWellString.get(stringName)

    insertStringProduction.run(
      wellString.id,
      month,
      oilVolumeStb,
      waterVolumeStb,
      gasVolumeMscf,
      productionDays,
      idleReason
    )
  }

  // =========================================================
  // String injection helper
  // =========================================================

  function addStringInjection(
    stringName,
    month,
    waterInjectionBbl,
    gasInjectionMscf,
    injectionDays,
    idleReason = null
  ) {
    const wellString = getWellString.get(stringName)

    insertStringInjection.run(
      wellString.id,
      month,
      waterInjectionBbl,
      gasInjectionMscf,
      injectionDays,
      idleReason
    )
  }

  // =========================================================
  // String allocation factor helper
  // =========================================================

  function addStringAllocationFactor(
    stringName,
    compartmentName,
    month,
    allocationFraction,
    allocationSource,
    remarks = null
  ) {
    const wellString = getWellString.get(stringName)
    const compartment =
      getReservoirCompartment.get(compartmentName)

    insertStringAllocationFactor.run(
      wellString.id,
      compartment.id,
      month,
      allocationFraction,
      allocationSource,
      remarks
    )
  }

  // =========================================================
  // String injection allocation factor helper
  // =========================================================

  function addStringInjectionAllocationFactor(
    stringName,
    compartmentName,
    month,
    allocationFraction,
    allocationSource,
    remarks = null
  ) {
    const wellString = getWellString.get(stringName)
    const compartment =
      getReservoirCompartment.get(compartmentName)

    insertStringInjectionAllocationFactor.run(
      wellString.id,
      compartment.id,
      month,
      allocationFraction,
      allocationSource,
      remarks
    )
  }

  // =========================================================
  // Public helpers
  // =========================================================

  return {
    addField,
    addWell,
    addReservoir,
    addFaultBlock,
    addWellMonthlyStatus,
    addPressureSurvey,
    addWellString,
    addReservoirCompartment,
    addStringProduction,
    addStringInjection,
    addStringAllocationFactor,
    addStringInjectionAllocationFactor,
  }
}

module.exports = {
  createDbHelpers,
}