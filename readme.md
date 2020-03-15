# @papb/zip [![Build Status](https://travis-ci.com/papb/zip.svg?branch=master)](https://travis-ci.com/papb/zip)

> Zipping & unzipping, simplified.

## Highlights

* Written in TypeScript
* Cross-platform
* [Simple API](https://github.com/papb/zip#api), for your simple zipping needs
* No external binaries needed


## Install

```
$ npm install @papb/zip
```


## Usage

```js
const { zip, zipContents, unzip } = require('@papb/zip');

(async () => {
	await zip('path/to/folder/foo', 'output.zip');
	await zipContents('path/to/folder/bar', 'output.zip');
	await unzip('output.zip', 'path/to/folder/baz');
	await unzip('output.zip', 'path/to/folder/baz');
})();
```


## TypeScript usage

@papb/zip is written in TypeScript and comes with complete type declarations. This means that you will have great code completions right in your editor, and also means that you can use Tory perfectly with TypeScript:

```ts
import { zip, zipContents, unzip } from '@papb/zip';
// ...
```


## API

### zip(folderPath, \[destinationPath\])
> *TypeScript signature:* `zip(folderPath: string, destinationPath?: string): Promise<string>`

Creates a zip archive of the given folder, saving it in `destinationPath`. If `destinationPath` is not given, the zip file will be saved as `output.zip` in a freshly-created temporary folder.

This async function returns the absolute path to the generated zip file.

### zipContents(folderPath, \[destinationPath\])
> *TypeScript signature:* `zipContents(folderPath: string, destinationPath?: string): Promise<string>`

Creates a zip archive of the contents of the given folder, saving it in `destinationPath`. If `destinationPath` is not given, the zip file will be saved as `output.zip` in a freshly-created temporary folder.

This async function returns the absolute path to the generated zip file.

### unzip(zipFilePath, \[destinationContainerPath\])
> *TypeScript signature:* `unzip(zipFilePath: string, destinationContainerPath?: string): Promise<string>`

Extracts the zip file in `zipFilePath` into the folder specified in `destinationContainerPath`. If `destinationContainerPath` is not given, a freshly-created temporary folder will be used as container.

This async function returns the absolute path to the destination container folder.


## License

MIT © [Pedro Augusto de Paula Barbosa](https://github.com/papb)
