export default function setRandomApples(){
    const quantityApples = Math.floor(Math.random() * (8 - 3 + 1)) + 3
    const allCell = document.querySelectorAll('#container .cell')

    console.log(quantityApples)

    // for (let i=0; i < quantityApples; i++){
    //     const randomApple = allCell[Math.floor(Math.random() * (100 - 0 + 1)) + 0]

    //     console.log(i)
    //     if (randomApple.style.backgroundImage){
    //         i--
    //         continue
    //     }

    //     randomApple.style.backgroundImage = 'url(./static/img/apple.webp)'
    //     randomApple.style.backgroundPosition = 'center';
    //     randomApple.style.backgroundSize = 'contain'; 
    // }
}