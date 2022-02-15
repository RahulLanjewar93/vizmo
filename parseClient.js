
const Parse = require('parse/node')

Parse.initialize('myAppId')
Parse.serverURL = 'http://localhost:1337/parse'

class CustomParseClientApp {
    constructor(){
        Parse.User.enableUnsafeCurrentUser()
    }

    async seed(){
        return await Parse.Cloud.run('seed',{data:"test"}).then(data=>console.log(data))
    }

    async getFloors(){
        return await Parse.Cloud.run('floors:get').then(data=>console.log(data))
    }

    async getSeats(){
        return await Parse.Cloud.run('seats:get',{floorId:'mKadIpMZ5k'}).then(data=>console.log(data))
    }

    async  signup(){
        return await Parse.Cloud.run('signup',{
            firstName:"rahul",
            lastName:"lanjewar",
            email:"rahullanjewar93@gmail.com",
            password:"12345678"
        }).then(data => console.log('inside then',data)).catch(err=>console.log('from catch',err.message,err.code))
    }


    async login(){
        return await Parse.Cloud.run('login',{
            email:"rahullanjewar93@gmail.com",
            password:"12345678"
        }).then(async (data) => {
            console.log('inside then',data)
            await Parse.User.become(data.sessionToken)
        }).catch(err=>console.log('from catch',{message:err.message,code:err.code}))

    }

    async getUsers(){
        return await Parse.Cloud.run("getUsers").then(data=>console.log(data))
    }


    async blockSeats(arg){
        return await Parse.Cloud.run("seats:block",{seatIds:arg.seatIds}).then(data=>console.log(data))
    }

    async startCheck(){
        return await Parse.Cloud.run("check:start").then(data=>console.log(data))
    }

    async stopCheck(){
        return await Parse.Cloud.run("check:stop").then(data=>console.log(data))
    }
}


// User 1
const client1 = new CustomParseClientApp()
// client1.login()
// client1.blockSeats({seatIds:["oDGB6DSW8K","G9boHzKRQd","wrij7O6c7H"]})
setTimeout(client1.startCheck,5000)
setTimeout(client1.stopCheck,10000)

// User 2
const client2 = new CustomParseClientApp()
client2.login()
client2.blockSeats({seatIds:["oDGB6DSW8K","G9boHzKRQd","wrij7O6c7H"]})






