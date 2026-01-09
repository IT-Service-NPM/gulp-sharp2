import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs';
// import looksSame from 'looks-same';
import GulpClient from 'gulp';
import './gulpfile.ts';

// const testSrcFilesPath: string = path.join(__dirname, 'fixtures');
const testDestFilesPath: string = path.join(__dirname, 'output');

describe('png', () => {

  beforeEach(() => {
    fs.rmSync(testDestFilesPath, { force: true, recursive: true });
  });

  it('must convert JPEG image to PNG', async () => {
    const _cwd = process.cwd();
    try {
      process.chdir(__dirname);
      /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
      await promisify(GulpClient.series('task1'))();
    } finally {
      process.chdir(_cwd);
    };

    // expect(testDestFilesPath).toBeDirectory();
    expect(
      fs.existsSync(testDestFilesPath),
      `Output directory must be exists: "${testDestFilesPath}"`
    ).toBeTruthy();

    // const testSrcFilePath = path.join(testSrcFilesPath, 'test-file.jpeg');
    const testDestFilePath = path.join(testDestFilesPath, 'test-file.png');
    expect(
      fs.existsSync(testDestFilePath),
      `Output file expected: "${testDestFilePath}"`
    ).toBeTruthy();

    // const { equal } = await looksSame(testSrcFilePath, testDestFilePath, {
    //   strict: false,
    //   tolerance: 10,
    //   ignoreCaret: true
    // });
    // expect(equal,
    //   'Output image must be the same as input'
    // ).toBeTruthy();
  });

});
