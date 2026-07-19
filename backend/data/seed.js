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
  // Producer allocations: Tapis
  // Temporary well-level allocation model
  // =========================================================

  db.addAllocation('TP-01', 'E34', 'FB-A', '2026-01', 6000, 1200, 4000, 25)
  db.addAllocation('TP-01', 'E34', 'FB-A', '2026-02', 5700, 1320, 4200, 24)
  db.addAllocation('TP-01', 'E34', 'FB-A', '2026-03', 5400, 1500, 4400, 26)

  db.addAllocation('TP-01', 'E34', 'FB-B', '2026-01', 4000, 800, 3000, 25)
  db.addAllocation('TP-01', 'E34', 'FB-B', '2026-02', 3800, 880, 3150, 24)
  db.addAllocation('TP-01', 'E34', 'FB-B', '2026-03', 3600, 1000, 3300, 26)

  db.addAllocation('TP-01', 'E40A', 'FB-C', '2026-01', 15000, 3000, 11000, 25)
  db.addAllocation('TP-01', 'E40A', 'FB-C', '2026-02', 14250, 3300, 11550, 24)
  db.addAllocation('TP-01', 'E40A', 'FB-C', '2026-03', 13500, 3750, 12100, 26)

  db.addAllocation('TP-02', 'E34', 'FB-A', '2026-01', 5000, 6000, 3000, 22)
  db.addAllocation('TP-02', 'E34', 'FB-A', '2026-02', 4750, 6600, 3150, 21)
  db.addAllocation('TP-02', 'E34', 'FB-A', '2026-03', 4500, 7500, 3300, 23)

  db.addAllocation('TP-02', 'E34', 'FB-B', '2026-01', 3000, 3000, 2000, 22)
  db.addAllocation('TP-02', 'E34', 'FB-B', '2026-02', 2850, 3300, 2100, 21)
  db.addAllocation('TP-02', 'E34', 'FB-B', '2026-03', 2700, 3750, 2200, 23)

  db.addAllocation('TP-02', 'E22B', 'FB-C', '2026-01', 4000, 5000, 2500, 22)
  db.addAllocation('TP-02', 'E22B', 'FB-C', '2026-02', 3800, 5500, 2625, 21)
  db.addAllocation('TP-02', 'E22B', 'FB-C', '2026-03', 3600, 6250, 2750, 23)

  db.addAllocation('TP-03', 'E22B', 'FB-B', '2026-01', 7000, 1200, 15000, 24)
  db.addAllocation('TP-03', 'E22B', 'FB-B', '2026-02', 6650, 1320, 15750, 23)
  db.addAllocation('TP-03', 'E22B', 'FB-B', '2026-03', 0, 0, 0, 0, 'Mechanical issue')

  // =========================================================
  // Producer allocations: Irong Barat
  // =========================================================

  db.addAllocation('IB-01', 'R1', 'FB-1', '2026-01', 12000, 4000, 9000, 26)
  db.addAllocation('IB-01', 'R1', 'FB-1', '2026-02', 11400, 4400, 9450, 25)
  db.addAllocation('IB-01', 'R1', 'FB-1', '2026-03', 10800, 5000, 9900, 27)

  db.addAllocation('IB-01', 'R2', 'FB-2', '2026-01', 6000, 2500, 4500, 26)
  db.addAllocation('IB-01', 'R2', 'FB-2', '2026-02', 5700, 2750, 4725, 25)
  db.addAllocation('IB-01', 'R2', 'FB-2', '2026-03', 5400, 3125, 4950, 27)

  db.addAllocation('IB-02', 'R2', 'FB-1', '2026-01', 7000, 10000, 6000, 23)
  db.addAllocation('IB-02', 'R2', 'FB-1', '2026-02', 6650, 11000, 6300, 22)
  db.addAllocation('IB-02', 'R2', 'FB-1', '2026-03', 6300, 12500, 6600, 24)

  db.addAllocation('IB-03', 'R3', 'FB-2', '2026-01', 14000, 3000, 12000, 27)
  db.addAllocation('IB-03', 'R3', 'FB-2', '2026-02', 13300, 3300, 12600, 26)
  db.addAllocation('IB-03', 'R3', 'FB-2', '2026-03', 12600, 3750, 13200, 28)

  // =========================================================
  // Producer allocations: Semangkok
  // =========================================================

  db.addAllocation('SMK-01', 'E12', 'FB-North', '2026-01', 9000, 3500, 8000, 25)
  db.addAllocation('SMK-01', 'E12', 'FB-North', '2026-02', 8550, 3850, 8400, 24)
  db.addAllocation('SMK-01', 'E12', 'FB-North', '2026-03', 8100, 4375, 8800, 26)

  db.addAllocation('SMK-02', 'E20', 'FB-North', '2026-01', 6000, 800, 14000, 24)
  db.addAllocation('SMK-02', 'E20', 'FB-North', '2026-02', 5700, 880, 14700, 23)
  db.addAllocation('SMK-02', 'E20', 'FB-North', '2026-03', 5400, 1000, 15400, 25)

  db.addAllocation('SMK-03', 'E25', 'FB-South', '2026-01', 5000, 12000, 4000, 21)
  db.addAllocation('SMK-03', 'E25', 'FB-South', '2026-02', 4750, 13200, 4200, 20)
  db.addAllocation('SMK-03', 'E25', 'FB-South', '2026-03', 4500, 15000, 4400, 22)

  // =========================================================
  // Injector allocations: Tapis
  // =========================================================

  db.addInjectionAllocation('TWI-01', 'E34', 'FB-A', '2026-01', 300000, 0, 28)
  db.addInjectionAllocation('TWI-01', 'E34', 'FB-A', '2026-02', 285000, 0, 27)
  db.addInjectionAllocation('TWI-01', 'E34', 'FB-A', '2026-03', 330000, 0, 29)

  db.addInjectionAllocation('TGI-01', 'E40A', 'FB-C', '2026-01', 0, 150000, 27)
  db.addInjectionAllocation('TGI-01', 'E40A', 'FB-C', '2026-02', 0, 157500, 26)
  db.addInjectionAllocation('TGI-01', 'E40A', 'FB-C', '2026-03', 0, 142500, 28)

  db.addInjectionAllocation('TWAG-01', 'E22B', 'FB-C', '2026-01', 180000, 90000, 26)
  db.addInjectionAllocation('TWAG-01', 'E22B', 'FB-C', '2026-02', 171000, 94500, 25)
  db.addInjectionAllocation('TWAG-01', 'E22B', 'FB-C', '2026-03', 198000, 85500, 27)

  // =========================================================
  // Injector allocations: Irong Barat
  // =========================================================

  db.addInjectionAllocation('IBWI-01', 'R2', 'FB-1', '2026-01', 220000, 0, 27)
  db.addInjectionAllocation('IBWI-01', 'R2', 'FB-1', '2026-02', 209000, 0, 26)
  db.addInjectionAllocation('IBWI-01', 'R2', 'FB-1', '2026-03', 242000, 0, 28)

  // =========================================================
  // Injector allocations: Semangkok
  // =========================================================

  db.addInjectionAllocation('SMKGI-01', 'E20', 'FB-North', '2026-01', 0, 120000, 25)
  db.addInjectionAllocation('SMKGI-01', 'E20', 'FB-North', '2026-02', 0, 126000, 24)
  db.addInjectionAllocation('SMKGI-01', 'E20', 'FB-North', '2026-03', 0, 114000, 26)

  // =========================================================
  // Reservoir pressure surveys: Tapis
  // Temporarily tied to total reservoirs.
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
  // Well strings
  // String data will be added next.
  // =========================================================

  // =========================================================
  // Well strings: Tapis producers
  // =========================================================

  db.addWellString('TP-01', 'TP-01L', 'Long String')
  db.addWellString('TP-01', 'TP-01S', 'Short String')

  db.addWellString('TP-02', 'TP-02L', 'Long String')
  db.addWellString('TP-02', 'TP-02S', 'Short String')

  db.addWellString('TP-03', 'TP-03L', 'Long String')

  // =========================================================
  // String production
  // String data will be added next.
  // =========================================================

  // =========================================================
  // Monthly string production: TP-01
  // =========================================================

  db.addStringProduction('TP-01L', '2026-01', 15000, 3000, 11000, 25)
  db.addStringProduction('TP-01L', '2026-02', 14250, 3300, 11550, 24)
  db.addStringProduction('TP-01L', '2026-03', 13500, 3750, 12100, 26)

  db.addStringProduction('TP-01S', '2026-01', 10000, 2000, 7000, 25)
  db.addStringProduction('TP-01S', '2026-02', 9500, 2200, 7350, 24)
  db.addStringProduction('TP-01S', '2026-03', 9000, 2500, 7700, 26)

  // =========================================================
  // Monthly string production: TP-02
  // =========================================================

  db.addStringProduction('TP-02L', '2026-01', 4000, 5000, 2500, 22)
  db.addStringProduction('TP-02L', '2026-02', 3800, 5500, 2625, 21)
  db.addStringProduction('TP-02L', '2026-03', 3600, 6250, 2750, 23)

  db.addStringProduction('TP-02S', '2026-01', 8000, 9000, 5000, 22)
  db.addStringProduction('TP-02S', '2026-02', 7600, 9900, 5250, 21)
  db.addStringProduction('TP-02S', '2026-03', 7200, 11250, 5500, 23)

  // =========================================================
  // Monthly string production: TP-03
  // =========================================================

  db.addStringProduction('TP-03L', '2026-01', 7000, 1200, 15000, 24)
  db.addStringProduction('TP-03L', '2026-02', 6650, 1320, 15750, 23)
  db.addStringProduction('TP-03L', '2026-03', 0, 0, 0, 0, 'Mechanical issue')

  // =========================================================
  // String allocation factors
  // Allocation factors should total 1.0 for each string-month.
  // =========================================================

  // =========================================================
  // String allocation factors: TP-01L
  // TP-01L is completed only in E40A / FB-C
  // =========================================================

  db.addStringAllocationFactor('TP-01L', 'E40A / FB-C', '2026-01', 1.00, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-01L', 'E40A / FB-C', '2026-02', 1.00, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-01L', 'E40A / FB-C', '2026-03', 1.00, 'Completion', 'Single completed compartment')

  // =========================================================
  // String allocation factors: TP-01S
  // Allocation changed following surveillance interpretation
  // =========================================================

  db.addStringAllocationFactor('TP-01S', 'E34 / FB-A', '2026-01', 0.60, 'PLT', 'January PLT interpretation')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-B', '2026-01', 0.40, 'PLT', 'January PLT interpretation')

  db.addStringAllocationFactor('TP-01S', 'E34 / FB-A', '2026-02', 0.55, 'Engineering Estimate', 'Updated allocation after performance review')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-B', '2026-02', 0.45, 'Engineering Estimate', 'Updated allocation after performance review')

  db.addStringAllocationFactor('TP-01S', 'E34 / FB-A', '2026-03', 0.50, 'PLT', 'March PLT interpretation')
  db.addStringAllocationFactor('TP-01S', 'E34 / FB-B', '2026-03', 0.50, 'PLT', 'March PLT interpretation')

  // =========================================================
  // String allocation factors: TP-02L
  // TP-02L is completed only in E22B / FB-C
  // =========================================================

  db.addStringAllocationFactor('TP-02L', 'E22B / FB-C', '2026-01', 1.00, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-02L', 'E22B / FB-C', '2026-02', 1.00, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-02L', 'E22B / FB-C', '2026-03', 1.00, 'Completion', 'Single completed compartment')

  // =========================================================
  // String allocation factors: TP-02S
  // Allocation changes between E34 fault blocks
  // =========================================================

  db.addStringAllocationFactor('TP-02S', 'E34 / FB-A', '2026-01', 0.625, 'PLT', 'January PLT interpretation')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-B', '2026-01', 0.375, 'PLT', 'January PLT interpretation')

  db.addStringAllocationFactor('TP-02S', 'E34 / FB-A', '2026-02', 0.60, 'Engineering Estimate', 'February allocation review')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-B', '2026-02', 0.40, 'Engineering Estimate', 'February allocation review')

  db.addStringAllocationFactor('TP-02S', 'E34 / FB-A', '2026-03', 0.58, 'PLT', 'March PLT interpretation')
  db.addStringAllocationFactor('TP-02S', 'E34 / FB-B', '2026-03', 0.42, 'PLT', 'March PLT interpretation')

  // =========================================================
  // String allocation factors: TP-03L
  // TP-03L is completed only in E22B / FB-B
  // =========================================================

  db.addStringAllocationFactor('TP-03L', 'E22B / FB-B', '2026-01', 1.00, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-03L', 'E22B / FB-B', '2026-02', 1.00, 'Completion', 'Single completed compartment')
  db.addStringAllocationFactor('TP-03L', 'E22B / FB-B', '2026-03', 1.00, 'Completion', 'Well idle due to mechanical issue')
}

module.exports = {
  seedDatabase,
}