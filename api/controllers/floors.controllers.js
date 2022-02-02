const Floor = require('../models/floors.models')
const Seat = require('../models/seats.models')

const floorControllers = {

    // List of all floors available
    getListOfFloors : async (req,res)=>{
        console.log('getListOfFloors called')

        const floor = await Floor.find({})
        res.send(floor)
    },

    // List of all seats available on a particular floor
    getSeatsByFloor :async (req,res) => {
        console.log('getSeatsByFloor called')
        const {floorId} = req.params

        //Check for floorId
        if(!floorId || floorId.length != 24){
            return res.status(404).json({error:"Send correct floor ID"})
        }

        try{
            // Fetch the floor details
            const floor = await Floor.findById(floorId).populate('seats')

            // Check if seats are added to floors
            if(floor && floor.seats){
                return res.status(200).json(floor.seats)
            }else{
                return res.status(200).json([])
            }
        }catch(error){
            console.log(error)
            return res.status(500).json({error:'Some server error'})
        }
    },

    // Block the seats for the current user
    blockUserSelectedSeats:async (req,res)=>{
        try{
            const {floorId} = req.params
            const {seatIds} = req.body

            //Check for floorId and seats
            if(!seatIds || !floorId.length){
                return res.status(404).json({error:"Send correct floor ID & seat IDs"})
            }

            // Get Current Date Time
            const currentDateTime = new Date()


            // Check if the current time is less than the time for which the seat is already booked
            for(let seatId of seatIds){
                const seat = await Seat.findById(seatId)
                if(seat && seat.blockedTill){
                    let d2 = new Date(currentDateTime)
                    let d1 = new Date(seat.blockedTill)
                    if(d1 >= d2){
                        const timeout = Math.floor(Math.abs(d1-d2)/(1000*60)*100)/100
                        return res.status(404).json({"success":false,"message":"The slot is already blocked please try another slot",seat:seat,timeNow:currentDateTime,timeout})
                    }
                }
            }

            // Add 5 minutes to current datetime
            const blockedTill = new Date(currentDateTime)
            blockedTill.setMinutes(blockedTill.getMinutes()+5)
            const seatsPromises = seatIds.map(seatId => {
                const seat =  Seat.updateMany({"_id":seatId},{$set:{"blockedTill":blockedTill}},{upsert:true})
                return seat
            })
            Promise.all(seatsPromises).then(data=>{
                res.status(200).json({"sucess":true,"message":data})
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({error:'Some server error'})
        }
    },
    bookUserSelectedSeat:async (req,res)=>{
        try{
            const {floorId} = req.params
            const {seatIds} = req.body

            //Check for floorId and seats
            if(!seatIds || !floorId.length){
                return res.status(404).json({error:"Send correct floor ID & seat IDs"})
            }

            // Get Current Date Time
            const currentDateTime = new Date()


            for(let seatId of seatIds){
                const seat = await Seat.findById(seatId)
                if(seat && seat.bookedTill){
                    let d2 = new Date(currentDateTime)
                    let d1 = new Date(seat.bookedTill)
                    if(d1 >= d2){
                        const timeout = Math.floor(Math.abs(d1-d2)/(1000*60)*100)/100
                        return res.status(404).json({"success":false,"message":"The slot is already booked please try another slot",seat:seat,timeNow:currentDateTime,timeout})
                    }
                }
            }

            // Add 5 minutes to current datetime
            const bookedTill = new Date(currentDateTime)
            bookedTill.setMinutes(bookedTill.getMinutes()+req.body.time)
            const seatsPromises = seatIds.map(seatId => {
                const seat =  Seat.updateMany({"_id":seatId},{$set:{"bookedTill":bookedTill}},{upsert:true})
                return seat
            })
            Promise.all(seatsPromises).then(data=>{
                res.status(200).json({"sucess":true,"message":data})
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({error:'Some server error'})
        }
    },
    getTimeoutForUserSelectedSeats:async (req,res)=>{
        const {floorId} = req.params
        const {seatIds} = req.body

        //Check for floorId and seats
        if(!seatIds || !floorId){
            return res.status(404).json({error:"Send correct floor ID & seat IDs"})
        }

        // Get Current Date Time
        const currentDateTime = new Date()

        // Check if the current time is less than the time for which the seat is already booked

        const data = await Promise.all(seatIds.map(async seatId =>{
            const seat = await Seat.findById(seatId)
            if(seat && seat.blockedTill){
                let d2 = new Date(currentDateTime)
                let d1 = new Date(seat.blockedTill)
                if(d1 >= d2){
                    const timeout = Math.floor(Math.abs(d1-d2)/(1000*60)*100)/100
                    return {seatId,timeout}
                }
                return {seatId,timeout:null}
            }
        }))

        res.json({success:true,data})
    },

    // Seed dummy data
    seed:async (req,res)=>{
        console.log('seed called')
        await Floor.deleteMany({})
        await Seat.deleteMany({})
        for(let i=1;i<=5;i++){
            const floor = new Floor({
                floor:i
            })
            for(let j=1;j<=10;j++){
                const seat = new Seat({
                    seatNumber:j,
                    filled:false,
                })
                seat.save()
                floor.seats.push(seat)
            }
            floor.save()
        }

        res.status(200).json({success:true})
    }
}


module.exports = floorControllers