let quadradosLegais = [];
let turnobranco = true;
let pecaSelecionada = null; // Variável para armazenar a peça clicada

const tabuleiro = document.querySelectorAll(".quadrado");
const pecas = document.querySelectorAll(".peça");

setupTabuleiro();
setupPecas();

// Configurar tabuleiro
function setupTabuleiro() {
  let i = 0;
  for (let quadrado of tabuleiro) {
    let row = 8 - Math.floor(i / 8);
    let column = String.fromCharCode(97 + (i % 8));
    quadrado.id = column + row;
    quadrado.addEventListener("click", moverPeca); // Adiciona evento de clique nos quadrados
    i++;
  }
}

// Configurar peças
function setupPecas() {
  for (let peca of pecas) {
    peca.addEventListener("click", selecionarPeca);
    peca.id = peca.classList[1] + peca.parentElement.id;
  }
}

function selecionarPeca(e) {
  const peca = e.currentTarget;
  const pecaCor = peca.getAttribute("color");

  if ((turnobranco && pecaCor === "branco") || (!turnobranco && pecaCor === "preto")) {
    if (pecaSelecionada === peca) {
      pecaSelecionada = null;
      limparDestaques();
    } else {
      pecaSelecionada = peca;
      getPossiveisMov(peca.parentNode.id, peca);
      destacarQuadrados(); // Adiciona destaque nos quadrados válidos
    }
  }
}

function moverPeca(e) {
  if (!pecaSelecionada) return;

  const destinoQuadrado = e.currentTarget;
  const pecaNoDestino = destinoQuadrado.querySelector(".peça");

  if (quadradosLegais.includes(destinoQuadrado.id)) {
    if (!pecaNoDestino) {
      destinoQuadrado.appendChild(pecaSelecionada);
    } else if (pecaNoDestino.getAttribute("color") !== pecaSelecionada.getAttribute("color")) {
      pecaNoDestino.remove();
      destinoQuadrado.appendChild(pecaSelecionada);
    }
    
    turnobranco = !turnobranco;
    pecaSelecionada = null;
    limparDestaques(); // Remove os destaques após mover
  }
}

// Função para destacar os quadrados legais
function destacarQuadrados() {
  limparDestaques(); // Limpa marcações anteriores
  for (let id of quadradosLegais) {
    let quadrado = document.getElementById(id);
    if (quadrado) {
      quadrado.classList.add("destaque"); // Adiciona a classe CSS
    }
  }
}

// Função para limpar os destaques quando a peça é deselecionada ou movida
function limparDestaques() {
  for (let quadrado of tabuleiro) {
    quadrado.classList.remove("destaque"); 
  }
}
// Função para obter movimentos válidos
function getPossiveisMov(posicao, peca) {
  quadradosLegais = [];
  const tipoPeca = peca.classList[1];
  const coluna = posicao[0];
  const linha = parseInt(posicao[1]);

  switch (true) {
    case tipoPeca.includes("peao"):
      movimentosPeao(coluna, linha, peca);
      break;
    case tipoPeca.includes("torre"):
      movimentosTorre(coluna, linha, peca);
      break;
    case tipoPeca.includes("bispo"):
      movimentosBispo(coluna, linha, peca);
      break;
    case tipoPeca.includes("cavalo"):
      movimentosCavalo(coluna, linha);
      break;
    case tipoPeca.includes("rainha"):
      movimentosRainha(coluna, linha, peca);
      break;
    case tipoPeca.includes("rei"):
      movimentosRei(coluna, linha);
      break;
  }
}

