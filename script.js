var lado = 9; //9(81-10) - 13(169-25) - 21(441-80)
var size = lado * lado;
var flags = 10;

var nivel = 1;

var matriz = [];
var responseMatriz = [];
var vectors = [];

var blocksEmpty = [];

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
    spreadBombs();
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
    document.querySelector('.li-flags').textContent = 10;
    for (var i = 0; i < defQuantityOfBombs(); i ++) {
        var linha = getRandomInt();
        var coluna = getRandomInt();
        if (matriz[linha][coluna] !== 'X') {
            matriz[linha][coluna] = 'X';
        } else i--;
    }
    spreadNumbers();
}

function spreadNumbers () {
    //Percorre as linhas da matriz
    for (var i = 0; i < lado; i ++) {
        //Percorre as colunas da matriz
        for (var j = 0; j < lado; j ++) {
            var quantityOfBombsAround = 0;
            //Se tiver uma bomba não faz nada, segue para o próximo laço
            if (matriz[i][j] !== 'X') {
                //Não sendo bomba, será percorrido os arredores da casa em questão para indentificar quantas minas existem ao seu redor
                for (var a = i - 1; a <= i + 1; a ++) {
                    for ( var b = j - 1; b <= j + 1; b ++) {
                        if (a >= 0 && b >= 0 && a < lado && b < lado) {
                            if (matriz[a][b] === 'X') {
                                quantityOfBombsAround ++;
                            }
                        }
                    }
                }
                matriz[i][j] = quantityOfBombsAround;
                if (!quantityOfBombsAround) {
                    blocksEmpty.push([i, j]);
                }
            }
        }
    }
    console.log(blocksEmpty)
    responseMatriz = matriz;
    buildVisualMatriz();
}

//Constrói a matriz no DOM
function buildVisualMatriz () {
    var box = document.querySelector('.box');
    for (var i = 0; i < lado; i ++) {
        for (var j = 0; j < lado; j ++) {
            var li = document.createElement('li');
            li.setAttribute('id', `li-${i}-${j}`);
            li.setAttribute('onmousedown', 'showBlocks(this)');
            li.setAttribute('class', 'close');
            li.innerHTML =  li.textContent + " ";
            box.appendChild(li);
        }
    }
}

//Chamada no evento 'onmousedown' do HTML e é responsável por mostrar a casa ou colocar a bandeira na casa
function showBlocks (element) {
    var liFlags = document.querySelector('.li-flags');
    window.event.preventDefault()
    var id = element.id;

    if (!event) var event = window.event;
    if (!event.button) {
        openBlock(element);
    } else {
        if (!(parseInt(element.textContent) >= 0 || element.textContent == 'X') && document.querySelector(`#${id} img`) == null) {
            element.innerHTML = '<img src="./imgs/bandeiraRussia.png">';
            element.classList.remove('close');
            flags--;
        } else if (document.querySelector(`#${id} img`) != null) {
            element.innerHTML = '';
            element.classList.add('close');
            flags++;
        }
        liFlags.textContent = flags;
    }
    winGame();
}

//Abre a casa que for clicada com o botão esquerdo do mouse, diferenciando casas com bomba, vazias ou com seus respectivos numeros
function openBlock (element) {
    var id = element.id;
    var linha = id[3];
    var coluna = id[5];

    if (id[4] > -1 && id[7] > -1) {
        linha = `${id[3]}` + `${id[4]}`;
        coluna = `${id[6]}` + `${id[7]}`;
    } else if (id[4] > -1) {
        linha = `${id[3]}` + `${id[4]}`;
        coluna = id[6];
    } else if (id[6] > -1) {
        linha = id[3];
        coluna = `${id[5]}` + `${id[6]}`;
    }

    if (document.querySelector(`#${id} img`) == null) {
        element.textContent = responseMatriz[linha][coluna];
        element.classList.remove('close');
        if (responseMatriz[linha][coluna] == 'X') loseGame(element);
        else if (responseMatriz[linha][coluna] == 0) {
            element.textContent = '';
            openAroundBlocks(linha, coluna);
        }
    }
}

//Abre algumas casas ao redor da casa clicada se essa for vazia
function openAroundBlocks (lin, col) {
    var el = document.querySelector(`#li-${lin}-${col}`);
    el.classList.remove('close');
    el.textContent = '';

    for (var i = 0; i < blocksEmpty.length; i ++) {
        var a = blocksEmpty[i][0];
        var b = blocksEmpty[i][1];
        el = document.querySelector(`#li-${a}-${b}`);
        if ((Math.abs(a - lin) < 2 && Math.abs(b - col) < 2)) {
            el.classList.remove('close');
            el.textContent = responseMatriz[a][b];
            if (responseMatriz[a][b] === 0) el.textContent = '';
        }
    }
}

//É chamada quando uma bomba é encontrada, mostra o modal de jogo perdido
function loseGame (element) {
    for (var i = 0; i < lado; i ++) {
        for (var j = 0; j < lado; j ++) {
            var el = document.querySelector(`#li-${i}-${j}`);
            el.removeAttribute('onmousedown');
            if (matriz[i][j] == 'X') {
                el.innerHTML = '';
                el.textContent = 'X';
                el.classList.add('loseBomb');
            }
        }
    }
    element.classList.remove('loseBomb');
    element.classList.add('bombExploded');
    document.querySelector('.endGame').style.display = 'flex';
    document.querySelector('.modalLose').style.display = 'flex';
}

//É chamada quando o jogo é ganho, mostra o modal de jogo ganhado
function winGame () {
    var nBandeiras = 0;
    var allBlocksOpen = true;
    for (var i = 0; i < lado; i ++) {
        for (var j = 0; j < lado; j ++) {
            var el = document.querySelector(`#li-${i}-${j}`);
            if (el.classList.contains('close')) allBlocksOpen = false;
            if (document.querySelector(`#li-${i}-${j} img`) != null) nBandeiras ++;
        }
    }
    if (allBlocksOpen && (nBandeiras == defQuantityOfBombs())) {
        document.querySelector('.endGame').style.display = 'flex';
        document.querySelector('.modalWin').style.display = 'flex';
    }
}

//Começa um novo jogo
function resetGame () {
    document.querySelector('.endGame').style.display = 'none';
    document.querySelector('.modalWin').style.display = 'none';
    document.querySelector('.modalLose').style.display = 'none';
    document.querySelector('.box').innerHTML = "";
    initMatriz();
}

//Fecha os modais de vitória ou derrota
function closeModal () {
    document.querySelector('.endGame').style.display = 'none';
    document.querySelector('.modalWin').style.display = 'none';
    document.querySelector('.modalLose').style.display = 'none';
}