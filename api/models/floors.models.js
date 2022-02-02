const mongoose = require('mongoose')
const Schema = mongoose.Schema

const floorSchema = new Schema({
    floor:{
            type:Number,
            required:true,
    },
    seats:[
        {
            type:Schema.Types.ObjectId,
            ref:'Seat'
        }
    ],
    filled:{
        type:Boolean,
        required:false
    }
})

module.exports = mongoose.model('Floor',floorSchema)