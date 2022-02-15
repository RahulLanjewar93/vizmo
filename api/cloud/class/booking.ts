import * as z from 'zod'

const booking = z.strictObject({
    bookedTill:z.date(),
    seatIds:z.array(z.literal('Pointer')),
    userId:z.string()
})

export type Blocking = z.infer<typeof booking>