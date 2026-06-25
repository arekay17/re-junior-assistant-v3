const Database = require('better-sqlite3')

const db = new Database('data/re-junior.db')

db.exec(`
  DROP TABLE IF EXISTS monthly_production_allocations;
  DROP TABLE IF EXISTS well_monthly_status;
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
    FOREIGN KEY (field_id) REFERENCES fields(id)
  );

  CREATE TABLE reservoirs (
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
  FOREIGN KEY (well_id) REFERENCES wells(id),
  UNIQUE (well_id, production_month)
  );

CREATE TABLE monthly_production_allocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  well_id INTEGER NOT NULL,
  reservoir_id INTEGER NOT NULL,
  production_month TEXT NOT NULL,
  oil_volume_stb REAL NOT NULL,
  water_volume_stb REAL NOT NULL,
  gas_volume_mscf REAL NOT NULL,
  FOREIGN KEY (well_id) REFERENCES wells(id),
  FOREIGN KEY (reservoir_id) REFERENCES reservoirs(id)
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
  INSERT INTO wells (field_id, name)
  VALUES (?, ?)
`)

const wells = [
  ['tapis', 'TP-01'],
  ['tapis', 'TP-02'],
  ['tapis', 'TP-03'],

  ['irong-barat', 'IB-01'],
  ['irong-barat', 'IB-02'],
  ['irong-barat', 'IB-03'],

  ['semangkok', 'SMK-01'],
  ['semangkok', 'SMK-02'],
  ['semangkok', 'SMK-03'],
]

for (const well of wells) {
  insertWell.run(well[0], well[1])
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

const getWell = db.prepare(`
  SELECT id FROM wells
  WHERE name = ?
`)

const getReservoir = db.prepare(`
  SELECT id FROM reservoirs
  WHERE name = ?
`)

const insertWellMonthlyStatus = db.prepare(`
  INSERT OR REPLACE INTO well_monthly_status (
    well_id,
    production_month,
    production_days
  )
  VALUES (?, ?, ?)
`)

const insertAllocation = db.prepare(`
  INSERT INTO monthly_production_allocations (
    well_id,
    reservoir_id,
    production_month,
    oil_volume_stb,
    water_volume_stb,
    gas_volume_mscf
  )
  VALUES (?, ?, ?, ?, ?, ?)
`)

function addAllocation(
  wellName,
  reservoirName,
  month,
  oilVolumeStb,
  waterVolumeStb,
  gasVolumeMscf,
  productionDays
) {
  const well = getWell.get(wellName)
  const reservoir = getReservoir.get(reservoirName)

  insertWellMonthlyStatus.run(
    well.id,
    month,
    productionDays
  )

  insertAllocation.run(
    well.id,
    reservoir.id,
    month,
    oilVolumeStb,
    waterVolumeStb,
    gasVolumeMscf
  )
}

// Tapis: well + reservoir allocation
function addThreeMonths(wellName, reservoirName, baseOil, baseWater, baseGas, productionDays) {
  addAllocation(wellName, reservoirName, '2026-01', baseOil, baseWater, baseGas, productionDays)

  addAllocation(
    wellName,
    reservoirName,
    '2026-02',
    baseOil * 0.95,
    baseWater * 1.1,
    baseGas * 1.05,
    productionDays - 1
  )

  addAllocation(
    wellName,
    reservoirName,
    '2026-03',
    baseOil * 0.9,
    baseWater * 1.25,
    baseGas * 1.1,
    productionDays + 1
  )
}

// Tapis
addThreeMonths('TP-01', 'E34', 10000, 2000, 7000, 25)
addThreeMonths('TP-01', 'E40A', 15000, 3000, 11000, 25)

addThreeMonths('TP-02', 'E34', 8000, 9000, 5000, 22)
addThreeMonths('TP-02', 'E22B', 4000, 5000, 2500, 22)

addThreeMonths('TP-03', 'E22B', 7000, 1200, 15000, 24)

// Irong Barat
addThreeMonths('IB-01', 'R1', 12000, 4000, 9000, 26)
addThreeMonths('IB-01', 'R2', 6000, 2500, 4500, 26)

addThreeMonths('IB-02', 'R2', 7000, 10000, 6000, 23)
addThreeMonths('IB-03', 'R3', 14000, 3000, 12000, 27)

// Semangkok
addThreeMonths('SMK-01', 'E12', 9000, 3500, 8000, 25)
addThreeMonths('SMK-02', 'E20', 6000, 800, 14000, 24)
addThreeMonths('SMK-03', 'E25', 5000, 12000, 4000, 21)

console.log('Database initialized successfully')