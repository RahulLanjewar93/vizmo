const Parse = require('parse/node')
Parse.initialize('myAppId')
Parse.serverURL = 'http://localhost:1337/parse'
//
// Parse.Cloud.run('seed',{data:"test"}).then(data=>console.log(data))

// Parse.Cloud.run('getFloors').then(data=>console.log(data))

// Parse.Cloud.run('seats:get',{floorId:'mKadIpMZ5k'}).then(data=>console.log(data))


// Parse.Cloud.run('signup',{
//     firstName:"rahul",
//     lastName:"lanjewar",
//     email:"rahullanjewar95",
//     password:"123456"
// }).then(data => console.log('inside then',data)).catch(err=>console.log('from catch',err))

// Parse.Cloud.run('login',{
//     username:"rahul23232",
//     email:"rahullanjewar93@gmail.com",
//     password:"Lanjewar93"
// }).then(data => console.log('inside then',data)).catch(err=>console.log('from catch',{message:err.message,code:err.code}))

// Parse.Cloud.run("getUsers").then(data=>console.log(data))

Parse.Cloud.run("seats:block",{seatIds:["oDGB6DSW8K","G9boHzKRQd","wrij7O6c7H"]}).then(data=>console.log(data))
