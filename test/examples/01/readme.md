### Create PNG QRCode from .url files with default settings

`url2qr` can create PNG QRCodes from .url files.

```typescript file=./gulpfile.ts
import { url2qr } from '#gulp-file2qr';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.url')
    .pipe(url2qr())
    .pipe(GulpClient.dest('output'));
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
