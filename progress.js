// Inicializa ou recupera o progresso
let completedBlocks = JSON.parse(localStorage.getItem('completedBlocks')) || [];

// Define a função global
function markBlockAsCompleted(blockId) {
    if (!completedBlocks.includes(blockId)) {
        completedBlocks.push(blockId);
        localStorage.setItem('completedBlocks', JSON.stringify(completedBlocks));

        alert(`Parabéns! Você completou o bloco: ${blockId}`);

        // Redireciona para a página inicial (ajuste o caminho conforme necessário)
        window.location.href = '../index.html';
    } else {
        alert('Este bloco já foi concluído!');
    }
}
