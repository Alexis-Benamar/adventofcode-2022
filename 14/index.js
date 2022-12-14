const { readFileSync, writeFileSync } = require('fs')
const path = require('path')

const fileName = 'test'
const data = readFileSync(path.join(__dirname, `./${fileName}.txt`)).toString()
const lines = data
  .split('\n')
  .map(line => line.split(' -> '))

const sortedX = data.match(/\d+,/gm).map(num => Number(num.slice(0, num.length - 1))).sort((a, b) => a - b)
const sortedY = data.match(/,\d+/gm).map(num => Number(num.slice(1, num.length))).sort((a, b) => a - b)
const minX = sortedX[0]
const minY = sortedY[0]
const maxX = sortedX[sortedX.length - 1]
const maxY = sortedY[sortedY.length - 1]
const gridMinX = Math.floor(minX / 10) * 10
const gridMaxX = Math.ceil(maxX / 10) * 10
const gridMinY = Math.floor(minY / 10) * 10
const gridMaxY = Math.ceil(maxY / 10) * 10
const cols = gridMaxX - gridMinX
const rows = gridMaxY - gridMinY

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
grid[500 - gridMinX][0] = '+'

/**
 * Draw point of line on grid
 * @param {number} x
 * @param {number} y
 * @returns
 */
function draw(x, y) {
  if (grid[x - gridMinX][y - gridMinY] === '#') return

  grid[x - gridMinX][y - gridMinY] = '#'
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
          if (drawX > end[0]) drawX-- // walk left
          if (drawX < end[0]) drawX++ // walk right
        } else if (drawY !== end[1]) {
          if (drawY > end[1]) drawY-- // walk up
          if (drawY < end[1]) drawY++ // walk down
        }

        // Draw on updated coordinates
        draw(drawX, drawY)
      }
    }
  }
}

/**
 * Add lines to grid
 */
addLines()

/**
 * Draw grid
 */
let output = ''
for (let j = 0; j < rows; j++) {
  for (let i = 0; i < cols; i++) {
    output += grid[i][j]
  }

  output += '\n'
}

console.log(output)

// Save output for better visualization
writeFileSync(path.join(__dirname, `./output.${fileName}.txt`), output, { encoding: 'utf-8' })