const pkg = require('./package.json')
const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify')

export default {
  input: pkg.main.replace('.min.', '.'),
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'simpleDateParse',
    sourcemap: true
  },
  plugins: [buble(), uglify()]
}
