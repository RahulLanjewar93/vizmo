// Intiailze express and import defaults.
const express = require('express')
const config = require('./config')
const routes = require('./routes')

const app = express()


// Accept incoming json and url encoded requests other than strings
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// Route different paths
app.use('/floors', routes.floors)

// If api not found return a
app.all('*', (req, res) => {
    res.send('Requested URL not found at server').status(404)
})

// DB is intialized (because we imported config) so listen on app

app.listen(config.port, (err) => {
    if (err) {
        throw err
    }
    console.log(`Listening on port ${config.port}`)
})


module.exports = app