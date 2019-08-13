import pkg from './package.json'
import buble from 'rollup-plugin-buble'
import serve from 'rollup-plugin-serve'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: pkg.main.replace('.min.', '.'),
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'simpleDateParse',
    sourcemap: true
  },
  plugins: [
    buble(),
    uglify(),
    Boolean(process.env.ROLLUP_WATCH) && serve()
  ]
}
