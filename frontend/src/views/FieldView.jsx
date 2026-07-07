import { useEffect, useState } from 'react'

import SummaryCards from '../components/SummaryCards'
import InjectorSummaryCards from '../components/InjectorSummaryCards'
import FieldPerformanceChart from '../components/FieldPerformanceChart'
import FieldWaterCutChart from '../components/FieldWaterCutChart'
import FieldGorChart from '../components/FieldGorChart'
import FieldWellLists from '../components/FieldWellLists'
import SurveillanceCandidates from '../components/SurveillanceCandidates'

function FieldView({ field, wells }) {
  const [fieldHistory, setFieldHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [injectors, setInjectors] = useState([])
  const [isLoadingInjectors, setIsLoadingInjectors] = useState(false)
  const [injectorError, setInjectorError] = useState('')

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