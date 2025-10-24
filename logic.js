const container = document.getElementById('container')

console.log('test podgryzki')

for (let i=0; i < 100; i++){
    const el = document.createElement('div')
    el.className = 'cell'

    console.log(container, el)
    container.appendChild(el)
}