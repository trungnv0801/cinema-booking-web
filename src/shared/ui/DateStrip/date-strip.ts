export function buildDateStripDays(startDate: Date, days: number): Date[] {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    return date
  })
}

export function isSameDate(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}
