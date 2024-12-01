/**
 * A Gulp plugin for creating PNG QRCodes with URI
 * from source .url files.
 *
 * .url files - INI files. For example:
 *
 * ```ini
 * [{000214A0-0000-0000-C000-000000000046}]
 * Prop3=19,2
 * [InternetShortcut]
 * URL=https://github.com/IT-Service-NPM/gulp-file2qr
 * ```
 *
 * @packageDocumentation
 */

import PluginError from 'plugin-error';
import GulpFile, { type BufferFile } from 'vinyl';
import { GulpFile2BufferFile, compose } from './fileBase.ts';
import { type Options, file2qr } from './file2qr.ts';
import { parseIniFromString } from 'cool-ini-parser';

const PLUGIN_NAME = 'gulp-file2qr';

/**
 * Gulp plugin stream for transformation .url files
 * to plain text utf-8 file with url
 * @public @internal
 */
class URLFile2TextGulpFile extends GulpFile2BufferFile {

  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async _transform2BufferFile(
    fileText: string, sourceFile: GulpFile
  ): Promise<BufferFile> {
    const iniData = parseIniFromString(fileText);
    const InternetShortcutSection = iniData.sections.find(
      section => section.name === 'InternetShortcut'
    );
    const URLstring = InternetShortcutSection?.entries.find(
      entry => entry.key === 'URL'
    );
    if (URLstring === undefined) {
      throw new PluginError(PLUGIN_NAME,
        `file "${sourceFile.path}" doesn't contains InternetShortcut/URL`
      );
    };
    const urlFromURLFile = new URL(URLstring.value);
    const TextFile = sourceFile.clone();
    TextFile.contents = Buffer.from(urlFromURLFile.toString());
    return TextFile as BufferFile;
  };

}

/**
 * Plugin fabric function.
 *
 * Returns Gulp plugin stream for transformation
 * .url files to PNG QR codes.
 *
 * .url files - INI files. For example:
 *
 * ```ini
 * [{000214A0-0000-0000-C000-000000000046}]
 * Prop3=19,2
 * [InternetShortcut]
 * URL=https://github.com/IT-Service-NPM/gulp-file2qr
 * ```
 *
 * @param options - {@link Options} for QRCode generator
 *
 * @public
 */
export function url2qr(options?: Options): NodeJS.ReadWriteStream {
  // TODO: replace with stream.compose in future
  return compose(
    new URLFile2TextGulpFile(),
    file2qr(options)
  );
};
