const Database = require('better-sqlite3')

const db = new Database('data/re-junior.db')

db.exec(`
  DROP TABLE IF EXISTS monthly_injection_allocations;
  DROP TABLE IF EXISTS monthly_production_allocations;
  DROP TABLE IF EXISTS well_monthly_status;
  DROP TABLE IF EXISTS fault_blocks;
  DROP TABLE IF EXISTS reservoirs;
  DROP TABLE IF EXISTS wells;
  DROP TABLE IF EXISTS fields;

  CREATE TABLE fields (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE wells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT NOT NULL,
    name TEXT NOT NULL,
    well_role TEXT NOT NULL,
    injector_type TEXT,
    FOREIGN KEY (field_id) REFERENCES fields(id)
  );

  CREATE TABLE reservoirs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (field_id) REFERENCES fields(id)
  );

  CREATE TABLE fault_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (field_id) REFERENCES fields(id)
  );

  CREATE TABLE well_monthly_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    well_id INTEGER NOT NULL,
    production_month TEXT NOT NULL,
    production_days REAL NOT NULL,
    idle_reason TEXT,
    FOREIGN KEY (well_id) REFERENCES wells(id),
    UNIQUE (well_id, production_month)
  );

  CREATE TABLE monthly_production_allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    well_id INTEGER NOT NULL,
    reservoir_id INTEGER NOT NULL,
    fault_block_id INTEGER NOT NULL,
    production_month TEXT NOT NULL,
    oil_volume_stb REAL NOT NULL,
    water_volume_stb REAL NOT NULL,
    gas_volume_mscf REAL NOT NULL,
    FOREIGN KEY (well_id) REFERENCES wells(id),
    FOREIGN KEY (reservoir_id) REFERENCES reservoirs(id),
    FOREIGN KEY (fault_block_id) REFERENCES fault_blocks(id)
    );

  CREATE TABLE monthly_injection_allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    well_id INTEGER NOT NULL,
    reservoir_id INTEGER NOT NULL,
    fault_block_id INTEGER NOT NULL,
    production_month TEXT NOT NULL,
    water_injection_bbl REAL NOT NULL,
    gas_injection_mscf REAL NOT NULL,
    FOREIGN KEY (well_id) REFERENCES wells(id),
    FOREIGN KEY (reservoir_id) REFERENCES reservoirs(id),
    FOREIGN KEY (fault_block_id) REFERENCES fault_blocks(id)
    );
`)

const insertField = db.prepare(`
  INSERT INTO fields (id, name, description)
  VALUES (?, ?, ?)
`)

insertField.run('tapis', 'Tapis', 'Mature oil field surveillance dashboard')
insertField.run('irong-barat', 'Irong Barat', 'Well and reservoir performance review')
insertField.run('semangkok', 'Semangkok', 'Production and pressure monitoring')

const insertWell = db.prepare(`
  INSERT INTO wells (field_id, name, well_role, injector_type)
  VALUES (?, ?, ?, ?)
`)

const wells = [
  ['tapis', 'TP-01', 'Producer', null],
  ['tapis', 'TP-02', 'Producer', null],
  ['tapis', 'TP-03', 'Producer', null],
  ['tapis', 'TWI-01', 'Injector', 'Water'],
  ['tapis', 'TGI-01', 'Injector', 'Gas'],
  ['tapis', 'TWAG-01', 'Injector', 'WAG'],

  ['irong-barat', 'IB-01', 'Producer', null],
  ['irong-barat', 'IB-02', 'Producer', null],
  ['irong-barat', 'IB-03', 'Producer', null],
  ['irong-barat', 'IBWI-01', 'Injector', 'Water'],

  ['semangkok', 'SMK-01', 'Producer', null],
  ['semangkok', 'SMK-02', 'Producer', null],
  ['semangkok', 'SMK-03', 'Producer', null],
  ['semangkok', 'SMKGI-01', 'Injector', 'Gas'],
]

