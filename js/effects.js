        // Константы для настройки эффектов
const FIGURES = 3 // Будет умножено на три для каждой фигуры

let isShapesOn = true
        // Классы
class Cross {
    constructor() {
        this.left = Math.random() * window.innerWidth;
        this.top = Math.random() * -450 - 81;
        this.to = Math.random() * 200 + (window.innerHeight / 3 * 2) + 200
        this.size = Math.random() * 60 + 20
        this.id = (Math.random() + 1).toString(36).substring(7)
        this.deg = Math.random() * 90 + 90
    }
    add() {
       $('body').append(`
       <svg id="${this.id}" class="falling-shape" style="left: ${this.left}px; top: ${this.top}px; z-index: 0;" id="cross" width="${this.size}" height="${this.size}" viewBox="0 0 324 324" fill="#EE4747" xmlns="http://www.w3.org/2000/svg">
            <circle cx="291.5" cy="32.5" r="32.5" fill="#EE4747"/>
            <circle cx="32.5" cy="291.5" r="32.5" fill="#EE4747"/>
            <line x1="34.019" y1="290.019" x2="293.019" y2="31.019" stroke="#EE4747" stroke-width="65"/>
            <circle cx="32.5" cy="32.5" r="32.5" transform="rotate(-90 32.5 32.5)" fill="#EE4747"/>
            <circle cx="291.5" cy="291.5" r="32.5" transform="rotate(-90 291.5 291.5)" fill="#EE4747"/>
            <line x1="290.019" y1="289.981" x2="31.019" y2="30.981" stroke="#EE4747" stroke-width="65"/>
        </svg>  
       `)
       $(`#${this.id}`).animate({
           top: `${this.to}px`,
           deg: this.deg,
        }, {
           duration: 15000,
           step: function(now) {
            $(`#${this.id}`).css({
                transform: `rotate(${now}deg)`
            })
           },
           complete: function() {
               let newCross = new Cross()
               if (isShapesOn) newCross.add()
               $(this).remove()
           }
       })
    }
}
class Nought {
    constructor() {
        this.left = Math.random() * window.innerWidth;
        this.top = Math.random() * -450 - 81;
        this.to = Math.random() * 200 + (window.innerHeight / 3 * 2) + 200
        this.size = Math.random() * 60 + 20
        this.id = (Math.random() + 1).toString(36).substring(7)
        this.deg = Math.random() * 90 + 90
    }
    add() {
       $('body').append(`
       <svg id="${this.id}" class="falling-shape" style="left: ${this.left}px; top: ${this.top}px; z-index: 0;" id="cross" width="${this.size}" height="${this.size}" viewBox="0 0 324 324" fill="#FFFFFF" fill-opacity="0" xmlns="http://www.w3.org/2000/svg">
            <circle cx="162" cy="162" r="139.5" stroke="#2B8F8F" stroke-width="45"/>
        </svg>  
       `)
       $(`#${this.id}`).animate({
           top: `${this.to}px`,
           deg: this.deg,
        }, {
           duration: 15000,
           step: function(now) {
            $(`#${this.id}`).css({
                transform: `rotate(${now}deg)`
            })
           },
           complete: function() {
               let newNought = new Nought()
               if (isShapesOn) newNought.add()
               $(this).remove()
           }
       })
    }
}
        // Графические функции
function displayWindow(selector, show) {
    switch (show) {
        case true:
            $(selector).show()
            $(selector).animate({
                'opacity': 1,
                'margin-top': '0px'
            }, 500)
            break
        case false:
            $(selector).animate({
                'opacity': 0,
                'margin-top': '-40px'
            }, {
                duration: 500,
                complete: () => {
                    $(selector).hide()
                }
            })
            break
    }
}

