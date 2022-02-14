// Types Declarations
Parse.Cloud.define("seed", seed);
Parse.Cloud.define("getSeats", getSeats);
Parse.Cloud.define("getFloors", getFloors);

async function seed(req: Parse.Cloud.FunctionRequest): Promise<Boolean> {

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
    return true
};

async function getSeats(req: Parse.Cloud.FunctionRequest): Promise<Object> {
    // Get FloorId
    const floorId = req.params.floorId

    const Floor = Parse.Object.extend("Floor")
    const floorQuery = new Parse.Query(Floor)
    const floor = await floorQuery.get(floorId)
    const floorNumber = floor.get("floorNumber")

    const Seat = Parse.Object.extend("Seat")
    const seatQuery = new Parse.Query(Seat)
    seatQuery.equalTo("parent", floor)
    const data = await seatQuery.find({ useMasterKey: true })

    const result = data.map((object, index) => {
        return {
            id: object.id,
            seatNumber: object.get('seatNumber'),
            floorNumber: floorNumber
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