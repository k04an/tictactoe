const mysql = require('mysql2')

module.exports = (server) => {
    const io = require('socket.io')(server)

    io.on('connect', (socket) => {
        console.log(socket.id + ' connected')

        // Создаем комнату
        socket.on('createroom', (callback) => {
            roomId = 'room-' + generateId()
            console.log(socket.id + ' created a room ' + roomId)
            socket.join(roomId)
            callback(roomId)
        })

        // Подключаем клиента к комнате
        socket.on('joinroom', (roomId, callback) => {
            // Проверяем существует ли комната и является ли она именно игровой комнатов
            if ((io.sockets.adapter.rooms.get(roomId) != undefined) && roomId.substring(0, 5) == 'room-') { 
                if (io.sockets.adapter.rooms.get(roomId).size < 2) {
                    socket.join(roomId) 
                    callback({code: 'ok', room: roomId})
                    startGame(roomId)
                } else {
                    callback({code: 'err', desc: 'Room is full', descCode: 2})
                }
            } else {
                callback({code: 'err', desc: 'Room does not exist', descCode: 1})
            }
        })

        // Удаляем клиента из комнаты
        socket.on('leaveroom', (roomId, callback) => {
            if ((io.sockets.adapter.rooms.get(roomId) != undefined) && roomId.substring(0, 5) == 'room-') {
                socket.leave(roomId)
                callback({code: 'ok'})
            } else {
                callback({code: 'err', desc: 'Room not found', descCode: 1})
            }
        })

        function startGame(room) {
            console.log('Game in ' + room + ' started')
            players = []

            // Положение клеток соотнисится с индексами массива следующим образом
            // 0 | 1 | 2
            // 3 | 4 | 5
            // 6 | 7 | 8
            field = ['', '', '', '', '', '', '', '', '']

            // Получаем ID всех сокетов в игровой комнате и на основе ID получаем объект сокета в массив
            Array.from(io.sockets.adapter.rooms.get(room)).forEach((socketId) => {
                players.push({
                    score: 0,
                    socket: io.sockets.sockets.get(socketId),
                    symbol: '',
                    goingToRestart: false
                })
            })

            players[0].symbol = 'x'
            players[1].symbol = 'o'

            score = {
                cross: 0,
                nought: 0
            }

            currentPlayer = players[0]
            otherPlayer = players[1]

            currentPlayer.socket.emit('game-start', score)

            otherPlayer.socket.emit('game-start', score)

            io.to(currentPlayer.socket.id).emit('game-yourturn')
            io.to(otherPlayer.socket.id).emit('game-opsturn')

            isGameOn = true

            // Вещаем обработчики событий на сокеты каждого игрока
            players.forEach((player) => {
                player.socket.on('game-pickcell', (cell) => {
                    if ((player == currentPlayer) && (field[cell] == '') && (isGameOn)) {
                        field[cell] = currentPlayer.symbol
                        io.to(room).emit('game-render', field)
                        switch (checkGame(field).state) {
                            case 'going':
                                swapPlayers(players)
                                break
                            case 'ended':
                                isGameOn = false
                                console.log('Game in ' + room + 'has ended. Won: ' + currentPlayer.symbol)
                                switch (currentPlayer.symbol) {
                                    case 'x':
                                        score.cross += 1
                                        break
                                    case 'o':
                                        score.nought += 1
                                        break
                                }
                                currentPlayer.socket.emit('game-won', score)
                                otherPlayer.socket.emit('game-lost', score)
                                break
                            case 'draw':
                                isGameOn = false
                                console.log('Game in ' + room + 'has ended with draw')
                                io.to(room).emit('game-draw')
                                break
                        }
                    }
                })

                player.socket.on('game-restart', (callback) => {
                    if (!isGameOn) {
                        player.goingToRestart = true
                        callback({code: 'ok'})
                        restartGame()
                    }
                })
            })

            function checkGame(field) {
                if (field.indexOf('') != -1) {
                    if(field[0] === field[1] && field[0] === field[2] && field[0] != '') return {state: 'ended', winner: field[0]}
                    if(field[3] === field[4] && field[3] === field[5] && field[3] != '') return {state: 'ended', winner: field[3]}
                    if(field[6] === field[7] && field[6] === field[8] && field[6] != '') return {state: 'ended', winner: field[6]}
                    if(field[0] === field[3] && field[0] === field[6] && field[0] != '') return {state: 'ended', winner: field[0]}
                    if(field[1] === field[4] && field[1] === field[7] && field[1] != '') return {state: 'ended', winner: field[1]}
                    if(field[2] === field[5] && field[2] === field[8] && field[2] != '') return {state: 'ended', winner: field[2]}
                    if(field[0] === field[4] && field[0] === field[8] && field[0] != '') return {state: 'ended', winner: field[0]}
                    if(field[6] === field[4] && field[6] === field[2] && field[6] != '') return {state: 'ended', winner: field[6]}
                    return {state: 'going'}
                } else return {state: 'draw'}
            }

            function swapPlayers() {
                players = [players[1], players[0]]
                currentPlayer = players[0]
                otherPlayer = players[1]
                io.to(currentPlayer.socket.id).emit('game-yourturn')
                io.to(otherPlayer.socket.id).emit('game-opsturn')
            }

            function restartGame() {
                if (players[0].goingToRestart == true && players[1].goingToRestart == true) {
                    players[0].goingToRestart = false
                    players[1].goingToRestart = false
                    console.log(console.log('Game in ' + room + ' has been restarted'))
                    field = ['', '', '', '', '', '', '', '', '']
                    isGameOn = true
                    io.to(room).emit('game-render', field)
                    swapPlayers()
                }
            }
        }
    })

    io.of('/').adapter.on('join-room', (room, id) => {
        console.log(id + ' joined room ' + room + ': ' + io.sockets.adapter.rooms.get(room).size)
        io.to(room).emit('userjoined', id)
    })

    io.of('/').adapter.on('leave-room', (room, id) => {
        console.log(id + ' leaved room ' + room + ': ' + io.sockets.adapter.rooms.get(room).size)
        io.to(room).emit('userleaved', id)
    })
}

function generateId() {
    return Math.random().toString(36).substring(2, 9)
}