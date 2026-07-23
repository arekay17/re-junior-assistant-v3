import { useEffect, useState } from 'react'

import ReservoirTable from '../components/ReservoirTable'
import ReservoirDetail from '../components/ReservoirDetail'
import ReservoirProductionHistoryChart from '../components/ReservoirProductionHistoryChart'
import WaterCutChart from '../components/WaterCutChart'
import GorChart from '../components/GorChart'
import ReservoirCompartmentContributionChart from '../components/ReservoirCompartmentContributionChart'

function ReservoirView({ field }) {
  const [reservoirs, setReservoirs] = useState([])
  const [selectedReservoir, setSelectedReservoir] = useState(null)
  const [isLoadingReservoirs, setIsLoadingReservoirs] = useState(false)
  const [reservoirError, setReservoirError] = useState('')

  const [reservoirHistory, setReservoirHistory] = useState([])
  const [isLoadingReservoirHistory, setIsLoadingReservoirHistory] = useState(false)
  const [reservoirHistoryError, setReservoirHistoryError] = useState('')

  const [compartmentHistory, setCompartmentHistory] = useState([])
  const [isLoadingCompartmentHistory, setIsLoadingCompartmentHistory] = useState(false)
  const [compartmentHistoryError, setCompartmentHistoryError] = useState('')

  useEffect(() => {
    setIsLoadingReservoirs(true)
    setReservoirError('')

    fetch(`/api/fields/${field.id}/reservoir-summary`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load reservoir summary')
        }

        return response.json()
      })
      .then((data) => {
        setReservoirs(data)
        setSelectedReservoir(data.length > 0 ? data[0] : null)
      })
      .catch(() => {
        setReservoirs([])
        setSelectedReservoir(null)
        setReservoirError('Unable to load reservoir summary')
      })
      .finally(() => {
        setIsLoadingReservoirs(false)
      })
  }, [field])

  useEffect(() => {
    if (!selectedReservoir) {
      setReservoirHistory([])
      setCompartmentHistory([])
      return
    }

    setIsLoadingReservoirHistory(true)
    setReservoirHistoryError('')

    fetch(`/api/reservoirs/${selectedReservoir.id}/history`)
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

    setIsLoadingCompartmentHistory(true)
    setCompartmentHistoryError('')

    fetch(`/api/reservoirs/${selectedReservoir.id}/compartment-history`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load reservoir compartment history')
        }

        return response.json()
      })
      .then((data) => {
        setCompartmentHistory(data)
      })
      .catch(() => {
        setCompartmentHistory([])
        setCompartmentHistoryError('Unable to load reservoir compartment history')
      })
      .finally(() => {
        setIsLoadingCompartmentHistory(false)
      })
  }, [selectedReservoir])

  return (
    <section className="field-section">
      <div className="section-heading">
        <p className="eyebrow">Reservoir View</p>
        <h2>Reservoir Dossier</h2>
      </div>

      {isLoadingReservoirs && (
        <section className="panel">
          <p>Loading reservoirs...</p>
        </section>
      )}

      {reservoirError && (
        <section className="panel">
          <p>{reservoirError}</p>
        </section>
      )}

      {!isLoadingReservoirs && !reservoirError && (
        <>
          <section className="layout">
            <ReservoirTable reservoirs={reservoirs} selectedReservoir={selectedReservoir} onSelectReservoir={setSelectedReservoir} />
            <ReservoirDetail selectedReservoir={selectedReservoir} />
          </section>

          <section className="panel history-panel">
            {isLoadingReservoirHistory && <p>Loading reservoir history...</p>}

            {reservoirHistoryError && <p>{reservoirHistoryError}</p>}

            {!isLoadingReservoirHistory && !reservoirHistoryError && (
              <>
                <ReservoirProductionHistoryChart history={reservoirHistory} />
                <WaterCutChart history={reservoirHistory} />
                <GorChart history={reservoirHistory} />
              </>
            )}

            {isLoadingCompartmentHistory && <p>Loading fault block contribution...</p>}

            {compartmentHistoryError && <p>{compartmentHistoryError}</p>}

            {!isLoadingCompartmentHistory && !compartmentHistoryError && (
              <ReservoirCompartmentContributionChart compartmentHistory={compartmentHistory} />
            )}
          </section>
        </>
      )}
    </section>
  )
}

export default ReservoirView