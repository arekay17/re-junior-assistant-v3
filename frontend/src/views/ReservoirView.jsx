import { useEffect, useState } from 'react'

import ReservoirTable from '../components/ReservoirTable'
import ReservoirDetail from '../components/ReservoirDetail'
import ReservoirProductionHistoryChart from '../components/ReservoirProductionHistoryChart'
import WaterCutChart from '../components/WaterCutChart'
import GorChart from '../components/GorChart'
import ReservoirCompartmentContributionChart from '../components/ReservoirCompartmentContributionChart'
import ReservoirInjectionHistoryChart from '../components/ReservoirInjectionHistoryChart'
import ReservoirInjectionCompartmentChart from '../components/ReservoirInjectionCompartmentChart'

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

  const [reservoirInjectionHistory, setReservoirInjectionHistory] = useState([])
  const [isLoadingReservoirInjectionHistory, setIsLoadingReservoirInjectionHistory] = useState(false)
  const [reservoirInjectionHistoryError, setReservoirInjectionHistoryError] = useState('')

  const [injectionCompartmentHistory, setInjectionCompartmentHistory] = useState([])
  const [isLoadingInjectionCompartmentHistory, setIsLoadingInjectionCompartmentHistory] = useState(false)
  const [injectionCompartmentHistoryError, setInjectionCompartmentHistoryError] = useState('')

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
      setReservoirInjectionHistory([])
      setInjectionCompartmentHistory([])
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

    setIsLoadingReservoirInjectionHistory(true)
    setReservoirInjectionHistoryError('')

    fetch(`/api/reservoirs/${selectedReservoir.id}/injection-history`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load reservoir injection history')
        }

        return response.json()
      })
      .then((data) => {
        setReservoirInjectionHistory(data)
      })
      .catch(() => {
        setReservoirInjectionHistory([])
        setReservoirInjectionHistoryError('Unable to load reservoir injection history')
      })
      .finally(() => {
        setIsLoadingReservoirInjectionHistory(false)
      })

    setIsLoadingInjectionCompartmentHistory(true)
    setInjectionCompartmentHistoryError('')

    fetch(`/api/reservoirs/${selectedReservoir.id}/injection-compartment-history`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load injection compartment history')
        }

        return response.json()
      })
      .then((data) => {
        setInjectionCompartmentHistory(data)
      })
      .catch(() => {
        setInjectionCompartmentHistory([])
        setInjectionCompartmentHistoryError('Unable to load injection compartment history')
      })
      .finally(() => {
        setIsLoadingInjectionCompartmentHistory(false)
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
            <h2>Production Surveillance</h2>

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

          <section className="panel history-panel">
            <h2>Injection Surveillance</h2>

            {isLoadingReservoirInjectionHistory && <p>Loading reservoir injection history...</p>}

            {reservoirInjectionHistoryError && <p>{reservoirInjectionHistoryError}</p>}

            {!isLoadingReservoirInjectionHistory && !reservoirInjectionHistoryError && (
              <ReservoirInjectionHistoryChart history={reservoirInjectionHistory} />
            )}

            {isLoadingInjectionCompartmentHistory && <p>Loading injection fault block contribution...</p>}

            {injectionCompartmentHistoryError && <p>{injectionCompartmentHistoryError}</p>}

            {!isLoadingInjectionCompartmentHistory && !injectionCompartmentHistoryError && (
              <ReservoirInjectionCompartmentChart compartmentHistory={injectionCompartmentHistory} />
            )}
          </section>
        </>
      )}
    </section>
  )
}

export default ReservoirView