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
