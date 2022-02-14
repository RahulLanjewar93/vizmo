"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customReturn = void 0;
function customReturn(data) {
    return {
        success: data.success,
        code: data.code,
        message: data.message,
        details: data.details
    };
}
exports.customReturn = customReturn;
