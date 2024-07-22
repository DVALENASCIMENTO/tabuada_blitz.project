const gameContainer = document.querySelector('.game-container'); // Seleciona o elemento com a classe 'game-container' e o armazena na variável gameContainer
const startBtn = document.getElementById('start-btn'); // Seleciona o elemento com o id 'start-btn' e o armazena na variável startBtn
const stopBtn = document.getElementById('stop-btn'); // Seleciona o elemento com o id 'stop-btn' e o armazena na variável stopBtn
const levelEl = document.getElementById('level'); // Seleciona o elemento com o id 'level' e o armazena na variável levelEl
const questionEl = document.getElementById('question'); // Seleciona o elemento com o id 'question' e o armazena na variável questionEl
const answersEl = document.getElementById('answers'); // Seleciona o elemento com o id 'answers' e o armazena na variável answersEl
const timerEl = document.getElementById('timer'); // Seleciona o elemento com o id 'timer' e o armazena na variável timerEl
const resultEl = document.getElementById('result'); // Seleciona o elemento com o id 'result' e o armazena na variável resultEl
const operationSelector = document.getElementById('operation'); // Seleciona o elemento com o id 'operation' e o armazena na variável operationSelector

let currentLevel = 1; // Inicializa o nível atual do jogo como 1
let currentQuestion = 0; // Inicializa a contagem de perguntas atuais como 0
let correctAnswers = 0; // Inicializa o contador de respostas corretas como 0
let totalCorrectAnswers = 0; // Inicializa o contador total de respostas corretas como 0
let totalQuestionsAsked = 0; // Inicializa o contador total de perguntas feitas como 0
let timer; // Declara uma variável para armazenar o identificador do temporizador
let gameInProgress = false; // Inicializa o estado do jogo como não iniciado
let usedQuestions = new Set(); // Cria um conjunto para armazenar perguntas já usadas

const totalLevels = 10; // Define o número total de níveis como 10
const questionsPerLevel = 10; // Define o número de perguntas por nível como 10

const tickSound = new Audio('sound/tictac1.mp3'); // Cria um objeto de áudio para o som de tic-tac
const finalTickSound = new Audio('sound/tictac2.mp3'); // Cria um objeto de áudio para o som final de tic-tac
const correctSound = new Audio('sound/correct.mp3'); // Cria um objeto de áudio para o som de resposta correta
const incorrectSound = new Audio('sound/incorrect.mp3'); // Cria um objeto de áudio para o som de resposta incorreta

startBtn.addEventListener('click', startGame); // Adiciona um ouvinte de evento para iniciar o jogo quando o botão 'start-btn' é clicado
stopBtn.addEventListener('click', endGame); // Adiciona um ouvinte de evento para terminar o jogo quando o botão 'stop-btn' é clicado
operationSelector.addEventListener('change', handleOperationChange); // Adiciona um ouvinte de evento para mudar a operação quando o seletor é alterado

function startGame() { // Função para iniciar o jogo
    startBtn.classList.add('hidden'); // Oculta o botão de iniciar
    stopBtn.classList.remove('hidden'); // Mostra o botão de parar
    resultEl.innerText = ''; // Limpa o texto do resultado
    currentLevel = 1; // Define o nível atual como 1
    correctAnswers = 0; // Reseta o contador de respostas corretas
    totalCorrectAnswers = 0; // Reseta o contador total de respostas corretas
    totalQuestionsAsked = 0; // Reseta o contador total de perguntas feitas
    usedQuestions.clear(); // Limpa o conjunto de perguntas usadas
    gameInProgress = true; // Define o estado do jogo como iniciado
    startLevel(); // Inicia o primeiro nível
}

function handleOperationChange() { // Função para lidar com a mudança de operação
    if (gameInProgress) { // Se o jogo está em andamento
        endGame(); // Termina o jogo
    }
    startBtn.classList.remove('hidden'); // Mostra o botão de iniciar
    stopBtn.classList.add('hidden'); // Oculta o botão de parar
}

