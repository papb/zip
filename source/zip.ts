import path = require('path');
import jetpack = require('fs-jetpack');
import tempy = require('tempy');
import yazl = require('yazl');
import extractZip = require('extract-zip');
import { ensureParentFolders } from './ensure-parent-folders';
import { copyFolderContents } from './copy-folder-contents';
import { ToryFolder } from 'tory';

export function assertType(path: string, type: 'file' | 'dir'): void {
	const existence = jetpack.exists(path);
	if (existence !== type) {
		throw new Error(
			`Expected ${type === 'dir' ? 'directory' : 'file'}, got ${existence || 'nothing'}`
		);
	}
}

async function _expandOptionalPath(type: 'file' | 'dir', path?: string): Promise<string> {
	if (path) {
		path = jetpack.path(path);
		await ensureParentFolders(path);
		return path;
	}

	return type === 'file' ? tempy.file() : tempy.directory();
}

async function _zipDir(folderPath: string, contentsOnly: boolean, destinationPath: string): Promise<void> {
	folderPath = jetpack.path(folderPath);
	destinationPath = jetpack.path(destinationPath);

	const folder = new ToryFolder(folderPath);

	return new Promise((resolve, reject) => {
		let stopped = false;
		function stop(error: any): void {
			stopped = true;
			reject(error);
		}

		try {
			const zipfile = new yazl.ZipFile();
			const outStream = zipfile.outputStream.pipe(
				jetpack.createWriteStream(destinationPath)
			);

			(zipfile as any).on('error', stop); // This is very important otherwise could lead to the process crashing on uncaught exception! This could happen for example if an invalid call to `zipfile.addFile` is performed. However this should not happen since we are checking correctly with an `if` before calling each function.
			outStream.on('error', stop);
			outStream.on('close', resolve);

			for (const filer of folder.toDefaultRecursiveIterable()) {
				if (stopped) {
					return;
				}

				const contentRelativePath = path.relative(folder.absolutePath, filer.absolutePath);
				const metadataPath = contentsOnly ?
					contentRelativePath :
					path.join(folder.name, contentRelativePath);

				if (filer instanceof ToryFolder) {
					if (filer.getFilers().length === 0) {
						zipfile.addEmptyDirectory(metadataPath);
					}
				} else {
					zipfile.addFile(filer.absolutePath, metadataPath);
				}
			}

			zipfile.end();
		} catch (error) {
			reject(error);
		}
	});
}

async function _zipFile(filePath: string, destinationPath: string): Promise<void> {
	filePath = jetpack.path(filePath);
	destinationPath = jetpack.path(destinationPath);

	return new Promise((resolve, reject) => {
		try {
			const zipfile = new yazl.ZipFile();
			const outStream = zipfile.outputStream.pipe(
				jetpack.createWriteStream(destinationPath)
			);

			(zipfile as any).on('error', reject); // This is very important otherwise could lead to the process crashing on uncaught exception! This could happen for example if an invalid call to `zipfile.addFile` is performed. However this should not happen since we are checking correctly with an `if` before calling each function.
			outStream.on('error', reject);
			outStream.on('close', resolve);

			zipfile.addFile(filePath, path.basename(filePath));

			zipfile.end();
		} catch (error) {
			reject(error);
		}
	});
}

async function _unzip(zipFilePath: string, destinationContainerPath: string): Promise<void> {
	assertType(zipFilePath, 'file');
	zipFilePath = jetpack.path(zipFilePath);
	destinationContainerPath = jetpack.path(destinationContainerPath);

	await jetpack.dirAsync(destinationContainerPath);

	return new Promise((resolve, reject) => {
		extractZip(zipFilePath, { dir: destinationContainerPath }, (error?: Error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

async function _zipDirWrapper(folderPath: string, contentsOnly: boolean, destinationPath?: string): Promise<string> {
	assertType(folderPath, 'dir');
	destinationPath = await _expandOptionalPath('file', destinationPath);

	const tempPath = tempy.file({ extension: '.zip' });
	await _zipDir(folderPath, contentsOnly, tempPath);

	await jetpack.moveAsync(tempPath, destinationPath);
	return destinationPath;
}

async function _zipFileWrapper(filePath: string, destinationPath?: string): Promise<string> {
	assertType(filePath, 'file');
	destinationPath = await _expandOptionalPath('file', destinationPath);

	const tempPath = tempy.file({ extension: '.zip' });
	await _zipFile(filePath, tempPath);

	await jetpack.moveAsync(tempPath, destinationPath);
	return destinationPath;
}

export async function zip(path: string, destinationPath?: string): Promise<string> {
	const existence = jetpack.exists(path);
	if (existence === 'dir') {
		return _zipDirWrapper(path, false, destinationPath);
	}

	if (existence === 'file') {
		return _zipFileWrapper(path, destinationPath);
	}

	throw new Error(`Expected file or directory, got ${existence ? 'something else' : 'nothing'}`);
}

export async function zipDirContents(folderPath: string, destinationPath?: string): Promise<string> {
	return _zipDirWrapper(folderPath, true, destinationPath);
}

export async function unzip(zipFilePath: string, destinationContainerPath?: string): Promise<string> {
	destinationContainerPath = await _expandOptionalPath('dir', destinationContainerPath);

	const tempPath = tempy.directory();
	await _unzip(zipFilePath, tempPath);

	await copyFolderContents(tempPath, destinationContainerPath);

	try {
		await jetpack.removeAsync(tempPath);
	} catch {}

	return destinationContainerPath;
}
