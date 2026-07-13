import { useEffect, useState } from 'react'

import ReservoirTable from '../components/ReservoirTable'
import ReservoirDetail from '../components/ReservoirDetail'

function ReservoirView({ field }) {
  const [reservoirs, setReservoirs] = useState([])
  const [selectedReservoir, setSelectedReservoir] = useState(null)
  const [isLoadingReservoirs, setIsLoadingReservoirs] = useState(false)
  const [reservoirError, setReservoirError] = useState('')

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

        if (data.length > 0) {
          setSelectedReservoir(data[0])
        }
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

  return (
    <>
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
          <section className="layout">
            <ReservoirTable
              reservoirs={reservoirs}
              selectedReservoir={selectedReservoir}
              onSelectReservoir={setSelectedReservoir}
            />

            <ReservoirDetail selectedReservoir={selectedReservoir} />
          </section>
        )}
      </section>
    </>
  )
}

export default ReservoirView