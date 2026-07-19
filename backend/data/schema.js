function createSchema(db) {
  db.exec(`
    DROP TABLE IF EXISTS monthly_string_injection_allocation_factors;
    DROP TABLE IF EXISTS monthly_string_injection;
    DROP TABLE IF EXISTS monthly_string_allocation_factors;
    DROP TABLE IF EXISTS monthly_string_production;
    DROP TABLE IF EXISTS well_strings;
    DROP TABLE IF EXISTS reservoir_compartments;
    DROP TABLE IF EXISTS monthly_injection_allocations;
    DROP TABLE IF EXISTS monthly_production_allocations;
    DROP TABLE IF EXISTS well_monthly_status;
    DROP TABLE IF EXISTS reservoir_pressure_surveys;
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
      stoiip_mmstb REAL,
      giip_bscf REAL,
      gas_cap_m REAL,
      initial_pressure_psia REAL,
      drive_mechanism TEXT,
      fluid_type TEXT,
      temperature_f REAL,
      FOREIGN KEY (field_id) REFERENCES fields(id)
    );

    CREATE TABLE reservoir_pressure_surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservoir_id INTEGER NOT NULL,
      well_id INTEGER NOT NULL,
      survey_date TEXT NOT NULL,
      pressure_psia REAL NOT NULL,
      survey_type TEXT NOT NULL,
      remarks TEXT,
      FOREIGN KEY (reservoir_id) REFERENCES reservoirs(id),
      FOREIGN KEY (well_id) REFERENCES wells(id)
    );

    CREATE TABLE fault_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_id TEXT NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (field_id) REFERENCES fields(id)
    );

    CREATE TABLE well_strings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      well_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      string_type TEXT,
      FOREIGN KEY (well_id) REFERENCES wells(id),
      UNIQUE (well_id, name)
    );

    CREATE TABLE reservoir_compartments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservoir_id INTEGER NOT NULL,
      fault_block_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      stoiip_mmstb REAL,
      giip_bscf REAL,
      gas_cap_m REAL,
      initial_pressure_psia REAL,
      drive_mechanism TEXT,
      fluid_type TEXT,
      temperature_f REAL,
      FOREIGN KEY (reservoir_id) REFERENCES reservoirs(id),
      FOREIGN KEY (fault_block_id) REFERENCES fault_blocks(id),
      UNIQUE (reservoir_id, fault_block_id)
    );

    CREATE TABLE monthly_string_production (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      string_id INTEGER NOT NULL,
      production_month TEXT NOT NULL,
      oil_volume_stb REAL NOT NULL,
      water_volume_stb REAL NOT NULL,
      gas_volume_mscf REAL NOT NULL,
      production_days REAL NOT NULL,
      idle_reason TEXT,
      FOREIGN KEY (string_id) REFERENCES well_strings(id),
      UNIQUE (string_id, production_month)
    );

    CREATE TABLE monthly_string_injection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      string_id INTEGER NOT NULL,
      production_month TEXT NOT NULL,
      water_injection_bbl REAL NOT NULL,
      gas_injection_mscf REAL NOT NULL,
      injection_days REAL NOT NULL,
      idle_reason TEXT,
      FOREIGN KEY (string_id) REFERENCES well_strings(id),
      UNIQUE (string_id, production_month)
    );

    CREATE TABLE monthly_string_allocation_factors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      string_id INTEGER NOT NULL,
      reservoir_compartment_id INTEGER NOT NULL,
      production_month TEXT NOT NULL,
      allocation_fraction REAL NOT NULL,
      allocation_source TEXT,
      remarks TEXT,
      FOREIGN KEY (string_id) REFERENCES well_strings(id),
      FOREIGN KEY (reservoir_compartment_id)
        REFERENCES reservoir_compartments(id),
      UNIQUE (
        string_id,
        reservoir_compartment_id,
        production_month
      ),
      CHECK (allocation_fraction >= 0 AND allocation_fraction <= 1)
    );

    CREATE TABLE monthly_string_injection_allocation_factors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      string_id INTEGER NOT NULL,
      reservoir_compartment_id INTEGER NOT NULL,
      production_month TEXT NOT NULL,
      allocation_fraction REAL NOT NULL,
      allocation_source TEXT,
      remarks TEXT,
      FOREIGN KEY (string_id) REFERENCES well_strings(id),
      FOREIGN KEY (reservoir_compartment_id)
        REFERENCES reservoir_compartments(id),
      UNIQUE (
        string_id,
        reservoir_compartment_id,
        production_month
      ),
      CHECK (allocation_fraction >= 0 AND allocation_fraction <= 1)
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
}

module.exports = {
  createSchema,
}