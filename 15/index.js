const { readFileSync } = require('fs')
const path = require('path')

const fileName = 'data' // Should be 'data' or 'test'
const YtoSearch = fileName === 'data' ? 2_000_000 : 10

const data = readFileSync(path.join(__dirname, `./${fileName}.txt`)).toString()
const lines = data
  .split('\n\n')[0]
  .split('\n')

  /**
   * Gets manhattan distance between a and b
   * @param {[x, y]} a 
   * @param {[x, y]} b 
   * @returns number
   */
function manhD(a, b) {
  return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])
}

/**
 * Parse lines as { sensor, beacon, radius = manhD(sensor, beacon)}
 */
const diamonds = lines.map(line => {
  const [sX, sY, bX, bY] = line.match(/-?\d+/g).map(Number)
  const sensor = [sX, sY]
  const beacon = [bX, bY]
  const radius = manhD(sensor, beacon)

  return { sensor, beacon, radius }
})

/**
 * Gets leftmost & rightmost x coordinate within diamond's range at y
 * @param {{ sensor, beacon, radius }} diamond 
 * @param {number} y 
 * @returns [number, number]
 */
function getLeftAndRightX(diamond, y) {
    const distance = (diamond.radius - Math.abs(y - diamond.sensor[1]))

    return [diamond.sensor[0] - distance, diamond.sensor[0] + distance]
}

/**
 * Get intersection points at Y
 * Returns their left & right intersection points
 * @param {number} y 
 * @returns [[x, y]]
 */
function getIntersectionPoints(y) {
  return diamonds
    .filter(diamond => y > diamond.sensor[1] - diamond.radius && y < diamond.sensor[1] + diamond.radius)
    .map(diamond => getLeftAndRightX(diamond, y))
}

/**
 * Scans line at Y
 * Iterates through all points inbetween leftmost and rightmost of all intersecting points
 */
function scanY(y) {
  console.log('Scanning Y:', y, '...')

  const intersectPoints = getIntersectionPoints(y)

  // Get minimum & maximum intersection points's X
  const [minX, maxX] = [Math.min(...intersectPoints.flat()), Math.max(...intersectPoints.flat())]

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

  // Answer is all points in range of sensors minus number of beacons at this y coordinate
  console.log(`Points at Y=${YtoSearch} that cannot be beacons:`, pointsReachable - beaconsAtY)
}

/**
 * Merge ranges together.
 * @param {[[x, y]]} intersectPoints 
 * @returns [[x, y]]
 */
function mergeRanges(intersectPoints) {
  // Get intersection points and sort them by their start
  const [first, ...rest] = intersectPoints.sort((a, b) => a[0] - b[0])

  const result = [first]

  // For each of the rest, compare with the previous range
  // If next range starts between previous start and previous end, merge them
  // Else, push range to list 
  rest.forEach(next => {
    const [nextStart, nextEnd] = next
    const [prevStart, prevEnd] = result[result.length - 1]

    if (nextStart <= prevEnd + 1) {
      result[result.length - 1] = [prevStart, Math.max(prevEnd, nextEnd)]
    } else {
      result.push([nextStart, nextEnd])
    }
  })

  return result
}

/**
 * Scans ranges at Y
 * If more than one range found, it means there's a gap
 * And the emitting signal must come from here
 * @returns 
 */
function scanRanges() {
  for (let y = 0; y <= 4_000_000; y++) {
    const intersectPoints = getIntersectionPoints(y)
    const ranges = mergeRanges(intersectPoints)

    if (ranges.length > 1) {
      const cell = [ranges[0][1] + 1, y]

      console.log('Found signal source at', cell)
      console.log('Signal frequency:', cell[0] * 4_000_000 + cell[1])

      return
    }
  }
}

/**
 * Part 1
 */
console.time('scanningY')
scanY(YtoSearch)
console.timeEnd('scanningY')

/**
 * Part 2
 */
console.time('scanningRanges')
scanRanges()
console.timeEnd('scanningRanges')
