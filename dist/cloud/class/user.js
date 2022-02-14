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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("../common/zod");
const z = __importStar(require("zod"));
const MailChecker = __importStar(require("mailchecker"));
const returns_1 = require("../common/returns");
function signup(req) {
    return __awaiter(this, void 0, void 0, function* () {
        // If login session is found on the browser, don't let user sign-up until logged out
        if (req.user) {
            return (0, returns_1.customReturn)({ success: false, message: 'Seems you have logged into an existing account', code: Parse.Error.OPERATION_FORBIDDEN, details: null });
            // throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Seems you have logged into an existing account');
        }
        const signupSchema = z.strictObject({
            firstName: z.string().min(1),
            lastName: z.string().min(1),
            email: z.string().email()
                .refine(val => MailChecker.isValid(val))
                .transform(val => val.toLocaleLowerCase()),
            password: z.string().min(8),
        });
        const result = signupSchema.safeParse(req.params);
        if (!result.success) {
            return (0, zod_1.flattenZodError)(result.error);
        }
        const signupData = result.data;
        const userData = {
            name: `${signupData.firstName} ${signupData.lastName}`,
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: signupData.email,
        };
        try {
            yield Parse.User.signUp(signupData.email, signupData.password, userData, { useMasterKey: true });
            const user = yield Parse.User.logIn(signupData.email, signupData.password);
            return { sessionToken: user.getSessionToken() };
        }
        catch (error) {
            return Object.assign({ success: false, details: null }, error);
        }
    });
}
function login(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const loginSchema = {};
        const { username, email, password } = req.params;
        try {
            const userData = {
                username: username || "dummy",
                email: email || "dummy@dummy.com",
                password: password || "dummy"
            };
            const user = yield Parse.User.logIn(userData.username, userData.password);
            return { sessionToken: user.getSessionToken() };
        }
        catch (error) {
            if (error.code === Parse.Error.USERNAME_TAKEN)
                throw new Parse.Error(Parse.Error.USERNAME_TAKEN, error.message);
            else if (error.code === Parse.Error.EMAIL_TAKEN)
                throw new Parse.Error(Parse.Error.EMAIL_TAKEN, error.message);
            // else if (error.code === Parse.Error.PASSWORD_MISSING) throw new Parse.Error(Parse.Error.PASSWORD_MISSING,error.message)
            else
                throw Error(error.message);
        }
    });
}
function getUsers(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new Parse.Query(Parse.User);
        const user = yield query.first();
        if (user) {
            const result = {
                username: user.get("username"),
                email: user.get("email")
            };
            return result;
        }
        return {};
    });
}
// Cloud trigger definitions
// Parse.Cloud.beforeSave('_User', function (request) {
//     console.log("Request from before save", request)
// })
// Cloud function definitions
Parse.Cloud.define('signup', signup);
Parse.Cloud.define('login', login);
Parse.Cloud.define('getUsers', getUsers);
