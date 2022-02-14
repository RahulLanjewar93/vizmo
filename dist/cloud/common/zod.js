"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenZodError = void 0;
const z = __importStar(require("zod"));
const returns_1 = require("./returns");
// Schemas
const userSchema = z.strictObject({
    username: z.string(),
    email: z.string(),
    password: z.string().min(8),
});
// Helpers
function flattenZodError(error) {
    const returnData = {
        success: false,
        code: 0,
        message: `${error.errors[0].path.concat('.')} - ${error.errors[0].message}`,
        details: error.errors
    };
    return (0, returns_1.customReturn)(returnData);
}
exports.flattenZodError = flattenZodError;
