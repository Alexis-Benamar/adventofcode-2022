const { readFileSync, writeFileSync } = require('fs')
const path = require('path')

const fileName = 'data' // Should be 'data' or 'test'
const data = readFileSync(path.join(__dirname, `./${fileName}.txt`)).toString()
const lines = data
  .split('\n\n')[0]
  .split('\n')

const gridSize = 100 * (fileName === 'data' ? 50000 : 1)
const gridOffset = gridSize / 2
// const sensors = []
// const beacons = []
// const coordX = []
// const coordY = []

// const grid = new Array(gridSize)
// for (let i = 0; i < gridSize; i++) {
//   const row = []
//   for (let j = 0; j < gridSize; j++) {
//     row.push('.')
//   }
//   grid[i] = row
// }

function manhD(a, b) {
  return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])
}

const diamonds = lines.map(line => {
  const [sX, sY, bX, bY] = line.match(/-?\d+/g).map(Number)
  const sensor = [sX, sY]
  const beacon = [bX, bY]
  const radius = manhD(sensor, beacon)

  return { sensor, beacon, radius }
})

function getLeftAndRightX(diamond, y) {
    const distance = (diamond.radius - Math.abs(y - diamond.sensor[1]))

    return [diamond.sensor[0] - distance, diamond.sensor[0] + distance]
}

function scanY(y) {
  console.log('Processing data...')

  // Get diamonds crossed by line at y
  const diamondsCrossing = diamonds.filter(diamond => {
    return y > diamond.sensor[1] - diamond.radius && y < diamond.sensor[1] + diamond.radius
  })

  // Get minimum & maximum intersection points's X
  const intersectPoints = diamondsCrossing
    .flatMap(diamond => getLeftAndRightX(diamond, y))
  const [minX, maxX] = [Math.min(...intersectPoints), Math.max(...intersectPoints)]

  // For each points inbetween min & max, if in range of any sensor, increment
  let pointsReachable = 0
  for (let x = minX; x <= maxX; x++) {
    const sensorsInReach = diamonds.filter(diamond => manhD(diamond.sensor, [x, y]) <= diamond.radius)
    if (sensorsInReach.length > 0) pointsReachable++
  }

  // Get beacons present at Y coordinates
  const beaconsAtY = [...new Set(diamonds.map(diamond =>  diamond.beacon[1]))]
    .filter(beaconY => beaconY === y)
    .length

  console.log('Points at Y=2000000 that cannot be beacons:', pointsReachable - beaconsAtY)
}

scanY(2000000) // Part 1
