import setRandomApples from './apples.js'

function setMainLogic(){
    const container = document.getElementById('container')

    for (let i=0; i < 100; i++){
        const el = document.createElement('div')
        el.className = 'cell hover'
        el.addEventListener('click', window.cellEventListener)

        container.appendChild(el)
    }

    setRandomApples()
}

// Часть отвественная за логику клика на клетку
const intervals = new WeakMap()

function intervalSettedCell(cell){
    let growing = true
    let size
    cell.style.transition = 'all 1.5s ease'
    const intervalId = setInterval(() => {
        if (growing){
            size = '1.2'
            growing = false
        } else {
            size = '1'
            growing = true
        }
        
        cell.style.transform = `scale(${size})`
    }, 1550)

    intervals.set(cell, intervalId);
    return intervalId
}

function removeStylesActiveCell(cell, flag=false){
    const intervalId = intervals.get(cell)

    if (!flag) cell.removeEventListener('click', window.cellEventListener)

    if (intervalId) {
        clearInterval(intervalId)
        intervals.delete(cell)
    }

    cell.classList.remove('active')
    cell.style.backgroundColor = '';
    cell.style.transform = '';
    cell.style.transition = '';
}

window.cellEventListener = (event) => {
    const el = event.target

    if (!el.classList || !el.classList.contains('cell')) return

    if (el.classList.contains('active')){
        removeStylesActiveCell(el, true)
        return
    }

    const activeCells = document.querySelectorAll('#container .cell.active')
    const cells = document.querySelectorAll('#container .cell')

    console.log(activeCells.length)
    if (activeCells.length > 0){
        cells.forEach(hEl => removeStylesActiveCell(hEl))

        // Дальнейшая логика на построение маршрута
        setRoute(activeCells[0], el)

        return
    }

    el.classList.add('active')
    el.style.backgroundColor = '#c57293'
    intervalSettedCell(el)
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkRC(el){
    el.style.transform = "scale(1.1)"
    el.classList.add('setted')
    await sleep(200)
    el.style.transform = "scale(1)"
}

function setHover(cells, hover=false){
    cells.forEach(el => {
        if (hover){
            if (!el.classList.contains('hover')) el.classList.add('hover')
        } else {
            if (el.classList.contains('hover')) el.classList.remove('hover')
        }
    })
}

async function checkWay(el1, el2){
    const response = await fetch(`/api/check?el1=${el1}&el2=${el2}`, {
        method: "GET",
        credentials: "same-origin"
    })
    const data = await response.json()
    try {
        if (!response.ok) {
            console.error("Ошибка сервера: ", data.detail)
        }
    
        console.log("Результат: ", data)
    
        return data
    } catch (err) {
        console.error("Сетевая ошибка: ", err)
    }
}

async function setHtmlMatrix(cells, el1){
    let matrix = []

    for (let i=0; i < 10; i++){
        let tempMatrix = []

        Array.from(cells).slice(i*10).forEach((el, index) => {
            if (index > 9) return;
            if (el === el1) {el.classList.add('start')}
            // if (el === el2) {el.classList.add('end')}
            tempMatrix.push(el)
        })

        matrix.push(tempMatrix)
    }

    return matrix
}

async function setNewCell(matrix, htmlMatrix){
    const tasks = [];

    for (let i=0; i < 100; i++){
        console.log('setNewCell', i)
        const y = Math.trunc(i / 10) || 0 // row
        const x = i % 10 || 0 // column

        console.log(y, x)

        console.log(matrix[y][x])
        console.log(htmlMatrix[y][x])

        const el = htmlMatrix[y][x]

        if (matrix[y][x] === 2){
            el.classList.add('block')
        }

        if (matrix[y][x] === 1){
            tasks.push(checkRC(el)); // стартуем задачу
            await sleep(200);
        }
    }

    await Promise.allSettled(tasks);
}

// Часть ответсвенная за построение маршрута
async function setRoute(el1, el2){
    
    const container = document.getElementById('container')
    const cells = container.querySelectorAll('.cell')

    setHover(cells)

    const indexEl1 = Array.from(cells).indexOf(el1)
    const indexEl2 = Array.from(cells).indexOf(el2)

    const matrix = (await checkWay(indexEl1, indexEl2))?.matrix
    const htmlMatrix = await setHtmlMatrix(cells, indexEl1)

    console.log(matrix, htmlMatrix)

    await setNewCell(matrix, htmlMatrix)
}

setMainLogic()