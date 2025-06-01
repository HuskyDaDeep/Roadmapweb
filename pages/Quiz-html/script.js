document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos principais do DOM
    const quizForm = document.getElementById('quiz-form');
    const resultsSection = document.getElementById('results-section');
    const scoreDisplay = document.getElementById('score-display');
    const correctCountDisplay = document.getElementById('correct-count');
    const incorrectCountDisplay = document.getElementById('incorrect-count');
    // Estes elementos serão selecionados dinamicamente após a submissão do quiz
    let generateExplanationBtn;
    let explanationLoading;
    let explanationsDiv;
    let restartQuizBtn;

    // Define as respostas corretas para cada pergunta
    const correctAnswers = {
        q1: 'a', // Hyper Text Markup Language
        q2: 'a', // <p>
        q3: 'c', // <title>
        q4: 'b', // src
        q5: 'c', // <ul>
        q6: 'b', // CORREÇÃO: Apenas o valor 'b' para a pergunta 6
        q7: 'c', // <a>
        q8: 'a', // <h1>
        q9: 'b', // Fornecer um texto alternativo para a imagem, para fins de acessibilidade.
        q10: 'c' // <br>
    };

    // Mapeamento de perguntas e opções para gerar explicações detalhadas
    const quizQuestionsData = {
        q1: {
            question: "1. Qual a sigla para HTML?",
            options: {
                a: "Hyper Text Markup Language",
                b: "High Tech Modern Language",
                c: "Home Tool Management Links",
                d: "Hyperlink and Text Markup"
            }
        },
        q2: {
            question: "2. Qual tag HTML é usada para criar um parágrafo?",
            options: {
                a: "&lt;p&gt;",
                b: "&lt;para&gt;",
                c: "&lt;text&gt;",
                d: "&lt;pgraph&gt;"
            }
        },
        q3: {
            question: "3. Qual elemento HTML define o título de um documento (exibido na aba do navegador)?",
            options: {
                a: "&lt;body&gt;",
                b: "&lt;head&gt;",
                c: "&lt;title&gt;",
                d: "&lt;meta&gt;"
            }
        },
        q4: {
            question: "4. Qual atributo HTML é usado para especificar o caminho de um arquivo de imagem?",
            options: {
                a: "href",
                b: "src",
                c: "link",
                d: "url"
            }
        },
        q5: {
            question: "5. Qual tag HTML é usada para criar uma lista não ordenada (com marcadores)?",
            options: {
                a: "&lt;ol&gt;",
                b: "&lt;li&gt;",
                c: "&lt;ul&gt;",
                d: "&lt;dl&gt;"
            }
        },
        q6: {
            question: "6. Qual é a forma correta de comentar um código HTML?",
            options: {
                a: "// Este é um comentário",
                b: "&lt;!-- Este é um comentário --&gt;",
                c: "/* Este é um comentário */",
                d: "# Este é um comentário"
            }
        },
        q7: {
            question: "7. Qual tag HTML é usada para criar um link (hyperlink)?",
            options: {
                a: "&lt;link&gt;",
                b: "&lt;hlink&gt;",
                c: "&lt;a&gt;",
                d: "&lt;url&gt;"
            }
        },
        q8: {
            question: "8. Qual elemento HTML é usado para definir o cabeçalho principal de uma página (o mais importante)?",
            options: {
                a: "&lt;h1&gt;",
                b: "&lt;h6&gt;",
                c: "&lt;head&gt;",
                d: "&lt;header&gt;"
            }
        },
        q9: {
            question: "9. Qual é o propósito do atributo `alt` na tag `&lt;img&gt;`?",
            options: {
                a: "Definir o alinhamento da imagem.",
                b: "Fornecer um texto alternativo para a imagem, para fins de acessibilidade.",
                c: "Alterar o tamanho da imagem.",
                d: "Adicionar um link à imagem."
            }
        },
        q10: {
            question: "10. Qual tag HTML é usada para criar uma quebra de linha simples (sem iniciar um novo parágrafo)?",
            options: {
                a: "&lt;break&gt;",
                b: "&lt;lb&gt;",
                c: "&lt;br&gt;",
                d: "&lt;newline&gt;"
            }
        }
    };

    // Variável para armazenar as respostas do utilizador após a submissão
    let userAnswers = {};

    /**
     * Função para chamar a API Gemini e gerar explicações detalhadas para as perguntas do quiz.
     */
    async function generateExplanations() {
        // Re-seleciona os elementos para garantir que estão no DOM e acessíveis
        generateExplanationBtn = document.getElementById('generate-explanation-btn');
        explanationLoading = document.getElementById('explanation-loading');
        explanationsDiv = document.getElementById('explanations');

        if (generateExplanationBtn) { // Verifica se o botão existe antes de manipulá-lo
            generateExplanationBtn.disabled = true; // Desabilita o botão para evitar múltiplas chamadas
            generateExplanationBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        if (explanationLoading) {
            explanationLoading.classList.remove('hidden'); // Mostra o indicador de carregamento
        }
        if (explanationsDiv) {
            explanationsDiv.innerHTML = ''; // Limpa explicações anteriores
        }


        let promptContent = "Dadas as seguintes perguntas de quiz HTML, as suas respostas corretas e as respostas selecionadas pelo utilizador, forneça uma explicação concisa para cada pergunta. Para cada pergunta, explique por que a resposta correta está correta e, brevemente, por que as opções incorretas estão erradas. Formate a saída como uma lista de explicações, uma para cada pergunta.\n\nExemplo de formato:\n1. **Pergunta 1:** [Explicação]\n2. **Pergunta 2:** [Explicação]\n\nAqui estão as perguntas e respostas:\n\n";

        // Constrói o conteúdo do prompt com base nas perguntas, opções, respostas do utilizador e respostas corretas
        for (let i = 1; i <= Object.keys(quizQuestionsData).length; i++) {
            const qKey = `q${i}`;
            const questionData = quizQuestionsData[qKey];
            const userAnswer = userAnswers[qKey] || 'Não respondida'; // Se o utilizador não respondeu
            const correctAnswer = correctAnswers[qKey];

            promptContent += `${questionData.question}\n`;
            for (const optionKey in questionData.options) {
                promptContent += `  ${optionKey}) ${questionData.options[optionKey]}\n`;
            }
            promptContent += `  Resposta do utilizador: ${userAnswer}\n`;
            promptContent += `  Resposta correta: ${correctAnswer}) ${questionData.options[correctAnswer]}\n\n`;
        }

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
                if (explanationsDiv) {
                    explanationsDiv.innerHTML = `<h3 class="text-xl font-bold mb-4 text-gray-800">Explicações Detalhadas:</h3>` + text.replace(/\n/g, '<br>'); // Substitui quebras de linha por <br> para HTML
                }
            } else {
                if (explanationsDiv) {
                    explanationsDiv.innerHTML = '<p class="text-red-500">Não foi possível gerar explicações. A estrutura da resposta da API é inesperada.</p>';
                }
                console.error('Estrutura de resposta inesperada da API Gemini:', result);
            }
        } catch (error) {
            console.error('Erro ao chamar a API Gemini:', error);
            if (explanationsDiv) {
                explanationsDiv.innerHTML = '<p class="text-red-500">Ocorreu um erro ao gerar explicações. Verifique a sua ligação à internet ou tente novamente mais tarde.</p>';
            }
        } finally {
            if (generateExplanationBtn) {
                generateExplanationBtn.disabled = false; // Habilita o botão novamente
                generateExplanationBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            if (explanationLoading) {
                explanationLoading.classList.add('hidden'); // Esconde o indicador de carregamento
            }
            if (explanationsDiv) {
                explanationsDiv.scrollIntoView({ behavior: 'smooth' }); // Rola para as explicações
            }
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
        resultsSection.classList.add('hidden'); // Esconde a seção de resultados
        explanationsDiv.innerHTML = ''; // Limpa as explicações
        userAnswers = {}; // Reinicia as respostas do utilizador
        quizForm.scrollIntoView({ behavior: 'smooth' }); // Rola para o topo do quiz
    }

    // Adiciona um ouvinte de evento para o envio do formulário
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o comportamento padrão de envio

        let score = 0;
        let incorrectCount = 0;
        const totalQuestions = Object.keys(correctAnswers).length;

        // Limpa quaisquer classes de feedback visual anteriores
        document.querySelectorAll('.option-label').forEach(label => {
            label.classList.remove('correct-answer', 'incorrect-answer');
        });

        // Limpa explicações anteriores e esconde o botão de gerar explicações (será reexibido)
        explanationsDiv = document.getElementById('explanations'); // Re-seleciona
        explanationLoading = document.getElementById('explanation-loading'); // Re-seleciona
        if (explanationsDiv) explanationsDiv.innerHTML = '';
        if (explanationLoading) explanationLoading.classList.add('hidden');

        userAnswers = {}; // Reinicia as respostas do utilizador

        // Itera sobre cada pergunta para validar e dar feedback visual
        for (let i = 1; i <= totalQuestions; i++) {
            const questionName = `q${i}`;
            const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
            const correctAnswer = correctAnswers[questionName];

            // Encontra a label da resposta correta para esta pergunta
            const correctLabel = document.querySelector(`input[name="${questionName}"][value="${correctAnswer}"]`).closest('label');

            if (selectedOption) {
                const userAnswer = selectedOption.value;
                userAnswers[questionName] = userAnswer; // Armazena a resposta do utilizador
                const userSelectedLabel = selectedOption.closest('label');

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
            } else {
                // Se o utilizador não selecionou uma opção, considera como erro
                incorrectCount++;
                userAnswers[questionName] = 'Não respondida';
                // Ainda assim, destaca a resposta correta para que o utilizador saiba qual era
                if (correctLabel) {
                    correctLabel.classList.add('correct-answer');
                }
            }
        }

        // Exibe os resultados na seção de resultados
        scoreDisplay.textContent = `A sua pontuação: ${score}/${totalQuestions}`;
        correctCountDisplay.textContent = `Acertos: ${score}`;
        incorrectCountDisplay.textContent = `Erros: ${incorrectCount}`;
        resultsSection.classList.remove('hidden'); // Mostra a seção de resultados
        resultsSection.scrollIntoView({ behavior: 'smooth' }); // Rola para os resultados

        // Re-seleciona os botões e adiciona os ouvintes de evento após a seção de resultados ser exibida
        generateExplanationBtn = document.getElementById('generate-explanation-btn');
        restartQuizBtn = document.getElementById('restart-quiz-btn');

        if (generateExplanationBtn) {
            generateExplanationBtn.addEventListener('click', generateExplanations);
        }
        if (restartQuizBtn) {
            restartQuizBtn.addEventListener('click', restartQuiz);
        }
    });

    // Os event listeners para os botões de explicação e reiniciar AGORA SÃO ANEXADOS
    // APÓS A SUBMISSÃO DO QUIZ, DENTRO DO LISTENER DE SUBMISSÃO,
    // garantindo que os elementos já estão no DOM e visíveis.
    // As referências globais (fora do DOMContentLoaded) são removidas para evitar confusão.
    // Apenas os elementos que são fixos no DOM (como quizForm, resultsSection, scoreDisplay, etc.)
    // são selecionados no início.
});
