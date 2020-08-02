import { zip, zipContents, unzip } from './zip';
export { zip, zipContents, unzip } from './zip';

// eslint-disable-next-line import/no-anonymous-default-export
export default { zip, zipContents, unzip };

// For CommonJS default export support
module.exports = { zip, zipContents, unzip };
module.exports.default = { zip, zipContents, unzip };
