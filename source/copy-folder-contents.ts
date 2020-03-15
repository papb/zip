import jetpack = require('fs-jetpack');
import pMap = require('p-map');

const CONCURRENCY = process.platform === 'win32' || process.platform === 'cygwin' ? 15 : 40;

export async function copyFolderContents(sourcePath: string, destinationPath: string): Promise<void> {
	const sourceFilers = (await jetpack.listAsync(sourcePath))!;
	await pMap(sourceFilers, async (filerName: string) => {
		await jetpack.copyAsync(
			jetpack.path(sourcePath, filerName),
			jetpack.path(destinationPath, filerName)
		);
	}, { concurrency: CONCURRENCY });
}
