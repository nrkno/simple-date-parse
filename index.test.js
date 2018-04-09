/* globals describe, expect, test */
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
})
