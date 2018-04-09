// [date|timestamp|string], [timestamp|Date]
// 0, '', null = January 1, 1970, 00:00:00 UTC
// now = now
// + 1 second(s)
// - 1 minute(s)
// + 1 day(s)
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

export default function parse (parse, from) {
  if (isFinite(parse)) return new Date(Number(parse)) // Allow timestamps and Date instances

  const text = String(parse).toLowerCase()
  const date = new Date(isFinite(from) ? from : Date.now())
  const name = {year: 'FullYear', month: 'Month', week: 'Date', day: 'Date', hour: 'Hours', minute: 'Minutes', second: 'Seconds'}
  const math = /([+-]\s*\d+)\s*(second|minute|hour|day|week|month|year)|(mon)|(tue)|(wed)|(thu)|(fri)|(sat)|(sun)/g
  const [, year = 'y', month = 'm', day = 'd'] = text.match(/([-\dy]+)[-/.]([\dm]{1,2})[-/.]([\dd]{1,2})/) || []
  const [, hour = 'h', minute = 'm', second = 's'] = text.match(/([\dh]{1,2}):([\dm]{1,2}):?([\ds]{1,2})?/) || []
  let match = {year, month, day, hour, minute, second}

  Object.keys(match).forEach((unit) => {
    const move = unit === 'month' ? 1 : 0 // Month have zero based index
    const prev = `${date[`get${name[unit]}`]() + move}` // Shift to consistent index
    const next = match[unit].replace(/[^-\d]+/g, (match, index, next) => { // Replace non digit chars
      if (index) return prev.substr(prev.length - next.length + index, match.length) // Inside: copy match.length
      return prev.substr(0, Math.max(0, prev.length - next.length + match.length)) // Start: copy leading chars
    })

    date[`set${name[unit]}`](next - move)
  })

  while ((match = math.exec(text)) !== null) { // match = [fullMatch, number, unit, mon, tue, etc...]
    const unit = match[2]
    const size = String(match[1]).replace(/\s/g, '') * (unit === 'week' ? 7 : 1) // Strip whitespace and correct week
    const day = match.slice(2).indexOf(match[0]) // Weekdays starts at 3rd index but is not zero based

    if (unit) date[`set${name[unit]}`](date[`get${name[unit]}`]() + size)
    else date.setDate(date.getDate() - (date.getDay() || 7) + day) // Make sunday 7th day
  }

  return date
}
