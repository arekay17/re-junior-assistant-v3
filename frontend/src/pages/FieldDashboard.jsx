import { useEffect, useState } from 'react'

import SummaryCards from '../components/SummaryCards'
import WellTable from '../components/WellTable'
import WellDetail from '../components/WellDetail'
import ProductionHistoryChart from '../components/ProductionHistoryChart'
import WaterCutChart from '../components/WaterCutChart'
import GorChart from '../components/GorChart'
import ReservoirContributionChart from '../components/ReservoirContributionChart'
import ProductionHistoryTable from '../components/ProductionHistoryTable'

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

  const [reservoirHistory, setReservoirHistory] = useState([])
  const [isLoadingReservoirHistory, setIsLoadingReservoirHistory] = useState(false)
  const [reservoirHistoryError, setReservoirHistoryError] = useState('')

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

    setIsLoadingReservoirHistory(true)
    setReservoirHistoryError('')

    fetch(`/api/wells/${selectedWell.id}/reservoir-history`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load reservoir history')
        }

        return response.json()
      })
      .then((data) => {
        setReservoirHistory(data)
      })
      .catch(() => {
        setReservoirHistory([])
        setReservoirHistoryError('Unable to load reservoir history')
      })
      .finally(() => {
        setIsLoadingReservoirHistory(false)
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

                {isLoadingReservoirHistory && (
                  <p>Loading reservoir contribution...</p>
                )}

                {reservoirHistoryError && (
                  <p>{reservoirHistoryError}</p>
                )}

                {!isLoadingReservoirHistory && !reservoirHistoryError && (
                  <ReservoirContributionChart
                    reservoirHistory={reservoirHistory}
                  />
                )}

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