import * as z from "zod"

const blockingSchema = z.strictObject({
    blockedTill:z.date(),
    seatIds:z.array(z.literal('Pointer')),
    userId:z.string()
})

export type Blocking = z.infer<typeof blockingSchema>