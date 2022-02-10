require('dotenv').config();
const mongo = require('./mongo')
const parse = require('./parse')

const config = {
    port:process.env.PORT,
    mongo:mongo,
    parse
}



module.exports = config;
