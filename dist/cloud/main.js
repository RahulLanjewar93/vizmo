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
require('./class/seat');
require('./class/user');
require('./class/blocking');
require('./class/booking');
require('./class/floor');
Parse.Cloud.define('check:start', startCheck);
Parse.Cloud.define('check:stop', stopCheck);
// Check blocked items evert
function mainCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n\n BLOCK CHECK CALLED \n\n');
        const query = new Parse.Query('Seat').exists('blockedTill');
        const result = yield query.findAll();
        // Get blockedTill Value of each seat
        result.forEach(element => {
            const { blockedTill, bookedTill } = element.attributes;
            let currentDateTime = new Date();
            // Blocking has expired
            if (blockedTill < currentDateTime) {
                console.log(`\n\n CLEARING BLOCK TIME FOR SEAT ${element.id}\n\n`);
                element.unset("blockedTill");
                element.save();
            }
        });
    });
}
// let clearblockInterval = null;
let clearblockInterval = setInterval(mainCheck, 10000);
function startCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        if (clearblockInterval) {
            console.log("INTERVAL ALREADY RUNNING ,ID:", clearblockInterval);
        }
        else {
            clearblockInterval = setInterval(mainCheck, 10000);
        }
    });
}
function stopCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        if (clearblockInterval) {
            console.log("FOUND INTERVAL, CLEARING");
            clearInterval(clearblockInterval);
        }
        else {
            console.log('INTERVAL NOT FOUND');
        }
    });
}
