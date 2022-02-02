const mongo = require('mongoose')
const MONGOURL = process.env.MONGOURL
mongo.connect(`${MONGOURL}`)
    .then(()=>{
        console.log('DB Connected Sucessfully')
    })
    .catch(err=>{
    console.log(err)
    })

module.exports = mongo;