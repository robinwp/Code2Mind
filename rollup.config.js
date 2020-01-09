import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/code2mind.min.js',
    name: 'Code2Mind',
    format: 'iife',
  },
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
