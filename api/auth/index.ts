export async function validateAuth(req: Parse.Cloud.FunctionRequest | Parse.Cloud.TriggerRequest): Promise<void> {

    // If the user is logged in return from the middleware
    if (req.user) return
}