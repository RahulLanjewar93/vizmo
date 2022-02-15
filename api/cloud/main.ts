require('./class/seat')
require('./class/user')
require('./class/blocking')
require('./class/booking')
require('./class/floor')

// Parse.Cloud.define('check:start',startCheck)
// Parse.Cloud.define('check:stop',stopCheck)

// // Check blocked items evert
// async function mainCheck(){
//     console.log('\n\n BLOCK CHECK CALLED \n\n')
//     const query = new Parse.Query('Seat').exists('blockedTill')
//     const result = await query.findAll()

//     // Get blockedTill Value of each seat
//     result.forEach(element => {
//         const { blockedTill, bookedTill } = element.attributes
//         let currentDateTime = new Date()

//         // Blocking has expired
//         if (blockedTill < currentDateTime) {
//             console.log(`\n\n CLEARING BLOCK TIME FOR SEAT ${element.id}\n\n`)
//             element.unset("blockedTill")
//             element.save()
//         }
//     });
// }

// // let clearblockInterval = null;
// let clearblockInterval = setInterval(mainCheck, 10000)

// async function startCheck() {
//     if(clearblockInterval){
//         console.log("INTERVAL ALREADY RUNNING ,ID:",clearblockInterval)
//     }
//     else{
//         clearblockInterval = setInterval(mainCheck,10000)
//     }
// }

// async function stopCheck (){
//     if(clearblockInterval) {
//         console.log("FOUND INTERVAL, CLEARING")
//         clearInterval(clearblockInterval)
//     }else{
//         console.log('INTERVAL NOT FOUND')
//     }
// }

