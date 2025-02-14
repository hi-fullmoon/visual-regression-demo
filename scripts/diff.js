import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export function diff(target, benchmark) {
  const img1 = PNG.sync.read(fs.readFileSync(target));
  const img2 = PNG.sync.read(fs.readFileSync(benchmark));

  const { width, height } = img2;
  const diff = new PNG({ width, height });

  try {
    const numDiffPixels = pixelmatch(img2.data, img1.data, diff.data, width, height, {
      threshold: 0.1,
    });

    if (numDiffPixels > 0) {
      fs.writeFileSync('kms-home-page-diff.png', PNG.sync.write(diff));
      console.log('Diff image saved to kms-home-page-diff.png');
    }
  } catch (error) {
    console.error('Error comparing images:', error);
  }
}
