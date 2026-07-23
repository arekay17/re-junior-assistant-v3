import { useState } from 'react'
import WellTable from '../components/WellTable'
import WellDetail from '../components/WellDetail'
import ProductionHistoryChart from '../components/ProductionHistoryChart'
import WaterCutChart from '../components/WaterCutChart'
import GorChart from '../components/GorChart'
import ReservoirContributionChart from '../components/ReservoirContributionChart'
import ProductionHistoryTable from '../components/ProductionHistoryTable'
import InjectorTable from '../components/InjectorTable'
import InjectorDetail from '../components/InjectorDetail'
import WaterInjectionHistoryChart from '../components/WaterInjectionHistoryChart'
import GasInjectionHistoryChart from '../components/GasInjectionHistoryChart'
import InjectionHistoryTable from '../components/InjectionHistoryTable'
import InjectorReservoirContributionChart from '../components/InjectorReservoirContributionChart'

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
  injectionHistory,
  isLoadingInjectionHistory,
  injectionHistoryError,
  injectorReservoirHistory,
  isLoadingInjectorReservoirHistory,
  injectorReservoirHistoryError,
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
        <>
          <section className="layout">
            {isLoadingInjectors && <p>Loading injectors...</p>}

            {injectorError && <p>{injectorError}</p>}

            {!isLoadingInjectors && !injectorError && (
              <>
                <InjectorTable
                  injectors={injectors}
                  selectedInjector={selectedInjector}
                  onSelectInjector={setSelectedInjector}
                />

                <InjectorDetail
                  selectedInjector={selectedInjector}
                />
              </>
            )}
          </section>

          <section className="panel history-panel">
            {isLoadingInjectionHistory && <p>Loading injection history...</p>}

            {injectionHistoryError && <p>{injectionHistoryError}</p>}

            {!isLoadingInjectionHistory && !injectionHistoryError && (
              <>
                <WaterInjectionHistoryChart history={injectionHistory} />
                <GasInjectionHistoryChart history={injectionHistory} />

                {isLoadingInjectorReservoirHistory && <p>Loading reservoir injection contribution...</p>}

                {injectorReservoirHistoryError && <p>{injectorReservoirHistoryError}</p>}

                {!isLoadingInjectorReservoirHistory && !injectorReservoirHistoryError && (
                  <InjectorReservoirContributionChart injectorReservoirHistory={injectorReservoirHistory} />
                )}

                <InjectionHistoryTable history={injectionHistory} />
              </>
            )}
          </section>
        </>
      )}
    </>
  )
}

export default WellView