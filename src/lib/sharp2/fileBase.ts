// import assert from 'node:assert/strict';
import { Transform, type ResultCallback } from 'streamx';
import { callbackify } from 'util';
import PluginError from 'plugin-error';
import GulpFile, { type BufferFile } from 'vinyl';

const PLUGIN_NAME = 'gulp-file2qr';

/**
 * Gulp plugin base transform stream,
 * which support just BufferFile output
 *
 * @public @internal
 */
export abstract class GulpFile2BufferFile extends Transform<GulpFile> {

  /**
   * @internal
   */
  protected async getFileBuffer(file: GulpFile): Promise<Buffer> {
    if (file.isBuffer()) {
      return file.contents;
    };
    if (file.isStream()) {
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        file.contents
          .on('data', (chunk: string) => chunks.push(Buffer.from(chunk)))
          .on('close', resolve)
          .on('end', resolve)
          .on('error', reject);
      });
      const fileContents = Buffer.concat(chunks);
      return fileContents;
    };
    throw new PluginError(PLUGIN_NAME,
      `Null GulpFile processing does not supported (${file.path})`
    );
  };

  /**
   * @internal
   */
  protected abstract _transform2BufferFile(
    fileContent: Buffer, sourceFile: GulpFile
  ): Promise<BufferFile>;

  /**
   * @internal
   */
  override _transform(
    file: GulpFile,
    callback: ResultCallback<GulpFile>
  ): void {
    callbackify(async (): Promise<GulpFile | undefined> => {
      if (file.isNull()) {
        return file;
      };
      const fileContent: Buffer = await this.getFileBuffer(file);
      try {
        return await this._transform2BufferFile(fileContent, file);
      } catch (error) {
        throw (error instanceof PluginError) ? error as PluginError :
          new PluginError(PLUGIN_NAME,
            error instanceof Error ? error : error as string);
      };
    })(callback);
  };

};
