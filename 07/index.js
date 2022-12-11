const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString().split('\n')

/**
 * Parse lines
 */
const folders = []
const files = []
const currentPath = []

data.forEach((line, index) => {
  const args = line.split(' ')
  
  if (line.startsWith('$ cd')) {
    if (args[2] === '..') {
      currentPath.pop()
    } else {
      folders.push([...currentPath, args[2]].join(''))
      // Adds `${args[2]}/` to folder array
      currentPath.push((args[2] === '/' ? '' : args[2]) + '/')
    }
  }

  if (line.startsWith('$ ls')) {
    const content = []
    let i = index

    // Don't look here
    while(true) {
      i++

      if (data[i] === undefined || data[i].startsWith('$')) {
        break
      }
      
      content.push(data[i])
    }

    const localFiles = content
      .filter(item => !item.startsWith('dir'))
      .map(file => `${currentPath.join('')}${file.split(' ')[0]}`)
    files.push(...localFiles)
  }
})

/**
 * Calculate answers
 */
let totalSize = 0
let folderSizes = []

folders.forEach(folder => {
  // Get size of all content within folder
  const size = files
    .filter(file => file.startsWith(folder))
    .map(path => Number(path.split('/').reverse()[0]))
    .reduce((total, value) => total + value)

  if (size <= 100000) {
    totalSize += size
  }

  folderSizes.push(size)
})

const sortedSizes = folderSizes.sort((a, b) => a - b)
const freeSpace = 70000000 - sortedSizes[sortedSizes.length - 1]
const spaceToFreeUp = 30000000 - freeSpace
const bigEnough = sortedSizes.find(size => size >= spaceToFreeUp)

console.log(totalSize) // Part 1 answer
console.log(bigEnough) // Part 2 answer
