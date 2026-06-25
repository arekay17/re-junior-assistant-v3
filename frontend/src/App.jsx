import { useEffect, useState } from 'react'
import './App.css'

import FieldSelectionPage from './pages/FieldSelectionPage'
import FieldDashboard from './pages/FieldDashboard'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking backend...')

  const [fields, setFields] = useState([])
  const [isLoadingFields, setIsLoadingFields] = useState(true)
  const [fieldsError, setFieldsError] = useState('')

  const [selectedField, setSelectedField] = useState(null)

  const [wells, setWells] = useState([])
  const [isLoadingWells, setIsLoadingWells] = useState(false)
  const [wellsError, setWellsError] = useState('')

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.message)
      })
      .catch(() => {
        setBackendStatus('Backend not connected')
      })

    fetch('/api/fields')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load fields')
        }

        return response.json()
      })
      .then((data) => {
        setFields(data)
        setFieldsError('')
      })
      .catch(() => {
        setFields([])
        setFieldsError('Unable to load fields from backend')
      })
      .finally(() => {
        setIsLoadingFields(false)
      })
  }, [])

  function handleSelectField(field) {
    setSelectedField(field)
    setWells([])
    setWellsError('')
    setIsLoadingWells(true)

    fetch(`/api/fields/${field.id}/wells`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load wells')
        }

        return response.json()
      })
      .then((data) => {
        setWells(data)
        setWellsError('')
      })
      .catch(() => {
        setWells([])
        setWellsError('Unable to load wells from backend')
      })
      .finally(() => {
        setIsLoadingWells(false)
      })
  }

  function handleBackToFields() {
    setSelectedField(null)
    setWells([])
    setWellsError('')
    setIsLoadingWells(false)
  }

  if (!selectedField) {
    return (
      <FieldSelectionPage
        backendStatus={backendStatus}
        fields={fields}
        isLoadingFields={isLoadingFields}
        fieldsError={fieldsError}
        onSelectField={handleSelectField}
      />
    )
  }

  return (
    <FieldDashboard
      field={selectedField}
      wells={wells}
      isLoadingWells={isLoadingWells}
      wellsError={wellsError}
      onBack={handleBackToFields}
    />
  )
}

export default App