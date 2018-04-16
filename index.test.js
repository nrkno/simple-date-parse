/* globals describe, expect, test, beforeEach */
const parse = require('./index.min.js')

describe('parse', () => {
  test('should accept dates and number/string timestamps', () => {
    const jan19170 = new Date(null).getTime()
    const date = new Date()
    const dateStamp = date.getTime()
    const dateString = String(dateStamp)

    expect(parse(date).getTime()).toBe(dateStamp)
    expect(parse(dateStamp).getTime()).toBe(dateStamp)
    expect(parse(dateString).getTime()).toBe(dateStamp)

    expect(parse('').getTime()).toBe(jan19170)
    expect(parse(0).getTime()).toBe(jan19170)
    expect(parse(null).getTime()).toBe(jan19170)
    expect(parse(false).getTime()).toBe(jan19170)
  })

  describe('relative dates', () => {
    let now
    beforeEach(() => {
      now = parse('now').getTime()
    })
    test('should be able to add a minute to current time', () => {
      const parseNext = parse('+1minute', now)
      const expected = new Date(now).setMinutes((new Date(now).getMinutes() + 1))

      expect(parseNext.getTime()).toBe(expected)
    })
    test('should be able to subtract a minute to current time', () => {
      const parsePrev = parse('-1minute', now)
      const expected = new Date(now).setMinutes((new Date(now).getMinutes() - 1))

      expect(parsePrev.getTime()).toBe(expected)
    })
    test('should be able to add an hour to current time', () => {
      const praseNext = parse('+1hour', now)
      const expected = new Date(now).setHours((new Date(now).getHours() + 1))

      expect(praseNext.getTime()).toBe(expected)
    })
    test('should be able to subtract an hour to current time', () => {
      const parsePrev = parse('-1hour', now)
      const previousDay = new Date(now).setHours((new Date(now).getHours() - 1))

      expect(parsePrev.getTime()).toBe(previousDay)
    })
    test('should be able to add a day to current time', () => {
      const parseNext = parse('+1day', now)
      const expected = new Date(now).setDate((new Date(now).getDate() + 1))

      expect(parseNext.getTime()).toBe(expected)
    })
    test('should be able to subtract a day to current time', () => {
      const parsePrev = parse('-1day', now)
      const expected = new Date(now).setDate((new Date(now).getDate() - 1))

      expect(parsePrev.getTime()).toBe(expected)
    })
    test('should be able to add a week to current time', () => {
      const parseNext = parse('+1week', now)
      const expected = new Date(now).setDate((new Date(now).getDate() + 7))

      expect(parseNext.getTime()).toBe(expected)
    })
    test('should be able to subtract a week to current time', () => {
      const parsePrev = parse('-1week', now)
      const expected = new Date(now).setDate((new Date(now).getDate() - 7))

      expect(parsePrev.getTime()).toBe(expected)
    })
    test('should be able to add a month to current time', () => {
      const parseNext = parse('+1month', now)
      const expected = new Date(now).setMonth((new Date(now).getMonth() + 1))

      expect(parseNext.getTime()).toBe(expected)
    })
    test('should be able to subtract a month to current time', () => {
      const parsePrev = parse('-1month', now)
      const expected = new Date(now).setMonth((new Date(now).getMonth() - 1))

      expect(parsePrev.getTime()).toBe(expected)
    })
    test('should be able to add a year to current time', () => {
      const parseNext = parse('+1year', now)
      const expected = new Date(now).setFullYear((new Date(now).getFullYear() + 1))

      expect(parseNext.getTime()).toBe(expected)
    })
    test('should be able to subtract a year to current time', () => {
      const parsePrev = parse('-1year', now)
      const expected = new Date(now).setFullYear((new Date(now).getFullYear() - 1))

      expect(parsePrev.getTime()).toBe(expected)
    })
  })

  describe('"from" dates', () => {
    let from
    beforeEach(() => {
      from = new Date('Sat Apr 15 2000 12:44:03 GMT+0200 (CEST)')
    })
    test.skip('should be able to use "from" parameter to set a date', () => {
      const date = parse('', from)
      expect(date.getTime()).toBe(from.getTime())
    })
    test('if "now" is provided parse should ignore the "from" parameter', () => {
      const date = parse('now', from)
      const now = new Date()
      expect(date.getFullYear()).not.toBe(2000)
      expect(date.getFullYear()).toBe(now.getFullYear())
    })
  })

  describe('combining operators', () => {
    let from
    beforeEach(() => {
      from = new Date('Sun Apr 15 2018 12:44:03 GMT+0200 (CEST)')
    })

    test('should be able to subtract a day and add a week', () => {
      const date = parse('- 1 day + 1 week', from)
      const expected = new Date(from)
      expected.setDate(expected.getDate() + 6)
      expect(date.getTime()).toBe(expected.getTime())
    })

    test('should be able to add a day and subtract a week', () => {
      const date = parse('+ 1 day - 1 week', from)
      const expected = new Date(from)
      expected.setDate(expected.getDate() - 6)
      expect(date.getTime()).toBe(expected.getTime())
    })

    test('should be able to do multiple operations', () => {
      const date = parse('+ 1 year - 5 years - 12 months + 2 days - 3 weeks', from)
      const expected = new Date(from)
      expected.setFullYear(expected.getFullYear() - 5)
      expected.setDate(expected.getDate() - 19)
      expect(date.getTime()).toBe(expected.getTime())
    })

    test('should be able to set specific day of week and add days', () => {
      const date = parse('monday + 13 days', from)
      const expected = new Date(from)
      expected.setDate(expected.getDate() + 7)
      expect(date.getTime()).toBe(expected.getTime())
    })

    test('should be able to add days and get a specific weekday', () => {
      const date = parse('+ 13 days monday', from)
      const expected = new Date(from)
      expected.setDate(expected.getDate() + 8)
      expect(date.getTime()).toBe(expected.getTime())
    })

    test('should be able to set specific date and add months', () => {
      const date = parse('2004-10-05 + 2 months', from)
      const expected = new Date(from)
      expected.setFullYear(2004)
      expected.setMonth(9 + 2)
      expected.setDate(5)
      expect(date.getTime()).toBe(expected.getTime())
    })

    test('should be able to set specific date and subtract months', () => {
      const date = parse('2004-10-05 - 2 months', from)
      const expected = new Date(from)
      expected.setFullYear(2004)
      expected.setMonth(9 - 2)
      expected.setDate(5)
      expect(date.getTime()).toBe(expected.getTime())
    })
  })

  describe('yyyy-mm-dd format', () => {
    let now
    beforeEach(() => {
      now = new Date()
    })

    test('yyyy-mm-01 should get the current year and month, but set day to the first', () => {
      const date = parse('yyyy-mm-01')

      expect(date.getFullYear()).toBe(now.getFullYear())
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(1)
    })

    // NOTE: If the month does not have 31 days, it is set to the maximum date of the month
    test('yyyy-mm-31 should get the current year and month, but set day to the last day of the month', () => {
      const date = parse('yyyy-mm-31')

      expect(date.getFullYear()).toBe(now.getFullYear())
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())
    })

    test('yyyy-01-dd should get the current year and date, but set month to January', () => {
      const date = parse('yyyy-01-dd')

      expect(date.getFullYear()).toBe(now.getFullYear())
      expect(date.getMonth()).toBe(0)
      expect(date.getDate()).toBe(now.getDate())
    })

    test('yyyy-2342-dd should get the current year and date, but set month to December', () => {
      const date = parse('yyyy-14-dd')

      expect(date.getFullYear()).toBe(now.getFullYear())
      expect(date.getMonth()).toBe(11)
      expect(date.getDate()).toBe(now.getDate())
    })

    test('19yy-mm-dd should set the first two digits to 19 and the last two digits to the last two digits of the current year', () => {
      const date = parse('19yy-mm-dd')

      // Just doing - 100 cause I assume this code won't last into the next century
      expect(date.getFullYear()).toBe(now.getFullYear() - 100)
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(now.getDate())
    })

    test('yy01-mm-dd should set the last two digits to 01 and the first two digits to the first two digits of the current year', () => {
      const date = parse('yy01-mm-dd')

      expect(date.getFullYear().toString().substr(0, 2)).toBe(now.getFullYear().toString().substr(0, 2))
      expect(date.getFullYear().toString().substr(2)).toBe('01')
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(now.getDate())
    })

    test('y25y-mm-dd should set the two middle digits to 25 and the first and last digits to the first and last digits of the current year', () => {
      const date = parse('y25y-mm-dd')

      expect(date.getFullYear().toString().charAt(0)).toBe(now.getFullYear().toString().charAt(0))
      expect(date.getFullYear().toString().charAt(3)).toBe(now.getFullYear().toString().charAt(3))
      expect(date.getFullYear().toString().substr(1, 2)).toBe('25')
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(now.getDate())
    })

    test('should be able to set dates before year 0', () => {
      const date = parse('-20yy-mm-dd')

      expect(date.getFullYear().toString()[3]).toBe(now.getFullYear().toString()[2])
      expect(date.getFullYear().toString()[4]).toBe(now.getFullYear().toString()[3])
      expect(date.getFullYear().toString().substr(0, 3)).toBe('-20')
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(now.getDate())
    })

    test('should be able to set dates before year 0 and add more years', () => {
      const date = parse('-20yy-mm-dd + 2500years')

      // Should be year 4xx where xx = 100 - yy, where are the digits from 20yy
      expect(date.getFullYear().toString()[0]).toBe('4')
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(now.getDate())
    })
  })

  describe('days of the week', () => {
    let from
    beforeEach(() => {
      from = new Date('Sun Apr 15 2018 12:44:03 GMT+0200 (CEST)')
    })

    test('"monday" should give the previous monday', () => {
      const date = parse('monday', from)
      const expectedDate = new Date(from)
      expectedDate.setDate(from.getDate() - 6)
      expect(date.getTime()).toBe(expectedDate.getTime())
    })

    test('"monday" should give the same date if the date is monday', () => {
      const monday = new Date('Mon Apr 16 2018 12:44:03 GMT+0200 (CEST)')
      const date = parse('monday', monday)
      expect(date.getTime()).toBe(monday.getTime())
    })

    test('"tuesday" should give the previous tuesday', () => {
      const date = parse('tuesday', from)
      const expectedDate = new Date(from)
      expectedDate.setDate(from.getDate() - 5)
      expect(date.getTime()).toBe(expectedDate.getTime())
    })

    test('"tuesday" should give the same date if the date is tuesday', () => {
      const tuesday = new Date('Tue Apr 17 2018 12:44:03 GMT+0200 (CEST)')
      const date = parse('tuesday', tuesday)
      expect(date.getTime()).toBe(tuesday.getTime())
    })

    test('"wednesday" should give the previous wednesday', () => {
      const date = parse('wednesday', from)
      const expectedDate = new Date(from)
      expectedDate.setDate(from.getDate() - 4)
      expect(date.getTime()).toBe(expectedDate.getTime())
    })

    test('"wednesday" should give the same date if the date is wednesday', () => {
      const wednesday = new Date('Wed Apr 18 2018 12:44:03 GMT+0200 (CEST)')
      const date = parse('wednesday', wednesday)
      expect(date.getTime()).toBe(wednesday.getTime())
    })

    test('"thursday" should give the previous thursday', () => {
      const date = parse('thursday', from)
      const expectedDate = new Date(from)
      expectedDate.setDate(from.getDate() - 3)
      expect(date.getTime()).toBe(expectedDate.getTime())
    })

    test('"thursday" should give the same date if the date is thursday', () => {
      const thursday = new Date('Thu Apr 19 2018 12:44:03 GMT+0200 (CEST)')
      const date = parse('thursday', thursday)
      expect(date.getTime()).toBe(thursday.getTime())
    })

    test('"friday" should give the previous friday', () => {
      const date = parse('friday', from)
      const expectedDate = new Date(from)
      expectedDate.setDate(from.getDate() - 2)
      expect(date.getTime()).toBe(expectedDate.getTime())
    })

    test('"friday" should give the same date if the date is friday', () => {
      const friday = new Date('Fri Apr 20 2018 12:44:03 GMT+0200 (CEST)')
      const date = parse('friday', friday)
      expect(date.getTime()).toBe(friday.getTime())
    })

    test('"saturday" should give the previous saturday', () => {
      const date = parse('saturday', from)
      const expectedDate = new Date(from)
      expectedDate.setDate(from.getDate() - 1)
      expect(date.getTime()).toBe(expectedDate.getTime())
    })

    test('"saturday" should give the same date if the date is saturday', () => {
      const saturday = new Date('Sat Apr 21 2018 12:44:03 GMT+0200 (CEST)')
      const date = parse('saturday', saturday)
      expect(date.getTime()).toBe(saturday.getTime())
    })

    test('"sunday" should give the previous sunday', () => {
      const date = parse('sunday', from)
      expect(date.getTime()).toBe(from.getTime())
    })

    test('"sunday" should give the same date if the date is sunday', () => {
      const sunday = new Date('Sun Apr 22 2018 12:44:03 GMT+0200 (CEST)')
      const date = parse('sunday', sunday)
      expect(date.getTime()).toBe(sunday.getTime())
    })
  })
})
