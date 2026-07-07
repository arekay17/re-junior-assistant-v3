import { useState } from 'react'
import WellTable from '../components/WellTable'
import WellDetail from '../components/WellDetail'
import ProductionHistoryChart from '../components/ProductionHistoryChart'
import WaterCutChart from '../components/WaterCutChart'
import GorChart from '../components/GorChart'
import ReservoirContributionChart from '../components/ReservoirContributionChart'
import ProductionHistoryTable from '../components/ProductionHistoryTable'

function WellView({
  wells,
  selectedProducer,
  setSelectedProducer,
  productionHistory,
  isLoadingHistory,
  historyError,
  reservoirHistory,
  isLoadingReservoirHistory,
  reservoirHistoryError,
  injectors,
  selectedInjector,
  setSelectedInjector,
  isLoadingInjectors,
  injectorError,
}) {
  const [wellMode, setWellMode] = useState('producers')

  return (
    <>
      <section className="view-tabs sub-tabs">
        <button
          type="button"
          className={wellMode === 'producers' ? 'active-tab' : ''}
          onClick={() => setWellMode('producers')}
        >
          Producers
        </button>

        <button
          type="button"
          className={wellMode === 'injectors' ? 'active-tab' : ''}
          onClick={() => setWellMode('injectors')}
        >
          Injectors
        </button>
      </section>

      {wellMode === 'producers' && (
        <>
          <section className="layout">
            <WellTable
              wells={wells}
              selectedWell={selectedProducer}
              onSelectWell={setSelectedProducer}
            />

            <WellDetail selectedWell={selectedProducer} />
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

                {reservoirHistoryError && <p>{reservoirHistoryError}</p>}

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

      {wellMode === 'injectors' && (
        <section className="panel">
          <h2>Injector View</h2>

          {isLoadingInjectors && <p>Loading injectors...</p>}

          {injectorError && <p>{injectorError}</p>}

          {!isLoadingInjectors && !injectorError && (
            <>
              <p>
                Selected injector:{' '}
                <strong>{selectedInjector ? selectedInjector.name : '-'}</strong>
              </p>

              <p>
                Injector table and injection trends will be added here next.
              </p>

              <ul>
                {injectors.map((injector) => (
                  <li key={injector.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedInjector(injector)}
                    >
                      {injector.name} — {injector.injectorType}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </>
  )
}

export default WellView