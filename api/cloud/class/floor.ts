import * as z from 'zod'

Parse.Cloud.define("floors:get",getFloors)

async function getFloors(req: Parse.Cloud.FunctionRequest): Promise<Object> {
    const Floor = Parse.Object.extend("Floor")
    const query = new Parse.Query(Floor)
    const floors = await query.findAll()
    return floors
}