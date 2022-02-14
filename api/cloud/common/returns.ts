export type customReturnType = {
    success: boolean,
    code: number,
    message: string,
    details: any,
}

export function customReturn(data: customReturnType): Object {
    return {
        success: data.success,
        code: data.code,
        message: data.message,
        details: data.details
    }
}