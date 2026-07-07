import WellTable from '../components/WellTable'
import WellDetail from '../components/WellDetail'

import ProductionHistoryChart from '../components/ProductionHistoryChart'
import WaterCutChart from '../components/WaterCutChart'
import GorChart from '../components/GorChart'
import ReservoirContributionChart from '../components/ReservoirContributionChart'

import ProductionHistoryTable from '../components/ProductionHistoryTable'

function WellView({
  wells,
  selectedWell,
  setSelectedWell,
  productionHistory,
  isLoadingHistory,
  historyError,
  reservoirHistory,
  isLoadingReservoirHistory,
  reservoirHistoryError,
}) {
  return (
    <>
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

            {!isLoadingReservoirHistory &&
              !reservoirHistoryError && (
                <ReservoirContributionChart
                  reservoirHistory={reservoirHistory}
                />
              )}

            <ProductionHistoryTable
              history={productionHistory}
            />
          </>
        )}
      </section>
    </>
  )
}

export default WellView