// --- VARIABLES GLOBALES DU JEU ---
const COLORS = ['red', 'green', 'blue', 'yellow'];

const gameSequence = [];
let playerSequence = [];
let round = 1;
let isPlayerTurn = false;
let gameActive = false;

// Constantes d'animation
const FLASH_DURATION = 350; // Durée du flash lors de la démo
const INTERVAL = 550;       // Délai entre le début de deux flashes

// --- ÉLÉMENTS DOM ---
const Center = document.getElementById('center');
const audioMap = {
    'red': new Audio('do.mp3'),
    'green': new Audio('re.mp3'),
    'blue': new Audio('mi.mp3'),
    'yellow': new Audio('fa.mp3')
};
// Création des éléments d'affichage de statut (similaire à la version précédente pour un affichage centré)
let statusDisplay = document.createElement('span');
statusDisplay.id = 'game-status';
statusDisplay.style.fontSize = '14px';
statusDisplay.style.fontFamily = "'Press Start 2P', monospace"; // Assurez le style
statusDisplay.textContent = "SIMON SAYS";

let roundInfo = document.createElement('span');
roundInfo.id = 'round-info';
roundInfo.style.fontSize = '10px';
roundInfo.style.marginTop = '5px';
roundInfo.style.fontFamily = "'Press Start 2P', monospace"; // Assurez le style
roundInfo.textContent = "Round 0";

// Remplacer le contenu du bouton central par les affichages du statut
if (Center) {
    Center.innerHTML = '';
    Center.appendChild(statusDisplay);
    Center.appendChild(roundInfo);
}

// Map des éléments du jeu (utilisant les IDs ajoutés au HTML)
const allQuadrants = {
    'red': document.getElementById('red-game'),
    'green': document.getElementById('green-game'),
    'blue': document.getElementById('blue-game'),
    'yellow': document.getElementById('yellow-game')
};

// --- FONCTIONS DE NAVIGATION ---

function showSection(id) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(id);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Démarre le jeu si on entre dans la section 'jeu'
    if (id === 'menu') {
        displayBestScore();
    }
    else if (id === 'jeu') {
        startGame();
    } else if (gameActive) {
        gameOver(true); // Arrêter le jeu si on quitte la section 'jeu'
    }
}


// --- LOGIQUE D'ANIMATION ET DE JEU ---

/** Fait clignoter un quadrant spécifique. */
function flashColor(colorId, duration) {
    const element = allQuadrants[colorId];
    const audio = audioMap[colorId];
    if (audio) {
        // Optionnel : Réinitialiser et jouer pour éviter les délais si le son est rejoué rapidement
        audio.currentTime = 0; 
        audio.play().catch(e => console.error("Erreur lecture audio:", e)); // Utiliser catch pour éviter les erreurs de lecture automatique non initiée par l'utilisateur
    }
    if (element) {
        element.classList.add('active'); 
        setTimeout(() => {
            element.classList.remove('active');
        }, duration); 
    }
}

/** Désactive l'animation de pulsation CSS infinie au début du jeu. */
function disablePulseAnimation() {
    Object.values(allQuadrants).forEach(element => {
        if (element) {
            element.style.animation = 'none'; // Désactive l'animation
            element.style.boxShadow = element.style.boxShadow.replace('20px 5px', '10px 3px'); // Fixe une ombre plus discrète
        }
    });
}

/** Affiche la séquence de couleurs au joueur. */
function showSequence(sequence) {
    isPlayerTurn = false; 
    statusDisplay.textContent = "WATCH! \n";

    let delay = 0;

    sequence.forEach((colorId, index) => {
        setTimeout(() => {
            flashColor(colorId, FLASH_DURATION);
            
            if (index === sequence.length - 1) {
                setTimeout(startPlayerTurn, INTERVAL); // Commencer le tour du joueur après le dernier flash
            }
        }, delay);
        
        delay += INTERVAL;
    });
}

/** Démarre le tour du joueur. */
function startPlayerTurn() {
    isPlayerTurn = true;
    statusDisplay.textContent = 'YOUR TURN! \n ';
    const requiredClicks = gameSequence.length;
    let clickWord = (requiredClicks > 1) ? 'Clicks' : 'Click'; 
    
    // Mise à jour de l'affichage
    roundInfo.textContent = `Repeat ${requiredClicks} ${clickWord}`;
}

