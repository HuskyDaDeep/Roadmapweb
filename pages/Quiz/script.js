document.addEventListener('DOMContentLoaded', () => {
    // === Seleção de Elementos DOM ===
    const quizTitle = document.getElementById('quiz-title');
    const questionsContainer = document.getElementById('questions-container'); // Contém todos os question-block
    const quizForm = document.getElementById('quiz-form');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const resultsSection = document.getElementById('results-section');
    const scoreDisplay = document.getElementById('score-display');
    const correctCountDisplay = document.getElementById('correct-count');
    const incorrectCountDisplay = document.getElementById('incorrect-count');

    // Elementos da modal personalizada
    const customAlertModal = document.getElementById('custom-alert-modal');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');

    // Estes elementos são selecionados no início
    const generateExplanationBtn = document.getElementById('generate-explanation-btn');
    const explanationLoading = document.getElementById('explanation-loading');
    const explanationsDiv = document.getElementById('explanations');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const navLinks = document.querySelectorAll('.nav-menu a');


    // === Dados de Todos os Quizzes ===
    // (Mantido para mapear perguntas, opções e respostas corretas para a API Gemini)
    const allQuizzesData = {
        html: {
            title: "Quiz de HTML Básico",
            questions: [
                {
                    id: 'q1', text: "1. Qual a sigla para HTML?",
                    options: { a: "Hyper Text Markup Language", b: "High Tech Modern Language", c: "Home Tool Management Links", d: "Hyperlink and Text Markup" },
                    correct: 'a'
                },
                {
                    id: 'q2', text: "2. Qual tag HTML é usada para criar um parágrafo?",
                    options: { a: "&lt;p&gt;", b: "&lt;para&gt;", c: "&lt;text&gt;", d: "&lt;pgraph&gt;" },
                    correct: 'a'
                },
                {
                    id: 'q3', text: "3. Qual elemento HTML define o título de um documento (exibido na aba do navegador)?",
                    options: { a: "&lt;body&gt;", b: "&lt;head&gt;", c: "&lt;title&gt;", d: "&lt;meta&gt;" },
                    correct: 'c'
                },
                {
                    id: 'q4', text: "4. Qual atributo HTML é usado para especificar o caminho de um arquivo de imagem?",
                    options: { a: "href", b: "src", c: "link", d: "url" },
                    correct: 'b'
                },
                {
                    id: 'q5', text: "5. Qual tag HTML é usada para criar uma lista não ordenada (com marcadores)?",
                    options: { a: "&lt;ol&gt;", b: "&lt;li&gt;", c: "&lt;ul&gt;", d: "&lt;dl&gt;" },
                    correct: 'c'
                },
                {
                    id: 'q6', text: "6. Qual é a forma correta de comentar um código HTML?",
                    options: { a: "// Este é um comentário", b: "&lt;!-- Este é um comentário --&gt;", c: "/* Este é um comentário */", d: "# Este é um comentário" },
                    correct: 'b'
                },
                {
                    id: 'q7', text: "7. Qual tag HTML é usada para criar um link (hyperlink)?",
                    options: { a: "&lt;link&gt;", b: "&lt;hlink&gt;", c: "&lt;a&gt;", d: "&lt;url&gt;" },
                    correct: 'c'
                },
                {
                    id: 'q8', text: "8. Qual elemento HTML é usado para definir o cabeçalho principal de uma página (o mais importante)?",
                    options: { a: "&lt;h1&gt;", b: "&lt;h6&gt;", c: "&lt;head&gt;", d: "&lt;header&gt;" },
                    correct: 'a'
                },
                {
                    id: 'q9', text: "9. Qual é o propósito do atributo `alt` na tag `&lt;img&gt;`?",
                    options: { a: "Definir o alinhamento da imagem.", b: "Fornecer um texto alternativo para a imagem, para fins de acessibilidade.", c: "Alterar o tamanho da imagem.", d: "Adicionar um link à imagem." },
                    correct: 'b'
                },
                {
                    id: 'q10', text: "10. Qual tag HTML é usada para criar uma quebra de linha simples (sem iniciar um novo parágrafo)?",
                    options: { a: "&lt;break&gt;", b: "&lt;lb&gt;", c: "&lt;br&gt;", d: "&lt;newline&gt;" },
                    correct: 'c'
                }
            ]
        },
        javascript: {
            title: "Quiz de JavaScript Básico",
            questions: [
                {
                    id: 'q1', text: "1. Qual palavra-chave é usada para declarar uma variável em JavaScript?",
                    options: { a: "var", b: "let", c: "const", d: "Todas as anteriores" },
                    correct: 'd'
                },
                {
                    id: 'q2', text: "2. Qual método é usado para imprimir algo na consola do navegador?",
                    options: { a: "console.log()", b: "print()", c: "display()", d: "write()" },
                    correct: 'a'
                },
                {
                    id: 'q3', text: "3. O que o operador `===` faz em JavaScript?",
                    options: { a: "Compara dois valores, ignorando o tipo", b: "Compara dois valores e os seus tipos", c: "Atribui um valor", d: "Compara três valores" },
                    correct: 'b'
                },
                {
                    id: 'q4', text: "4. Qual é a forma correta de escrever um comentário de uma única linha em JavaScript?",
                    options: { a: "<!-- Comentário -->", b: "/* Comentário */", c: "// Comentário", d: "# Comentário" },
                    correct: 'c'
                },
                {
                    id: 'q5', text: "5. Qual objeto global contém funções e propriedades matemáticas?",
                    options: { a: "Math", b: "Number", c: "Calculate", d: "Calc" },
                    correct: 'a'
                },
                {
                    id: 'q6', text: "6. Qual método String retorna o comprimento de uma String?",
                    options: { a: "length()", b: "size()", c: "count()", d: "length" },
                    correct: 'd'
                },
                {
                    id: 'q7', text: "7. Qual das opções é uma função de callback?",
                    options: { a: "Uma função que é passada como argumento para outra função", b: "Uma função que chama a si mesma recursivamente", c: "Uma função que retorna outra função", d: "Uma função que é executada após um evento" },
                    correct: 'a'
                },
                {
                    id: 'q8', text: "8. Como se declara um array em JavaScript?",
                    options: { a: "var myArray = {};", b: "var myArray = [];", c: "var myArray = ();", d: "var myArray = <>;", },
                    correct: 'b'
                },
                {
                    id: 'q9', text: "9. O que o método `querySelector()` retorna?",
                    options: { a: "Uma coleção de elementos", b: "O primeiro elemento que corresponde a um seletor CSS",
                        c: "Todos os elementos que correspondem a um seletor CSS", d: "Um valor booleano" },
                    correct: 'b'
                },
                {
                    id: 'q10', text: "10. Qual função é usada para atrasar a execução de um código?",
                    options: { a: "setTimeout()", b: "delay()", c: "wait()", d: "pause()" },
                    correct: 'a'
                }
            ]
        },
        logic: {
            title: "Quiz de Lógica de Programação",
            questions: [
                {
                    id: 'q1', text: "1. O que é um algoritmo?",
                    options: { a: "Um tipo de linguagem de programação", b: "Uma sequência finita de instruções bem definidas para resolver um problema", c: "Um erro num programa de computador", d: "Um componente de hardware" },
                    correct: 'b'
                },
                {
                    id: 'q2', text: "2. Qual dos seguintes não é um tipo de estrutura de controlo fundamental?",
                    options: { a: "Sequência", b: "Decisão (Seleção)", c: "Aleatoriedade", d: "Repetição (Iteração)" },
                    correct: 'c'
                },
                {
                    id: 'q3', text: "3. O que é uma variável em programação?",
                    options: { a: "Um valor que nunca muda", b: "Um nome dado a um local de armazenamento na memória que pode mudar de valor", c: "Uma função matemática", d: "Um tipo de dado" },
                    correct: 'b'
                },
                {
                    id: 'q4', text: "4. Qual é o resultado da expressão lógica: `(VERDADEIRO E FALSO) OU VERDADEIRO`?",
                    options: { a: "VERDADEIRO", b: "FALSO", c: "Erro", d: "Nulo" },
                    correct: 'a'
                },
                {
                    id: 'q5', text: "5. O que significa 'loop infinito'?",
                    options: { a: "Um loop que se repete um número finito de vezes", b: "Um loop que nunca termina", c: "Um loop que se executa apenas uma vez", d: "Um tipo de loop recursivo" },
                    correct: 'b'
                },
                {
                    id: 'q6', text: "6. Qual o objetivo de um fluxograma?",
                    options: { a: "Escrever código de forma mais rápida", b: "Representar graficamente um algoritmo ou processo", c: "Depurar erros em programas", d: "Definir a interface do utilizador de um programa" },
                    correct: 'b'
                },
                {
                    id: 'q7', text: "7. O que é pseudocódigo?",
                    options: { a: "Um código que foi ofuscado", b: "Uma forma informal e de alto nível de descrever um algoritmo", c: "Um código binário", d: "Uma linguagem de programação obsoleta" },
                    correct: 'b'
                },
                {
                    id: 'q8', text: "8. Qual dos seguintes operadores é de comparação?",
                    options: { a: "+", b: "=", c: "==", d: "&&" },
                    correct: 'c'
                },
                {
                    id: 'q9', text: "9. O que é recursão em programação?",
                    options: { a: "Um erro de compilação", b: "Uma função que chama a si mesma", c: "Um tipo de loop", d: "A reutilização de código existente" },
                    correct: 'b'
                },
                {
                    id: 'q10', text: "10. Qual o principal benefício de decompor um problema complexo em subproblemas menores?",
                    options: { a: "Aumentar a complexidade do código", b: "Dificultar a colaboração em equipa", c: "Tornar o problema mais gerenciável e fácil de resolver", d: "Eliminar a necessidade de testar o código" },
                    correct: 'c'
                }
            ]
        },
        java: {
            title: "Quiz de Java Básico",
            questions: [
                {
                    id: 'q1', text: "1. Qual palavra-chave é usada para definir uma classe em Java?",
                    options: { a: "Class", b: "class", c: "newClass", d: "defineClass" },
                    correct: 'b'
                },
                {
                    id: 'q2', text: "2. Qual é o ponto de entrada principal de um programa Java?",
                    options: { a: "start()", b: "main()", c: "run()", d: "execute()" },
                    correct: 'b'
                },
                {
                    id: 'q3', text: "3. Qual das seguintes opções é um tipo de dados primitivo em Java?",
                    options: { a: "String", b: "Array", c: "int", d: "Object" },
                    correct: 'c'
                },
                {
                    id: 'q4', text: "4. Qual palavra-chave é usada para herança em Java?",
                    options: { a: "implements", b: "inherits", c: "extends", d: "uses" },
                    correct: 'c'
                },
                {
                    id: 'q5', text: "5. Qual método é usado para imprimir na consola em Java?",
                    options: { a: "System.out.print()", b: "console.log()", c: "print()", d: "System.write()" },
                    correct: 'a'
                },
                {
                    id: 'q6', text: "6. Qual conceito de POO (Programação Orientada a Objetos) se refere à capacidade de um objeto assumir várias formas?",
                    options: { a: "Encapsulamento", b: "Herança", c: "Abstração", d: "Polimorfismo" },
                    correct: 'd'
                },
                {
                    id: 'q7', text: "7. Qual palavra-chave é usada para criar uma constante em Java?",
                    options: { a: "const", b: "final", c: "static", d: "immutable" },
                    correct: 'b'
                },
                {
                    id: 'q8', text: "8. Qual estrutura de controlo é usada para executar um bloco de código repetidamente enquanto uma condição é verdadeira?",
                    options: { a: "if-else", b: "switch", c: "for loop", d: "while loop" },
                    correct: 'd'
                },
                {
                    id: 'q9', text: "9. O que o Garbage Collector faz em Java?",
                    options: { a: "Libera a memória de objetos não utilizados", b: "Otimiza o código em tempo de execução", c: "Compila o código-fonte", d: "Gere threads" },
                    correct: 'a'
                },
                {
                    id: 'q10', text: "10. Qual é a principal diferença entre `ArrayList` e `LinkedList` em Java?",
                    options: { a: "`ArrayList` é mais rápido para inserções e exclusões no meio da lista.", b: "`LinkedList` é baseado em array e `ArrayList` em nós encadeados.", c: "`ArrayList` é mais eficiente para acesso aleatório, `LinkedList` para inserções/exclusões no início/fim.", d: "Não há diferença significativa." },
                    correct: 'c'
                }
            ]
        }
    };

    // Variável para armazenar as respostas do utilizador após a submissão
    let userAnswers = {};
    let currentQuizData = null; // Armazenará os dados do quiz atualmente carregado

    /**
     * Define o título do quiz e a classe ativa da navegação.
     * @param {string} quizType - O tipo de quiz a carregar (ex: 'html', 'javascript').
     */
    function setupQuizPage(quizType) {
        currentQuizData = allQuizzesData[quizType];
        if (!currentQuizData) {
            console.error(`Dados para o quiz tipo '${quizType}' não encontrados.`);
            quizTitle.textContent = 'Erro ao carregar o quiz. Tipo de quiz inválido.';
            return;
        }

        quizTitle.textContent = currentQuizData.title; // Atualiza o título do quiz
        resultsSection.classList.add('hidden'); // Esconde a seção de resultados ao carregar novo quiz

        // Atualiza a classe ativa no menu de navegação
        navLinks.forEach(link => {
            // Verifica se o href do link contém o tipo de quiz (ex: 'index.html' para 'html', 'javascript_quiz.html' para 'javascript')
            if (link.getAttribute('href').includes(quizType)) {
                link.classList.add('active-quiz');
            } else {
                link.classList.remove('active-quiz');
            }
        });
    }

    /**
     * Exibe a caixa de mensagem modal personalizada.
     * @param {string} message - A mensagem a ser exibida na modal.
     */
    function showCustomAlert(message) {
        customAlertMessage.textContent = message;
        customAlertModal.classList.add('visible');
    }

    /**
     * Esconde a caixa de mensagem modal personalizada.
     */
    function hideCustomAlert() {
        customAlertModal.classList.remove('visible');
    }

    // Adiciona o event listener para fechar a modal
    customAlertCloseBtn.addEventListener('click', hideCustomAlert);

    /**
     * Função para chamar a API Gemini e gerar explicações detalhadas para as perguntas do quiz.
     */
    async function generateExplanations() {
        if (!currentQuizData) {
            console.error("Dados do quiz não carregados para gerar explicações.");
            explanationsDiv.innerHTML = '<p class="text-red-500">Erro: Quiz não carregado. Não é possível gerar explicações.</p>';
            return;
        }

        generateExplanationBtn.disabled = true; // Desabilita o botão para evitar múltiplas chamadas
        generateExplanationBtn.classList.add('opacity-50', 'cursor-not-allowed');
        explanationLoading.classList.remove('hidden'); // Mostra o indicador de carregamento
        explanationsDiv.innerHTML = ''; // Limpa explicações anteriores

        let promptContent = "Dadas as seguintes perguntas de quiz, as suas respostas corretas e as respostas selecionadas pelo utilizador, forneça uma explicação concisa para cada pergunta. Para cada pergunta, explique por que a resposta correta está correta e, brevemente, por que as opções incorretas estão erradas. Formate a saída como uma lista de explicações, uma para cada pergunta.\n\nExemplo de formato:\n1. **Pergunta 1:** [Explicação]\n2. **Pergunta 2:** [Explicação]\n\nAqui estão as perguntas e respostas:\n\n";

        // Constrói o conteúdo do prompt com base nas perguntas, opções, respostas do utilizador e respostas corretas
        currentQuizData.questions.forEach(q => {
            const userAnswer = userAnswers[q.id] || 'Não respondida'; // Se o utilizador não respondeu
            const correctAnswerText = q.options[q.correct];

            promptContent += `${q.text}\n`;
            for (const optionKey in q.options) {
                promptContent += `  ${optionKey}) ${q.options[optionKey]}\n`;
            }
            promptContent += `  Resposta do utilizador: ${userAnswer}\n`;
            promptContent += `  Resposta correta: ${q.correct}) ${correctAnswerText}\n\n`;
        });

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: promptContent }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Deixe como está, a chave será fornecida em tempo de execução pelo ambiente
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            console.log("A enviar pedido à API Gemini...");
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro HTTP:', response.status, response.statusText, errorData);
                throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Resposta da API Gemini:", result); // Log detalhado da resposta

            // Verifica a estrutura da resposta e exibe as explicações
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                explanationsDiv.innerHTML = `<h3 class="text-xl font-bold mb-4 text-gray-800">Explicações Detalhadas:</h3>` + text.replace(/\n/g, '<br>'); // Substitui quebras de linha por <br> para HTML
            } else {
                explanationsDiv.innerHTML = '<p class="text-red-500">Não foi possível gerar explicações. A estrutura da resposta da API é inesperada.</p>';
                console.error('Estrutura de resposta inesperada da API Gemini:', result);
            }
        } catch (error) {
            console.error('Erro ao chamar a API Gemini:', error);
            explanationsDiv.innerHTML = '<p class="text-red-500">Ocorreu um erro ao gerar explicações. Verifique a sua ligação à internet ou tente novamente mais tarde.</p>';
        } finally {
            generateExplanationBtn.disabled = false; // Habilita o botão novamente
            generateExplanationBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            explanationLoading.classList.add('hidden'); // Esconde o indicador de carregamento
            explanationsDiv.scrollIntoView({ behavior: 'smooth' }); // Rola para as explicações
        }
    }

    /**
     * Função para reiniciar o quiz, limpando seleções e resultados.
     */
    function restartQuiz() {
        quizForm.reset(); // Limpa todas as seleções de rádio buttons
        document.querySelectorAll('.option-label').forEach(label => {
            label.classList.remove('correct-answer', 'incorrect-answer'); // Remove feedback visual
        });
        document.querySelectorAll('.question-block').forEach(block => {
            block.classList.remove('unanswered-error'); // Remove feedback de erro
        });
        resultsSection.classList.add('hidden'); // Esconde a seção de resultados
        explanationsDiv.innerHTML = ''; // Limpa as explicações
        userAnswers = {}; // Reinicia as respostas do utilizador
        quizForm.scrollIntoView({ behavior: 'smooth' }); // Rola para o topo do quiz
    }

    // === Event Listener para o Formulário do Quiz ===
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o comportamento padrão de envio

        console.log("Form submit event fired!"); // Log para depuração

        if (!currentQuizData) {
            console.error("Nenhum quiz carregado. Não é possível submeter.");
            return;
        }

        let score = 0;
        let incorrectCount = 0;
        const totalQuestions = currentQuizData.questions.length;

        // Limpa quaisquer classes de feedback visual anteriores e de erro de não respondido
        document.querySelectorAll('.option-label').forEach(label => {
            label.classList.remove('correct-answer', 'incorrect-answer');
        });
        document.querySelectorAll('.question-block').forEach(block => {
            block.classList.remove('unanswered-error'); // Remove a borda vermelha de erros anteriores
        });

        explanationsDiv.innerHTML = ''; // Limpa explicações anteriores
        explanationLoading.classList.add('hidden'); // Garante que o spinner esteja escondido

        userAnswers = {}; // Reinicia as respostas do utilizador para esta submissão

        let allAnswered = true;
        let firstUnansweredQuestionElement = null;

        // === Validação: Verifica se todas as perguntas foram respondidas ===
        currentQuizData.questions.forEach((q) => {
            const questionName = q.id;
            // Use querySelector no quizForm para garantir que estamos pegando os inputs dentro deste formulário
            const selectedOption = quizForm.querySelector(`input[name="${questionName}"]:checked`);
            const questionBlock = quizForm.querySelector(`input[name="${questionName}"]`).closest('.question-block');

            if (!selectedOption) {
                allAnswered = false;
                if (!firstUnansweredQuestionElement) {
                    firstUnansweredQuestionElement = questionBlock; // Guarda a primeira pergunta não respondida
                }
                if (questionBlock) {
                    questionBlock.classList.add('unanswered-error'); // Adiciona classe de erro visual
                }
            }
        });

        if (!allAnswered) {
            // Se nem todas as perguntas foram respondidas, impede a submissão e exibe a modal
            showCustomAlert("Por favor, responda a todas as perguntas para continuar!");
            resultsSection.classList.add('hidden'); // Garante que a seção de resultados está escondida
            generateExplanationBtn.classList.add('hidden'); // Esconde o botão de explicação
            restartQuizBtn.classList.remove('hidden'); // Certifica-se que o botão de reiniciar está visível

            if (firstUnansweredQuestionElement) {
                firstUnansweredQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return; // Sai da função de submissão
        }

        // === Se todas as perguntas foram respondidas, procede com a correção ===
        currentQuizData.questions.forEach(q => {
            const selectedOption = quizForm.querySelector(`input[name="${q.id}"]:checked`); // Use quizForm para scope
            const correctAnswer = q.correct;

            const correctLabel = quizForm.querySelector(`input[name="${q.id}"][value="${correctAnswer}"]`).closest('label'); // Use quizForm para scope

            const userAnswer = selectedOption ? selectedOption.value : 'Não respondida'; // Obtém a resposta ou marca como não respondida
            userAnswers[q.id] = userAnswer; // Armazena a resposta do utilizador

            const userSelectedLabel = selectedOption ? selectedOption.closest('label') : null;

            if (userAnswer === correctAnswer) {
                score++;
                if (userSelectedLabel) {
                    userSelectedLabel.classList.add('correct-answer');
                }
            } else {
                incorrectCount++;
                if (userSelectedLabel) {
                    userSelectedLabel.classList.add('incorrect-answer');
                }
                // Destaca a resposta correta em verde, mesmo que o utilizador tenha errado
                if (correctLabel) {
                    correctLabel.classList.add('correct-answer');
                }
            }
        });

        // Exibe os resultados na seção de resultados
        scoreDisplay.textContent = `A sua pontuação: ${score}/${totalQuestions}`;
        correctCountDisplay.textContent = `Acertos: ${score}`;
        incorrectCountDisplay.textContent = `Erros: ${incorrectCount}`;
        resultsSection.classList.remove('hidden'); // Mostra a seção de resultados
        generateExplanationBtn.classList.remove('hidden'); // Mostra o botão de explicação
        restartQuizBtn.classList.remove('hidden'); // Mostra o botão de reiniciar
        resultsSection.scrollIntoView({ behavior: 'smooth' }); // Rola para os resultados

        // === Anexa Event Listeners aos Botões de Resultado (pois são dinâmicos) ===
        // Remove listeners antigos para evitar duplicações
        generateExplanationBtn.removeEventListener('click', generateExplanations);
        restartQuizBtn.removeEventListener('click', restartQuiz);

        // Adiciona novos listeners
        generateExplanationBtn.addEventListener('click', generateExplanations);
        restartQuizBtn.addEventListener('click', restartQuiz);
    });

    // === Inicialização: Carrega o quiz correto ao carregar a página ===
    const quizType = document.body.dataset.quizType;
    if (quizType) {
        setupQuizPage(quizType);
    } else {
        console.error("Atributo data-quiz-type não encontrado no body.");
        quizTitle.textContent = "Erro: Tipo de Quiz não especificado.";
    }
});