function startLevel() { // Função para iniciar um nível
    currentQuestion = 0; // Reseta a contagem de perguntas atuais
    correctAnswers = 0; // Reseta o contador de respostas corretas
    resultEl.innerText = ''; // Limpa o texto do resultado
    levelEl.innerText = `Nível: ${currentLevel}`; // Atualiza o nível exibido
    nextQuestion(); // Avança para a próxima pergunta
}

function nextQuestion() { // Função para mostrar a próxima pergunta
    if (currentQuestion >= questionsPerLevel) { // Se todas as perguntas do nível foram feitas
        showLevelResult(); // Mostra o resultado do nível
        return; // Sai da função
    }

    currentQuestion++; // Incrementa a contagem de perguntas atuais
    totalQuestionsAsked++; // Incrementa o contador total de perguntas feitas
    displayQuestion(); // Exibe a pergunta
}

function generateRadicationQuestion() { // Função para gerar uma pergunta de radiciação
    const operation = operationSelector.value; // Obtém o valor da operação selecionada
    const squareRoots = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 841, 900, 961, 1024]; // Array de raízes quadradas
    let num1, correctAnswer, questionString; // Declara variáveis para o número, a resposta correta e a string da pergunta

    if (operation === 'radiciacao') { // Se a operação for radiciação
        let rootType = Math.floor(Math.random() * 2) + 2; // Escolhe aleatoriamente entre raiz quadrada (2) e cúbica (3)

        if (rootType === 2) { // Se for raiz quadrada
            num1 = squareRoots[Math.floor(Math.random() * squareRoots.length)]; // Escolhe um número aleatório da lista de raízes quadradas
            correctAnswer = Math.sqrt(num1); // Calcula a raiz quadrada do número
            questionString = `√${num1} = ?`; // Cria a string da pergunta
        } else { // Se for raiz cúbica
            let cubeRoots = squareRoots.map(Math.cbrt).map(num => Math.round(num)); // Calcula as raízes cúbicas e arredonda
            num1 = Math.pow(cubeRoots[Math.floor(Math.random() * cubeRoots.length)], 3); // Calcula o número cujo cubo é a raiz
            correctAnswer = Math.cbrt(num1); // Calcula a raiz cúbica do número
            questionString = `∛${num1} = ?`; // Cria a string da pergunta
        }

        while (usedQuestions.has(questionString)) { // Garante que a pergunta não tenha sido usada
            num1 = squareRoots[Math.floor(Math.random() * squareRoots.length)];
            correctAnswer = Math.sqrt(num1);
            questionString = `√${num1} = ?`;
        }
        
        usedQuestions.add(questionString); // Adiciona a pergunta ao conjunto de perguntas usadas
        return { num1, correctAnswer, questionString }; // Retorna o número, a resposta correta e a string da pergunta
    }
    
    return { num1: null, correctAnswer: null, questionString: '' }; // Retorna valores nulos se não for radiciação
}

