# Stampfel

**Tamponnez vos notes de frais en un instant.**

*Stampfel* — « tampon » en alsacien — est une web app mobile (PWA) qui permet d'apposer un tampon d'adresse sur vos justificatifs de notes de frais. Les photos et leur lecture automatique sont traitées sur votre appareil.

🔗 **[Ouvrir Stampfel](https://stampfel.mycloudapi.fr/)**

---

## Fonctionnalités

### Tamponnage
- **Un seul parcours** : photo ou import → positionnement du tampon → export PNG ou PDF ; recadrage proposé pour les images
- **Importer** : images ou PDF (25 Mo maximum), avec choix de la page pour les documents multipages
- **Placement proposé** : analyse les contours de l'impression, y compris les caractères pâles, pour chercher un emplacement peu occupé ; une marge blanche peut accueillir le tampon si le ticket manque de place
- **Recadrage proposé** : recherche du papier et vérification de ses quatre bords ; si la détection est incertaine, l’image entière est conservée
- **Correction de perspective** : quatre coins indépendants redressent les photos prises de biais
- Poignées tactiles de 44 px, loupe pendant le déplacement et ajustement au clavier
- Rotation de la photo en conservant les coins ; recadrage réouvrable depuis le ticket, avec annulation possible
- **Glisser-déposer** : déplacez le tampon avec le doigt
- **Pinch-to-zoom** : redimensionnez le tampon à deux doigts
- **Rotation à deux doigts** : tournez le tampon directement sur l'image
- **Slider rotation** + champ numérique pour un contrôle précis
- Déplacement du tampon et des coins de recadrage avec les flèches du clavier

### Lecture de la date et de l'heure
- Lecture automatique dès la photo ou l'import
- Texte natif du PDF utilisé en priorité ; les PDF scannés passent par la reconnaissance locale
- Reconnaissance locale avec Tesseract.js et un modèle français hébergé avec l'application
- Dates numériques françaises (`08/10/2026`, `08-10-26`), ISO (`2026-10-08`) et mois en français (`8 octobre 2026`)
- Une date unique suffisamment lisible préremplit le champ ; plusieurs dates ou une lecture incertaine demandent un choix
- Les dates invalides et les lignes identifiées comme une expiration, une échéance ou une validité sont écartées
- Saisie manuelle toujours disponible et prioritaire, même si la lecture se termine ensuite
- Si la date ou l'heure manque encore, nouvelle lecture après redressement ou amélioration de l’image, sans écraser une correction manuelle
- **Repas proposé** : de 10:00 à 14:00 inclus, « midi » ; de 18:00 à 00:00 inclus, « soir ». À 14:01 ou 00:01, aucun libellé automatique
- Les horaires d'ouverture, plages horaires et heures invalides sont écartés ; une lecture ambiguë ou trop incertaine ne choisit pas de repas
- Le repas peut être modifié ou retiré. Il suit la date sur le tampon (`06/10/2026 · midi`) et dans le nom de fichier
- Chaque nouveau ticket repart avec une date vide ; la date doit être renseignée avant l'export

La proposition reste à vérifier : un ticket froissé, flou, peu contrasté ou une date atypique peut nécessiter une correction. Le premier lancement du moteur prend plus de temps ; après 45 secondes sans résultat, l'application propose la saisie manuelle.

### Personnalisation du tampon
- Adresse multiligne personnalisable
- 2 formes : rectangle ou cercle
- Texte en arc de cercle (mode cercle)
- 5 couleurs de fond + mode transparent
- 8 couleurs de texte
- 10 styles de police (Helvetica, Inter, Roboto Condensed, Oswald, Archivo Black et Barlow Condensed)
- Toggle gras
- Réglage de taille
- Afficher/masquer la date du ticket
- Effet vintage/usé (encre irrégulière et grain)
- Même rendu de tampon pour l'aperçu, le PNG et le PDF ; l'usure reste identique entre les exports

### Export
- **PNG** haute qualité (2400px max)
- **PDF photo** proportionnel à la photo
- **PDF importé** : ajoute le tampon à la page choisie et conserve toutes les pages, le texte natif et les formulaires. La marge est également disponible
- « Retoucher une copie de cette page » permet de recadrer ou filtrer un PDF scanné ; cet export contient alors uniquement la page choisie, sous forme d'image
- Nom numéroté par date sur cet appareil, par exemple `NDF_06102026_midi_02.pdf` ; un même ticket garde son numéro entre PNG et PDF
- Partage natif iOS/Android (Web Share API) ou téléchargement direct
- Une annulation du partage conserve le ticket et n'incrémente pas le compteur
- Rendus **Original / Lisible / N&B** : compensation locale de l’éclairage, contraste doux et netteté limitée pour conserver les impressions pâles
- Le N&B conserve des niveaux de gris ; aucun texte manquant n’est reconstitué
- Les filtres partent toujours du recadrage sans filtre, avec retour immédiat à l’original
- Les traitements photo sont exécutés dans un Web Worker local pour garder l’interface réactive
- Indications non bloquantes de flou, reflet localisé, manque de lumière ou bord possiblement coupé ; ce sont des aides visuelles, pas une garantie de lisibilité
- Zoom de lecture indépendant du tampon, avec comparaison à l'original en maintenant le bouton

L'export produit un nouveau fichier. La conservation de signatures numériques existantes dans un PDF n'est pas prise en charge.

### Interface
- Accueil « Cuivre » : fond sombre chaud, grand titre et actions compactes
- Titre en Outfit 800
- Icônes SVG (Tabler Icons, MIT)
- Animations fluides
- Safe area iOS (notch, barre home)
- Éditeur sur un écran : image, date, repas et deux exports toujours visibles ; rotation, taille et marge regroupées dans « Ajuster »
- Reprise temporaire d'un ticket sur cet appareil, **désactivée par défaut**, disponible pendant 24 h et effacée après export ou désactivation
- Vibration haptique Android
- Compteurs personnel et communautaire persistés sur le VPS, sans compte utilisateur
- Compteur personnel historique repris automatiquement sur l'appareil qui le détient
- Un ticket compte une fois, même exporté en PNG puis en PDF ; les exports hors ligne sont synchronisés au retour du réseau

---

## Installation

### Sur iPhone / iPad
1. Ouvrir le lien dans Safari
2. Tap sur le bouton partage ↑
3. « Sur l'écran d'accueil »

### Sur Android
1. Ouvrir le lien dans Chrome
2. Menu ⋮ → « Ajouter à l'écran d'accueil »

### Sur ordinateur
Ouvrir le lien dans n'importe quel navigateur.

### Déploiement sur le VPS

Le `Dockerfile` copie l'application, PDF.js et le moteur OCR dans une image Nginx. Le service Python `server/counters.py` conserve uniquement les compteurs dans SQLite, sur un volume Docker persistant. Aucun serveur de traitement des justificatifs n'est nécessaire.

Le `docker-compose.yml` inclus est un exemple pour un proxy **Traefik** :

```bash
STAMPFEL_LEGACY_COUNT=326 docker compose up -d --build
```

Par défaut, l'application est publiée sur `https://stampfel.mycloudapi.fr`. Elle
se connecte au réseau Docker externe `mca-public`. Le sous-domaine peut être
remplacé avec la variable `STAMPFEL_DOMAIN`.

La valeur `326` est le relevé vérifié lors de la migration de la version 1.8.0 ; pour une autre installation, relever la valeur réelle avant le premier démarrage. Ce paramètre initialise une base vide et ne remet jamais une base existante à zéro. Pendant la transition, le serveur lit l'ancien compteur Cloudflare afin de reprendre les incréments des anciennes installations. Les clients 1.8.0 écrivent uniquement sur le VPS.

Sauvegarder le volume `counters` avec l'API SQLite `backup` (méthode `CounterStore.backup`), puis conserver cette sauvegarde à part du conteneur. Ne pas supprimer le volume lors d'une mise à jour ou d'un retour à une ancienne version. Les origines autorisées sont définies par `ALLOWED_ORIGINS` ; l'API n'expose aucun port public direct.

La stack actuellement hébergée sur VPS4 utilise **Caddy**, avec son propre fichier `/srv/vps4/pro/stacks/stampfel/compose.yaml` et le réseau `vps4-edge`. Le fichier Compose Traefik de ce dépôt ne remplace pas cette configuration.

Servir le site en HTTPS (ou sur `localhost` pour les essais) permet l'installation PWA et le Service Worker. Lors d'une nouvelle livraison, changer le nom du cache dans `sw.js` ; les clients 1.8.0 appliquent la mise à jour sur l'accueil et attendent la fin d'un ticket en cours avant de recharger.

### Développement et vérification

```bash
npm ci --ignore-scripts
npm test
npm run test:counters
npm run test:ocr
npm run test:images
npm run test:meals
python3 scripts/dev-server.py --port 8780
```

Le serveur de développement reprend la politique de sécurité Nginx et utilise une base isolée dans `.test-output/dev-counters.sqlite3`, sans contacter le compteur réel. Il désactive le cache Service Worker pour rendre les modifications immédiatement visibles ; l'option `--pwa` sert le véritable `sw.js` pour les essais hors ligne.

Les ressources OCR et PDF sont incluses dans `vendor/ocr/`, `vendor/pdfjs/` et `vendor/pdf-lib/` avec leurs licences et empreintes SHA-256. Pour les régénérer depuis les versions verrouillées par `package-lock.json` :

```bash
npm run vendor:ocr
npm run vendor:pdf
npm run vendor:pdf-export
```

`npm test` couvre les dates, l'isolation des tickets, les annulations de partage, la géométrie du tampon et la synchronisation des compteurs. `npm run test:counters` vérifie la migration, les doublons, les accès concurrents, la persistance, les sauvegardes et les origines autorisées. `npm run test:ocr` exécute le vrai moteur sur huit tickets synthétiques (dates françaises, ISO, ambiguës, absentes ou invalides) ; ce jeu ne mesure pas la précision sur des photos réelles. Les résultats sont écrits dans `.test-output/ocr-results.json`.

`npm run test:images` construit trois scènes connues (perspective, ombre, fond clair/foncé), mesure l’erreur des coins et exécute le vrai OCR après traitement. Les images avant/après et les résultats restent dans `.test-output/images/`. Les tests unitaires vérifient aussi les limites géométriques, la préservation de l’original, des impressions pâles et l’annulation des traitements tardifs.

`npm run test:meals` lit six tickets synthétiques avec le vrai moteur OCR, dont les limites 14:01 et 00:01. Les tests unitaires couvrent aussi l'ambiguïté, la correction manuelle, les brouillons, la numérotation concurrente et les PDF natifs avec rotations, marges, texte et formulaires. Voir [la validation 1.10.0](docs/validation-1.10.0.md).

---

## Stack technique

- HTML / CSS / JS vanilla — `index.html`, `app.css` et `app.js`
- `receipt.js` : formats de date et état propre à chaque ticket
- `ocr.js` + `vendor/ocr/` : moteur Tesseract.js 7.0.0 et modèle français
- `pdf-import.js` + `vendor/pdfjs/` : lecture et rendu local avec PDF.js 6.4.299
- `pdf-export.js` + `vendor/pdf-lib/` : ajout du tampon au PDF original avec pdf-lib 1.17.1
- `local-store.js` : reprise temporaire facultative et numérotation dans IndexedDB
- `document-analysis.js` : analyse locale des zones imprimées et des défauts photo possibles
- `receipt-viewer.js` : zoom et comparaison à l'original
- `counters.js` + `server/counters.py` : synchronisation anonyme et stockage SQLite sur le VPS
- `image-processing.js`, `image-tools.js`, `image-worker.js` : détection, homographie, rééchantillonnage et amélioration locale, sans service distant ni génération d’image
- `stamp-renderer.js` : rendu Canvas partagé entre aperçu et exports
- `export-file.js` : partage, annulation et téléchargement
- Web Share API pour la sauvegarde mobile
- localStorage pour la persistance des réglages
- PWA : `sw.js`, `manifest.webmanifest` et icônes aux dimensions 192/512 px
- Polices : Google Fonts pour l'interface et plusieurs styles du tampon ; Helvetica utilise les polices système
- Icônes : SVG inline (Tabler Icons, MIT)

---

## Vie privée

Les photos, PDF, le texte reconnu, la date et l'heure ne sont pas envoyés à un service OCR : ils restent dans le navigateur jusqu'à l'export ou au partage choisi par l'utilisateur. L'application ne conserve pas d'historique des justificatifs et ne demande pas de compte.

La reprise après fermeture est désactivée par défaut. Si elle est activée, un seul ticket et ses réglages sont enregistrés dans IndexedDB sur cet appareil, avec une disponibilité de 24 h. L'export, la désactivation ou le remplacement par un nouveau ticket efface ce brouillon ; un brouillon expiré est supprimé à la prochaine consultation. Les index de numérotation par date restent locaux, sans image ni texte du justificatif.

Les fichiers de l'application, le lecteur PDF et le modèle OCR sont téléchargés depuis le même hébergement. Google Fonts fournit les polices. Le VPS reçoit un identifiant aléatoire propre au navigateur, le total personnel historique et des identifiants d'export pour dédupliquer les incréments ; il ne reçoit ni justificatif, ni adresse de tampon, ni montant, ni date. L'identifiant du navigateur est stocké sous forme d'empreinte dans la base. Le service de compteurs désactive ses journaux d'accès ; les requêtes réseau communiquent les métadonnées habituelles de connexion aux hébergeurs. Sans compte, effacer les données du navigateur ou changer d'appareil ne permet pas de retrouver son compteur personnel.

Le Service Worker met l'application en cache. Après un premier usage réussi en ligne, les ressources OCR et PDF déjà chargées peuvent être réutilisées hors ligne, tant que le navigateur conserve son cache. Les polices distantes et la synchronisation des compteurs peuvent rester indisponibles hors ligne ; une police de remplacement permet de continuer à tamponner et les incréments sont conservés localement en attendant le réseau.

---

## Auteur

**Loïc Arnold** — 2025

---

## Licence

Usage personnel et interne. Tous droits réservés.
