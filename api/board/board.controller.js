const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const boardService = require('./board.service')


// GET list boards
async function getBoards(req, res) {
    try {
        const boards = await boardService.query(req.query)
        res.send(boards)
    } catch (err) {
        logger.error('Cannot get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

// GET board by id
async function getBoardById(req, res) {
    try {
      const boardId = req.params.id;
      const board = await boardService.getById(boardId)
      
      res.json(board)
    } catch (err) {
      logger.error('Failed to get board', err)
      res.status(500).send({ err: 'Failed to get board' })
    }
  }


// POST (add board)
async function addBoard(req, res) {
    try {
        // const board = req.body;
        // board.byUserId = req.session.user._id
        // board = await boardService.add(board)
        // res.send(board)

        const board = req.body;
        const addedBoard = await boardService.add(board)
        res.json(addedBoard)
        const user = await userService.getById(addedBoard.byUserId)
        board.byUser = user

        // socketService.broadcast({type: 'board-added', data: addedBoard})
        // socketService.broadcast({type: 'board-added', data: addedBoard, userId: board.byUserId})

    } catch (err) {
        console.log(err)
        logger.error('Failed to add Board', err)
        res.status(500).send({ err: 'Failed to add Board' })
    }
}

// PUT (Update board)
async function updateBoard(req, res) {
    try {
      const board = req.body;
      const updatedBoard = await boardService.update(board)
      socketService.broadcast({type: 'board-update', data: board._id})
      res.json(updatedBoard)
    } catch (err) {
      logger.error('Failed to update board', err)
      res.status(500).send({ err: 'Failed to update board' })
  
    }
  }

  
module.exports = {
    getBoards,
    addBoard,
    getBoardById,
    updateBoard
}