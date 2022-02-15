"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenZodError = void 0;
function flattenZodError(error) {
    return {
        code: 'invalid-payload',
        message: `${error.errors[0].path.concat('.')} - ${error.errors[0].message}`,
        details: error.errors
    };
}
exports.flattenZodError = flattenZodError;
