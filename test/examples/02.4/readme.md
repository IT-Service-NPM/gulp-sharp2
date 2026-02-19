# Convert images to WebP format

```typescript file=./gulpfile.ts
import { webp } from 'gulp-sharp2/gulp-sharp';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.jpeg', { encoding: false })
    .pipe(webp({ preset: 'drawing' }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting JPEG to WebP';
GulpClient.task(task1);
```

Source and output images:

[![Source image](./fixtures/test-file.jpeg)](./fixtures/test-file.jpeg)
[![Output image](./output/test-file.webp)](./output/test-file.webp)
