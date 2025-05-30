document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const loginForm = document.getElementById('login-form');
    const roadmapContainer = document.getElementById('roadmap-container');
    const cardGrid = roadmapContainer.querySelector('.card-grid');

    // Dados dos blocos (cards)
    const roadmapBlocks = [
        {
            id: 'logica-programacao',
            title: 'Bloco 1: Lógica de Programação',
            description: 'Entenda como os computadores "pensam" e organize suas ideias para resolver problemas.',
            logo: 'assets/logo-logica.png',
            page: 'pages/logica-programacao.html'
        },
        {
            id: 'html-css',
            title: 'Bloco 2: HTML e CSS',
            description: 'Aprenda a estruturar o conteúdo e estilizar suas páginas web.',
            logo: 'assets/logo-html.png',
            page: 'pages/html-css.html'
        },
        {
            id: 'javascript-fundamentos',
            title: 'Bloco 3: JavaScript Fundamentos',
            description: 'Adicione interatividade e dinamismo às suas aplicações web.',
            logo: 'assets/logo-javascript.png',
            page: 'pages/javascript-fundamentos.html'
        },
        {
            id: 'proximos-passos',
            title: 'Bloco 4: Próximos Passos',
            description: 'Explore o que vem a seguir na sua jornada de desenvolvimento.',
            logo: 'assets/logo-generica.png', // Uma logo genérica para futuros tópicos
            page: 'pages/proximos-passos.html'
        }
    ];

    // Carrega o progresso salvo no localStorage
    let completedBlocks = JSON.parse(localStorage.getItem('completedBlocks')) || [];

    // Função para renderizar os cards do roadmap
    function renderRoadmapCards() {
        cardGrid.innerHTML = ''; // Limpa os cards existentes antes de renderizar
        roadmapBlocks.forEach(block => {
            const card = document.createElement('a'); // Usar <a> para navegação
            card.href = block.page; // Define o link da página
            card.classList.add('roadmap-card');
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
    }

    // Lógica da tela de login
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio do formulário e recarregamento da página

        // Simplesmente "logar" o usuário para fins de demonstração
        // Em um cenário real, você faria uma validação de credenciais
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.pointerEvents = 'none'; // Desabilita cliques na tela oculta
        setTimeout(() => {
            welcomeScreen.style.display = 'none'; // Remove da tela após a transição
            roadmapContainer.style.display = 'block'; // Mostra o container principal
            renderRoadmapCards(); // Renderiza os cards
        }, 500); // Tempo para a transição de opacidade
    });

    // Lógica para marcar um bloco como concluído (chamado das páginas de conteúdo)
    window.markBlockAsCompleted = function(blockId) {
        if (!completedBlocks.includes(blockId)) {
            completedBlocks.push(blockId);
            localStorage.setItem('completedBlocks', JSON.stringify(completedBlocks));
            alert(`Parabéns! Você completou o bloco: ${blockId}`);
            // Opcional: Redirecionar de volta para a página principal ou para o próximo bloco
            window.location.href = 'index.html';
        } else {
            alert('Este bloco já foi concluído!');
        }
    };

    // Verifica se o usuário já "logou" em uma sessão anterior
    // Para simplificar, se não houver um "logged_in" no localStorage, assume que não logou
    if (localStorage.getItem('logged_in') === 'true') {
        welcomeScreen.style.display = 'none';
        roadmapContainer.style.display = 'block';
        renderRoadmapCards();
    } else {
        // Marca que o usuário está "logado" após o submit do formulário
        loginForm.addEventListener('submit', () => {
            localStorage.setItem('logged_in', 'true');
        });
    }
});