const { readFileSync } = require('fs')
const path = require('path')

const fileName = 'data' // Should be 'data' or 'test'

const data = readFileSync(path.join(__dirname, `./${fileName}.txt`)).toString().split(`\n\n`)[0]
const cubes = data.split('\n')

const neighbors = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
]
console.log(cubes)

let exposedSides = 0

for (let i = 0; i < cubes.length; i++) {
  const cube = cubes[i].split(',').map(Number)
  let neighborCount = 0

  neighbors.forEach(neighbor => {
    const cubeNeighbor = [
      cube[0] + neighbor[0],
      cube[1] + neighbor[1],
      cube[2] + neighbor[2],
    ]

    if (cubes.findIndex(cube => cube === cubeNeighbor.join(',')) === -1) {
      exposedSides++
    } else {
      neighborCount++
    }
  })
}

let steamPocket = 0
let pockets = []

for (let x = 0; x <= 20; x++) {
  for (let y = 0; y <= 20; y++) {
    for (let z = 0; z <= 20; z++) {
      console.log(x, y, z)
      if (data.match(new RegExp(`${x},${y},${z}`, 'gm'))) continue


      let coveredSides = 0

      neighbors.forEach(neighbor => {
        const cubeNeighbor = [
          x + neighbor[0],
          y + neighbor[1],
          z + neighbor[2],
        ]

        if (cubeNeighbor[0] < 0 || cubeNeighbor[1] < 0 || cubeNeighbor[2] < 0) return

        if (!data.match(new RegExp(cubeNeighbor.join(','), 'gm'))) return
    
        coveredSides++
      })

      if (coveredSides === 6) {
        console.log('steam pocket found at', x, y, z)
        pockets.push(`${x},${y},${z}`)
        steamPocket++
      }
    }
  }
}

console.log('number of exposed faces:', exposedSides) // Part 1
console.log('number of steam pockets:', steamPocket)
console.log('ajusted area:', exposedSides - (steamPocket * 6))
console.log(pockets)