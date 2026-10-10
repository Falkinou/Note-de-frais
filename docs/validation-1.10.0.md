# Validation Stampfel 1.10.0

Vérifications du 10 octobre 2026. Les essais d'export utilisent uniquement des fixtures synthétiques et la base locale `.test-output/dev-counters.sqlite3`.

## Résultat fonctionnel

- Éditeur compact sur un seul écran, contrôlé en 393 × 852 et 320 × 568 : image, date, repas et exports accessibles sans défilement. Les réglages sont dans une feuille « Ajuster ».
- Midi de 10:00 à 14:00 inclus ; soir de 18:00 à 00:00 inclus. 14:01 et 00:01 restent sans libellé. Choix manuel prioritaire, y compris le retrait du repas.
- Placement fondé sur les zones imprimées ; proposition de marge lorsque l'espace paraît insuffisant. Alertes photo indicatives et non bloquantes.
- Zoom de lecture, déplacement dans l'image agrandie et comparaison à l'original indépendants du placement du tampon.
- Conservation du PDF importé et de toutes ses pages ; option explicite de retouche d'une copie raster de la page sélectionnée.
- Numéro local par date, conservé entre PNG et PDF d'un même ticket. Deux tickets distincts reçoivent des noms distincts.
- Reprise locale facultative, décochée au premier usage. Date, repas, photo, filtre, marge, tampon et PDF restaurés après rechargement. Brouillon supprimé après export, désactivation ou expiration à sa prochaine lecture.

## Tests automatisés

- `npm test` : 54 tests réussis. Dates/heures, priorités manuelles, export annulé, géométrie, synchronisation, analyse photo, stockage et PDF natif.
- `npm run test:ocr` : huit fixtures passent avec le vrai moteur OCR.
- `npm run test:meals` : six lectures réelles passent : 10:00, 13:50, 14:01, 18:00, 23:59 et 00:01.
- Les tests PDF contrôlent les rotations 0/90/180/270°, une origine CropBox décalée, l'emplacement du tampon, le texte sélectionnable, un formulaire et une seconde page visuellement identique. La marge est vérifiée aux quatre rotations.
- Licences et empreintes du moteur PDF embarqué incluses dans `vendor/pdf-lib/`.

## Parcours navigateur

- Photo : lecture de date/repas, filtre Lisible, correction manuelle conservée après traitement, annulation d'un nouveau recadrage, export PNG puis PDF avec un seul incrément.
- PDF de deux pages : choix de page, heure issue du texte natif, tampon et marge. Le fichier téléchargé a été rouvert avec pypdf et rendu avec Poppler : deux pages, texte et champ `reference` conservés. Rendu inspecté visuellement.
- Reprise : sauvegarde locale activée dans le test, rechargement, restauration exacte puis suppression après export. Sur une origine neuve, l'option reste désactivée.
- PDF scanné : « Retoucher une copie de cette page » ouvre le recadrage et rend les filtres disponibles ; date et repas restent présents.
- Hors ligne : après chargement des ressources OCR, PDF.js et pdf-lib, arrêt du serveur local puis rechargement. Photo, redressement, filtre, OCR et export PDF fonctionnent ; import et export d'un PDF natif fonctionnent aussi. Au redémarrage du serveur, les deux exports en attente sont synchronisés une fois : sept événements locaux au total, communauté locale 333 (base 326).

## Portée et limites

Les vues mobiles sont des dimensions de navigateur, pas une validation sur iPhone physique. La caméra, les gestes tactiles matériels, le clavier Safari et la feuille native de partage iOS restent à confirmer sur appareil. Le contrôle hors ligne a arrêté le serveur de l'application ; il ne simule pas intégralement le mode avion du téléphone.

Les fixtures OCR synthétiques vérifient les formats et les régressions, sans mesurer la précision sur un corpus de vrais tickets. Les alertes photo et le placement analysent des pixels, sans reconnaître sémantiquement les montants. Les signatures numériques de PDF existants ne sont pas conservées par ce flux d'export.

Le service et le volume des compteurs en production ne sont pas remplacés lors de cette livraison. Une sauvegarde SQLite et l'identité du conteneur sont vérifiées avant activation du nouveau frontend.
