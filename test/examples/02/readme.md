### Create QRCode in streaming mode with scale

Read .url files in streaming mode
and create PNG QRCodes with `scale = 10`.

```typescript file=./gulpfile.ts
import { url2qr } from '#gulp-file2qr';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.url', { buffer: false })
    .pipe(url2qr({ qrOptions: { scale: 10 }, buffer: false }))
    .pipe(GulpClient.dest('output', { encoding: false }));
};
task1.description = 'Test gulp task for creating PNG QR codes';
GulpClient.task(task1);
```

.url files — INI files. For example:

```ini file=./fixtures/test-file.url
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,2
[InternetShortcut]
URL=https://github.com/IT-Service-NPM/gulp-file2qr
```

QRCode:

[![QRCode](./output/test-file.png)](./output/test-file.png)
