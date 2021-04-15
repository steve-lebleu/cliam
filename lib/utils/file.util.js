"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = void 0;
const fs_1 = require("fs");
/**
 * @description
 *
 * @param path
 */
const read = (path, options) => {
    if (!fs_1.existsSync(path)) {
        throw new Error(`${path} cannot be found`);
    }
    const content = fs_1.readFileSync(path, { encoding: 'utf-8' });
    if (!content && options?.forceContent) {
        throw new Error(`${path} seems to be empty`);
    }
    return JSON.parse(content);
};
exports.read = read;
