document.addEventListener('DOMContentLoaded', () => {
    
    const roadmapContainer = document.getElementById('roadmap-container');
    const cardGrid = roadmapContainer.querySelector('.card-grid');

  const roadmapBlocks = [
        {
            id: 'quiz-Logica',
            title: 'Quiz 1: Lógica de Programação',
            description: 'Entenda como os computadores "pensam" e organize suas ideias para resolver problemas.',
            logo: '/assets/logo-logica.png',
            page: 'pages/logica-programacao.html'
        },
        {
            id: 'quiz-Html',
            title: 'Quiz 2: HTML e CSS',
            description: 'Aprenda a estruturar o conteúdo e estilizar suas páginas web.',
            logo: '/assets/logo-html.png',
            page: 'pages/html-introducao.html'
        },
        {
            id: 'quiz-Javascript',
            title: 'Quiz 3: JavaScript Fundamentos',
            description: 'Adicione interatividade e dinamismo às suas aplicações web.',
            logo: '/assets/logo-javascript.png',
            page: 'pages/javascript-fundamentos.html'
        },
        {
            id: 'quiz-Backend',
            title: 'Bloco 4: Próximos Passos',
            description: 'Explore o que vem a seguir na sua jornada de desenvolvimento.',
            logo: '/assets/java.png', // Uma logo genérica para futuros tópicos
            page: 'pages/backend-springboot-java.html'
        },
    
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

    renderRoadmapCards();
});
