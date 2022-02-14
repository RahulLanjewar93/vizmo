
import * as z from 'zod'
import { customReturn } from './returns';
// Schemas
const userSchema = z.strictObject({
    username: z.string(),
    email: z.string(),
    password: z.string().min(8),
})


// Types
export type User = z.infer<typeof userSchema>;

type FlatZodError = {
    success: false,
    code: string;
    message: string;
    details: Array<z.ZodIssue>
}


// Helpers
export function flattenZodError(error: z.ZodError): object {
    const returnData = {
        success: false,
        code: 0, //'invalid-payload'
        message: `${error.errors[0].path.concat('.')} - ${error.errors[0].message}`,
        details: error.errors
    }

    return customReturn(returnData)
}