function displayQuestion() { // Função para exibir a pergunta
    const operation = operationSelector.value; // Obtém o valor da operação selecionada
    let num1, num2, correctAnswer; // Declara variáveis para os números e a resposta correta

    switch (operation) { // Usa um switch para determinar a operação
        case 'adicao':
            num1 = Math.floor(Math.random() * 10) + 1; // Gera um número aleatório para a adição
            num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 + num2; // Calcula a resposta correta
            questionEl.innerText = `${num1} + ${num2} = ?`; // Atualiza a pergunta exibida
            break;
        case 'subtracao':
            num1 = Math.floor(Math.random() * 10) + 1; // Gera um número aleatório para a subtração
            num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 - num2;
            questionEl.innerText = `${num1} - ${num2} = ?`; // Atualiza a pergunta exibida
            break;
        case 'divisao':
            num2 = Math.floor(Math.random() * 9) + 1; // Gera um número aleatório para o divisor
            num1 = Math.floor(Math.random() * 90) + 10; // Gera um número aleatório para o dividendo
            while (num1 % num2 !== 0) { // Garante que o dividendo seja múltiplo do divisor
                num1 = Math.floor(Math.random() * 90) + 10;
            }
            correctAnswer = num1 / num2; // Calcula a resposta correta
            questionEl.innerText = `${num1} ÷ ${num2} = ?`; // Atualiza a pergunta exibida
            break;
        case 'potenciacao':
            num1 = Math.floor(Math.random() * 10) + 1; // Gera a base para a potência
            num2 = Math.floor(Math.random() * 4) + 2;  // Gera o expoente
            correctAnswer = Math.pow(num1, num2); // Calcula a resposta correta
            questionEl.innerHTML = `${num1}<sup>${num2}</sup> = ?`; // Atualiza a pergunta exibida com a potência
            break;
        case 'radiciacao':
            const radQuestion = generateRadicationQuestion(); // Gera uma pergunta de radiciação
            num1 = radQuestion.num1;
            correctAnswer = radQuestion.correctAnswer;
            questionEl.innerText = radQuestion.questionString; // Atualiza a pergunta exibida
            break;
        case 'multiplicacao':
        default:
            num1 = Math.floor(Math.random() * 10) + 1; // Gera números aleatórios para multiplicação
            num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 * num2; // Calcula a resposta correta
            questionEl.innerText = `${num1} x ${num2} = ?`; // Atualiza a pergunta exibida
            break;
    }

    const answers = [correctAnswer]; // Cria uma array com a resposta correta
    while (answers.length < 4) { // Garante que haja 4 respostas
        const wrongAnswer = Math.floor(Math.random() * 100); // Gera uma resposta errada aleatória
        if (!answers.includes(wrongAnswer)) { // Garante que a resposta errada não seja duplicada
            answers.push(wrongAnswer);
        }
    }

    answers.sort(() => Math.random() - 0.5); // Embaralha as respostas

    answersEl.innerHTML = ''; // Limpa a área de respostas
    answers.forEach(answer => { // Cria um botão para cada resposta
        const button = document.createElement('button'); // Cria um botão
        button.innerText = answer; // Define o texto do botão como a resposta
        button.addEventListener('click', () => checkAnswer(button, correctAnswer)); // Adiciona um ouvinte de evento para verificar a resposta
        answersEl.appendChild(button); // Adiciona o botão à área de respostas
    });

    stopSounds(); // Para todos os sons
    startTimer(); // Inicia o temporizador
}

function getTimeForLevel(level) { // Função para obter o tempo para o nível atual
    const times = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3]; // Array de tempos por nível
    return times[level - 1] || 3; // Retorna o tempo correspondente ao nível, mínimo de 3 segundos
}

function startTimer() { // Função para iniciar o temporizador
    let timeLeft = getTimeForLevel(currentLevel); // Obtém o tempo restante para o nível atual
    timerEl.innerText = timeLeft; // Exibe o tempo restante
    timerEl.style.color = '#2ecc71'; // Define a cor inicial do temporizador como verde

    clearInterval(timer); // Limpa qualquer temporizador existente
    tickSound.pause(); // Pausa o som de tic-tac
    tickSound.currentTime = 0; // Reseta o tempo do som
    finalTickSound.pause(); // Pausa o som final de tic-tac
    finalTickSound.currentTime = 0; // Reseta o tempo do som
    tickSound.play(); // Reproduz o som de tic-tac

    timer = setInterval(() => { // Define o temporizador para atualizar a cada segundo
        timeLeft--; // Decrementa o tempo restante
        if (timeLeft <= 0) { // Se o tempo terminar
            clearInterval(timer); // Limpa o temporizador
            timerEl.innerText = '0'; // Define o tempo restante como 0
            stopSounds(); // Para todos os sons
            nextQuestion(); // Avança para a próxima pergunta
        } else if (timeLeft <= 3) { // Se o tempo restante for 3 segundos ou menos
            timerEl.innerText = timeLeft; // Atualiza o tempo restante exibido
            timerEl.style.color = '#ff6f61'; // Muda a cor do temporizador para vermelho
            tickSound.pause(); // Pausa o som de tic-tac
            tickSound.currentTime = 0; // Reseta o tempo do som
            
            finalTickSound.play(); // Reproduz o som final de tic-tac
        } else {
            timerEl.innerText = timeLeft; // Atualiza o tempo restante exibido
        }
    }, 1000);
}

