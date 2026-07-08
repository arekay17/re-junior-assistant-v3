import { useEffect, useState } from 'react'

import FieldView from '../views/FieldView'
import WellView from '../views/WellView'
import ReservoirView from '../views/ReservoirView'

function FieldDashboard({
  field,
  wells,
  isLoadingWells,
  wellsError,
  onBack,
}) {
  const [activeView, setActiveView] = useState('field')

  const [selectedProducer, setSelectedProducer] = useState(null)
  const [selectedInjector, setSelectedInjector] = useState(null)

  const [productionHistory, setProductionHistory] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState('')

  const [injectionHistory, setInjectionHistory] = useState([])
  const [isLoadingInjectionHistory, setIsLoadingInjectionHistory] =
  useState(false)
  const [injectionHistoryError, setInjectionHistoryError] = useState('')

  const [reservoirHistory, setReservoirHistory] = useState([])
  const [isLoadingReservoirHistory, setIsLoadingReservoirHistory] =
    useState(false)
  const [reservoirHistoryError, setReservoirHistoryError] = useState('')

  const [injectors, setInjectors] = useState([])
  const [isLoadingInjectors, setIsLoadingInjectors] = useState(false)
  const [injectorError, setInjectorError] = useState('')

  useEffect(() => {
    if (wells.length > 0) {
      setSelectedProducer(wells[0])
    }
  }, [wells])

  useEffect(() => {
    if (injectors.length > 0) {
      setSelectedInjector(injectors[0])
    }
  }, [injectors])

  useEffect(() => {
    if (!field) {
      return
    }

    setIsLoadingInjectors(true)
    setInjectorError('')

    fetch(`/api/fields/${field.id}/injectors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load injectors')
        }

        return response.json()
      })
      .then((data) => {
        setInjectors(data)
      })
      .catch(() => {
        setInjectors([])
        setInjectorError('Unable to load injectors')
      })
      .finally(() => {
        setIsLoadingInjectors(false)
      })
  }, [field])

  useEffect(() => {
    if (!selectedProducer) {
      return
    }

    setIsLoadingHistory(true)
    setHistoryError('')

    fetch(`/api/wells/${selectedProducer.id}/history`)
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

    fetch(`/api/wells/${selectedProducer.id}/reservoir-history`)
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
  }, [selectedProducer])

  useEffect(() => {
  if (!selectedInjector) {
    return
  }

  setIsLoadingInjectionHistory(true)
  setInjectionHistoryError('')

  fetch(`/api/injectors/${selectedInjector.id}/history`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load injection history')
      }

      return response.json()
    })
    .then((data) => {
      setInjectionHistory(data)
    })
    .catch(() => {
      setInjectionHistory([])
      setInjectionHistoryError(
        'Unable to load injection history'
      )
    })
    .finally(() => {
      setIsLoadingInjectionHistory(false)
    })
}, [selectedInjector])

  return (
    <main className="app">
      <button type="button" className="back-button" onClick={onBack}>
        Back to fields
      </button>

      <header className="header">
        <p className="eyebrow">Reservoir Engineering</p>
        <h1>{field.name} Dashboard</h1>
        <p className="subtitle">
          Select a surveillance view for field, well, or reservoir analysis.
        </p>
      </header>

      <section className="view-tabs">
        <button
          type="button"
          className={activeView === 'field' ? 'active-tab' : ''}
          onClick={() => setActiveView('field')}
        >
          Field View
        </button>

        <button
          type="button"
          className={activeView === 'well' ? 'active-tab' : ''}
          onClick={() => setActiveView('well')}
        >
          Well View
        </button>

        <button
          type="button"
          className={activeView === 'reservoir' ? 'active-tab' : ''}
          onClick={() => setActiveView('reservoir')}
        >
          Reservoir View
        </button>
      </section>

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

      {!isLoadingWells && !wellsError && activeView === 'field' && (
        <FieldView field={field} wells={wells} />
      )}

      {!isLoadingWells &&
        !wellsError &&
        activeView === 'well' &&
        selectedProducer && (
          <WellView
            wells={wells}
            selectedProducer={selectedProducer}
            setSelectedProducer={setSelectedProducer}
            productionHistory={productionHistory}
            isLoadingHistory={isLoadingHistory}
            historyError={historyError}
            reservoirHistory={reservoirHistory}
            isLoadingReservoirHistory={isLoadingReservoirHistory}
            reservoirHistoryError={reservoirHistoryError}
            injectors={injectors}
            selectedInjector={selectedInjector}
            setSelectedInjector={setSelectedInjector}
            isLoadingInjectors={isLoadingInjectors}
            injectorError={injectorError}
            injectionHistory={injectionHistory}
            isLoadingInjectionHistory={isLoadingInjectionHistory}
            injectionHistoryError={injectionHistoryError}
          />
        )}

      {!isLoadingWells && !wellsError && activeView === 'reservoir' && (
        <ReservoirView field={field} />
      )}
    </main>
  )
}

export default FieldDashboard