# Stampfel

**Tamponnez vos notes de frais en un instant.**

*Stampfel* — « tampon » en alsacien — est une web app mobile (PWA) qui permet d'apposer un tampon d'adresse sur vos justificatifs de notes de frais. 100% local, aucune donnée ne quitte votre appareil.

🔗 **[Ouvrir Stampfel](https://falkinou.github.io/Note-de-frais/)**

---

## Fonctionnalités

### Tamponnage
- **Mode Rapide** : photo → tampon auto-positionné → sauvegarde en un tap
- **Mode Complet** : photo ou import → recadrage → positionnement manuel → export PNG ou PDF
- **Positionnement intelligent** : analyse la luminosité de l'image pour placer le tampon dans la zone la plus claire
- **Détection auto des bords** : détecte les contours du ticket pour un recadrage précis (algorithme Sobel)
- **Glisser-déposer** : déplacez le tampon avec le doigt
- **Pinch-to-zoom** : redimensionnez le tampon à deux doigts
- **Rotation à deux doigts** : tournez le tampon directement sur l'image
- **Slider rotation** + champ numérique pour un contrôle précis

### Personnalisation du tampon
- Adresse multiligne personnalisable
- 2 formes : rectangle ou cercle
- Texte en arc de cercle (mode cercle)
- 5 couleurs de fond + mode transparent
- 8 couleurs de texte
- 10 polices (Inter, Roboto Condensed, Oswald, Archivo Black, Barlow Condensed, Space Grotesk, Bebas Neue, Outfit, DM Sans, Instrument Sans)
- Toggle gras
- Réglage de taille
- Afficher/masquer la date
- Effet vintage/usé réaliste (encre irrégulière, grain, bavures)

### Export
- **PNG** haute qualité (2400px max)
- **PDF** proportionnel à la photo
- Nom de fichier automatique : `NDF_JJMMAAAA.png`
- Partage natif iOS/Android (Web Share API) ou téléchargement direct
- Filtre « Améliorer » : contraste +25%, luminosité +8%, netteté (unsharp mask)

### Interface
- Design « Liquid Depth » : fond sombre chaud, éléments en verre translucide
- Titre en Darker Grotesque 900
- Icônes SVG (Tabler Icons, MIT)
- Animations fluides
- Safe area iOS (notch, barre home)
- Vibration haptique Android
- Compteur local + communautaire (Cloudflare Workers)

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

---

## Stack technique

- HTML / CSS / JS vanilla — fichier unique `index.html`
- Canvas API pour le rendu image + tampon
- Web Share API pour la sauvegarde mobile
- localStorage pour la persistance des réglages
- PWA : Service Worker + manifest inline (base64)
- Cloudflare Workers + KV pour le compteur communautaire
- Polices : Google Fonts (Darker Grotesque, DM Sans, Instrument Sans, Outfit + 10 polices tampon)
- Icônes : SVG inline (Tabler Icons, MIT)

---

## Vie privée

Aucune donnée ne quitte votre appareil. Les photos sont traitées localement via Canvas API. Le seul appel réseau est l'incrémentation du compteur communautaire (aucune donnée personnelle transmise).

---

## Auteur

**Loïc Arnold** — 2025

---

## Licence

Usage personnel et interne. Tous droits réservés.
