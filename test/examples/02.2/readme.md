### Convert images to PNG format

```typescript file=./gulpfile.ts
import { png } from '#gulp-sharp2/gulp-sharp';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.jpeg', { encoding: false })
    .pipe(png({ palette: true }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting JPEG to PNG';
GulpClient.task(task1);

```

Source and output images:

[![Source image](./fixtures/test-file.jpeg)](./fixtures/test-file.jpeg)
[![Output image](./output/test-file.png)](./output/test-file.png)
