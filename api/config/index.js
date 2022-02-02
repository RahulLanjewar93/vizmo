require('dotenv').config();
const mongo = require('./mongo')


const config = {
    port:process.env.PORT,
    mongo:mongo,
}



module.exports = config;