for (const well of wells) {
  insertWell.run(well[0], well[1], well[2], well[3])
}

const insertReservoir = db.prepare(`
  INSERT INTO reservoirs (field_id, name)
  VALUES (?, ?)
`)

const reservoirs = [
  ['tapis', 'E34'],
  ['tapis', 'E40A'],
  ['tapis', 'E22B'],

  ['irong-barat', 'R1'],
  ['irong-barat', 'R2'],
  ['irong-barat', 'R3'],

  ['semangkok', 'E12'],
  ['semangkok', 'E20'],
  ['semangkok', 'E25'],
]

for (const reservoir of reservoirs) {
  insertReservoir.run(reservoir[0], reservoir[1])
}

const insertFaultBlock = db.prepare(`
  INSERT INTO fault_blocks (field_id, name)
  VALUES (?, ?)
`)

const faultBlocks = [
  ['tapis', 'FB-A'],
  ['tapis', 'FB-B'],
  ['tapis', 'FB-C'],

  ['irong-barat', 'FB-1'],
  ['irong-barat', 'FB-2'],

  ['semangkok', 'FB-North'],
  ['semangkok', 'FB-South'],
]

for (const faultBlock of faultBlocks) {
  insertFaultBlock.run(faultBlock[0], faultBlock[1])
}

const getWell = db.prepare(`
  SELECT id FROM wells
  WHERE name = ?
`)

const getReservoir = db.prepare(`
  SELECT id FROM reservoirs
  WHERE name = ?
`)

const getFaultBlock = db.prepare(`
  SELECT id FROM fault_blocks
  WHERE name = ?
`)

const insertWellMonthlyStatus = db.prepare(`
  INSERT OR REPLACE INTO well_monthly_status (
    well_id,
    production_month,
    production_days,
    idle_reason
  )
  VALUES (?, ?, ?, ?)
`)

