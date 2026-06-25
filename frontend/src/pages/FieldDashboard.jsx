import { useEffect, useState } from 'react'

import SummaryCards from '../components/SummaryCards'
import WellTable from '../components/WellTable'
import WellDetail from '../components/WellDetail'
import ProductionHistoryTable from '../components/ProductionHistoryTable'
import ProductionHistoryChart from '../components/ProductionHistoryChart'
import WaterCutChart from '../components/WaterCutChart'
import GorChart from '../components/GorChart'

function FieldDashboard({
  field,
  wells,
  isLoadingWells,
  wellsError,
  onBack,
}) {
  const [selectedWell, setSelectedWell] = useState(null)

  const [productionHistory, setProductionHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState('')

  useEffect(() => {
    if (wells.length > 0) {
      setSelectedWell(wells[0])
    }
  }, [wells])

  useEffect(() => {
    if (!selectedWell) {
      return
    }

    setIsLoadingHistory(true)
    setHistoryError('')

    fetch(`/api/wells/${selectedWell.id}/history`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load history')
        }

        return response.json()
      })
      .then((data) => {
        setProductionHistory(data)
      })
      .catch(() => {
        setProductionHistory([])
        setHistoryError('Unable to load production history')
      })
      .finally(() => {
        setIsLoadingHistory(false)
      })
  }, [selectedWell])

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

      {isLoadingWells && (
        <div className="panel">
          <p>Loading wells...</p>
        </div>
      )}

      {wellsError && (
        <div className="panel">
          <p>{wellsError}</p>
        </div>
      )}

      {!isLoadingWells && !wellsError && selectedWell && (
        <>
          <SummaryCards wells={wells} />

          <section className="layout">
            <WellTable
              wells={wells}
              selectedWell={selectedWell}
              onSelectWell={setSelectedWell}
            />

            <WellDetail selectedWell={selectedWell} />
          </section>

          <section className="panel history-panel">
            {isLoadingHistory && <p>Loading production history...</p>}

            {historyError && <p>{historyError}</p>}

            {!isLoadingHistory && !historyError && (
              <>
              <ProductionHistoryChart history={productionHistory} />
              <WaterCutChart history={productionHistory} />
              <GorChart history={productionHistory} />
              <ProductionHistoryTable history={productionHistory} />
              </>
            )}
          </section>
        </>
      )}
    </main>
  )
}

export default FieldDashboard