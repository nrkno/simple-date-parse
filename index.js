const DATE = { year: 'FullYear', month: 'Month', week: 'Date', day: 'Date', hour: 'Hours', minute: 'Minutes', second: 'Seconds' }
const ADD = /([+-]\s*\d+)\s*(second|minute|hour|day|week|month|year)|(mon)|(tue)|(wed)|(thu)|(fri)|(sat)|(sun)/g
const YMD = /([-\dy]+)[-/.]([\dm]+)[-/.]([\dd]+)/
const HMS = /([\dh]+):([\dm]+):?([\ds]+)?/

export default function parse (parse, from) {
  if (isFinite(parse)) return new Date(Number(parse)) // Allow timestamps and Date instances

  const text = String(parse).toLowerCase()
  const date = new Date((isFinite(from) && text.indexOf('now') === -1) ? Number(from) : Date.now())
  const [, year = 'y', month = 'm', day = 'd'] = text.match(YMD) || []
  const [, hour = 'h', minute = 'm', second = 's'] = text.match(HMS) || []
  let match = { year, month, day, hour, minute, second }

  Object.keys(match).forEach((unit) => {
    const move = unit === 'month' ? 1 : 0 // Month have zero based index
    const prev = String(date[`get${DATE[unit]}`]() + move) // Shift to consistent index
    match[unit] = match[unit].replace(/[^-\d]+/g, (match, index, next) => { // Replace non digit chars
      if (index) return prev.substr(prev.length - next.length + index, match.length) // Inside: copy match.length
      return prev.substr(0, Math.max(0, prev.length - next.length + match.length)) // Start: copy leading chars
    }) - move
  })

  // Keep units within boundries
  const lastDayInMonth = new Date(match.year, Math.min(12, match.month + 1), 0).getDate()
  date.setFullYear(match.year, Math.min(11, match.month), Math.max(1, Math.min(lastDayInMonth, match.day)))
  date.setHours(Math.min(24, match.hour), Math.min(59, match.minute), Math.min(59, match.second))

  while ((match = ADD.exec(text)) !== null) { // match = [fullMatch, number, unit, mon, tue, etc...]
    const unit = match[2]
    const size = String(match[1]).replace(/\s/g, '') * (unit === 'week' ? 7 : 1) // Strip whitespace and correct week
    const day = match.slice(2).indexOf(match[0]) // Weekdays starts at 3rd index but is not zero based
    const before = date.getDate()

    if (unit) date[`set${DATE[unit]}`](date[`get${DATE[unit]}`]() + size) // Add day/month/week etc
    else date.setDate(date.getDate() - (date.getDay() || 7) + day) // Adjust weekday and make sunday 7th day

    // If day of month has changed, we have encountered dfferent length months, or leap year
    if ((unit === 'month' || unit === 'year') && before !== date.getDate()) date.setDate(0)
  }

  return date
}
