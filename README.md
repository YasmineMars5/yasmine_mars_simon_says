Nom du projet: Simon Says

description du projet
Le joueur doit mémoriser une séquence de couleurs (accompagnés de sons) qui augmente à chaque tour réussi. Le jeu intègre un système de calcul du meilleur score local .


Fonctionnalités principales:
Jeu de Séquence: Génération aléatoire et progressive de la séquence de couleurs/sons.
Affichage Dynamique: Mise à jour en temps réel du statut du jeu ("WATCH!", "Votre tour!", "BIEN!") et du numéro de tour.
Gestion du Score: Suivi du meilleur score local historique.
Navigation par Sections: Utilisation d'une structure multi-sections (menu, jeu, rules, param) gérée par une fonction showSection() pour une expérience de jeu sur une seule page.

Technologies utilisées:
Html: Création de la structure de l'interface utilisateur (UI), 
CSS3	Mise en forme visuelle, création des animations de pulsation pour le menu et des effets de flash  pour le jeu.
manipulation dynamique du DOM (affichage du statut et du score).
Données	Web Storage :Enregistrement et récupération du meilleur score du joueur entre les sessions.

Nouveautés explorées : 
L'implémentation d'une interface de Paramètres (#param) pour permettre à l'utilisateur de modifier deux variables cruciales (FLASH_DURATION et INTERVAL).
Gestion Fine de l'État du Jeu (Nettoyage) : J'ai approfondi la nécessité d'une réinitialisation complète de l'état du jeu (gameOver(true)). 


Difficultés rencontrées : problèmes techniques ou conceptuels rencontrés:
_Après avoir quitté le jeu  et être revenu au menu, le bouton central affichait le statut et le numéro de tour du jeu précédent (ex: "Tour 5" au lieu de "Tour 0").
_Assurer que les réglages faits dans la section Paramètres soient immédiatement pris en compte par la logique du jeu sans avoir à recharger la page.


Solutions apportées: 
Réinitialisation Forcée et Complète : J'ai déplacé et renforcé la logique de réinitialisation (gameSequence.length = 0, round = 1, statusDisplay.textContent = "SIMON SAYS") dans la fonction gameOver(isQuit). J'ai également fait appel à cette fonction directement depuis l'attribut onclick du bouton "RETOUR AU MENU" dans la section du jeu .
Lien Global des Paramètres : J'ai utilisé des variables globales (let FLASH_DURATION, let INTERVAL) pour les paramètres et ai créé la fonction updateParams() pour mettre à jour ces variables directement lors de l'interaction avec le curseur , garantissant ainsi que la logique du jeu accède toujours aux valeurs les plus récentes.





Lien vers la page  GitHub Pages : https://yasminemars5.github.io/yasmine_mars_simon_says/

