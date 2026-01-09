// import assert from 'node:assert/strict';
import { Transform, type ResultCallback } from 'streamx';
import { callbackify } from 'util';
import PluginError from 'plugin-error';
import GulpFile, { type BufferFile } from 'vinyl';

export type gulpPlugin = NodeJS.ReadWriteStream;

/**
 * Gulp plugin base class
 *
 * @public @internal
 */
export abstract class Plugin extends Transform<GulpFile> {

  /**
   * @internal
   */
  protected readonly pluginName: string;

  /**
 * @internal
 */
  protected constructor(
    pluginName: string
  ) {
    super();
    this.pluginName = pluginName;
  };

  /**
  * return gulp plugin, compatible with `.pipe`
  *
  * @public @internal
  */
  public getPlugin(): gulpPlugin {
    return this as unknown as gulpPlugin;
  };

};

/**
 * Gulp plugin base transform stream,
 * which support just BufferFile output
 *
 * @public @internal
 */
export abstract class GulpFile2BufferFile extends Plugin {

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
    throw new PluginError(this.pluginName,
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
          new PluginError(this.pluginName,
            error instanceof Error ? error : error as string);
      };
    })(callback);
  };

};
