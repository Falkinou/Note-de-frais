# Stampfel 1.11.0 — lecture vérifiable et fonctionnement hors ligne

Les points 7, 10, 11, 12, 13, 15, 21, 41, 43, 48 et 50 sont implémentés.

- Statuts courts de date, avec icônes distinctes ; sélection directe Aucun / Midi / Soir.
- Cuivre uniforme, Instrument Sans pour les commandes et Outfit pour le nom ; icônes SVG dans la configuration ; rayons de 10 px pour les commandes et 16 px pour les panneaux.
- Grille des tiers visible pendant le déplacement d’un coin ou son réglage au clavier.
- Compteur personnel renommé « Sur cet appareil » ; compteurs en bas de l’accueil.
- Version des Options lue depuis la même métadonnée que l’application ; test de cohérence avec package.json et le manifeste hors ligne.

## Lecture de date et d’heure

Le texte natif des PDF est lu en priorité, avec coordonnées ramenées dans l’aperçu, y compris les pages tournées. Pour une photo, l’éclairage du papier est normalisé dans le worker d’image avant OCR. Le fichier exporté n’est pas modifié par ce traitement de lecture. Le moteur français local Tesseract est conservé entre les tickets ; une lecture active peut être annulée sans laisser son résultat modifier le ticket suivant.

La confiance est évaluée sur les mots contenant la date ou l’heure, plutôt que sur la page entière. Les résultats faibles restent à confirmer. Une seule seconde passe sur l’original avec une segmentation différente est autorisée si des informations manquent. Une contradiction entre les dates retire le préremplissage automatique. Les dates et repas corrigés manuellement restent prioritaires. Les plages demeurent 10:00–14:00 inclus pour midi et 18:00–00:00 inclus pour soir.

La loupe montre des extraits bitmap de la zone réellement reconnue, date et heure séparément. Pour l’OCR, l’image rendue par le moteur est utilisée afin que le redressement automatique ne décale pas la preuve. Les extraits ne sont conservés entre sessions que si la reprise locale, désactivée par défaut, est activée.

## Hors ligne

239 ressources, environ 18,2 Mio, sont préparées dès la première visite connectée : application, trois variantes du moteur OCR, modèle français, import et export PDF, CMaps, polices PDF, WASM et polices de l’interface/tampon. Les polices proviennent de Google Fonts, sont hébergées localement et accompagnées de leurs licences OFL. Aucune requête Google Fonts à l’exécution.

Le service worker vérifie chaque téléchargement par SHA-256. Les ressources identiques sont réutilisées entre versions. Une installation incomplète n’active pas la nouvelle version. « Prêt hors ligne » exige la présence de toutes les ressources, indépendamment de l’indicateur de connexion. Les erreurs proposent une reprise. Les documents et l’API des compteurs ne sont jamais mis dans ce cache.

Après un premier téléchargement complet, import photo/PDF, OCR, amélioration, tampon et export fonctionnent sans serveur. La première ouverture entièrement sans réseau ne peut pas installer l’application. L’effacement des données du site ou leur éviction par le système nécessite une nouvelle préparation connectée.

## Vérifications

- `npm test` : 69 tests passent, dont confiance locale des chiffres, preuves PDF tournées, annulation et réutilisation du moteur, conflits entre passes, cache incomplet/corrompu, réparation après éviction, versions et empreintes des ressources.
- `npm run test:reading` : 6 cas des limites de repas, puis 17 scènes OCR (formats numériques/français/ISO, dates ambiguës ou invalides, validité, horaires, ticket incliné, ombre, petits caractères). Sur la machine de développement, ces 17 scènes prennent environ 0,15 à 0,36 seconde chacune, hors initialisation. Ce jeu synthétique et cette machine ne constituent pas une garantie de vitesse ou d’exactitude sur tous les téléphones/tickets.
- Navigateur : 393 × 852 et 320 × 568, aucune superposition et exports visibles. Petit écran : date 274 × 40 px ; repas sur la ligne suivante ; document haut de 568 px.
- Serveur local arrêté avant la première utilisation des fonctions : rechargement, import d’une image, lecture 06/10/2026 13:50 → midi, preuves visuelles, export PNG, premier import PDF multipage et export PDF complet réussis.
- Le PDF téléchargé contient toujours ses deux pages, le texte natif et le champ `reference = CHAMP-CONSERVE`. PNG exporté : 700 × 1000 pixels.
- Au redémarrage du serveur, les deux exports de test se synchronisent une seule fois : compteur local 2, communauté de test 333 → 335. Ces essais utilisent la base locale, pas la production.
- Photo ombrée : après normalisation, date et heure correctes avec leurs extraits ; correction manuelle en 08/10/2026 / soir conservée après relecture.

Preuves et rapports locaux : `.test-output/v1.11/` (exclus de Git). Le navigateur de bureau est utilisé avec des dimensions mobiles ; le sélecteur natif et le partage sur un iPhone physique ne sont pas testés ici.

## Livraison

Exécuter `npm run build:offline` après toute modification d’un fichier livré. Le test des empreintes empêche de publier un manifeste périmé. Le Dockerfile inclut les nouveaux modules et toutes les ressources locales. Déployer le frontend seul, conserver le conteneur et le volume des compteurs, puis vérifier les empreintes HTTP du VPS et de GitHub Pages. Les détails de livraison et le retour arrière sont enregistrés hors dépôt dans `.codex-work/stampfel-deploy/`.
