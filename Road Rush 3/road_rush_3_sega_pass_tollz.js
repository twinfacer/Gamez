avail_chars=/[0-9,A-V,\s]/

nums =   "1     2     3     4     5     6     7     8"
mask =   "00000 00000 00000 00000 00000 00000 00000 00000"
// Money
money =  "11110 11110 11110 11110 00000 00000 00000 00000"
// Bike (0-15)
bike =   "00000 00000 00001 00001 00000 11111 00000 00000"
// Upgrades bits
perf =   "00001 00000 00000 00000 00000 00000 00000 00000"
susp =   "00000 00001 00000 00000 00000 00000 00000 00000"
tires =  "00000 00000 00000 00000 01000 00000 00000 00000"
prot =   "00000 00000 00000 00000 10000 00000 00000 00000"
// Level & Tracks
tracks = "00000 00001 00000 00000 00000 00000 11111 00000"
level =  "00000 00000 00000 00000 00111 00000 00000 00000"

// Utils
const log = console.log // Sorry. I'm lazy =)
// Convert all the things! from Int -> Bin -> Char(5)
const charToBin = (char) => Number.parseInt(char.toLowerCase(), 32).toString(2).padStart(5, '0')
const binToChar = (bin) => Number.parseInt(bin, 2).toString(32)
const passToBin = (pass) => pass.replace(/\s/g, '').split('').map(charToBin).join(' ')
const numToChar = (n) => n.toString(2).slice(0,8).toString(32)
const charToNum = (c) => Number.parseInt(c.replace(/\s/g, '').split('').map(charToBin).join(''), 2)

// Checksum do follows - get first 7 chars of password, convert them to binary, summs them them adds 1. Then convert back to 1 char.
function checksum(pass) {
  let sum = 1
  // Get rid of spaces, get first 7 chars, convert each to Int, then summ with buff (sum)
  pass.replace(/\s/g, '').slice(0,8).split('').map(charToNum).map((n) => sum += n)
  return binToChar(sum.toString(2).slice(-5))
}

function generateHead(money, bike=0, grades=[0,0,0,0]) {
  const binary = (money/10).toString(2).padStart(16, '0')
  // log(binary)
  // log([binary.slice(0, 4), binary.slice(5, 9), binary.slice(10, 14), binary.slice(15, 19)].reverse().join(' '))
  // 0-2550 + perf/susp upgrades
  const bikeBin = bike.toString(2)
  log(bikeBin)
  const first = binToChar(`${binary.slice(12, 16)}${grades[1] == 1 ? 1 : 0}`)
  const second = binToChar(`${binary.slice(8, 12)}${grades[0] == 1 ? 1 : 0}`)
  // 2560 - 655350
  // TODO: Bike part
  const third = binToChar(`${binary.slice(4, 8)}0`)
  const forth = binToChar(`${binary.slice(0, 4)}0`)
  return `${first}${second}${third}${forth}`
  // return `${forth}${third}${second}${first}`
}

function generateTail(lvl=1, tracks=[0,0,0,0,0], bike=0, grades=[0,0,0,0]) {
  const lvlBin = `${grades[2] == 1 ? 1 : 0}${grades[3] == 1 ? 1 : 0}${lvl.toString(2).padStart()}`
  const lvlChar = binToChar(lvlBin)
  const bikeChar = `0`
  const tracksChar = binToChar(Number.parseInt(tracks.join(''), 2))
  return `${lvlChar}${bikeChar}${tracksChar}`
}

function parsePass(pass) {
  let output = { money: 0, lvl: 1, bike: 1, tracks: [0,0,0,0,0], grades: [0,0,0,0] }
  const bin = pass.replace(/\s/g, '').split('').map(charToBin).map((n) => n.padStart(5, '0')).join('')
  const moneyBin = `${bin.slice(15, 19)}${bin.slice(10, 14)}${bin.slice(5, 9)}${bin.slice(0, 4)}`
  const tailBin = bin.slice(19, 39)
  log(`${tailBin.slice(0,5)} ${tailBin.slice(5,10)} ${tailBin.slice(10,15)} ${tailBin.slice(15,20)}`)
  output.money = Number.parseInt(moneyBin, 2) * 10
  output.grades = [bin.slice(4, 5), bin.slice(9, 10), tailBin.slice(0,1), tailBin.slice(1,2)]
  output.tracks = tailBin.slice(10, 15).split('')
  output.lvl = Number.parseInt(tailBin.slice(2,5), 2)
  log(output.grades)
  log(output.tracks)
  log(money)
  return output
}

// Grades (Perf, Susp, Prot, Tires)
function generatePass(money=0, bike=0, lvl=1, tracks=[0,0,0,0,0], grades=[0,0,0,0]) {
  const head = generateHead(money, bike, grades)
  const tail = generateTail(lvl, tracks, bike, grades)
  return `${head} ${tail}${checksum(head + tail)}`.toUpperCase()
}
//////// TESTZ
// log(parsePass('I700 9003'))
// log( `     0$ - ${generatePass(0)} == 0000 1002`)
// log( `  0$ - ${generatePass(0)} == 0000 1002`)
// log( `  150$ - ${generatePass(150)} == `)
// log( `  160$ - ${generatePass(160)} == `)
// log( `  170$ - ${generatePass(170)} == `)
log( `  1000$ - ${generatePass(1000, 15)} == 8C00 100M`)
log( `  2560$ - ${generatePass(2560)} == 8C00 100M`)
log( `222010$ - ${generatePass(222010)} == IMCB 1102`)
log( `655350$ - ${generatePass(655350)} == UUUU 100Q`)
