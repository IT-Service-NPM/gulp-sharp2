### Convert images to JPEG format

```typescript file=./gulpfile.ts
import { jpeg as gulpJpeg } from '#gulp-sharp2/gulp-sharp';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.png', { encoding: false })
    .pipe(gulpJpeg({ quality: 90 }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting PNG to JPEG';
GulpClient.task(task1);

```

Source image:

[![Source image](./fixtures/test-file.png)](./fixtures/test-file.png)

Output JPEG image:

[![Output image](./output/test-file.jpeg)](./output/test-file.jpeg)
