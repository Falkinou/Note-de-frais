# Validation Stampfel 1.8.0 — 10 octobre 2026

## Périmètre

Accueil Cuivre : titre agrandi, accès au tampon sur l’accueil, prise de photo et import image/PDF. Un seul parcours, sans création de compte ni historique des justificatifs. Les deux compteurs restent sous les actions.

## Vérifications

- 21 tests JavaScript : dates (y compris chiffres espacés par l’OCR), isolation des tickets, export/annulation, géométrie du tampon, import des compteurs et synchronisation hors ligne.
- 5 tests Python : migration, déduplication, concurrence, sauvegarde/restauration, persistance et contrôle des origines.
- 8 cas OCR synthétiques exécutés avec le moteur réel, tous conformes. Ce jeu ne mesure pas la précision sur des photos réelles.
- Parcours navigateur à 393 × 852 et accueil à 320 × 568, sans débordement horizontal.
- Photo : date française préremplie. PDF texte d’une page : ouverture directe. PDF de deux pages : sélection de la seconde et date issue de cette page.
- PDF scanné : reconnaissance locale avec gestion des espaces introduits dans les chiffres de la date.
- PDF invalide : erreur compréhensible et retour à l’accueil utilisable.
- Export PNG puis PDF du même ticket : deux fichiers téléchargés et vérifiés, un seul incrément personnel et communautaire dans la base de test isolée.
- Configuration du tampon accessible et sauvegarde conservée.
- Syntaxe JavaScript, empreintes des ressources OCR/PDF et `git diff --check` vérifiés.

## Migration des compteurs

Le compteur communautaire ancien a été relevé à **326** avant livraison. L’initialisation est persistée dans SQLite sur le VPS. Une lecture périodique de l’ancien compteur reprend les incréments des installations qui n’ont pas encore été mises à jour. Les nouveaux clients utilisent uniquement l’API du VPS.

Le total personnel réel est lu depuis `ndf_count` sur chaque appareil au premier lancement de cette version, puis conservé côté serveur avec un identifiant aléatoire. Le cas historique « 119 personnels / 326 communautaires » est couvert par un test, sans ajouter 119 au total communautaire. Aucun chiffre personnel n’est imposé en production.

Les fichiers des essais, les compteurs de test et les justificatifs restent exclus de la livraison. La base SQLite est portée par un volume persistant distinct des images. Le retour arrière conserve ce volume.

## Limites des vérifications

Le partage natif sur un iPhone physique et les gestes tactiles n’ont pas été exécutés depuis cette session. Le serveur de développement désactive le cache Service Worker : les essais locaux ne constituent donc pas une validation du fonctionnement hors ligne de la PWA. Une date reconnue reste à vérifier et peut toujours être corrigée manuellement.
