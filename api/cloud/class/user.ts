import { flattenZodError, User } from '../common/zod'
import * as z from 'zod'
import * as MailChecker from 'mailchecker'
import { customReturn } from '../common/returns'

async function signup(req: Parse.Cloud.FunctionRequest): Promise<any> {

    // If login session is found on the browser, don't let user sign-up until logged out
    if (req.user) {
        return customReturn({ success: false, message: 'Seems you have logged into an existing account', code: Parse.Error.OPERATION_FORBIDDEN, details: null })
        // throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Seems you have logged into an existing account');
    }


    const signupSchema = z.strictObject({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email()
            .refine(val => MailChecker.isValid(val))
            .transform(val => val.toLocaleLowerCase()),
        password: z.string().min(8),
    })

    const result = signupSchema.safeParse(req.params)

    if (!result.success) {
        return flattenZodError(result.error)

    }

    const signupData = result.data;
    const userData = {
        name: `${signupData.firstName} ${signupData.lastName}`,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
    }
    try {
        await Parse.User.signUp(signupData.email, signupData.password, userData, { useMasterKey: true })
        const user = await Parse.User.logIn(signupData.email, signupData.password)
        return user.getSessionToken()
    } catch (error: any) {
        return {
            success: false,
            details: null,
            ...error
        }
    }
}

async function login(req: Parse.Cloud.FunctionRequest): Promise<Object> {

    const loginSchema = {}

    const { username, email, password } = req.params
    try {
        const userData: User = {
            username: username || "dummy",
            email: email || "dummy@dummy.com",
            password: password || "dummy"
        }
        const user = await Parse.User.logIn(userData.username, userData.password)
        return { sessionToken: user.getSessionToken() }
    } catch (error: any) {
        if (error.code === Parse.Error.USERNAME_TAKEN) throw new Parse.Error(Parse.Error.USERNAME_TAKEN, error.message)
        else if (error.code === Parse.Error.EMAIL_TAKEN) throw new Parse.Error(Parse.Error.EMAIL_TAKEN, error.message)
        // else if (error.code === Parse.Error.PASSWORD_MISSING) throw new Parse.Error(Parse.Error.PASSWORD_MISSING,error.message)
        else throw Error(error.message)
    }
}

async function getUsers(req: Parse.Cloud.FunctionRequest): Promise<Object> {
    const query = new Parse.Query(Parse.User)
    const user = await query.first()
    if (user) {
        const result: Partial<User> = {
            username: user.get("username"),
            email: user.get("email")
        }
        return result
    }
    return {}
}

// Cloud trigger definitions
// Parse.Cloud.beforeSave('_User', function (request) {
//     console.log("Request from before save", request)
// })

// Cloud function definitions
Parse.Cloud.define('signup', signup)
Parse.Cloud.define('login', login)
Parse.Cloud.define('getUsers', getUsers)