function checkAnswer(button, correctAnswer) { // Função para verificar a resposta
    if (parseFloat(button.innerText) === correctAnswer) { // Se a resposta do botão for correta
        button.classList.add('correct'); // Adiciona a classe 'correct' ao botão
        correctSound.play(); // Reproduz o som de resposta correta
        correctAnswers++; // Incrementa o contador de respostas corretas
        totalCorrectAnswers++; // Incrementa o contador total de respostas corretas
    } else { // Se a resposta for incorreta
        button.classList.add('incorrect'); // Adiciona a classe 'incorrect' ao botão
        incorrectSound.play(); // Reproduz o som de resposta incorreta
    }

    setTimeout(() => { // Aguarda 1 segundo antes de mostrar a próxima pergunta
        if (gameInProgress) nextQuestion(); // Se o jogo está em andamento, avança para a próxima pergunta
    }, 1000);
}

function showLevelResult() { // Função para mostrar o resultado do nível
    clearInterval(timer); // Limpa o temporizador
    const accuracy = (correctAnswers / questionsPerLevel) * 100; // Calcula a precisão como uma porcentagem
    resultEl.innerText = `Você acertou ${correctAnswers} de ${questionsPerLevel} perguntas neste nível.`; // Exibe o resultado do nível

    if (accuracy >= 70) { // Se a precisão for 70% ou mais
        stopSounds(); // Para todos os sons
        currentLevel++; // Incrementa o nível atual
        if (currentLevel > totalLevels) { // Se o nível atual for maior que o total de níveis
            endGame(); // Termina o jogo
        } else {
            resultEl.innerText += ' Próximo nível em 10 segundos...'; // Informa que o próximo nível começará em 10 segundos
            setTimeout(() => {
                startLevel(); // Inicia o próximo nível
            }, 10000);
        }
    } else { // Se a precisão for menor que 70%
        resultEl.innerText += ' Você não atingiu 70% de acertos. Tente novamente! Em 10 segundos, o nível será reiniciado.'; // Informa que o nível será reiniciado
        setTimeout(() => {
            startLevel(); // Reinicia o nível atual
        }, 10000);
    }
}

function endGame() { // Função para terminar o jogo
    gameInProgress = false; // Define o estado do jogo como não iniciado
    clearInterval(timer); // Limpa o temporizador
    stopSounds(); // Para todos os sons
    startBtn.classList.remove('hidden'); // Mostra o botão de iniciar
    stopBtn.classList.add('hidden'); // Oculta o botão de parar

    const accuracy = (totalCorrectAnswers / totalQuestionsAsked) * 100; // Calcula a precisão total
    resultEl.innerText = `Jogo terminado! Você acertou um total de ${totalCorrectAnswers} de ${totalQuestionsAsked} perguntas.`; // Exibe o resultado final
    resultEl.innerText += `\nPorcentagem de acertos: ${accuracy.toFixed(2)}%`; // Exibe a porcentagem de acertos
}

function stopSounds() { // Função para parar todos os sons
    tickSound.pause(); // Pausa o som de tic-tac
    tickSound.currentTime = 0; // Reseta o tempo do som
    finalTickSound.pause(); // Pausa o som final de tic-tac
    finalTickSound.currentTime = 0; // Reseta o tempo do som
    correctSound.pause(); // Pausa o som de resposta correta
    correctSound.currentTime = 0; // Reseta o tempo do som
    incorrectSound.pause(); // Pausa o som de resposta incorreta
    incorrectSound.currentTime = 0; // Reseta o tempo do som
}
