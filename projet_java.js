const colors = ["1", "2", "3", "4"];
let gameSequence = [];
let level = 1;
function showSequence(){


}
function handlePlayerClick(clickedColor) {
            if (!isPlayerTurn) return;

            flashColor(clickedColor, 150); 
            playerSequence.push(clickedColor);
            checkPlayerInput();
}

function checkPlayerInput() {
            const lastIndex = playerSequence.length - 1;
            
            // 1. Vérifier la justesse du dernier clic
            if (playerSequence[lastIndex] !== gameSequence[lastIndex]) {
                gameOver(false); // Séquence incorrecte
                return;
            }

            // 2. Vérifier si la séquence est complète
            if (playerSequence.length === gameSequence.length) {
                // SUCCÈS : Le joueur a répété la séquence croissante
                statusDisplay.textContent = 'GOOD!';
                isPlayerTurn = false;
                
                // CORRECTION: Incrémenter le round ici après la validation complète
                round++;
                
                setTimeout(nextRound, 1500);
            }
        }

function nextLevel() {
    // 1. Ajouter une couleur aléatoire à la séquence
    const randomColor = colors[Math.floor(Math.random() * 4)];
    gameSequence.push(randomColor);
    
    // 2. Afficher la séquence au joueur (voir section DOM pour l'affichage)
    showSequence(gameSequence);
    
    // 3. Réinitialiser la séquence du joueur
    playerSequence = [];
    
    // 4. Mettre à jour l'affichage du niveau (Manipulation de texte dans le DOM)
    document.getElementById('level-display').innerText = `Niveau ${level}`;
    level++;
}