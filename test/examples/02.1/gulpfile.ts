import { jpeg as gulpJpeg } from '#gulp-sharp2/gulp-sharp';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.png', { encoding: false })
    .pipe(gulpJpeg({ quality: 90 }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting PNG to JPEG';
GulpClient.task(task1);
