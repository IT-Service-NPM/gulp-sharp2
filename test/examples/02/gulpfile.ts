import { url2qr } from '#gulp-file2qr';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.url', { buffer: false })
    .pipe(url2qr({ qrOptions: { scale: 10 }, buffer: false }))
    .pipe(GulpClient.dest('output', { encoding: false }));
};
task1.description = 'Test gulp task for creating PNG QR codes';
GulpClient.task(task1);