// Funções para movimentação das peças
function movimentosPeao(coluna, linha, peca) {
  const direcao = peca.getAttribute("color") === "branco" ? 1 : -1;
  const novaLinha = linha + direcao;
  const linhaInicial = peca.getAttribute("color") === "branco" ? 2 : 7;
  
  // Verifica se a casa à frente está livre
  let quadradoFrente = document.getElementById(coluna + novaLinha);
  if (quadradoFrente && !quadradoFrente.querySelector(".peça")) {
    quadradosLegais.push(coluna + novaLinha);

    // Se o peão estiver na posição inicial, pode avançar duas casas
    const duasCasas = linha + 2 * direcao;
    let quadradoDuasCasas = document.getElementById(coluna + duasCasas);
    if (linha === linhaInicial && quadradoDuasCasas && !quadradoDuasCasas.querySelector(".peça")) {
      quadradosLegais.push(coluna + duasCasas);
    }
  }

  // Capturas diagonais
  const colunasLaterais = [
    String.fromCharCode(coluna.charCodeAt(0) - 1),
    String.fromCharCode(coluna.charCodeAt(0) + 1)
  ];
  
  for (let novaColuna of colunasLaterais) {
    if (novaColuna >= 'a' && novaColuna <= 'h') {
      let quadradoDiagonal = document.getElementById(novaColuna + novaLinha);
      if (quadradoDiagonal) {
        let pecaNoDestino = quadradoDiagonal.querySelector(".peça");
        if (pecaNoDestino && pecaNoDestino.getAttribute("color") !== peca.getAttribute("color")) {
          quadradosLegais.push(novaColuna + novaLinha);
        }
      }
    }
  }
}

function movimentosTorre(coluna, linha, peca) {
  const direcoes = [
    [0, 1], [0, -1], [1, 0], [-1, 0] // Cima, Baixo, Direita, Esquerda
  ];
  
  for (let [dx, dy] of direcoes) {
    let novaColuna = coluna.charCodeAt(0);
    let novaLinha = linha;
    
    while (true) {
      novaColuna += dx;
      novaLinha += dy;
      
      if (novaColuna < 97 || novaColuna > 104 || novaLinha < 1 || novaLinha > 8) break;
      
      let pos = String.fromCharCode(novaColuna) + novaLinha;
      let quadrado = document.getElementById(pos);
      if (!quadrado) break;

      let pecaNoDestino = quadrado.querySelector(".peça");

      if (pecaNoDestino) {
        if (pecaNoDestino.getAttribute("color") !== peca.getAttribute("color")) {
          quadradosLegais.push(pos); // Captura permitida
        }
        break; // Parar ao encontrar qualquer peça
      }

      quadradosLegais.push(pos);
    }
  }
}

function movimentosBispo(coluna, linha, peca) {
  const direcoes = [
    [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonais
  ];
  
  for (let [dx, dy] of direcoes) {
    let novaColuna = coluna.charCodeAt(0);
    let novaLinha = linha;
    
    while (true) {
      novaColuna += dx;
      novaLinha += dy;
      
      if (novaColuna < 97 || novaColuna > 104 || novaLinha < 1 || novaLinha > 8) break;
      
      let pos = String.fromCharCode(novaColuna) + novaLinha;
      let quadrado = document.getElementById(pos);
      if (!quadrado) break;

      let pecaNoDestino = quadrado.querySelector(".peça");

      if (pecaNoDestino) {
        if (pecaNoDestino.getAttribute("color") !== peca.getAttribute("color")) {
          quadradosLegais.push(pos); // Captura permitida
        }
        break; // Parar ao encontrar qualquer peça
      }

      quadradosLegais.push(pos);
    }
  }
}
function movimentosCavalo(coluna, linha) {
  const movimentos = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
  ];
  for (let [dx, dy] of movimentos) {
    let novaColuna = String.fromCharCode(coluna.charCodeAt(0) + dx);
    let novaLinha = linha + dy;
    if (novaColuna >= 'a' && novaColuna <= 'h' && novaLinha >= 1 && novaLinha <= 8) {
      quadradosLegais.push(novaColuna + novaLinha);
    }
  }
}

function movimentosRainha(coluna, linha, peca) {
  movimentosTorre(coluna, linha, peca);
  movimentosBispo(coluna, linha,peca);
}

function movimentosRei(coluna, linha) {
  const movimentos = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];
  for (let [dx, dy] of movimentos) {
    let novaColuna = String.fromCharCode(coluna.charCodeAt(0) + dx);
    let novaLinha = linha + dy;
    if (novaColuna >= 'a' && novaColuna <= 'h' && novaLinha >= 1 && novaLinha <= 8) {
      quadradosLegais.push(novaColuna + novaLinha);
    }
  }
}

