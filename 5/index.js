const { readFileSync } = require('fs')
const path = require('path')

const data = readFileSync(path.join(__dirname, './data.txt')).toString()

console.log(data)