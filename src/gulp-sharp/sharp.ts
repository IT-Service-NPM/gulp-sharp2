/**
 * Implementation
 * {@link https://www.npmjs.com/package/@forward-software/gulp-sharp|gulp-sharp}
 * @forward-software/gulp-sharp
 * plugin interface
 *
 * @remarks
 *
 * @see {@link https://www.npmjs.com/package/@forward-software/gulp-shar}
 *
 */

import GulpFile, { type BufferFile } from 'vinyl';
import { type JpegOptions } from 'sharp';
import {
  GulpFileTransformWithSharp,
  type Options,
  type Process
} from '../sharp2/sharp2.ts';

/**
 * Gulp plugin stream for convert images with
 * {@link https://www.npmjs.com/package/sharp| Sharp}.
 *
 * @internal
 */
class ImageConverter extends GulpFileTransformWithSharp {

  /**
   * @internal
   */
  constructor(
    protected readonly extname: string,
    process: Process,
    options?: Options
  ) {
    super(process, options);
  };

  /**
   * @internal
   */
  protected override async _transform2BufferFile(
    fileContent: Buffer, sourceFile: GulpFile
  ): Promise<BufferFile> {
    sourceFile.extname = this.extname;
    return super._transform2BufferFile(fileContent, sourceFile);
  };

};

/**
 * Returns Gulp plugin for convert
 * images with
 * {@link https://www.npmjs.com/package/sharp| Sharp}
 * to JPEG.
 *
 * @param options - JpegOptions for
 * {@link https://www.npmjs.com/package/sharp| Sharp}
 * .jpeg method
 *
 * @public
 */
export function jpeg(options?: JpegOptions) {
  return new ImageConverter(
    '.jpeg',
    (sharpObject) => sharpObject.jpeg(options)
  ).getPlugin();
};
