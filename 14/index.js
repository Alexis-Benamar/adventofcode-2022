const { readFileSync, writeFileSync } = require('fs')
const path = require('path')

const fileName = 'data' // Should be 'data' or 'test'
const withFloor = true // Adds floor at bottom

const data = readFileSync(path.join(__dirname, `./${fileName}.txt`)).toString()
const lines = data
  .split('\n')
  .map(line => line.split(' -> '))

/**
 * Setup
 */
const sortedX = data.match(/\d+,/gm).map(num => Number(num.slice(0, num.length - 1))).sort((a, b) => a - b)
const sortedY = data.match(/,\d+/gm).map(num => Number(num.slice(1, num.length))).sort((a, b) => a - b)
const minX = sortedX[0]
const minY = sortedY[0]
const maxX = sortedX[sortedX.length - 1]
const maxY = sortedY[sortedY.length - 1]
const gridMinX = 0
const gridMaxX = 1000
const gridMinY = 0
const gridMaxY = maxY + 3
const cols = gridMaxX - gridMinX
const rows = gridMaxY

/**
 * Output related variables
 * leftmostX and rightmostX are based on leftmost & rightmost grains of sand
 */
let output = ''
let leftmostX = minX
let rightmostX = maxX

console.log('minX, maxX, minY, maxY', minX, maxX, minY, maxY)
console.log('gridMinX, gridMaxX, gridMinY, gridMaxY', gridMinX, gridMaxX, gridMinY, gridMaxY)
console.log('cols, rows:', cols, rows, '\n')

/**
 * Grid initialization
 */
const grid = new Array(cols)
for (let i = 0; i < cols; i++) {
  const row = []
  for (let j = 0; j < rows; j++) {
    row.push('.')
  }
  grid[i] = row
}

// Sand source
grid[500 - gridMinX][0] = '+'

// Add floor
if (withFloor) {
  for (let i = 0; i < cols; i++) {
    grid[i][gridMaxY - 1] = '#'
  }
}

/**
 * Draw point of line on grid
 * @param {number} x
 * @param {number} y
 * @returns
 */
function draw(x, y) {
  if (grid[x - gridMinX][y] === '#') return

  grid[x - gridMinX][y] = '#'
}

/**
 * From data, draw lines that build floors and walls on the map
 */
function addLines() {
  for (let i = 0; i < lines.length; i++) {
    // Get list of vertices that makes lines
    const vertices = lines[i].map(vertex => vertex.split(',').map(num => Number(num)))
    console.log(vertices)

    // For each vertex in vertices, draw line between vertex[i] and vertex[i + 1]
    for (let j = 0; j < vertices.length - 1; j++) {
      const [start, end] = [vertices[j], vertices[j + 1]]
      let [drawX, drawY] = start

      // First, draw starting point
      draw(drawX, drawY)

      // While draw coords have not reached end coords
      while ((drawX !== end[0]) || (drawY !== end[1])) {
        if (drawX !== end[0]) {
          if (drawX > end[0]) drawX-- // Walk left
          if (drawX < end[0]) drawX++ // Walk right
        } else if (drawY !== end[1]) {
          if (drawY > end[1]) drawY-- // Walk up
          if (drawY < end[1]) drawY++ // Walk down
        }

        // Draw on updated coordinates
        draw(drawX, drawY)
      }
    }
  }
}

/**
 * Make sand fall
 * If grain of sand gets stationnary, returns false
 * Else, if grain of sand reaches bottom of grid, return true
 * @returns boolean
 */
function sandFall() {
  let grain = [500 - gridMinX, gridMinY] // Initiate grain of sand at coordinates 500,0

  if (grid[grain[0]][grain[1]] === 'o') {
    console.log('source blocked!')

    return true
  }

  while (true) {
    const [nextL, nextM, nextR] = [
      [grain[0] - 1, grain[1] + 1], // Bottom left
      [grain[0], grain[1] + 1],     // Bottom middle
      [grain[0] + 1, grain[1] + 1], // Bottom right
    ]

    if (grid[nextM[0]][nextM[1]] === undefined) {
      console.log('grain reached bottom, stopping sand fall...')

      return true
    }

    if (grid[nextM[0]][nextM[1]] === '.') {
      grain = nextM
      
      continue
    }

    if (grid[nextL[0]][nextL[1]] === '.') {
      grain = nextL
      
      continue
    }

    if (grid[nextR[0]][nextR[1]] === '.') {
      grain = nextR
      
      continue
    }

    grid[grain[0]][grain[1]] = 'o'

    if (grain[0] < leftmostX) leftmostX = grain[0]
    if (grain[0] > rightmostX) rightmostX = grain[0]

    return false
  }
}

/**
 * Draw grid
 * Since we know the leftmost and rightmost X value,
 * we only have to draw data contained between those two values
 * (with a slight offset to give the pile of sand some space)
 */
function drawGrid() {
  output = ''

  for (let j = 0; j < rows; j++) {
    for (let i = leftmostX - 5; i < rightmostX + 6; i++) {
      output += grid[i][j]
    }

    output += '\n'
  }

  console.log(output)
}

/**
 * Run simulation
 * - add lines to grid to build map
 * - make sand fall until one grain of sand reaches grid bottom limit
 */
function runSimulation() {
  addLines()

  let units = 0

  while (true) {
    const hasSandFallen = sandFall()

    if (hasSandFallen) break

    units++
  }

  console.log('\n')
  drawGrid()

  console.log('units of sand:', units)

  // Save final output for better visualization
  writeFileSync(path.join(__dirname, `./output.${fileName}.txt`), output, { encoding: 'utf-8' })
}

runSimulation()