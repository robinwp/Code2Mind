// import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript'

export default {
  input: 'src/core/Code2Mind.ts',
  output: {
    file: 'dist/code2mind.js',
    name:'Code2Mind',
    format: 'umd'
  },
  plugins: [
    typescript(),
    babel({
      exclude: 'node_modules/**'
    }),
    // terser()
  ]
};
