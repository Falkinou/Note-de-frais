# Validation Stampfel 1.9.0 — 10 octobre 2026

## Changements

- Recadrage par quatre coins indépendants, correction de perspective par homographie et interpolation bilinéaire.
- Détection du papier par régions claires et contrôle du contraste des quatre bords. Si le résultat est ambigu, aucune coupe automatique n’est imposée.
- Poignées tactiles de 44 px, loupe pendant le déplacement, réglage au clavier, rotation des coins avec la photo et retour au recadrage depuis le ticket.
- Rendus Original, Lisible et N&B. Estimation locale du fond, compensation de l’éclairage, contraste et netteté limités. Le N&B garde les niveaux de gris.
- Source sans filtre conservée, résultats mis en cache pour comparer sans compression répétée ; annulation des traitements d’un ticket quitté.
- Nouvelle lecture de la date sur l’image redressée/traitée si aucune date n’a encore été retenue. Une date manuelle reste prioritaire.
- Le placement proposé du tampon ne remplace pas un geste manuel commencé entre-temps.

Les traitements s’exécutent dans un Web Worker local. Aucun service de retouche ou de génération d’image n’est appelé.

## Vérifications

- **33 tests JavaScript réussis**, dont 9 tests de géométrie/traitement et 3 tests d’annulation du worker ; les tests existants de date, export, rendu du tampon et compteurs passent aussi.
- **8 fixtures OCR existantes réussies**.
- **3 scènes synthétiques de perspective** : fond foncé, fond clair et ombre. Erreur maximale des coins de 0,70 à 0,80 point de pourcentage dans le repère de l’image. Ces chiffres concernent uniquement ces scènes contrôlées, pas un taux de réussite sur les photos réelles.
- Dans la scène ombrée du test automatisé, la date n’est pas retrouvée sur le recadrage sans filtre et devient `2026-10-10` avec les rendus Lisible et N&B. L’ensemble détection/redressement/deux rendus prend environ 70 à 115 ms sur le poste de test ; ce n’est pas une mesure de performance sur iPhone.
- Tests navigateur à 393 × 852 et 320 × 568 : import, détection, déplacement indépendant au pointeur et au clavier, redressement, rotation, annulation, reprise du recadrage, filtres et restauration exacte de la source sans filtre.
- Ticket froissé réel issu de l’exemple public CORD/Donut : refus prudent de la détection automatique, réglage manuel et amélioration visuelle vérifiés. La photo est conservée uniquement dans `.test-output/`, hors livraison.
- Export PNG 806 × 1363 vérifié avec des pixels monochromes, puis PDF du même ticket ; deux fichiers valides, un seul incrément sur la base de test locale. Aucune exportation de test n’est effectuée sur le compteur de production.
- Dates corrigées manuellement conservées après changement de rendu et annulation du recadrage.
- Vérification de la syntaxe et des espaces dans le diff.

Les captures et scènes sont dans `.test-output/images/`. Pour reproduire les essais : `npm test`, `npm run test:ocr`, `npm run test:images`.

## Limites

La détection ne reconnaît pas sémantiquement un ticket. Sur un fond similaire, un document froissé ou des bords masqués, le placement manuel peut rester nécessaire. Les pixels absents, les caractères effacés et les plis ne sont pas recréés. Les proportions après perspective sont estimées à partir des longueurs des bords visibles.

Le partage natif et les gestes au doigt n’ont pas été vérifiés sur un iPhone physique. Le serveur local désactive le cache PWA ; les vérifications locales ne démontrent pas le fonctionnement hors ligne.

## Références techniques et exemple de contrôle

- [Transformations géométriques — OpenCV](https://docs.opencv.org/4.13.0/da/d6e/tutorial_py_geometric_transformations.html) : principe de la transformation à quatre points. L’implémentation Stampfel est en JavaScript, sans dépendance OpenCV.
- [Seuillage — OpenCV](https://docs.opencv.org/4.13.0/d7/d4d/tutorial_py_thresholding.html) : seuillage d’Otsu et éclairage non uniforme.
- [CORD — NAVER/Clova AI, CC BY 4.0](https://github.com/clovaai/cord), exemple [receipt_00004 fourni avec Donut](https://github.com/clovaai/donut/blob/master/misc/sample_image_cord_test_receipt_00004.png), utilisé uniquement pour une vérification manuelle locale.
