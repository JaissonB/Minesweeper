var lado = 9; //9(81-10) - 13(169-25) - 21(441-80)
var size = lado * lado;

var nivel = 1;

var matriz = [];
var vectors = [];

//Muda a quantidade de bombas conforme o tamanho da matriz
function defQuantityOfBombs () {
    switch (lado) {
        case 9:
            return 10
        case 13:
            return 25
        case 21:
            return 80
    }
}

//Inicia a matriz do tamanho necessário
function initMatriz () {
    matriz = [];
    for (var i = 0; i < size; i++) {
        vectors.push(0);
        if (vectors.length == lado) {
            var divisor = (i + 1) / lado - 1;
            matriz[divisor] = vectors;
            vectors = [];
        }
    }
}
initMatriz();

//Retorna um numero pseudo-aleatorio para usar na distribuição das bombas
function getRandomInt () {
    min = Math.ceil(0);
    max = Math.floor(lado);
    return Math.floor(Math.random() * (max - min)) + min;
}

//Espalha aleatóriamente as minas pela matriz
function spreadBombs () {
    for (var i = 0; i < defQuantityOfBombs(); i ++) {
        var linha = getRandomInt();
        var coluna = getRandomInt();
        if (matriz[linha][coluna] !== 'X') {
            matriz[linha][coluna] = 'X';
        } else i--;
    }
}
spreadBombs();
console.log(matriz)

function spreadNumbers () {
    //Percorre as linhas da matriz
    for (var i = 0; i < lado; i ++) {
        //Percorre as colunas da matriz
        for (var j = 0; j < lado; j ++) {
            console.log(i, j);
            var quantityOfBombsAround = 0;
            //Se tiver uma bomba não faz nada, segue para o próximo laço
            if (matriz[i][j] !== 'X') {
                //Não sendo bomba, será percorrido os arredores da casa em questão para indentificar quantas minas existem ao seu redor
                for (var a = i - 1; a <= i + 1; a ++){
                    for ( var b = j - 1; b <= j + 1; b ++) {
                        if (a >= 0 && b >= 0 && a < lado && b < lado) {
                            if (matriz[a][b] === 'X') {
                                quantityOfBombsAround ++;
                            }
                        }
                    }
                }
                matriz[i][j] = quantityOfBombsAround;
            }
        }
    }
    console.log("Spread:", matriz)
}
spreadNumbers();