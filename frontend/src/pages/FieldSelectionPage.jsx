
function FieldSelectionPage({ backendStatus, fields, isLoadingFields, fieldsError, onSelectField }) {
  return (
    <main className="app">
      <header className="header">
        <p className="eyebrow">Reservoir Engineering</p>
        <h1>RE Junior Assistant</h1>
        <p className="subtitle">Select a field to begin surveillance review.</p>
        <p className="backend-status">Backend: {backendStatus}</p>
      </header>
      <section className="field-grid">
        {isLoadingFields && (
          <div className="panel">
            <p>Loading fields...</p>
          </div>
        )}

        {fieldsError && (
          <div className="panel">
            <p>{fieldsError}</p>
          </div>
        )}

        {!isLoadingFields &&
          !fieldsError &&
          fields.map((field) => (
            <button
              key={field.id}
              type="button"
              className="field-card"
              onClick={() => onSelectField(field)}
            >
              <span>Field</span>
              <strong>{field.name}</strong>
              <p>{field.description}</p>
            </button>
          ))}
      </section>
      
    </main>
  )
}

export default FieldSelectionPage