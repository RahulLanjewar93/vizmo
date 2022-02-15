"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const z = __importStar(require("zod"));
const zod_1 = require("../common/zod");
// Types Declarations
// Parse.Cloud.define("seat:seed", seed);
Parse.Cloud.define("seats:get", getSeats);
Parse.Cloud.define("seats:block", blockSeats);
Parse.Cloud.define("seats:book", bookSeats);
Parse.Cloud.define("seats:timeout", getTimeout);
// Parse.Cloud.define("floors:get", getFloors);
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
                seat.set("bookedTill");
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
        return { success: true };
    });
}
;
function getSeats(req) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get FloorId
        const floorId = req.params.floorId;
        const floorQuery = new Parse.Query("Floor");
        const floor = yield floorQuery.get(floorId);
        const floorNumber = floor.get("floorNumber");
        const seatQuery = new Parse.Query("Seat");
        seatQuery.equalTo("parent", floor);
        const data = yield seatQuery.find({ useMasterKey: true });
        const result = data.map((object, index) => {
            return {
                id: object.id,
                seatNumber: object.get('seatNumber'),
                floorNumber: floorNumber,
                blockedTill: object.get("blockedTill")
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
function blockSeats(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const seatSchema = z.strictObject({
            seatIds: z.string().array()
        });
        const result = seatSchema.safeParse(req.params);
        if (!result.success) {
            throw {
                message: (0, zod_1.flattenZodError)(result.error)
            };
        }
        // Get current date time and add 5 to it
        const currentDateTime = new Date();
        const blockedTill = new Date(currentDateTime);
        blockedTill.setMinutes(blockedTill.getMinutes() + 5);
        const data = [];
        for (let seatId of result.data.seatIds) {
            const seat = yield new Parse.Query('Seat').get(seatId);
            const result = yield seat.save({
                blockedTill: blockedTill
            }, { useMasterKey: true });
            data.push(result);
        }
        return data;
    });
}
function bookSeats() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function getTimeout() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
