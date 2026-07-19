function getCalendarDays(productionMonth) {
  const [year, month] = productionMonth.split('-').map(Number)
  return new Date(year, month, 0).getDate()
}

module.exports = {
  getCalendarDays,
}