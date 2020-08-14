# @papb/zip ![Build Status](https://github.com/papb/zip/workflows/CI/badge.svg)

> Zipping & unzipping, simplified.

## Highlights

* Written in TypeScript
* Cross-platform
* [Simple Promise-based API](https://github.com/papb/zip#api), for your simple zipping needs
* No external binaries needed
* Outputs to temporary folder if you do not specify an output path


## Install

```
$ npm install @papb/zip
```


## Usage

```js
const { zip, zipContents, unzip } = require('@papb/zip');

(async () => {
	await zip('path/to/file.txt', 'file.zip');
	await zip('path/to/folder/foo123', 'foo.zip');
	await zipContents('path/to/folder/bar', 'bar.zip');
	await unzip('baz.zip', 'path/to/folder/baz');

	// If you don't specify an output path, a temp path is used:
	const zipped = await zip('path/to/folder/foo');
	console.log(zipped);
	//=> '/path/to/some/temp/folder/output.zip'
	const unzipped = await unzip('foo.zip');
	console.log(unzipped);
	//=> '/path/to/some/temp/folder' (which will contain a
	//   single folder called 'foo123' in this example)
})();
```


## TypeScript usage

@papb/zip is written in TypeScript and comes with complete type declarations. This means that you will have great code completions right in your editor, and also means that you can use it perfectly with TypeScript:

```ts
import { zip, zipContents, unzip } from '@papb/zip';
// ...
```


## API

### zip(fileOrFolderPath, \[destinationPath\])
> *TypeScript signature:* `zip(fileOrFolderPath: string, destinationPath?: string): Promise<string>`

Creates a zip archive of the given file or folder, saving it in `destinationPath`. If `destinationPath` is not given, the zip file will be saved as `output.zip` in a freshly-created temporary folder.

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
