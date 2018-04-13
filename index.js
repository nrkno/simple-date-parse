// [date|timestamp|string], [timestamp|Date]
// 0, '', null = January 1, 1970, 00:00:00 UTC
// now = now
// + 1 second(s)
// - 1 minute(s)
// + 1 day(s) relative to "from" ("from" defaults to Date.now())
// now + 1 day(s) relative to Date.now(), even if "from" is provided
// - 1 week(s)
// + 1 month(s)
// - 1 year(s)
// 00:00 - 1 year(s)
// yyyy-mm-01 + 1 year
// monday + 1 days
// tue + 1 week(s)
// friday = friday this week, can be in future and past
// monday - 3 days = friday guaranteed last week
// sunday + 5 days = friday guaranteed next week
// 2018-01-dd + 1 week
// yyyy-mm-01 + 1 month(s) - 1 day = end current month
// yy00-01-01 - 100 year(s)
// 100-1-1 - 1st of January year 100
// -100-1-1 - 1st of January year -100
// -081 + y00 = 0
// -181 + y0y = -101
// -181 + y0 = -80
// -181 + y0yy = -81
// -181 + y0 = -180
// y-0-0 = first day of year (keeps month within year and day within month)
// y-4-90 = last day of april (keeps day within month)

const DATE = {year: 'FullYear', month: 'Month', week: 'Date', day: 'Date', hour: 'Hours', minute: 'Minutes', second: 'Seconds'}
const ADD = /([+-]\s*\d+)\s*(second|minute|hour|day|week|month|year)|(mon)|(tue)|(wed)|(thu)|(fri)|(sat)|(sun)/g
const YMD = /([-\dy]+)[-/.]([\dm]{1,2})[-/.]([\dd]{1,2})/
const HMS = /([\dh]{1,2}):([\dm]{1,2}):?([\ds]{1,2})?/

export default function parse (parse, from) {
  if (isFinite(parse)) return new Date(Number(parse)) // Allow timestamps and Date instances

  const text = String(parse).toLowerCase()
  const date = new Date((isFinite(from) && text.indexOf('now') === -1) ? Number(from) : Date.now())
  const [, year = 'y', month = 'm', day = 'd'] = text.match(YMD) || []
  const [, hour = 'h', minute = 'm', second = 's'] = text.match(HMS) || []
  let match = {year, month, day, hour, minute, second}

  Object.keys(match).forEach((unit) => {
    const move = unit === 'month' ? 1 : 0 // Month have zero based index
    const prev = `${date[`get${DATE[unit]}`]() + move}` // Shift to consistent index
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

    if (unit) date[`set${DATE[unit]}`](date[`get${DATE[unit]}`]() + size)
    else date.setDate(date.getDate() - (date.getDay() || 7) + day) // Make sunday 7th day
  }

  return date
}
