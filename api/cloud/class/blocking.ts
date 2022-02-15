import * as z from "zod";

const blockingSchema = z.strictObject({
  blockedTill: z.date(),
  seatId: z.literal("Pointer"),
  userId: z.literal("Pointer"),
});

export type Blocking = z.infer<typeof blockingSchema>;
