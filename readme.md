# @nrk/simple-date-parse

> Simple natural language date parsing in javascript

## Installation

```bash
npm install @nrk/simple-date-parse
```
```js
import parse from '@nrk/simple-date-parse'
```

## Usage
```js
parse(
  Date|Number|String, // Date to parse.
  [Number|Date]       // Relative to this date. Optional and defaults to Date.now()
) // => Date


// Examples:
parse(0|''|null) // => Date: January 1, 1970, 00:00:00 UTC
parse('foobar') // => Date: Date.now() (any invalid keywords are ignored)
parse('now') // => Date: Date.now()
parse('+ 1 second') // => 1 second in the future
parse('- 2 minutes') // => 2 minutes ago
parse('+ 1 day') // => tomorrow
parse('- 2 weeks') // => today, 2 weeks ago
parse('+ 1 month') // => today, 1 month in the future
parse('- 2 years') // => today, 2 years ago
parse('00:00 - 1 year') // => at midnight one year ago
parse('yyyy-mm-01 + 1 year') // => first day of current month next year
parse('mon + 1 days') // => Tuesday this week
parse('friday') // => Friday this week, can be in future and past
parse('friday - 1 week') // => Friday guaranteed last week
parse('friday + 1 week') // => Friday guaranteed next week
parse('2018-01-dd + 1 week') // => Current day of month, but in January 2018 plus one week
parse('yyyy-mm-01 + 1 month(s) - 1 day') // => end current month
parse('yy00-01-01 - 100 year(s)') // => 1st of January this century minus 100 years
parse('100-1-1') // => 1st of January year 100
parse('-100-1-1') // => 1st of January year -100
parse('y00', new Date(-081, 1, 1)).getFullYear() // =>  0
parse('y0y', new Date(-081, 1, 1)).getFullYear() // => -101
parse('y0', new Date(-081, 1, 1)).getFullYear() // => -80
parse('y0yy', new Date(-081, 1, 1)).getFullYear() // => -81
parse('y0', new Date(-081, 1, 1)).getFullYear() // => -180
parse('y-0-0')  // => first day of year (keeps month within year and day within month)
parse('y-4-90') // => last day of April (keeps day within month)
```


## FAQ
### Why did you make `simple-date-parse`?

There is already a great variety of superb natural language date parsing libraries in javascript, but a great deal of them are quite forgiving and flexible in terms for formatting (for instance allowing both day before and month, understanding both "tomorrow" and "+ 1 day" etc.). Such libraries are wonderful when you are not in control of the input format, but they also comes with lots of kilobytes and needs for config for internationalisation.

`simple-date-parse` is more simple and strict in terms of format (allowing only `+/-` `year|month|week|day|hour|minute|second`, `mon|tue|wed|tur|sat|sun` and `y-m-d`), making parsing blazing fast and super lightweight (*1.27KB* gzipped). Use `simple-date-parse` generating interfaces like `<button value="+ 1 day">Tomorrow</button>` or other situations with controlled text input.


### When should I not use `simple-date-parse`?
If you are doing date manipulation, we recommend a functional approaches provided by libraries such as [Day.JS](https://github.com/xx45/dayjs), [Moment.js](https://momentjs.com/) or [date-fns](https://date-fns.org/). For more advanced natural language date parsing, checkout [SugarJS](https://sugarjs.com/dates/#/Parsing), [DateJS](https://github.com/datejs/Datejs), [Sherlock](https://github.com/neilgupta/Sherlock) or [Chrono](https://github.com/wanasit/chrono).

### Does `simple-date-parse` handle timezones, leap year, summertime etc.?

**TL;DR: yes**. Despite popular belief, the native [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object in Javascript is quite intelligent. Under the hood `simple-date-parse` converts operations to native function such as `+ 1 month === setMonth(date.getMonth() + 1)`. This avoid crazy calculations (such as `year % 4 === leap year` or `new Date().getTime() + 1000 * 60 * 60 24 * 10 === 10 days from now`) and lets native `Date` to do the heaving lifting.

## Local development
First clone `@nrk/simple-date-parse` and install its dependencies:

```bash
git clone git@github.com:nrkno/simple-date-parse.git
cd simple-date-parse
npm install && npm test:watch
```

## Building and committing
After having applied changes, remember to build before pushing the changes upstream.

```bash
git checkout -b feature/my-changes
# update the source code
npm run build
git commit -am "Add my changes"
git push origin feature/my-changes
# then make a PR to the master branch,
# and assign another developer to review your code
```

> NOTE! Please also make sure to keep commits small and clean (that the commit message actually refers to the updated files).
> Stylistically, make sure the commit message is **Capitalized** and **starts with a verb in the present tense** (for example `Add minification support`).
