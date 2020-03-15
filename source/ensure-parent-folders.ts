import jetpack = require('fs-jetpack');

export async function ensureParentFolders(path: string): Promise<void> {
	try {
		if (await jetpack.existsAsync(path)) {
			return;
		}

		await jetpack.writeAsync(path, '');
		await jetpack.removeAsync(path);
	} catch (error) {
		const error2 = new Error(`Unable to ensure writing permissions to "${jetpack.path(path)}".`);
		(error2 as any).parentError = error;
		throw error2;
	}
}
