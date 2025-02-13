import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export function diff(target, benchmark) {
  const img1 = PNG.sync.read(fs.readFileSync(target));
  const img2 = PNG.sync.read(fs.readFileSync(benchmark));

  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  });

  if (numDiffPixels > 0) {
    fs.writeFileSync('kms-home-page-diff.png', PNG.sync.write(diff));
    console.log('Diff image saved to kms-home-page-diff.png');
  }
}
