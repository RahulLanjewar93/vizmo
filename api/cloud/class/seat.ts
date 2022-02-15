import * as z from "zod";
const moment = require("moment");
import { flattenZodError } from "../common/zod";
import { Blocking } from "./blocking";

const seatSchema = z.strictObject({
  seatNumber: z.number(),
  blockingId: z.literal("Pointer").optional(),
  bookingId: z.literal("Pointer").optional(),
  floorId: z.literal("Pointer"),
});

export type Seat = z.infer<typeof seatSchema>;

// Types Declarations
Parse.Cloud.define("seat:seed", seed);
Parse.Cloud.define("seat:get", getSeats);
Parse.Cloud.define("seat:block", blockSeats);
Parse.Cloud.define("seat:book", bookSeats);
Parse.Cloud.define("seat:timeout", getTimeout);
// Parse.Cloud.define("floors:get", getFloors);

async function seed(req: Parse.Cloud.FunctionRequest): Promise<Object> {
  const FloorClass = new Parse.Schema("Floor");
  const SeatClass = new Parse.Schema("Seat");
  const BlockingClass = new Parse.Schema("Blocking");
  await BlockingClass.purge();
  await FloorClass.purge();
  await SeatClass.purge();
  for (let i = 1; i <= 5; i++) {
    const Floor = Parse.Object.extend("Floor");
    const floor = new Floor();
    for (let j = 1; j <= 5; j++) {
      const Seat = Parse.Object.extend("Seat");
      const seat = new Seat();
      seat.set("floor", floor);
      const seatData = {
        seatNumber: j,
      };
      await seat.save(seatData);
    }
    const floorData = {
      floorNumber: i,
    };
    await floor.save(floorData);
  }
  return { success: true };
}

async function getSeats(req: Parse.Cloud.FunctionRequest): Promise<Object> {
  // Get FloorId

  const floorId = req.params.floorId;

  const floorQuery = new Parse.Query("Floor");
  const floor = await floorQuery.get(floorId);
  const floorNumber = floor.get("floorNumber");

  const seatQuery = new Parse.Query("Seat");
  seatQuery.equalTo("floor", floor);
  const data = await seatQuery.find({ useMasterKey: true });

  const result = data.map((object, index) => {
    return {
      id: object.id,
      seatNumber: object.get("seatNumber"),
      floorNumber: floorNumber,
      blockedTill: object.get("blockedTill"),
    };
  });
  return result;
}

async function getFloors(req: Parse.Cloud.FunctionRequest): Promise<Object> {
  const Floor = Parse.Object.extend("Floor");
  const query = new Parse.Query(Floor);
  const floors = await query.findAll();
  return floors;
}

async function blockSeats(req: Parse.Cloud.FunctionRequest): Promise<Boolean> {
  // Fetch Current, User If user is not logged in return
  if (!req.user)
    throw new Parse.Error(
      Parse.Error.OPERATION_FORBIDDEN,
      "Please Login First"
    );

  // Get current date time and add 5 to it
  const currentTime = new Date(moment().format());
  const bookingTime = new Date(
    moment()
      .add(5, "minutes")
      .format()
  );

  // Check incoming data
  const seatSchema = z.strictObject({ seatId: z.string() });
  const inputCheck = seatSchema.safeParse(req.params);
  if (!inputCheck.success) {
    throw {
      message: flattenZodError(inputCheck.error),
    };
  }

  const seatData = inputCheck.data;

  // Fetch the seat with the booking, if available
  const seat = await new Parse.Query("Seat")
    .include("blockingId")
    .get(seatData.seatId);

  // Get the blockingId of the seat
  const { blockingId: seatBlockingId } = seat.attributes;

  // Booking Id found on the seat perfrom validation
  if (seatBlockingId) {
    return false;
  }

  console.log("\n\n seat \n\n", seat);
  // No blockingId found, create a blocking
  const BlockingObj = Parse.Object.extend("Blocking");
  const blocking = new BlockingObj();
  const blockingData: Blocking = {
    blockedTill: bookingTime,
    userId: req.user as any,
    seatId: seat as any,
  };

  await blocking.save(blockingData);

  const result = await seat.save(
    {
      blockingId: blocking,
    },
    { useMasterKey: true }
  );

  return true;
}

async function bookSeats() {}

async function getTimeout() {}
