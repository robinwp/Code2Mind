import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [{
    file: 'dist/code2mind.min.js',
    name: 'Code2Mind',
    format: 'iife',
  }, {
    file: 'dist/code2mind.umd.js',
    name: 'Code2Mind',
    format: 'umd',
  }],
  plugins: [
    postcss({
      extensions: ['.css'],
    }),
    typescript(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};
