const socket = io()
socket.id = ''
let currRoom = ''

socket.on('userleaved', () => {
    socket.emit('leaveroom', currRoom, (response) => {
        if (response.code == 'ok') {
            switchToWindow('home')
        } else if (response.code == 'err') {
            console.log('Error: ' + response.desc)
        }
    })
})

socket.on('game-yourturn', () => {
    $('.field-log').html('Ваш ход')
})

socket.on('game-opsturn', () => {
    $('.field-log').html('Ход соперника')
})

socket.on('game-render', (field) => {
    field.forEach((item, i) => {
        if (item == 'x') item = 'cross'
        else if (item == 'o') item = 'nought'
        drawShape(i, item)
    })
})

socket.on('game-won', (scoreInfo) => {
    $('.field-log').html('Победа!')
    showScore(scoreInfo)
    setTimeout(() => {
        toggleCurtain(true)
    }, 1000)
})

socket.on('game-lost', (scoreInfo) => {
    $('.field-log').html('Поражение!')
    showScore(scoreInfo)
    setTimeout(() => {
        toggleCurtain(true)
    }, 1000)
})

socket.on('game-draw', () => {
    $('.field-log').html('Ничья!')
    setTimeout(() => {
        toggleCurtain(true)
    }, 1000)
})

function showScore(score) {
    console.log(score)
    $('.cross-score > span').html(score.cross)
    $('.nought-score > span').html(score.nought)
}