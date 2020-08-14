import { basename } from 'path';
import { zip, zipContents, unzip } from '../source';
import { attemptDelete } from './helpers/attempt-delete';
import test from 'ava';
import jetpack = require('fs-jetpack');
import tempy = require('tempy');
import { ToryFolder } from 'tory';

const fixtures = jetpack.cwd('test/fixtures');

function foldersEqual(pathToFolderA: string, pathToFolderB: string): boolean {
	return (new ToryFolder(pathToFolderA)).sameContentsDeep(new ToryFolder(pathToFolderB));
}

async function makeTestDir(): Promise<string> {
	const dir = jetpack.cwd(tempy.directory());

	await dir.writeAsync('.foobar', '123');
	await dir.dirAsync('a/b/z');
	await dir.writeAsync('a/b/c', 'foo');
	await dir.writeAsync('a/a', 'bar');
	await dir.writeAsync('a/d.zip', 'baz');
	await dir.writeAsync('b/f', '');
	await dir.writeAsync('c/g.png', '');
	await dir.dirAsync('d');
	await dir.dirAsync('.git');

	return dir.cwd();
}

async function makeTestFile(): Promise<string> {
	const dir = jetpack.cwd(tempy.directory());
	await dir.writeAsync('.foobar', '123');
	return dir.path('.foobar');
}

test('unzip', async t => {
	const testDir = await makeTestDir();
	const unzippedPath = await unzip(fixtures.path('fixture.zip'));
	t.is(jetpack.exists(unzippedPath), 'dir');
	t.true(foldersEqual(testDir, unzippedPath));
	await attemptDelete(testDir);
	await attemptDelete(unzippedPath);
});

test('zip (dir)', async t => {
	const testDir = await makeTestDir();
	const testDirName = basename(testDir);

	const zippedPath = await zip(testDir);
	const unzippedPath = await unzip(zippedPath);

	t.deepEqual(await jetpack.listAsync(unzippedPath), [testDirName]);
	t.false(foldersEqual(testDir, unzippedPath));

	const unzippedPathInner = jetpack.path(unzippedPath, testDirName);
	t.true(foldersEqual(testDir, unzippedPathInner));

	await attemptDelete(testDir);
	await attemptDelete(zippedPath);
	await attemptDelete(unzippedPath);
});

test('zip (file)', async t => {
	const testFile = await makeTestFile();
	const testFileName = basename(testFile);

	const zippedPath = await zip(testFile);

	const unzippedPath = await unzip(zippedPath);
	const unzippedFilePath = jetpack.path(unzippedPath, testFileName);

	t.is(jetpack.exists(unzippedPath), 'dir');
	t.is(jetpack.exists(unzippedFilePath), 'file');
	t.deepEqual(await jetpack.listAsync(unzippedPath), [testFileName]);
	t.true(jetpack.read(testFile) === jetpack.read(unzippedFilePath));

	await attemptDelete(testFile);
	await attemptDelete(zippedPath);
	await attemptDelete(unzippedPath);
});

test('zipContents', async t => {
	const testDir = await makeTestDir();
	const zippedPath = await zipContents(testDir);
	const unzippedPath = await unzip(zippedPath);
	t.true(foldersEqual(testDir, unzippedPath));
	await attemptDelete(testDir);
	await attemptDelete(zippedPath);
	await attemptDelete(unzippedPath);
});
