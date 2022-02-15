
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
        }).then(data => {
            console.log('inside then',data)
            await Parse.User.become(data.sessionToken)
        }).catch(err=>console.log('from catch',{message:err.message,code:err.code}))

    }

    async getUsers(){
        return await Parse.Cloud.run("getUsers").then(data=>console.log(data))
    }


    async blockSeats(){
        return await Parse.Cloud.run("seats:block",{seatIds:["oDGB6DSW8K","G9boHzKRQd","wrij7O6c7H"]}).then(data=>console.log(data))
    }
}

const newClient = new CustomParseClientApp()
newClient.login()

newClient.blockSeats()