const insertAllocation = db.prepare(`
  INSERT INTO monthly_production_allocations (
    well_id,
    reservoir_id,
    fault_block_id,
    production_month,
    oil_volume_stb,
    water_volume_stb,
    gas_volume_mscf
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertInjectionAllocation = db.prepare(`
  INSERT INTO monthly_injection_allocations (
    well_id,
    reservoir_id,
    fault_block_id,
    production_month,
    water_injection_bbl,
    gas_injection_mscf
  )
  VALUES (?, ?, ?, ?, ?, ?)
`)

function addAllocation(
  wellName,
  reservoirName,
  faultBlockName,
  month,
  oilVolumeStb,
  waterVolumeStb,
  gasVolumeMscf,
  productionDays,
  activityStatus = 'Flowing',
  idleReason = null
) {
  const well = getWell.get(wellName)
  const reservoir = getReservoir.get(reservoirName)
  const faultBlock = getFaultBlock.get(faultBlockName)

  insertWellMonthlyStatus.run(
    well.id,
    month,
    productionDays,
    idleReason
  )

  insertAllocation.run(
    well.id,
    reservoir.id,
    faultBlock.id,
    month,
    oilVolumeStb,
    waterVolumeStb,
    gasVolumeMscf
  )
}

// Tapis: well + reservoir allocation
function addThreeMonths(
  wellName,
  reservoirName,
  faultBlockName,
  baseOil,
  baseWater,
  baseGas,
  productionDays
) {
  addAllocation(wellName, reservoirName, faultBlockName, '2026-01', baseOil, baseWater, baseGas, productionDays)

  addAllocation(
    wellName,
    reservoirName,
    faultBlockName,
    '2026-02',
    baseOil * 0.95,
    baseWater * 1.1,
    baseGas * 1.05,
    productionDays - 1
  )

  addAllocation(
    wellName,
    reservoirName,
    faultBlockName,
    '2026-03',
    baseOil * 0.9,
    baseWater * 1.25,
    baseGas * 1.1,
    productionDays + 1
  )
}

// Tapis
addThreeMonths('TP-01', 'E34', 'FB-A', 6000, 1200, 4000, 25)
addThreeMonths('TP-01', 'E34', 'FB-B', 4000, 800, 3000, 25)
addThreeMonths('TP-01', 'E40A', 'FB-C', 15000, 3000, 11000, 25)

addThreeMonths('TP-02', 'E34', 'FB-A', 5000, 6000, 3000, 22)
addThreeMonths('TP-02', 'E34', 'FB-B', 3000, 3000, 2000, 22)
addThreeMonths('TP-02', 'E22B', 'FB-C', 4000, 5000, 2500, 22)

addAllocation('TP-03', 'E22B', 'FB-B', '2026-01', 7000, 1200, 15000, 24)

addAllocation('TP-03', 'E22B', 'FB-B', '2026-02', 6650, 1320, 15750, 23)

addAllocation(
  'TP-03',
  'E22B',
  'FB-B',
  '2026-03',
  0,
  0,
  0,
  0,
  'Idle',
  'Mechanical issue'
)

// Irong Barat
addThreeMonths('IB-01', 'R1', 'FB-1', 12000, 4000, 9000, 26)
addThreeMonths('IB-01', 'R2', 'FB-2', 6000, 2500, 4500, 26)

addThreeMonths('IB-02', 'R2', 'FB-1', 7000, 10000, 6000, 23)
addThreeMonths('IB-03', 'R3', 'FB-2', 14000, 3000, 12000, 27)

// Semangkok
addThreeMonths('SMK-01', 'E12', 'FB-North', 9000, 3500, 8000, 25)
addThreeMonths('SMK-02', 'E20', 'FB-North', 6000, 800, 14000, 24)
addThreeMonths('SMK-03', 'E25', 'FB-South', 5000, 12000, 4000, 21)

// Add injection allocation

function addInjectionAllocation(
  wellName,
  reservoirName,
  faultBlockName,
  month,
  waterInjectionBbl,
  gasInjectionMscf,
  injectionDays,
  idleReason = null
) {
  const well = getWell.get(wellName)
  const reservoir = getReservoir.get(reservoirName)
  const faultBlock = getFaultBlock.get(faultBlockName)

  insertWellMonthlyStatus.run(
    well.id,
    month,
    injectionDays,
    idleReason
  )

  insertInjectionAllocation.run(
    well.id,
    reservoir.id,
    faultBlock.id,
    month,
    waterInjectionBbl,
    gasInjectionMscf
  )
}

function addInjectionThreeMonths(
  wellName,
  reservoirName,
  faultBlockName,
  baseWaterInjection,
  baseGasInjection,
  injectionDays
) {
  addInjectionAllocation(
    wellName,
    reservoirName,
    faultBlockName,
    '2026-01',
    baseWaterInjection,
    baseGasInjection,
    injectionDays
  )

  addInjectionAllocation(
    wellName,
    reservoirName,
    faultBlockName,
    '2026-02',
    baseWaterInjection * 0.95,
    baseGasInjection * 1.05,
    injectionDays - 1
  )

  addInjectionAllocation(
    wellName,
    reservoirName,
    faultBlockName,
    '2026-03',
    baseWaterInjection * 1.10,
    baseGasInjection * 0.95,
    injectionDays + 1
  )
}

// Tapis Injectors
addInjectionThreeMonths('TWI-01', 'E34', 'FB-A', 300000, 0, 28)
addInjectionThreeMonths('TGI-01', 'E40A', 'FB-C', 0, 150000, 27)
addInjectionThreeMonths('TWAG-01', 'E22B', 'FB-C', 180000, 90000, 26)

// Irong Barat Injector
addInjectionThreeMonths('IBWI-01', 'R2', 'FB-1', 220000, 0, 27)

// Semangkok Injector
addInjectionThreeMonths('SMKGI-01', 'E20', 'FB-North', 0, 120000, 25)


console.log('Database initialized successfully')
