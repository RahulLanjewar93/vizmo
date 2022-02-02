const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seatSchema = new Schema({
    seatNumber:{
        type:Number,
        required:true
    },
    bookedTill:{
        type:Date,
    },
    blockedTill:{
        type:Date
    }
})


module.exports = mongoose.model('Seat',seatSchema)