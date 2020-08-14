import { zip, zipDirContents, unzip } from './zip';
export { zip, zipDirContents, unzip } from './zip';

// eslint-disable-next-line import/no-anonymous-default-export
export default { zip, zipDirContents, unzip };

// For CommonJS default export support
module.exports = { zip, zipDirContents, unzip };
module.exports.default = { zip, zipDirContents, unzip };
