import * as z from 'zod'
import { flattenZodError } from '../common/zod';

// Types Declarations
Parse.Cloud.define("seat:seed", seed);
Parse.Cloud.define("seats:get", getSeats);
Parse.Cloud.define("seats:block", blockSeats);
Parse.Cloud.define("seats:book", bookSeats);
Parse.Cloud.define("seats:timeout", getTimeout)
Parse.Cloud.define("floors:get", getFloors);

async function seed(req: Parse.Cloud.FunctionRequest): Promise<Object> {

    const FloorClass = new Parse.Schema("Floor");
    const SeatClass = new Parse.Schema("Seat");
    await FloorClass.purge()
    await SeatClass.purge()
    for (let i = 1; i <= 5; i++) {
        const Floor = Parse.Object.extend("Floor");
        const floor = new Floor()
        for (let j = 1; j <= 5; j++) {
            const Seat = Parse.Object.extend("Seat")
            const seat = new Seat()
            seat.set("parent", floor)
            seat.set("bookedTill",)
            const seatData = {
                seatNumber: j
            }
            await seat.save(seatData)
        }
        const floorData = {
            floorNumber: i
        }
        await floor.save(floorData)
    }
    return { success: true }
};

async function getSeats(req: Parse.Cloud.FunctionRequest): Promise<Object> {
    // Get FloorId

    const floorId = req.params.floorId

    const floorQuery = new Parse.Query("Floor")
    const floor = await floorQuery.get(floorId)
    const floorNumber = floor.get("floorNumber")

    const seatQuery = new Parse.Query("Seat")
    seatQuery.equalTo("parent", floor)
    const data = await seatQuery.find({ useMasterKey: true })

    const result = data.map((object, index) => {
        return {
            id: object.id,
            seatNumber: object.get('seatNumber'),
            floorNumber: floorNumber,
            blockedTill: object.get("blockedTill")
        }
    })
    return result
}

async function getFloors(req: Parse.Cloud.FunctionRequest): Promise<Object> {
    const Floor = Parse.Object.extend("Floor")
    const query = new Parse.Query(Floor)
    const floors = await query.findAll()
    return floors
}

async function blockSeats(req: Parse.Cloud.FunctionRequest): Promise<unknown> {
    const seatSchema = z.strictObject({
        seatIds: z.string().array()
    })
    const result = seatSchema.safeParse(req.params)
    if (!result.success) {
        throw {
            message: flattenZodError(result.error)
        }
    }

    // Get current date time and add 5 to it
    const currentDateTime = new Date()
    const blockedTill = new Date(currentDateTime)
    blockedTill.setMinutes(blockedTill.getMinutes() + 5)
    const data = []
    for (let seatId of result.data.seatIds) {
        const seat = await new Parse.Query('Seat').get(seatId)
        const result = await seat.save({
            blockedTill: blockedTill
        }, { useMasterKey: true })
        data.push(result)

    }
    return data
}

async function bookSeats() {

}

async function getTimeout() {

}


async function blockCheck() {
    console.log('\n\n BLOCK CHECK CALLED \n\n')
    const query = new Parse.Query('Seat').exists('blockedTill')
    const result = await query.findAll()

    // Get blockedTill Value of each seat
    result.forEach(element => {
        const { blockedTill, bookedTill } = element.attributes
        let currentDateTime = new Date()

        // Blocking has expired
        if (blockedTill < currentDateTime) {
            console.log(`\n\n CLEARING BLOCK TIME FOR SEAT ${element.id}\n\n`)
            element.unset("blockedTill")
            element.save()
        }


    });
}

// Check blocked items evert
const clearblockInterval = setInterval(blockCheck, 10000)