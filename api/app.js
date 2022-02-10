// Intiailze express and import defaults.
const ParseServer = require('parse-server').ParseServer;
const express = require('express')
const config = require('./config')
const routes = require('./routes')

const app = express()

const mountPath = process.env.PARSE_MOUNT || '/parse';
const api = new ParseServer(config.parse);
app.use(mountPath, api);

// Accept incoming json and url encoded requests
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Route different paths
app.use('/floors', routes.floors)

// If api not found return not found error
app.all('*', (req, res) => {
    res.send('Requested URL not found at server').status(404)
})

app.listen(config.port, (err) => {
    if (err) {
        throw err
    }
    console.log(`Listening on port ${config.port}`)
})


module.exports = app