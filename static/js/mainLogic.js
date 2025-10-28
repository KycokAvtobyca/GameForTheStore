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

async function getBlock(el1, el2){
    const response = await fetch(`/api/blocks?el1=${el1}&el2=${el2}`, {
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

// Часть ответсвенная за построение маршрута
async function setRoute(el1, el2){
    const container = document.getElementById('container')
    const cells = container.querySelectorAll('.cell')

    setHover(cells)
    
    const indexEl1 = Array.from(cells).indexOf(el1)
    const indexEl2 = Array.from(cells).indexOf(el2)

    await getBlock(indexEl1, indexEl2)

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

    console.log(matrix)

    // Теперь находим короткий путь
    let rowIndexEl1 = indexEl1 % 10
    let rowIndexEl2 = indexEl2 % 10
    let columnIndexEl1 = Math.trunc(indexEl1 / 10)
    let columnIndexEl2 = Math.trunc(indexEl2 / 10)

    // Двигаемся от первого элемента
    while (true){
        let check=0
        // Проверяем горизонталь
        let left=false

        if (rowIndexEl1 > rowIndexEl2) left=true

        // Проверяем вертикаль
        let down=false

        if (columnIndexEl1 > columnIndexEl2) down=true

        check++
        

        if (rowIndexEl1 !== rowIndexEl2){
            rowIndexEl1 += left ? -1 : 1

            if (await checkRC(matrix[columnIndexEl1][rowIndexEl1])){
                break
            }
        }
        
        if (columnIndexEl1 !== columnIndexEl2){
            columnIndexEl1 += down ? -1 : 1

            if (await checkRC(matrix[columnIndexEl1][rowIndexEl1])){
                break
            }
        }

        if (rowIndexEl1 === rowIndexEl2 && columnIndexEl1 === columnIndexEl2){
            console.log('Второй элемент найден. Игра завершена.')
            matrix[columnIndexEl2][rowIndexEl2].classList.add('end')
        
            return true
        }

    }

    // Сделать препятствия
}

setMainLogic()