# Correctif 1.10.1 — date sur iPhone

Le champ natif de date débordait sur le sélecteur de repas dans la capture iPhone fournie. Ce comportement correspond au [défaut WebKit 301648](https://bugs.webkit.org/show_bug.cgi?id=301648), qui concerne la largeur à 100 % avec padding des champs de date sur iOS.

Le style natif du seul champ de date est désactivé avec `appearance: none` et `-webkit-appearance: none`. Sa largeur maximale reste bornée à sa colonne ; la valeur interne garde une hauteur explicite et un alignement à gauche. Le contrôle reste un `input type=date` avec son calendrier natif.

Contrôles effectués dans le navigateur de test :

- 393 × 852 : date 253 × 40 px, repas 84 × 40 px, espace 10 px, aucun défilement vertical.
- 320 × 568 : date 180 × 40 px, repas 84 × 40 px, espace 10 px, exports visibles.
- Saisie du 08/10/2026 et choix « Soir » conservés dans l'interface et le nom du fichier.
- Ouverture et fermeture du calendrier natif vérifiées.
- Diff et syntaxe du Service Worker contrôlés. Aucun changement dans la logique OCR, PDF ou les compteurs.

Le correctif vise le rendu natif iOS signalé ; la vérification sur un iPhone physique n'est pas disponible dans cet environnement. Les dimensions mobiles ci-dessus ne simulent pas le moteur iOS.
