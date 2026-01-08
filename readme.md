# gulp-sharp2

[![GitHub release][github-release]][github-release-url]
[![NPM release][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]

[![CI Status][build]][build-url]
[![Tests Results][tests]][tests-url]
[![Coverage status][coverage]][coverage-url]

[![Semantic Versioning](https://img.shields.io/badge/Semantic%20Versioning-v2.0.0-green.svg?logo=semver)](https://semver.org/lang/ru/spec/v2.0.0.html)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-v1.0.0-yellow.svg?logo=git)](https://conventionalcommits.org)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

[![VS Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?logo=visual%20studio%20code)](https://code.visualstudio.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-333333.svg?logo=typescript)](http://www.typescriptlang.org/)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333.svg?logo=editorconfig)](https://editorconfig.org)
[![ESLint](https://img.shields.io/badge/ESLint-3A33D1?logo=eslint)](https://eslint.org)

[github-release]: https://img.shields.io/github/v/release/IT-Service-NPM/gulp-sharp2.svg?sort=semver&logo=github

[github-release-url]: https://github.com/IT-Service-NPM/gulp-sharp2/releases

[npm]: https://img.shields.io/npm/v/gulp-sharp2.svg?logo=npm

[npm-url]: https://www.npmjs.com/package/gulp-sharp2

[node]: https://img.shields.io/node/v/gulp-sharp2.svg

[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/gulp-sharp2

[deps-url]: https://libraries.io/npm/gulp-sharp2/tree

[size]: https://packagephobia.com/badge?p=gulp-sharp2

[size-url]: https://packagephobia.com/result?p=gulp-sharp2

[build]: https://github.com/IT-Service-NPM/gulp-sharp2/actions/workflows/ci.yml/badge.svg?branch=main

[build-url]: https://github.com/IT-Service-NPM/gulp-sharp2/actions/workflows/ci.yml

[tests]: https://gist.githubusercontent.com/sergey-s-betke/d70e4de09a490afc9fb7a737363b231a/raw/gulp-sharp2-tests.svg

[tests-url]: https://github.com/IT-Service-NPM/gulp-sharp2/actions/workflows/ci.yml

[coverage]: https://gist.githubusercontent.com/sergey-s-betke/d70e4de09a490afc9fb7a737363b231a/raw/gulp-sharp2-coverage.svg

[coverage-url]: https://github.com/IT-Service-NPM/gulp-sharp2/actions/workflows/ci.yml

This plugin is a modern version of `gulp-sharp`
and other gulp plugins for images processing with `sharp`.

## Contents

* [Install](#install)
* [Examples](#examples)
  * [Convert SVG to monochrome PNG](#convert-svg-to-monochromepng)
* [API](#api)
* [License](#license)

## Install

```sh
npm install --save-dev gulp-sharp2
```

## Examples

### Convert SVG to monochrome PNG

`sharp2` can create monochrome PNG from .svg files.

```typescript file=./test/examples/01/gulpfile.ts
import { sharp2 } from '#gulp-sharp2';
import GulpClient from 'gulp';
import rename from 'gulp-rename';

function task1() {
  return GulpClient.src('fixtures/*.svg', { encoding: false })
    .pipe(sharp2((sharpObject) => sharpObject
      .resize({ width: 600 })
      .toColorspace('b-w')
      .png({
        compressionLevel: 9,
        colors: 2
      }),
      {
        sharpOptions: {
          density: 600,
          ignoreIcc: true
        }
      }
    ))
    .pipe(rename({ extname: '.png' }))
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for converting SVG to monochrome PNG';
GulpClient.task(task1);

```

Source SVG image:

[![Source SVG](./test/examples/01/fixtures/test-file.svg)](./test/examples/01/fixtures/test-file.svg)

Output PNG image:

[![Output PNG](./test/examples/01/output/test-file.png)](./test/examples/01/output/test-file.png)

## API

Please, read the [API reference](/docs/index.md).

## License

[MIT](LICENSE) © [Sergei S. Betke](https://github.com/sergey-s-betke)
