var lado = 3
var size = lado * lado

var matriz = []
var vetores = []

for (var i = 0; i < size; i++) {
    vetores.push(i)
    if (vetores.length == lado) {
        var divisor = (i + 1) / lado - 1;
        matriz[divisor] = vetores
        vetores = []
    }
}

matriz[getRandomInt()][getRandomInt()] = 'X'
console.log(matriz)

function getRandomInt () {
    min = Math.ceil(0);
    max = Math.floor(lado);
    return Math.floor(Math.random() * (max - min)) + min;
}

