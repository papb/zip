import { zip, zipContents, unzip } from './zip';
export { zip, zipContents, unzip } from './zip';

export default { zip, zipContents, unzip };

// For CommonJS default export support
module.exports = { zip, zipContents, unzip };
module.exports.default = { zip, zipContents, unzip };
