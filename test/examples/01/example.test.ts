import { describe, expect, it, beforeEach } from 'vitest';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs';
import looksSame from 'looks-same';
import GulpClient from 'gulp';
import './gulpfile.ts';

// const testSrcFilesPath: string = path.join(__dirname, 'fixtures');
const testDestFilesPath: string = path.join(__dirname, 'output');
const testSnapshotFilesPath: string = path.join(__dirname, 'snapshot');

describe('sharp2', () => {

  beforeEach(() => {
    fs.rmSync(testDestFilesPath, { force: true, recursive: true });
  });

  it('must transform SVG image', async () => {
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

    const testDestFilePath = path.join(testDestFilesPath, 'test-file.png');
    const testSnapshotFilePath =
      path.join(testSnapshotFilesPath, 'test-file.png');
    expect(
      fs.existsSync(testDestFilePath),
      `Output file expected: "${testDestFilePath}"`
    ).toBeTruthy();

    const { equal } = await looksSame(testDestFilePath, testSnapshotFilePath);
    expect(equal,
      'Output file must be the same as snapshot'
    ).toBeTruthy();
  });

});
