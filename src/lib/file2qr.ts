import { PassThrough } from 'node:stream';
import GulpFile, { type StreamFile, type BufferFile } from 'vinyl';
import {
  GulpFile2GulpFile,
  type Options as GulpFile2GulpFileOptions
} from './fileBase.ts';
import * as QRCode from 'qrcode';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PLUGIN_NAME = 'gulp-file2qr';

/**
 * gulp-file2qr plugin options
 *
 * @remarks
 *
 * @see {@link url2qr} for more details.
 *
 * @public
 */
export interface Options extends GulpFile2GulpFileOptions {

  /**
   * Options for generated PNG QR codes.
   *
   * See {@link https://www.npmjs.com/package/qrcode| `qrcode`}
   * for more details.
   *
   * @public
   */
  qrOptions?: QRCode.QRCodeRenderersOptions;

};

/**
 * Gulp plugin stream for transformation text data from file
 * to PNG QR code
 *
 * @public @internal
 */
export class GulpFile2QR extends GulpFile2GulpFile {

  /**
   * @internal
   */
  protected readonly options: Options;

  /**
   * @internal
   */
  constructor(options?: Options) {
    super(options);
    const optionsDefaults: Options = {
      qrOptions: {
        scale: 4
      }
    };
    this.options = { ...optionsDefaults, ...options };
  };

  /**
   * @internal
   */
  protected override async _transform2StreamFile(
    fileText: string, sourceFile: GulpFile
  ): Promise<StreamFile> {
    const QRCodeFile = sourceFile.clone();
    QRCodeFile.extname = '.png';
    const PNGStream = new PassThrough;
    QRCodeFile.contents = PNGStream;
    await QRCode.toFileStream(PNGStream, fileText, this.options.qrOptions);
    return QRCodeFile as StreamFile;
  };

  /**
   * @internal
   */
  protected override async _transform2BufferFile(
    fileText: string, sourceFile: GulpFile
  ): Promise<BufferFile> {
    const QRCodeFile = sourceFile.clone();
    QRCodeFile.extname = '.png';
    QRCodeFile.contents =
      await QRCode.toBuffer(fileText, this.options.qrOptions);
    return QRCodeFile as BufferFile;
  };

}

/**
 * Plugin fabric function.
 *
 * Returns Gulp plugin stream for transformation
 * GulpFile with utf-8 plain text data
 * to GulpFile with PNG QR code.
 *
 * Used in pipeline with other Gulp plugins,
 * which transforms source files to simple
 * buffered utf-8 text files with QR code data.
 *
 * @param options - {@link Options} for QRCode generator
 *
 * @internal
 */
export function file2qr(options?: Options): GulpFile2QR {
  return new GulpFile2QR(options);
};
