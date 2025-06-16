document.addEventListener('DOMContentLoaded', () => {
    const roadmapContainer = document.getElementById('roadmap-container');
    const cardGrid = roadmapContainer.querySelector('.card-grid');
    const congratulationsScreen = document.getElementById('congratulations-screen');
    const backToRoadmapBtn = document.getElementById('back-to-roadmap-btn');

    // Definição dos blocos do roadmap
    const roadmapBlocks = [
        {
            id: 'quiz-Logica',
            title: 'Quiz 1: Lógica de Programação',
            description: 'Entenda como os computadores "pensam" e organize suas ideias para resolver problemas.',
            logo: '/assets/logo-logica.png',
            page: '../Quiz/logic_quiz.html'
        },
        {
            id: 'quiz-Html',
            title: 'Quiz 2: HTML e CSS',
            description: 'Aprenda a estruturar o conteúdo e estilizar suas páginas web.',
            logo: '/assets/logo-html.png',
            page: '../Quiz/Html_quiz.html'
        },
        {
            id: 'quiz-Javascript',
            title: 'Quiz 3: JavaScript Fundamentos',
            description: 'Adicione interatividade e dinamismo às suas aplicações web.',
            logo: '/assets/logo-javascript.png',
            page: '../Quiz/javascript_quiz.html'
        },
        {
            id: 'quiz-Java', // Renomeado para 'quiz-Java' para clareza
            title: 'Quiz 4: Java Básico',
            description: 'Explore os fundamentos da programação orientada a objetos com Java.',
            logo: '/assets/java.png',
            page: '../Quiz/java_quiz.html'
        },
    ];

    // Carrega o progresso salvo no localStorage
    // 'completedBlocks' deve ser um array de IDs dos quizzes concluídos
    let completedBlocks = JSON.parse(localStorage.getItem('completedBlocks')) || [];

    // Função para verificar se todos os quizzes foram concluídos
    function checkAllQuizzesCompleted() {
        // Verifica se cada ID de bloco no roadmapBlocks está presente em completedBlocks
        const allCompleted = roadmapBlocks.every(block => completedBlocks.includes(block.id));
        return allCompleted;
    }

    // Função para renderizar os cards do roadmap
    function renderRoadmapCards() {
        cardGrid.innerHTML = ''; // Limpa os cards existentes antes de renderizar
        roadmapBlocks.forEach(block => {
            const card = document.createElement('a'); // Usar <a> para navegação
            card.href = block.page; // Define o link da página
            card.classList.add('roadmap-card');

            // Adiciona a classe 'completed' se o quiz correspondente estiver no localStorage
            if (completedBlocks.includes(block.id)) {
                card.classList.add('completed');
            }

            card.innerHTML = `
                <img src="${block.logo}" alt="${block.title} Logo">
                <h2>${block.title}</h2>
                <p>${block.description}</p>
            `;
            cardGrid.appendChild(card);
        });

        // Após renderizar os cards, verifica se todos foram concluídos e ajusta a exibição
        if (checkAllQuizzesCompleted()) {
            showCongratulationsScreen();
        } else {
            hideCongratulationsScreen();
        }
    }

    // Funções para mostrar/esconder a tela de parabéns
    function showCongratulationsScreen() {
        roadmapContainer.classList.add('hidden'); // Esconde o roadmap
        congratulationsScreen.classList.remove('hidden');
        congratulationsScreen.classList.add('visible'); // Adiciona a classe para a transição CSS
        // Se usar uma biblioteca de confetes (ex: canvas-confetti), chame-a aqui
        // Exemplo: confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    function hideCongratulationsScreen() {
        roadmapContainer.classList.remove('hidden');
        congratulationsScreen.classList.add('hidden');
        congratulationsScreen.classList.remove('visible');
    }

    // Inicializa a renderização dos cards ao carregar a página
    renderRoadmapCards();

    // Event listener para o botão "Voltar ao Roadmap"
    if (backToRoadmapBtn) {
        backToRoadmapBtn.addEventListener('click', () => {
            hideCongratulationsScreen();
            // Se você quiser "resetar" o progresso para refazer os quizzes, descomente as linhas abaixo:
            // localStorage.removeItem('completedBlocks');
            // completedBlocks = [];
            // renderRoadmapCards(); // Renderiza novamente para mostrar os cards como não-concluídos
        });
    }

    // --- Lógica para Marcar Quizzes como Concluídos (Implementar nos arquivos de quiz) ---
    // Esta função é um exemplo de como você marcaria um quiz como completo.
    // Você precisa chamar esta função no JavaScript de CADA QUIZ (logic_quiz.html, Html_quiz.html, etc.)
    // após o usuário submeter as respostas e obter sucesso.
    window.markQuizAsCompleted = function(quizId) {
        let currentCompletedBlocks = JSON.parse(localStorage.getItem('completedBlocks')) || [];
        if (!currentCompletedBlocks.includes(quizId)) {
            currentCompletedBlocks.push(quizId);
            localStorage.setItem('completedBlocks', JSON.stringify(currentCompletedBlocks));
            // Opcional: Redirecionar de volta para a página principal do roadmap após a conclusão
            // window.location.href = './index.html'; // Ajuste o caminho se necessário
        }
    };
});