"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Types Declarations
Parse.Cloud.define("seed", seed);
Parse.Cloud.define("getSeats", getSeats);
Parse.Cloud.define("getFloors", getFloors);
function seed(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const FloorClass = new Parse.Schema("Floor");
        const SeatClass = new Parse.Schema("Seat");
        yield FloorClass.purge();
        yield SeatClass.purge();
        for (let i = 1; i <= 5; i++) {
            const Floor = Parse.Object.extend("Floor");
            const floor = new Floor();
            for (let j = 1; j <= 5; j++) {
                const Seat = Parse.Object.extend("Seat");
                const seat = new Seat();
                seat.set("parent", floor);
                const seatData = {
                    seatNumber: j
                };
                yield seat.save(seatData);
            }
            const floorData = {
                floorNumber: i
            };
            yield floor.save(floorData);
        }
        return true;
    });
}
;
function getSeats(req) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get FloorId
        const floorId = req.params.floorId;
        const Floor = Parse.Object.extend("Floor");
        const floorQuery = new Parse.Query(Floor);
        const floor = yield floorQuery.get(floorId);
        const floorNumber = floor.get("floorNumber");
        const Seat = Parse.Object.extend("Seat");
        const seatQuery = new Parse.Query(Seat);
        seatQuery.equalTo("parent", floor);
        const data = yield seatQuery.find({ useMasterKey: true });
        const result = data.map((object, index) => {
            return {
                id: object.id,
                seatNumber: object.get('seatNumber'),
                floorNumber: floorNumber
            };
        });
        return result;
    });
}
function getFloors(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const Floor = Parse.Object.extend("Floor");
        const query = new Parse.Query(Floor);
        const floors = yield query.findAll();
        return floors;
    });
}
