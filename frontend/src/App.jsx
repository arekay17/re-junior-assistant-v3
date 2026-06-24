import { useEffect, useState } from 'react'
import './App.css'

import FieldSelectionPage from './pages/FieldSelectionPage'
import FieldDashboard from './pages/FieldDashboard'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking backend...')
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const [wells, setWells] = useState([])

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
      .then((response) => response.json())
      .then((data) => {
        setFields(data)
      })
      .catch(() => {
        setFields([])
      })
  }, [])

  function handleSelectField(field) {
    setSelectedField(field)

    fetch(`/api/fields/${field.id}/wells`)
      .then((response) => response.json())
      .then((data) => {
        setWells(data)
      })
      .catch(() => {
        setWells([])
      })
  }

  if (!selectedField) {
    return (
      <FieldSelectionPage
        backendStatus={backendStatus}
        fields={fields}
        onSelectField={handleSelectField}
      />
    )
  }

  return (
    <FieldDashboard
      field={selectedField}
      wells={wells}
      onBack={() => setSelectedField(null)}
    />
  )
}

export default App