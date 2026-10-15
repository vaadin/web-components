import cssNano from 'cssnano';
import fs from 'fs';
import path from 'path';
import postCssImport from 'postcss-import';
import postCssUrl from 'postcss-url';

export default {
  plugins: [
    postCssImport(),
    postCssUrl({
      filter: 'src/fonts/**',
      url: (asset) => {
        // Copy font files to the dist directory, while dropping "src" from the relative path
        const relativePath = path.relative('src', asset.relativePath);
        const distPath = path.join('dist', relativePath);
        fs.mkdirSync(path.dirname(distPath), { recursive: true });
        fs.copyFileSync(asset.absolutePath, distPath);
        return relativePath;
      },
    }),
    cssNano({
      preset: 'default',
    }),
  ],
};
