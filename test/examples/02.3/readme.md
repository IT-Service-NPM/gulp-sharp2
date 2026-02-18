# Convert images to TIFF format

```typescript file=./gulpfile.ts
import { tiff } from '#gulp-sharp2/gulp-sharp';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.png', { encoding: false })
    .pipe(tiff({ quality: 90 }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting PNG to TIFF';
GulpClient.task(task1);
```

Source and output images:

[![Source image](./fixtures/test-file.png)](./fixtures/test-file.png)
[![Output image](./output/test-file.tiff)](./output/test-file.tiff)
