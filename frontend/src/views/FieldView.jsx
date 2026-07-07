import { useEffect, useState } from 'react'

import SummaryCards from '../components/SummaryCards'
import InjectorSummaryCards from '../components/InjectorSummaryCards'
import FieldPerformanceChart from '../components/FieldPerformanceChart'
import FieldWaterCutChart from '../components/FieldWaterCutChart'
import FieldGorChart from '../components/FieldGorChart'
import FieldWellLists from '../components/FieldWellLists'
import SurveillanceCandidates from '../components/SurveillanceCandidates'
import FieldWaterInjectionChart from '../components/FieldWaterInjectionChart'
import FieldGasInjectionChart from '../components/FieldGasInjectionChart'

function FieldView({ field, wells }) {
  const [fieldHistory, setFieldHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [injectors, setInjectors] = useState([])
  const [isLoadingInjectors, setIsLoadingInjectors] = useState(false)
  const [injectorError, setInjectorError] = useState('')
  const [injectionHistory, setInjectionHistory] = useState([])
  const [isLoadingInjectionHistory, setIsLoadingInjectionHistory] = useState(false)
  const [injectionHistoryError, setInjectionHistoryError] = useState('')

  useEffect(() => {
    setIsLoading(true)
    setError('')

    fetch(`/api/fields/${field.id}/history`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load field history')
        }

        return response.json()
      })
      .then((data) => {
        setFieldHistory(data)
      })
      .catch(() => {
        setFieldHistory([])
        setError('Unable to load field history')
      })
      .finally(() => {
        setIsLoading(false)
      })

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
        setInjectorError('Unable to load injector summary')
      })
      .finally(() => {
        setIsLoadingInjectors(false)
      })
    
    setIsLoadingInjectionHistory(true)
    setInjectionHistoryError('')

    fetch(`/api/fields/${field.id}/injection-history`)
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
        setInjectionHistoryError('Unable to load injection history')
      })
      .finally(() => {
        setIsLoadingInjectionHistory(false)
      })

  }, [field])

  return (
    <>
      <section className="field-section">
        <div className="section-heading">
          <p className="eyebrow">Field Performance</p>
          <h2>Production and Injection Overview</h2>
        </div>

        <SummaryCards wells={wells} />

        {isLoadingInjectors && <p>Loading injector summary...</p>}
        {injectorError && <p>{injectorError}</p>}
        {!isLoadingInjectors && !injectorError && (
          <InjectorSummaryCards injectors={injectors} />
        )}

        <section className="panel">
          <h3>Production Performance</h3>
          {isLoading && <p>Loading field history...</p>}
          {error && <p>{error}</p>}

          {!isLoading && !error && (
            <>
              <FieldPerformanceChart history={fieldHistory} />
              <FieldWaterCutChart history={fieldHistory} />
              <FieldGorChart history={fieldHistory} />
            </>
          )}
        </section>

        <section className="panel">
          <h3>Injection Performance</h3>

          {isLoadingInjectionHistory && <p>Loading injection history...</p>}

          {injectionHistoryError && <p>{injectionHistoryError}</p>}

          {!isLoadingInjectionHistory && !injectionHistoryError && (
            <>
              <FieldWaterInjectionChart history={injectionHistory} />
              <FieldGasInjectionChart history={injectionHistory} />
            </>
          )}
        </section>
        
      </section>

      <section className="field-section">
        <div className="section-heading">
          <p className="eyebrow">Field Surveillance</p>
          <h2>Wells Requiring Attention</h2>
        </div>

        <FieldWellLists wells={wells} />
        <SurveillanceCandidates wells={wells} />
      </section>
    </>
  )
}

export default FieldView