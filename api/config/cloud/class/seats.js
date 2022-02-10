Parse.Cloud.define("seed",seed);
Parse.Cloud.define("getSeats",getSeats);
Parse.Cloud.define("getFloors",getFloors);

async function seed(req){
    const FloorClass = new Parse.Schema("Floor");
    const SeatClass = new Parse.Schema("Seat");
    await FloorClass.purge()
    await SeatClass.purge()
    for(let i=1;i<=5;i++){
        const Floor = Parse.Object.extend("Floor");
        const floor = new Floor()
        const floorData = {
            floorNumber:i
        }
        for(let j=1;j<=5;j++){
            const Seat = Parse.Object.extend("Seat")
            const seat = new Seat()
            seat.set("parent",floor)
            const seatData = {
                seatNumber:j
            }

            await seat.save(seatData)
        }
    }
    return true
};

async function getSeats(req){
    const floorId = req.params.floorId
    const Seat = Parse.Object.extend("Seat")
    const query = new Parse.Query(Seat)
    const data = query.equalTo("parent",floorId)
    return data
}

async function getFloors(req){
    const Floor = Parse.Object.extend("Floor")
    const query = new Parse.Query(Floor)
    const floors = await query.findAll()
    return floors
}