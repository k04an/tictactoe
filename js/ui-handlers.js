allowWindowSwitch = false
$(document).ready(function() {
    $('.btnCreateRoom').click(() => {
        if (allowWindowSwitch) {
            socket.emit('createroom', (roomId) => {
                currRoom = roomId
                resetGameWindow()
                switchToWindow('game')
                $('.field-log').html('Ожидаем соперника...' + roomId)
            })
        }
    })

    $('.btnJoinRoom').click(() => {
        if (allowWindowSwitch) {
            socket.emit('joinroom', $('.roomIDInput').val(), (response) => {
                console.log(response)
                if (response.code == 'ok') {
                    currRoom = response.room
                    resetGameWindow()
                    switchToWindow('game')
                } else if (response.code == 'err') {
                    alert('Error ' + response.descCode + ' has occurred: ' + response.desc)
                }
            })
        }
    })

    $('.toLobbyBtn > div').click(() => {
        if (allowWindowSwitch) {
            socket.emit('leaveroom', currRoom, (response) => {
                if (response.code == 'ok') {
                    switchToWindow('home')
                } else if (response.code == 'err') {
                    console.log('Error: ' + response.desc)
                }
            })
        }
    })

    $('.field > tbody > tr > td').click(function(e) {
        socket.emit('game-pickcell', getKey($('.field > tbody > tr > td'), e.currentTarget))

        // Поиск ключа по значению
        function getKey(obj, value) {
            return Object.keys(obj).find(key => obj[key] === value)
        }
    })
 
    $('#bottom-wave').on('animationend', () => {
        allowWindowSwitch = true
    })

    $('.restartBtn').click(() => {
        socket.emit('game-restart', (resp) => {
            if (resp.code == 'ok') {
                clearField()
                toggleCurtain(false)
                $('.field-log').html('Ждем решения соперника...')
            }
        })
    }) 
})