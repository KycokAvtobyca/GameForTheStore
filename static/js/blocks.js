import { checkRC } from './mainLogic.js'

async function checkBlock(matrix, y1, x1){
    if (matrix[y1][x1] == 2){
        console.log('Вы врезались в препятствие. Игра завершена.')
        return true
    }

    return false
}

export default async function setBlocks(indexEl1, indexEl2, htmlMatrix, matrix){
    // Теперь находим короткий путь
    let y1 = Math.trunc(indexEl1 / 10)
    let y2 = Math.trunc(indexEl2 / 10)
    let x1 = indexEl1 % 10
    let x2 = indexEl2 % 10    

    // Двигаемся от первого элемента
    let check=0

    while (true){
        check++

        if (await checkBlock(matrix, y1, x1)) return

        if (check === 1){
            const start = htmlMatrix[y1][x1]
            start.classList.add('start')
            await checkRC(start)
            continue
        }

        let down = y1 > y2
        let left = x1 > x2

        // Сначала по строке, потом по столбцу - это важно
        if (x1 !== x2){
            left ? x1-- : x1++
            if (matrix[y1][x1] === 1) await checkRC(htmlMatrix[y1][x1])
        }

        if (y1 !== y2){
            down ? y1-- : y1++
            if (matrix[y1][x1] === 1) await checkRC(htmlMatrix[y1][x1])
        }
    
        if (await checkBlock(matrix, y1, x1)) return

        if (y1 === y2 && x1 === x2){
            console.log('Второй элемент найден. Игра завершена.')
            htmlMatrix[y2][x2].classList.add('end')
            return true
        }
    }
}