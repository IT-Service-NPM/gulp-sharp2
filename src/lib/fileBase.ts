// import assert from 'node:assert/strict';
import { Transform, type TransformCallback } from 'node:stream';
import { callbackify } from 'util';
import PluginError from 'plugin-error';
import GulpFile, { type StreamFile, type BufferFile } from 'vinyl';

const PLUGIN_NAME = 'gulp-file2qr';

/**
 * Gulp plugin base transform stream,
 * which support just BufferFile output
 *
 * @public @internal
 */
export abstract class GulpFile2BufferFile extends Transform {

  /**
   * @internal
   */
  constructor() {
    super({ objectMode: true });
  };

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
  protected async getFileText(file: GulpFile): Promise<string> {
    const fileContents: Buffer = await this.getFileBuffer(file);
    const fileText: string = fileContents.toString('utf8');
    return fileText;
  };

  /**
   * @internal
   */
  protected abstract _transform2BufferFile(
    fileText: string, sourceFile: GulpFile
  ): Promise<BufferFile>;

  /**
   * @internal
   */
  override _transform(
    file: GulpFile,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    callbackify(async (): Promise<GulpFile | undefined> => {
      if (file.isNull()) {
        return file;
      };
      const fileText: string = await this.getFileText(file);
      try {
        return await this._transform2BufferFile(fileText, file);
      } catch (error) {
        throw (error instanceof PluginError) ? error as PluginError :
          new PluginError(PLUGIN_NAME,
            error instanceof Error ? error : error as string);
      };
    })(callback);
  };

};

/**
 * GulpFile2GulpFile options
 *
 * @public
 */
export interface Options {

  /**
   * Create output GulpFile with Buffer (true),
   * or with stream (false).
   *
   * If not specified, created StreamFile
   * when input file is StreamFile,
   * and created BufferFile,
   * when input file is BufferFile.
   *
   * @public
   */
  buffer?: boolean;

};

/**
 * Gulp plugin base transform stream
 *
 * @public @internal
 */
export abstract class GulpFile2GulpFile extends GulpFile2BufferFile {

  private readonly _options: Options;

  constructor(options?: Options) {
    super();
    this._options = { ...{}, ...options };
  };

  /**
   * @internal
   */
  protected abstract _transform2StreamFile(
    fileText: string, sourceFile: GulpFile
  ): Promise<StreamFile>;

  /**
   * @internal
   */
  override _transform(
    file: GulpFile,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    callbackify(async (): Promise<GulpFile | undefined> => {
      if (file.isNull()) {
        return file;
      };
      const fileText: string = await this.getFileText(file);
      try {
        if (
          ((this._options.buffer === undefined) && (file.isStream()))
          || ((this._options.buffer !== undefined) && (!this._options.buffer))
        ) {
          return await this._transform2StreamFile(fileText, file);
        } else if (
          ((this._options.buffer === undefined) && (file.isBuffer()))
          || ((this._options.buffer !== undefined))
        ) {
          return await this._transform2BufferFile(fileText, file);
        };
      } catch (error) {
        throw (error instanceof PluginError) ? error as PluginError :
          new PluginError(PLUGIN_NAME,
            error instanceof Error ? error : error as string);
      };
    })(callback);
  };

};
