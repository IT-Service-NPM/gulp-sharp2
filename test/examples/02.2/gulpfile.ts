import { png } from '#gulp-sharp2/gulp-sharp';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.jpeg', { encoding: false })
    .pipe(png({ palette: true }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting JPEG to PNG';
GulpClient.task(task1);
