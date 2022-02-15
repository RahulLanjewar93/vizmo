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
const moment = require("moment");
const zod_1 = require("../common/zod");
const seatSchema = z.strictObject({
    seatNumber: z.number(),
    blockingId: z.literal("Pointer").optional(),
    bookingId: z.literal("Pointer").optional(),
    floorId: z.literal("Pointer"),
});
// Types Declarations
Parse.Cloud.define("seat:seed", seed);
Parse.Cloud.define("seat:get", getSeats);
Parse.Cloud.define("seat:block", blockSeats);
Parse.Cloud.define("seat:book", bookSeats);
Parse.Cloud.define("seat:timeout", getTimeout);
// Parse.Cloud.define("floors:get", getFloors);
function seed(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const FloorClass = new Parse.Schema("Floor");
        const SeatClass = new Parse.Schema("Seat");
        const BlockingClass = new Parse.Schema("Blocking");
        yield BlockingClass.purge();
        yield FloorClass.purge();
        yield SeatClass.purge();
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
                yield seat.save(seatData);
            }
            const floorData = {
                floorNumber: i,
            };
            yield floor.save(floorData);
        }
        return { success: true };
    });
}
function getSeats(req) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get FloorId
        const floorId = req.params.floorId;
        const floorQuery = new Parse.Query("Floor");
        const floor = yield floorQuery.get(floorId);
        const floorNumber = floor.get("floorNumber");
        const seatQuery = new Parse.Query("Seat");
        seatQuery.equalTo("floor", floor);
        const data = yield seatQuery.find({ useMasterKey: true });
        const result = data.map((object, index) => {
            return {
                id: object.id,
                seatNumber: object.get("seatNumber"),
                floorNumber: floorNumber,
                blockedTill: object.get("blockedTill"),
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
        // Fetch Current, User If user is not logged in return
        if (!req.user)
            throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, "Please Login First");
        // Get current date time and add 5 to it
        const currentTime = new Date(moment().format());
        const bookingTime = new Date(moment()
            .add(5, "minutes")
            .format());
        // Check incoming data
        const seatSchema = z.strictObject({ seatId: z.string() });
        const inputCheck = seatSchema.safeParse(req.params);
        if (!inputCheck.success) {
            throw {
                message: (0, zod_1.flattenZodError)(inputCheck.error),
            };
        }
        const seatData = inputCheck.data;
        // Fetch the seat with the booking, if available
        const seat = yield new Parse.Query("Seat")
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
        const blockingData = {
            blockedTill: bookingTime,
            userId: req.user,
            seatId: seat.id,
        };
        yield blocking.save(blockingData);
        const result = yield seat.save({
            blockingId: blocking,
        }, { useMasterKey: true });
        return true;
    });
}
function bookSeats() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function getTimeout() {
    return __awaiter(this, void 0, void 0, function* () { });
}
