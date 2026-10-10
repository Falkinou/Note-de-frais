# Stampfel 1.11.1 — tampon rond

Le fond transparent supprimait le tracé de la forme avec son remplissage. Un tampon rond sans texte en arc ressemblait donc à du texte rectangulaire. Les adresses très longues pouvaient également augmenter la hauteur du dessin et transformer le cercle en ellipse.

Le contour du cercle reste maintenant visible avec un intérieur transparent et suit la couleur du texte. Le tampon rond garde un dessin carré ; les lignes et leur taille sont adaptées à l’espace disponible, avec ou sans titre en arc. Le libellé de configuration indique « Contour conservé ». Le rectangle transparent conserve son rendu texte seul.

## Vérifications

- `npm test` : 71 tests passent, dont deux nouveaux contrôles raster du contour, de la transparence, de la couleur et des adresses longues avec date, avec ou sans arc. Les contrôles de rotation et de géométrie partagée entre aperçu et export passent.
- Navigateur en 393 × 852 : cercle visible dans la configuration et sur le ticket ; texte en arc activable ; export PNG et PDF complet réussis depuis l’interface.
- PNG téléchargé : 700 × 1000 pixels. PDF téléchargé : deux pages conservées, texte natif et champ `reference = CHAMP-CONSERVE` présents. Les deux fichiers ont été ouverts/rendus et inspectés visuellement : contour rond, intérieur transparent.
- Essais réalisés sur des documents synthétiques avec le serveur et les compteurs locaux. Pas d’export de test en production.
- Manifeste hors ligne régénéré pour 1.11.1 : 239 ressources. Les moteurs et autres ressources inchangées sont réutilisables par le cache existant.

Preuves locales : `.test-output/v1.11.1/`. Le navigateur de bureau utilise un viewport mobile ; aucun iPhone physique n’a été testé.

## Livraison

Déploiement du frontend seul sur le VPS, conservation du conteneur et du volume des compteurs, puis publication GitHub Pages. Vérifier la version, les empreintes HTTP et le rendu public après mise à jour du service worker. Le dossier de livraison et le retour arrière sont conservés hors dépôt dans `.codex-work/stampfel-deploy/`.
