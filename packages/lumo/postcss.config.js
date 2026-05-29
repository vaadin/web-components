import cssNano from 'cssnano';
import postCssImport from 'postcss-import';

export default {
  plugins: [
    postCssImport(),
    cssNano({
      preset: 'default',
    }),
  ],
};
