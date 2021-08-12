import buble from '@rollup/plugin-buble'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

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
    terser(),
    Boolean(process.env.ROLLUP_WATCH) && serve()
  ]
}
