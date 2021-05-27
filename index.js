const trilateration = require('./trilateration');

const distance = (pos, origem) => {
    return (Math.sqrt(Math.pow(Math.abs(pos[0])-Math.abs(origem[0]),2) + Math.pow(Math.abs(pos[1])-Math.abs(origem[1]),2)))*111;
};

const local1 = [-20.511609,-48.598058]
const local2 = [-20.514477,-48.598278]
const local3 = [-20.512559,-48.600762]
const origem = [-20.513086,-48.600052]

const LatA = local1[0]
const LonA = local1[1]
const DistA = distance(local1, origem)
const LatB = local2[0]
const LonB = local2[1]
const DistB = distance(local2, origem)
const LatC = local3[0]
const LonC = local3[1]
const DistC = distance(local3, origem)

const result = trilateration(LatA, LonA, DistA, LatB, LonB, DistB, LatC, LonC, DistC)

console.log(result, origem)
console.log(distance(result,origem)*1000) // Distance in meters

