function ReservoirView({ field }) {
  return (
    <section className="panel">
      <h2>Reservoir View</h2>
      <p className="muted">
        Reservoir-level analysis for {field.name}. This will later show reservoir production trend,
        fault block contribution, and wells contributing to each reservoir.
      </p>
    </section>
  )
}

export default ReservoirView