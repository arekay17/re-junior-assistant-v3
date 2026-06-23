import { useEffect, useState } from 'react'
import './App.css'

import FieldSelectionPage from './pages/FieldSelectionPage'
import FieldDashboard from './pages/FieldDashboard'
import { wellsByField } from './data/mockData'

function App() {
  const [selectedField, setSelectedField] = useState(null)
  const [backendStatus, setBackendStatus] = useState('Checking backend...')

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.message)
      })
      .catch(() => {
        setBackendStatus('Backend not connected')
      })
  }, [])

  if (!selectedField) {
    return (
      <FieldSelectionPage
        backendStatus={backendStatus}
        onSelectField={setSelectedField}
      />
    )
  }

  return (
    <FieldDashboard
      field={selectedField}
      wells={wellsByField[selectedField.id]}
      onBack={() => setSelectedField(null)}
    />
  )
}

export default App