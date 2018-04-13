# @nrk/simple-date-parse

> Simple natural language date parsing in javascript

## Installation

```bash
npm i @nrk/simple-date-parse --save
```
```js
import parse from '@nrk/simple-date-parse'
```

## Usage
```js
parse(Date|Number|String, [Number|Date]) // => Date

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
// y-0-0 = first day of year (keeps month within year and day within month)
// y-4-90 = last day of april (keeps day within month)
```


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
