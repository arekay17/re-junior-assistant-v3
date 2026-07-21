function seedDatabase(db) {
  // =========================================================
  // Fields
  // =========================================================

  db.addField('tapis', 'Tapis', 'Mature oil field surveillance dashboard')
  db.addField('irong-barat', 'Irong Barat', 'Well and reservoir performance review')
  db.addField('semangkok', 'Semangkok', 'Production and pressure monitoring')

  // =========================================================
  // Wells: Tapis
  // =========================================================

  db.addWell('tapis', 'TP-01', 'Producer', null)
  db.addWell('tapis', 'TP-02', 'Producer', null)
  db.addWell('tapis', 'TP-03', 'Producer', null)
  db.addWell('tapis', 'TWI-01', 'Injector', 'Water')
  db.addWell('tapis', 'TGI-01', 'Injector', 'Gas')
  db.addWell('tapis', 'TWAG-01', 'Injector', 'WAG')

  // =========================================================
  // Wells: Irong Barat
  // =========================================================

  db.addWell('irong-barat', 'IB-01', 'Producer', null)
  db.addWell('irong-barat', 'IB-02', 'Producer', null)
  db.addWell('irong-barat', 'IB-03', 'Producer', null)
  db.addWell('irong-barat', 'IBWI-01', 'Injector', 'Water')

  // =========================================================
  // Wells: Semangkok
  // =========================================================

  db.addWell('semangkok', 'SMK-01', 'Producer', null)
  db.addWell('semangkok', 'SMK-02', 'Producer', null)
  db.addWell('semangkok', 'SMK-03', 'Producer', null)
  db.addWell('semangkok', 'SMKGI-01', 'Injector', 'Gas')

  // =========================================================
  // Reservoirs: Tapis
  // =========================================================

  db.addReservoir('tapis', 'E34', 52, 18, 0.18, 3120, 'WAG support', 'Oil', 185)
  db.addReservoir('tapis', 'E40A', 43, 12, 0.1, 3050, 'Gas cap expansion', 'Oil', 180)
  db.addReservoir('tapis', 'E22B', 27, 9, 0.05, 2980, 'Water injection support', 'Oil', 176)

  // =========================================================
  // Reservoirs: Irong Barat
  // =========================================================

  db.addReservoir('irong-barat', 'R1', 35, 5, 0.02, 2850, 'Natural depletion', 'Oil', 170)
  db.addReservoir('irong-barat', 'R2', 42, 7, 0.04, 2920, 'Water drive', 'Oil', 174)
  db.addReservoir('irong-barat', 'R3', 31, 4, 0.01, 2880, 'Natural depletion', 'Oil', 172)

  // =========================================================
  // Reservoirs: Semangkok
  // =========================================================

  db.addReservoir('semangkok', 'E12', 29, 6, 0.03, 2760, 'Water drive', 'Oil', 168)
  db.addReservoir('semangkok', 'E20', 38, 11, 0.12, 3010, 'Gas cap expansion', 'Oil', 182)
  db.addReservoir('semangkok', 'E25', 24, 3, 0.02, 2680, 'Natural depletion', 'Oil', 165)

  // =========================================================
  // Fault blocks: Tapis
  // =========================================================

  db.addFaultBlock('tapis', 'FB-A')
  db.addFaultBlock('tapis', 'FB-B')
  db.addFaultBlock('tapis', 'FB-C')

  // =========================================================
  // Fault blocks: Irong Barat
  // =========================================================

  db.addFaultBlock('irong-barat', 'FB-1')
  db.addFaultBlock('irong-barat', 'FB-2')

  // =========================================================
  // Fault blocks: Semangkok
  // =========================================================

  db.addFaultBlock('semangkok', 'FB-North')
  db.addFaultBlock('semangkok', 'FB-South')

  // =========================================================
  // Reservoir compartments: Tapis
  // =========================================================

  db.addReservoirCompartment('E34', 'FB-A', 'E34 / FB-A', 30, 10, 0.12, 3120, 'WAG support', 'Oil', 185)
  db.addReservoirCompartment('E34', 'FB-B', 'E34 / FB-B', 22, 8, 0.06, 3090, 'Water injection support', 'Oil', 183)
  db.addReservoirCompartment('E40A', 'FB-C', 'E40A / FB-C', 43, 12, 0.1, 3050, 'Gas cap expansion', 'Oil', 180)
  db.addReservoirCompartment('E22B', 'FB-B', 'E22B / FB-B', 15, 5, 0.03, 2980, 'Natural depletion', 'Oil', 176)
  db.addReservoirCompartment('E22B', 'FB-C', 'E22B / FB-C', 12, 4, 0.02, 2960, 'Water injection support', 'Oil', 175)

  // =========================================================
  // Reservoir compartments: Irong Barat
  // =========================================================

  db.addReservoirCompartment('R1', 'FB-1', 'R1 / FB-1', 35, 5, 0.02, 2850, 'Natural depletion', 'Oil', 170)
  db.addReservoirCompartment('R2', 'FB-1', 'R2 / FB-1', 24, 4, 0.02, 2920, 'Water drive', 'Oil', 174)
  db.addReservoirCompartment('R2', 'FB-2', 'R2 / FB-2', 18, 3, 0.02, 2900, 'Water drive', 'Oil', 173)
  db.addReservoirCompartment('R3', 'FB-2', 'R3 / FB-2', 31, 4, 0.01, 2880, 'Natural depletion', 'Oil', 172)

  // =========================================================
  // Reservoir compartments: Semangkok
  // =========================================================

  db.addReservoirCompartment('E12', 'FB-North', 'E12 / FB-North', 29, 6, 0.03, 2760, 'Water drive', 'Oil', 168)
  db.addReservoirCompartment('E20', 'FB-North', 'E20 / FB-North', 38, 11, 0.12, 3010, 'Gas cap expansion', 'Oil', 182)
  db.addReservoirCompartment('E25', 'FB-South', 'E25 / FB-South', 24, 3, 0.02, 2680, 'Natural depletion', 'Oil', 165)

  // =========================================================
  // Reservoir pressure surveys: Tapis
  // =========================================================

  db.addPressureSurvey('E34', 'TP-01', '2019-01-15', 3115, 'PBU', 'Baseline pressure')
  db.addPressureSurvey('E34', 'TP-02', '2021-06-10', 3045, 'SGS', 'Static gradient survey')
  db.addPressureSurvey('E34', 'TP-01', '2023-09-18', 2998, 'PBU', 'Post WAG review')
  db.addPressureSurvey('E34', 'TP-03', '2026-03-20', 2955, 'RFT', 'Latest surveillance point')

  db.addPressureSurvey('E40A', 'TP-01', '2019-02-12', 3048, 'PBU', 'Baseline pressure')
  db.addPressureSurvey('E40A', 'TP-01', '2021-08-22', 2995, 'SGS', 'Gradient survey')
  db.addPressureSurvey('E40A', 'TP-02', '2024-01-11', 2920, 'PBU', 'Decline monitoring')
  db.addPressureSurvey('E40A', 'TP-01', '2026-03-15', 2875, 'RFT', 'Latest pressure point')

  db.addPressureSurvey('E22B', 'TP-02', '2019-03-05', 2975, 'PBU', 'Baseline pressure')
  db.addPressureSurvey('E22B', 'TP-03', '2021-04-18', 2910, 'SGS', 'Static survey')
  db.addPressureSurvey('E22B', 'TP-02', '2023-11-09', 2865, 'PBU', 'Surveillance update')
  db.addPressureSurvey('E22B', 'TP-03', '2026-02-28', 2810, 'RFT', 'Latest pressure point')

  // =========================================================
  // Well strings: Tapis
  // =========================================================

  db.addWellString('TP-01', 'TP-01L', 'Long String')
  db.addWellString('TP-01', 'TP-01S', 'Short String')
  db.addWellString('TP-02', 'TP-02L', 'Long String')
  db.addWellString('TP-02', 'TP-02S', 'Short String')
  db.addWellString('TP-03', 'TP-03L', 'Long String')
  db.addWellString('TWI-01', 'TWI-01S', 'Water Injection String')
  db.addWellString('TGI-01', 'TGI-01S', 'Gas Injection String')
  db.addWellString('TWAG-01', 'TWAG-01S', 'WAG Injection String')

  // =========================================================
  // Well strings: Irong Barat
  // =========================================================

  db.addWellString('IB-01', 'IB-01L', 'Long String')
  db.addWellString('IB-01', 'IB-01S', 'Short String')
  db.addWellString('IB-02', 'IB-02S', 'Production String')
  db.addWellString('IB-03', 'IB-03S', 'Production String')
  db.addWellString('IBWI-01', 'IBWI-01S', 'Water Injection String')

  // =========================================================
  // Well strings: Semangkok
  // =========================================================

  db.addWellString('SMK-01', 'SMK-01S', 'Production String')
  db.addWellString('SMK-02', 'SMK-02S', 'Production String')
  db.addWellString('SMK-03', 'SMK-03S', 'Production String')
  db.addWellString('SMKGI-01', 'SMKGI-01S', 'Gas Injection String')

  // =========================================================
  // Monthly string production: Tapis
  // =========================================================

  db.addStringProduction('TP-01L', '2026-01', 15000, 3000, 11000, 25)
  db.addStringProduction('TP-01L', '2026-02', 14250, 3300, 11550, 24)
  db.addStringProduction('TP-01L', '2026-03', 13500, 3750, 12100, 26)

  db.addStringProduction('TP-01S', '2026-01', 10000, 2000, 7000, 25)
  db.addStringProduction('TP-01S', '2026-02', 9500, 2200, 7350, 24)
  db.addStringProduction('TP-01S', '2026-03', 9000, 2500, 7700, 26)

  db.addStringProduction('TP-02L', '2026-01', 4000, 5000, 2500, 22)
  db.addStringProduction('TP-02L', '2026-02', 3800, 5500, 2625, 21)
  db.addStringProduction('TP-02L', '2026-03', 3600, 6250, 2750, 23)

  db.addStringProduction('TP-02S', '2026-01', 8000, 9000, 5000, 22)
  db.addStringProduction('TP-02S', '2026-02', 7600, 9900, 5250, 21)
  db.addStringProduction('TP-02S', '2026-03', 7200, 11250, 5500, 23)

  db.addStringProduction('TP-03L', '2026-01', 7000, 1200, 15000, 24)
  db.addStringProduction('TP-03L', '2026-02', 6650, 1320, 15750, 23)
  db.addStringProduction('TP-03L', '2026-03', 0, 0, 0, 0, 'Mechanical issue')

  // =========================================================
  // Monthly string production: Irong Barat
  // =========================================================

  db.addStringProduction('IB-01L', '2026-01', 12000, 4000, 9000, 26)
  db.addStringProduction('IB-01L', '2026-02', 11400, 4400, 9450, 25)
  db.addStringProduction('IB-01L', '2026-03', 10800, 5000, 9900, 27)

  db.addStringProduction('IB-01S', '2026-01', 6000, 2500, 4500, 26)
  db.addStringProduction('IB-01S', '2026-02', 5700, 2750, 4725, 25)
  db.addStringProduction('IB-01S', '2026-03', 5400, 3125, 4950, 27)

  db.addStringProduction('IB-02S', '2026-01', 7000, 10000, 6000, 23)
  db.addStringProduction('IB-02S', '2026-02', 6650, 11000, 6300, 22)
  db.addStringProduction('IB-02S', '2026-03', 6300, 12500, 6600, 24)

  db.addStringProduction('IB-03S', '2026-01', 14000, 3000, 12000, 27)
  db.addStringProduction('IB-03S', '2026-02', 13300, 3300, 12600, 26)
  db.addStringProduction('IB-03S', '2026-03', 12600, 3750, 13200, 28)

  // =========================================================
  // Monthly string production: Semangkok
  // =========================================================

  db.addStringProduction('SMK-01S', '2026-01', 9000, 3500, 8000, 25)
  db.addStringProduction('SMK-01S', '2026-02', 8550, 3850, 8400, 24)
  db.addStringProduction('SMK-01S', '2026-03', 8100, 4375, 8800, 26)

  db.addStringProduction('SMK-02S', '2026-01', 6000, 800, 14000, 24)
  db.addStringProduction('SMK-02S', '2026-02', 5700, 880, 14700, 23)
  db.addStringProduction('SMK-02S', '2026-03', 5400, 1000, 15400, 25)

  db.addStringProduction('SMK-03S', '2026-01', 5000, 12000, 4000, 21)
  db.addStringProduction('SMK-03S', '2026-02', 4750, 13200, 4200, 20)
  db.addStringProduction('SMK-03S', '2026-03', 4500, 15000, 4400, 22)

  // =========================================================
  // Monthly string injection
  // =========================================================

  db.addStringInjection('TWI-01S', '2026-01', 300000, 0, 28)
  db.addStringInjection('TWI-01S', '2026-02', 285000, 0, 27)
  db.addStringInjection('TWI-01S', '2026-03', 330000, 0, 29)

  db.addStringInjection('TGI-01S', '2026-01', 0, 150000, 27)
  db.addStringInjection('TGI-01S', '2026-02', 0, 157500, 26)
  db.addStringInjection('TGI-01S', '2026-03', 0, 142500, 28)

  db.addStringInjection('TWAG-01S', '2026-01', 180000, 90000, 26)
  db.addStringInjection('TWAG-01S', '2026-02', 171000, 94500, 25)
  db.addStringInjection('TWAG-01S', '2026-03', 198000, 85500, 27)

  db.addStringInjection('IBWI-01S', '2026-01', 220000, 0, 27)
  db.addStringInjection('IBWI-01S', '2026-02', 209000, 0, 26)
  db.addStringInjection('IBWI-01S', '2026-03', 242000, 0, 28)

  db.addStringInjection('SMKGI-01S', '2026-01', 0, 120000, 25)
  db.addStringInjection('SMKGI-01S', '2026-02', 0, 126000, 24)
  db.addStringInjection('SMKGI-01S', '2026-03', 0, 114000, 26)

  // =========================================================
  // Production allocation factors: Tapis
  // =========================================================

  db.addStringAllocationFactor('TP-01L', 'E40A / FB-C', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-01L', 'E40A / FB-C', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-01L', 'E40A / FB-C', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringAllocationFactor('TP-01S', 'E34 / FB-A', '2026-01', 0.6, 'PLT', 'January PLT interpretation')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-B', '2026-01', 0.4, 'PLT', 'January PLT interpretation')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-A', '2026-02', 0.55, 'Engineering Estimate', 'Updated allocation after performance review')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-B', '2026-02', 0.45, 'Engineering Estimate', 'Updated allocation after performance review')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-A', '2026-03', 0.5, 'PLT', 'March PLT interpretation')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-B', '2026-03', 0.5, 'PLT', 'March PLT interpretation')

  db.addStringAllocationFactor('TP-02L', 'E22B / FB-C', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-02L', 'E22B / FB-C', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-02L', 'E22B / FB-C', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringAllocationFactor('TP-02S', 'E34 / FB-A', '2026-01', 0.625, 'PLT', 'January PLT interpretation')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-B', '2026-01', 0.375, 'PLT', 'January PLT interpretation')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-A', '2026-02', 0.6, 'Engineering Estimate', 'February allocation review')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-B', '2026-02', 0.4, 'Engineering Estimate', 'February allocation review')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-A', '2026-03', 0.58, 'PLT', 'March PLT interpretation')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-B', '2026-03', 0.42, 'PLT', 'March PLT interpretation')

  db.addStringAllocationFactor('TP-03L', 'E22B / FB-B', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-03L', 'E22B / FB-B', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-03L', 'E22B / FB-B', '2026-03', 1, 'Completion', 'Well idle due to mechanical issue')

  // =========================================================
  // Production allocation factors: Irong Barat
  // =========================================================

  db.addStringAllocationFactor('IB-01L', 'R1 / FB-1', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-01L', 'R1 / FB-1', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-01L', 'R1 / FB-1', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringAllocationFactor('IB-01S', 'R2 / FB-2', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-01S', 'R2 / FB-2', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-01S', 'R2 / FB-2', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringAllocationFactor('IB-02S', 'R2 / FB-1', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-02S', 'R2 / FB-1', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-02S', 'R2 / FB-1', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringAllocationFactor('IB-03S', 'R3 / FB-2', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-03S', 'R3 / FB-2', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('IB-03S', 'R3 / FB-2', '2026-03', 1, 'Completion', 'Single completed compartment')

  // =========================================================
  // Production allocation factors: Semangkok
  // =========================================================

  db.addStringAllocationFactor('SMK-01S', 'E12 / FB-North', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('SMK-01S', 'E12 / FB-North', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('SMK-01S', 'E12 / FB-North', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringAllocationFactor('SMK-02S', 'E20 / FB-North', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('SMK-02S', 'E20 / FB-North', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('SMK-02S', 'E20 / FB-North', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringAllocationFactor('SMK-03S', 'E25 / FB-South', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('SMK-03S', 'E25 / FB-South', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('SMK-03S', 'E25 / FB-South', '2026-03', 1, 'Completion', 'Single completed compartment')

  // =========================================================
  // Injection allocation factors
  // =========================================================

  db.addStringInjectionAllocationFactor('TWI-01S', 'E34 / FB-A', '2026-01', 0.6, 'ILT', 'January injection logging interpretation')
  db.addStringInjectionAllocationFactor('TWI-01S', 'E34 / FB-B', '2026-01', 0.4, 'ILT', 'January injection logging interpretation')
  db.addStringInjectionAllocationFactor('TWI-01S', 'E34 / FB-A', '2026-02', 0.55, 'Engineering Estimate', 'Updated injection allocation')
  db.addStringInjectionAllocationFactor('TWI-01S', 'E34 / FB-B', '2026-02', 0.45, 'Engineering Estimate', 'Updated injection allocation')
  db.addStringInjectionAllocationFactor('TWI-01S', 'E34 / FB-A', '2026-03', 0.5, 'ILT', 'March injection logging interpretation')
  db.addStringInjectionAllocationFactor('TWI-01S', 'E34 / FB-B', '2026-03', 0.5, 'ILT', 'March injection logging interpretation')

  db.addStringInjectionAllocationFactor('TGI-01S', 'E40A / FB-C', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('TGI-01S', 'E40A / FB-C', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('TGI-01S', 'E40A / FB-C', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringInjectionAllocationFactor('TWAG-01S', 'E22B / FB-C', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('TWAG-01S', 'E22B / FB-C', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('TWAG-01S', 'E22B / FB-C', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringInjectionAllocationFactor('IBWI-01S', 'R2 / FB-1', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('IBWI-01S', 'R2 / FB-1', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('IBWI-01S', 'R2 / FB-1', '2026-03', 1, 'Completion', 'Single completed compartment')

  db.addStringInjectionAllocationFactor('SMKGI-01S', 'E20 / FB-North', '2026-01', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('SMKGI-01S', 'E20 / FB-North', '2026-02', 1, 'Completion', 'Single completed compartment')
  db.addStringInjectionAllocationFactor('SMKGI-01S', 'E20 / FB-North', '2026-03', 1, 'Completion', 'Single completed compartment')
}

module.exports = {
  seedDatabase,
}