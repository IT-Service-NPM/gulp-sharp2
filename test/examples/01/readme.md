# Convert SVG to monochrome PNG

`sharp2` can create monochrome PNG from .svg files.

```typescript file=./gulpfile.ts
import { sharp2 } from 'gulp-sharp2';
import GulpClient from 'gulp';
import rename from 'gulp-rename';

function task1() {
  return GulpClient.src('fixtures/*.svg', { encoding: false })
    .pipe(sharp2((sharpObject) => sharpObject
      .resize({ width: 600 })
      .toColorspace('b-w')
      .png({
        compressionLevel: 9,
        colors: 2
      }),
      {
        sharpOptions: {
          density: 600,
          ignoreIcc: true
        }
      }
    ))
    .pipe(rename({ extname: '.png' }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting SVG to monochrome PNG';
GulpClient.task(task1);
```

Source SVG image:

[![Source SVG](./fixtures/test-file.svg)](./fixtures/test-file.svg)

Output PNG image:

[![Output PNG](./output/test-file.png)](./output/test-file.png)