/** Gère le clic du joueur sur un quadrant. */
window.handlePlayerClick = function(clickedColor) {
    if (!isPlayerTurn || !gameActive) return;

    flashColor(clickedColor, 150); // Flash court lors du clic
    playerSequence.push(clickedColor);
    
    checkPlayerInput();
}

/** Vérifie si la séquence du joueur correspond. */
function checkPlayerInput() {
    const lastIndex = playerSequence.length - 1;
    
    if (playerSequence[lastIndex] !== gameSequence[lastIndex]) {
        gameOver(false); // Séquence incorrecte
        return;
    }

    if (playerSequence.length === gameSequence.length) {
        // SUCCÈS : Le joueur a réussi le tour
        statusDisplay.textContent = 'GOOD!';
        isPlayerTurn = false;
        roundInfo.textContent='';
        round++; // Incrémenter le round
        
        setTimeout(nextRound, 1500); // Lancer le prochain tour
    }
}

/** Prépare et démarre le tour suivant (incrémentation de la séquence). */
function nextRound() {
    if (!gameActive) return;

    playerSequence.length = 0;
    
    roundInfo.textContent = `Round ${round} \n`;
    
    // AJOUT: Nouvelle couleur pour rendre la séquence croissante
    const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    gameSequence.push(nextColor);
    
    showSequence(gameSequence);
}

/** Initialise et commence le jeu. */
function startGame() {
    gameActive = true;
    round = 1; 
    gameSequence.length = 0;
    playerSequence.length = 0;
    
    disablePulseAnimation(); 
    setTimeout(nextRound, 1000);
}
// --- VARIABLES GLOBALES DU JEU ---
// ... (vos variables existantes) ...
const LOCAL_STORAGE_KEY = 'simonSaysBestScore'; // Clé pour localStorage

// --- NOUVELLES FONCTIONS DE GESTION DU SCORE ---

/**
 * Récupère le meilleur score local stocké.
 * @returns {number} Le meilleur score ou 0 si aucun score n'est trouvé.
 */
function getBestScore() {
    const score = localStorage.getItem(LOCAL_STORAGE_KEY);
    return score ? parseInt(score, 10) : 0;
}

/**
 * Met à jour le meilleur score local si le score actuel est supérieur.
 * @param {number} newScore Le score que le joueur vient d'atteindre (round - 1).
 */
function updateBestScore(newScore) {
    const currentBest = getBestScore();
    if (newScore > currentBest) {
        localStorage.setItem(LOCAL_STORAGE_KEY, newScore.toString());
        return true; // Nouveau record
    }
    return false; // Pas de nouveau record
}

/**
 * Met à jour l'affichage du meilleur score dans le menu.
 */
function displayBestScore() {
    const bestScoreElement = document.getElementById('best-score-display');
    const bestScore = getBestScore();
    if (bestScoreElement) {
        bestScoreElement.textContent = `Best Score: ${bestScore}`;
    }
}
/** Fin de la partie. */
/** Fin de la partie. */
function gameOver(isQuit) {
    gameActive = false;
    isPlayerTurn = false;
    
    // Le score est le round précédent
    const finalScore = round - 1; 

    if (!isQuit) {
         statusDisplay.textContent = 'Fail! \n';
         roundInfo.textContent = `Score: ${finalScore}`;

         // Vérifier et mettre à jour le meilleur score
         const isNewRecord = updateBestScore(finalScore);

         let alertMessage = `Game Over! Score: ${finalScore}.`;
         if (isNewRecord) {
             alertMessage += "\nNEW LOCAL SCORE ! 🏆";
         }
         
         setTimeout(() => {
             alert(alertMessage);
             showSection('menu');
             // S'assurer que le menu affiche le nouveau record
             displayBestScore(); 
         }, 3000);
    }
    // Si on quitte le jeu manuellement, on met à jour le menu pour l'affichage
    if (isQuit) {
        displayBestScore();
    }
}

// Exécuté au chargement : Initialisation de la section
showSection('menu');