function toggleFallingShapes(toggle) {
    switch (toggle) {
        case true:
            isShapesOn = true
            setTimeout(function() {
                for (let i = 1; i < FIGURES; i++) {
                    let cross = new Cross()
                    cross.add()
                }
            }, 1500)
            setTimeout(function() {
                for (let i = 1; i < FIGURES; i++) {
                    let cross = new Cross()
                    cross.add()
                }
            }, 5000)
            setTimeout(function() {
                for (let i = 1; i < FIGURES; i++) {
                    let cross = new Cross()
                    cross.add()
                }
            }, 8500)
            // Отрисовка ноликов
            setTimeout(function() {
                for (let i = 1; i < FIGURES; i++) {
                    let nought = new Nought()
                    nought.add()
                }
            }, 1500)
            setTimeout(function() {
                for (let i = 1; i < FIGURES; i++) {
                    let nought = new Nought()
                    nought.add()
                }
            }, 5000)
            setTimeout(function() {
                for (let i = 1; i < FIGURES; i++) {
                    let nought = new Nought()
                    nought.add()
                }
            }, 8500)
            break
        case false:
            isShapesOn = false
            $('.falling-shape').remove()
    }
}

function toggleCurtain(show) {
    switch (show) {
        case true:
            allowWindowSwitch = false
            $('.slide').css('display', 'flex')
            $('.slide').animate({'opacity': '70%'}, 1000, () => {allowWindowSwitch = true})
            break
        case false:
            allowWindowSwitch = false
            $('.slide').animate({'opacity': '0%'}, 1000, () => {
                $('.slide').css('display', 'none')
                allowWindowSwitch = true
            })
            break
    }
}

function switchToWindow(windowName) {
    switch (windowName) {
        case 'home':
            allowWindowSwitch = false
            toggleFallingShapes(true)
            displayWindow('#game-field', false)
            $('#bottom-wave').css('transform', 'scale(1)')
            $('#bottom-wave').animate({
                'marginBottom': '-90vh'
            }, 2500, () => {
                displayWindow('#home-window', true)
                allowWindowSwitch = true
            })
            break
        
        case 'game':
            allowWindowSwitch = false

            // Изменяем css свойства волны и отключаем для нее css анимацию.
            // Это неоходимо для возможности использования jquery анимации
            $('#bottom-wave').css('margin-bottom', '-90vh').css('animation', '').animate({
                marginBottom: "0vh"
            }, {
                duration: 2500,
                complete: () => {
                    toggleFallingShapes(false)
                    $('#bottom-wave').css('transform', 'scale(1.6)')
                    displayWindow('#game-field', true)
                    allowWindowSwitch = true
                }
            })
            displayWindow('#home-window', false)
            break
    }
}

function resetGameWindow() {
    toggleCurtain(false)
    $('.cross-score > span').html('0')
    $('.nought-score > span').html('0')
    clearField()
}

function clearField() {
    $(`.field > tbody > tr > td`).html('')
}

function drawShape(cellPosition, shape) {
    switch (shape) {
        case 'cross':
            shape = `
            <svg class="game-shape-cross" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" width="85px" height="85px" viewBox="0 0 352 352" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="46.2548" y1="46" x2="306" y2="305.745" stroke="#EE4747" stroke-width="64" stroke-linecap="round"/>
                <line x1="305" y1="46.2548" x2="45.2548" y2="306" stroke="#EE4747" stroke-width="64" stroke-linecap="round"/>
            </svg>
            `
            break
        case 'nought':
            shape = `
            <svg class="game-shape-nought" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" width="85px" height="85px" viewBox="0 0 324 324" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="162" cy="162" r="139.5" stroke="#2B8F8F" stroke-width="45"/>
            </svg>  
            `
            break
    }
    if ($(`.field > tbody > tr > td:eq(${cellPosition})`).html() == '') $(`.field > tbody > tr > td:eq(${cellPosition})`).html(shape)
}

function renderField(field) {
    field.forEach((item, i) => {
        if (item == 'x') item = 'cross'
        else if (item == 'o') item = 'nought'
        drawShape(i, item)
    })
}

        // Создание эффектов
// Отрисовка крестов. Рисуем 2 группы с некоторым интервалом, для обеспечения непрерывного падения
toggleFallingShapes(true)

setTimeout(() => {
    displayWindow('#home-window', true)
}, 2500)