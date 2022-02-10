const Parse = require('parse/node')
Parse.initialize('myAppId')
Parse.serverURL = 'http://localhost:1337/parse'

Parse.Cloud.run('seed').then(data=>console.log(data))