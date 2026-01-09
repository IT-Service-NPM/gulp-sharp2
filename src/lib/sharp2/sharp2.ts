/**
 * A Gulp plugin for images processing with Sharp
 *
 * This plugin is a convenience plugin
 * that wrap images files to
 * {@link https://www.npmjs.com/package/sharp| Sharp} object,
 * processes it using a callback function,
 * and pushes the results back into the pipe.
 *
 * @packageDocumentation
 */

import GulpFile, { type BufferFile } from 'vinyl';
import { GulpFile2BufferFile } from './fileBase.ts';
import sharp, { type Sharp, type SharpOptions } from 'sharp';

/**
 * {@link sharp2} plugin options
 *
 * @remarks
 *
 * See {@link https://www.npmjs.com/package/sharp| Sharp}
 * for more details.
 *
 * @public
 */
export interface Options {

  /**
   * Options for
   * {@link https://www.npmjs.com/package/sharp| Sharp} object.
   *
   * See {@link https://www.npmjs.com/package/sharp| Sharp}
   * for more details.
   *
   * @public
   */
  sharpOptions?: SharpOptions;

};

/**
 * {@link sharp2} Process function,
 * used for {@link https://www.npmjs.com/package/sharp| Sharp}
 * object transformation.
 *
 * @param sharpObject - {@link https://www.npmjs.com/package/sharp| Sharp}
 *  object with image for processing
 *
 * @remarks
 *
 * @see {@link sharp2}
 *
 * @public
 */
export type Process = (sharpObject: Sharp) => Sharp;

/**
 * Gulp plugin stream for transformation
 * images with
 * {@link https://www.npmjs.com/package/sharp| Sharp}.
 *
 * @public @internal
 */
export class GulpFileTransformWithSharp extends GulpFile2BufferFile {

  /**
   * @internal
   */
  protected readonly options: Options;

  /**
   * @internal
   */
  protected readonly process: Process;

  /**
   * @internal
   */
  constructor(process: Process, options?: Options) {
    // TODO: использовать макросы tsc / ebuild для чтения из package.json
    super('gulp-sharp2');
    this.process = process;
    const optionsDefaults: Options = {
      sharpOptions: {
        // density: 600,
        // ignoreIcc: true
      }
    };
    this.options = { ...optionsDefaults, ...options };
  };

  /**
   * @internal
   */
  protected override async _transform2BufferFile(
    fileContent: Buffer, sourceFile: GulpFile
  ): Promise<BufferFile> {
    const outputFile = sourceFile.clone();
    const sharpObject = sharp(
      fileContent,
      this.options.sharpOptions
    );
    outputFile.contents = await this.process(sharpObject).toBuffer();
    return outputFile as BufferFile;
  };

}

/**
 * Plugin fabric function.
 *
 * Returns Gulp plugin stream for transformation
 * images with
 * {@link https://www.npmjs.com/package/sharp| Sharp}.
 *
 * Used in pipeline with other Gulp plugins.
 *
 * This function create new
 * {@link https://www.npmjs.com/package/sharp| Sharp} object
 * with options from second parameter (if specified).
 * Image, loaded by Sharp object, - from gulp pipeline.
 * The created Sharp object used as parameter when
 * process function (first parameter) is calling.
 * After process is finished, this plugin send
 * new gulp file to pipeline with content from
 * `Sharp.toBuffer()`.
 *
 * @param process - {@link Process},
 *  using for image in Sharp object processing
 * @param options - {@link Options} for Sharp object constructor
 *
 * @public
 */
export function sharp2(
  process: Process,
  options?: Options
): NodeJS.ReadWriteStream {
  return new GulpFileTransformWithSharp(
    process,
    options
  ).getPlugin();
};
