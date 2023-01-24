import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import esbuild from 'esbuild';
// eslint-disable-next-line import/no-extraneous-dependencies
import { sassPlugin } from 'esbuild-sass-plugin';

// Function to get all files
const fsFiles = (dirPath = './', fileType = '', fileOptions = []) => {
  // Return Files array
  const files = fs.readdirSync(dirPath);
  // Loop through files array
  files.forEach((file) => {
    // File options is an array then push items in.
    const arrPush = () => fileOptions.push(path.join(dirPath, '/', file));
    // File options is an object assign key and set value.
    // eslint-disable-next-line no-return-assign
    const objAssign = () => fileOptions[path.join(file.split('.')[0])] = path.join(dirPath, '/', file);
    // Check if `${dirPath}/${file}` is a folder or a file
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      fileOptions = fsFiles(`${dirPath}/${file}`, fileType, fileOptions);
    } else {
      // Check if fileType is an empty string and return all files.
      if (fileType === '') {
        if (Array.isArray(fileOptions)) {
          arrPush();
        } else {
          objAssign();
        }
      }
      // Check for specific file type if fileType does not equal emplty string.
      if (file.split('.')[1] === fileType) {
        if (Array.isArray(fileOptions)) {
          arrPush();
        } else {
          objAssign();
        }
      }
    }
  });
  return fileOptions;
};

// Clean out directory first
fs.rmSync('build/dist/development', { recursive: true, force: true });

let components = fsFiles('./src/components', 'ts');
components = components.filter((item) => (!item.includes('demo') && !item.includes('-base')));

const outDir = 'build/dist/development/components';
const cssFiles = [];

// Run EsBuild
// eslint-disable-next-line max-len
// npx esbuild src/components/ids-tag/ids-tag.ts src/components/ids-alert/ids-alert.ts --bundle --splitting --outdir=out --format=esm
esbuild
  .build({
    entryPoints: components,
    outdir: outDir,
    bundle: true,
    splitting: true,
    chunkNames: 'chunks/ids-[name]-[hash]',
    format: 'esm',
    plugins: [
      sassPlugin({
        type: 'css-text',
        transform(source, dir, filePath) {
          // Make the css file for standalone css
          const rootDir = path.basename(path.dirname(dir));
          if (rootDir === 'components') {
            const noHost = source.replace(':host {', ':root {');
            const comp = path.basename(path.dirname(filePath));
            const file = `${outDir}${path.sep}${comp}${path.sep}${comp}.css`;
            cssFiles.push({ file, source: noHost });
            fs.mkdirSync(path.dirname(file), { recursive: true }, () => {});
            fs.writeFileSync(file, noHost, () => {});
          }
          return source;
        }
      })
    ],
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('⚡ Build complete! ⚡');
  })
  .catch(() => process.exit(1));