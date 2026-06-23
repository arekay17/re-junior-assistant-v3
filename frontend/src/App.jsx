import { useState } from 'react'
import './App.css'

const fields = [
  {
    id: 'tapis',
    name: 'Tapis',
    description: 'Mature oil field surveillance dashboard',
  },
  {
    id: 'irong-barat',
    name: 'Irong Barat',
    description: 'Well and reservoir performance review',
  },
  {
    id: 'semangkok',
    name: 'Semangkok',
    description: 'Production and pressure monitoring',
  },
]

const wellsByField = {
  tapis: [
    { id: 1, name: 'TP-01', reservoir: 'E34', oilRate: 850, waterCut: 22, gor: 750, status: 'Normal' },
    { id: 2, name: 'TP-02', reservoir: 'E40A', oilRate: 420, waterCut: 68, gor: 500, status: 'High water cut' },
    { id: 3, name: 'TP-03', reservoir: 'E22B', oilRate: 300, waterCut: 15, gor: 1800, status: 'High GOR' },
  ],
  'irong-barat': [
    { id: 1, name: 'IB-01', reservoir: 'R1', oilRate: 620, waterCut: 35, gor: 900, status: 'Normal' },
    { id: 2, name: 'IB-02', reservoir: 'R2', oilRate: 280, waterCut: 72, gor: 650, status: 'High water cut' },
    { id: 3, name: 'IB-03', reservoir: 'R3', oilRate: 510, waterCut: 18, gor: 1200, status: 'Normal' },
  ],
  semangkok: [
    { id: 1, name: 'SMK-01', reservoir: 'E12', oilRate: 390, waterCut: 28, gor: 1100, status: 'Normal' },
    { id: 2, name: 'SMK-02', reservoir: 'E20', oilRate: 240, waterCut: 12, gor: 2100, status: 'High GOR' },
    { id: 3, name: 'SMK-03', reservoir: 'E25', oilRate: 180, waterCut: 76, gor: 700, status: 'High water cut' },
  ],
}

function App() {
  const [selectedField, setSelectedField] = useState(null)

  if (!selectedField) {
    return (
      <main className="app">
        <header className="header">
          <p className="eyebrow">Reservoir Engineering</p>
          <h1>RE Junior Assistant</h1>
          <p className="subtitle">Select a field to begin surveillance review.</p>
        </header>

        <section className="field-grid">
          {fields.map((field) => (
            <button
              key={field.id}
              type="button"
              className="field-card"
              onClick={() => setSelectedField(field)}
            >
              <span>Field</span>
              <strong>{field.name}</strong>
              <p>{field.description}</p>
            </button>
          ))}
        </section>
      </main>
    )
  }

  return (
    <FieldDashboard
      field={selectedField}
      wells={wellsByField[selectedField.id]}
      onBack={() => setSelectedField(null)}
    />
  )
}

function FieldDashboard({ field, wells, onBack }) {
  const [selectedWell, setSelectedWell] = useState(wells[0])

  const totalOilRate = wells.reduce((sum, well) => sum + well.oilRate, 0)
  const issueCount = wells.filter((well) => well.status !== 'Normal').length

  return (
    <main className="app">
      <button type="button" className="back-button" onClick={onBack}>
        Back to fields
      </button>

      <header className="header">
        <p className="eyebrow">Reservoir Engineering</p>
        <h1>{field.name} Dashboard</h1>
        <p className="subtitle">
          First mock dashboard for well surveillance review.
        </p>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Total Wells</span>
          <strong>{wells.length}</strong>
        </div>
        <div className="summary-card">
          <span>Total Oil Rate</span>
          <strong>{totalOilRate} bopd</strong>
        </div>
        <div className="summary-card">
          <span>Wells With Issues</span>
          <strong>{issueCount}</strong>
        </div>
      </section>

      <section className="layout">
        <div className="panel">
          <h2>Well List</h2>

          <table>
            <thead>
              <tr>
                <th>Well</th>
                <th>Reservoir</th>
                <th>Oil Rate</th>
                <th>WC</th>
                <th>GOR</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {wells.map((well) => (
                <tr
                  key={well.id}
                  onClick={() => setSelectedWell(well)}
                  className={selectedWell.id === well.id ? 'selected' : ''}
                >
                  <td>{well.name}</td>
                  <td>{well.reservoir}</td>
                  <td>{well.oilRate} bopd</td>
                  <td>{well.waterCut}%</td>
                  <td>{well.gor} scf/stb</td>
                  <td>{well.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="panel detail-panel">
          <h2>{selectedWell.name}</h2>
          <p className="muted">Selected well detail</p>

          <dl>
            <div><dt>Reservoir</dt><dd>{selectedWell.reservoir}</dd></div>
            <div><dt>Oil Rate</dt><dd>{selectedWell.oilRate} bopd</dd></div>
            <div><dt>Water Cut</dt><dd>{selectedWell.waterCut}%</dd></div>
            <div><dt>GOR</dt><dd>{selectedWell.gor} scf/stb</dd></div>
            <div><dt>Status</dt><dd>{selectedWell.status}</dd></div>
          </dl>

          <div className="interpretation">
            <h3>First-pass comment</h3>
            <p>
              {selectedWell.status === 'Normal'
                ? 'Well appears stable based on the current mock surveillance indicators.'
                : `Well requires review due to ${selectedWell.status.toLowerCase()}. Check latest trend, pressure data, and operating history.`}
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App