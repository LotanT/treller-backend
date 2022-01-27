const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {getBoards, addBoard, getBoardById, updateBoard} = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBoards)
router.get('/:id', getBoardById)
router.post('/', requireAuth, addBoard)
router.put('/', updateBoard)

// router.delete('/:id',  requireAuth, deleteboard)

module.exports = router