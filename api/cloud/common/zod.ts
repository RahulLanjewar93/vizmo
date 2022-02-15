
import * as z from 'zod'

type FlatZodError = {
    code: string;
    message: string;
    details: Array<z.ZodIssue>
}

export function flattenZodError(error: z.ZodError): FlatZodError {
    return {
        code: 'invalid-payload',
        message: `${error.errors[0].path.concat('.')} - ${error.errors[0].message}`,
        details: error.errors
    }
}
