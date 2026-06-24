import { useEffect, useState } from 'react'

import SummaryCards from '../components/SummaryCards'
import WellTable from '../components/WellTable'
import WellDetail from '../components/WellDetail'

function FieldDashboard({ field, wells, onBack }) {
  const [selectedWell, setSelectedWell] = useState(null)

  useEffect(() => {
    if (wells.length > 0) {
      setSelectedWell(wells[0])
    }
  }, [wells])

  if (!selectedWell) {
    return (
      <main className="app">
        <button type="button" className="back-button" onClick={onBack}>
          Back to fields
        </button>

        <header className="header">
          <p className="eyebrow">Reservoir Engineering</p>
          <h1>{field.name} Dashboard</h1>
          <p className="subtitle">Loading wells...</p>
        </header>
      </main>
    )
  }

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

      <SummaryCards wells={wells} />

      <section className="layout">
        <WellTable
          wells={wells}
          selectedWell={selectedWell}
          onSelectWell={setSelectedWell}
        />

        <WellDetail selectedWell={selectedWell} />
      </section>
    </main>
  )
}

export default FieldDashboard