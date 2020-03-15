import jetpack = require('fs-jetpack');

export async function attemptDelete(absolutePath: string): Promise<void> {
	try {
		await jetpack.removeAsync(absolutePath);
	} catch (error) {
		console.warn(`Unable to cleanup temp file(s) ('${absolutePath}') after test:`, error);
	}
}
