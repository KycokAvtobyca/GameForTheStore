import { checkRC } from './mainLogic.js'

async function setBlocks(indexEl1, indexEl2){
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

            await checkRC(matrix[columnIndexEl1][rowIndexEl1])
        }
        
        if (columnIndexEl1 !== columnIndexEl2){
            columnIndexEl1 += down ? -1 : 1

            await checkRC(matrix[columnIndexEl1][rowIndexEl1])
        }

        if (rowIndexEl1 === rowIndexEl2 && columnIndexEl1 === columnIndexEl2){
            console.log('Второй элемент найден. Игра завершена.')
            matrix[columnIndexEl2][rowIndexEl2].classList.add('end')
        
            return true
        }

    }
    
    // Сделать препятствия
}