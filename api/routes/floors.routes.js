const express = require('express')
const router = express.Router()
const floorController = require('../controllers/floors.controllers')

router.get('/',floorController.getListOfFloors)
// router.get('/:floorId',floorController.getSeatsByFloor)
router.get('/:floorId/seats',floorController.getSeatsByFloor)
// router.get('/:floorId/seats/:seatId',floorController.getSeatsByFloor)
router.post('/:floorId/seats/block',floorController.blockUserSelectedSeats)
router.post('/:floorId/seats/verify',floorController.getSeatsByFloor)
router.post('/:floorId/seats/book',floorController.getSeatsByFloor)
router.post('/:floorId/seats/timeout',floorController.getTimeoutForUserSelectedSeats)
router.get('/seed',floorController.seed)


module.exports = router