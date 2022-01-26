const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('board')
        // const Boards = await collection.find(criteria).toArray()

        const boards = await collection.find(filterBy).toArray()

        // !!!!!ADD USER TO BOARD!!!

        // var boards = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'aboutUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'aboutUser'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutUser'
        //     }
        // ]).toArray()

        // !!!!!ADD USER TO BOARD!!!

        // boards = boards.map(board => {
        //     board.byUser = { _id: board.byUser._id, fullname: board.byUser.fullname }
        //     board.aboutUser = { _id: board.aboutUser._id, fullname: board.aboutUser.fullname }
        //     delete board.byUserId
        //     delete board.aboutUserId
        //     return board
        // })

        return boards
    } catch (err) {
        logger.error('cannot find Boards', err)
        throw err
    }

}
async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ '_id': ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board: ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        // const boardToAdd = {
        //     byUserId: ObjectId(board.byUserId),
        //     aboutUserId: ObjectId(board.aboutUserId),
        //     txt: board.txt
        // }
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board;
    } catch (err) {
        logger.error('cannot insert Board', err)
        throw err
    }
}

async function update(board) {
    try {
        var prevId = board._id
        var id = ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection('board')
        const updatedBoard = await collection.findOneAndUpdate({ "_id": id }, { $set: { ...board } })
        board._id = prevId
        return board
    } catch (err) {
        logger.error(`cannot update board: ${board._id}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

module.exports = {
    query,
    add,
    update,
    getById
}


