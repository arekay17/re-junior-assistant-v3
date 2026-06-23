import { useState } from 'react'
import './App.css'

import FieldSelectionPage from './pages/FieldSelectionPage'
import FieldDashboard from './pages/FieldDashboard'
import { wellsByField } from './data/mockData'

function App() {
  const [selectedField, setSelectedField] = useState(null)

  if (!selectedField) {
    return <FieldSelectionPage onSelectField={setSelectedField} />
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