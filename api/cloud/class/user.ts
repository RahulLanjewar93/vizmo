import { flattenZodError } from '../common/zod'
import * as z from 'zod'
import * as MailChecker from 'mailchecker'

const userSchema = z.strictObject({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email()
        .refine(val => MailChecker.isValid(val))
        .transform(val => val.toLocaleLowerCase()),
    password: z.string().min(8),
})

export type User = z.infer<typeof userSchema>

async function signup(req: Parse.Cloud.FunctionRequest): Promise<any> {

    // If login session is found on the browser, don't let user sign-up until logged out
    if (req.user) throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Seems you have logged into an existing account');


    // const signupSchema = z.strictObject({
    //     firstName: z.string().min(1),
    //     lastName: z.string().min(1),
    //     email: z.string().email()
    //         .refine(val => MailChecker.isValid(val))
    //         .transform(val => val.toLocaleLowerCase()),
    //     password: z.string().min(8),
    // })

    const result = userSchema.safeParse(req.params)

    if (!result.success) {
        throw {
            message: flattenZodError(result.error)
        }
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
        return { sessionToken: user.getSessionToken() }
    } catch (error: any) {
        throw new Parse.Error(error.code, error.message)
    }
}

async function login(req: Parse.Cloud.FunctionRequest): Promise<Record<string, unknown>> {

    const loginSchema = z.strictObject({
        email: z.string().email()
            .refine(val => MailChecker.isValid(val))
            .transform(val => val.toLocaleLowerCase()),
        password: z.string().min(8)
    })

    const result = loginSchema.safeParse(req.params)

    if (!result.success) {
        throw {
            message: flattenZodError(result.error)
        }
    }
    const loginData = result.data
    try {
        // const userData: Partial<User> = {
        //     email: loginData.email,
        //     password: loginData.password
        // }
        const user = await Parse.User.logIn(loginData.email, loginData.password)
        return { sessionToken: user.getSessionToken() }
    } catch (error: any) {
        if (error.code === Parse.Error.USERNAME_TAKEN) throw new Parse.Error(Parse.Error.USERNAME_TAKEN, error.message)
        else if (error.code === Parse.Error.EMAIL_TAKEN) throw new Parse.Error(Parse.Error.EMAIL_TAKEN, error.message)
        // else if (error.code === Parse.Error.PASSWORD_MISSING) throw new Parse.Error(Parse.Error.PASSWORD_MISSING,error.message)
        else throw Error(error.message)
    }
}

async function getUsers(req: Parse.Cloud.FunctionRequest): Promise<Object[]> {
    const query = new Parse.Query('_User')
    const users = await query.findAll({ useMasterKey: true })
    return users
}

// Cloud trigger definitions
// Parse.Cloud.beforeSave('_User', function (request) {
//     console.log("Request from before save", request)
// })

// Cloud function definitions
Parse.Cloud.define('signup', signup)
Parse.Cloud.define('login', login)
Parse.Cloud.define('getUsers', getUsers)
