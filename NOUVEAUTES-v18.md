# 🆕 Version v18 — Akwaba, Firebase, sécurité et dashboard admin

Cette version applique les demandes suivantes. **Le fonctionnement des
alertes Violence et Enlèvement (sirène, GPS, contacts de confiance,
notifications) n'a pas été modifié** — seul l'accès à ces deux rubriques est
désormais conditionné à l'abonnement.

## Ce qui a changé

- **Nouveau logo** — bouclier orange professionnel, aux couleurs de l'app
  (déjà proches du drapeau ivoirien). Utilisé sur l'icône de l'application
  (toutes les tailles Android régénérées dans `android-res/`), l'écran
  d'accueil et l'écran de connexion. Sources modifiables dans `branding/`.
- **Rubriques masquées** — *Mon Planning*, *Alerte Info* et les écrans
  *Service Public* ont été retirés de la navigation visible. Le code reste
  intact et fonctionnel : repassez les indicateurs de l'objet `FEATURES` (en
  haut de `alerte-app-ui-source.jsx`) à `true` pour les republier plus tard,
  sans rien réécrire.
- **Abonnement « Akwaba »** — chaque nouveau compte démarre avec 30 jours
  d'accès gratuit et complet à Alerte Violence et Alerte Enlèvement. Une
  fois ce mois écoulé, ces deux rubriques passent en Premium : abonnement
  annuel à **3 000 FCFA**. Le paiement est pour l'instant simulé (activation
  immédiate) — l'écran `Paiement` est prêt à recevoir la vraie API de
  paiement que vous fournirez.
- **Connexion par Firebase** — l'inscription et la connexion utilisent
  désormais Firebase Authentication (le numéro de téléphone reste le seul
  identifiant vu par l'utilisateur). Un numéro ne peut plus créer deux
  comptes, et une connexion sur un nouvel appareil ferme automatiquement la
  session ouverte sur l'ancien (vérifié toutes les 45 secondes).
- **Saisies nettoyées** — noms, communes, messages et champs texte sont
  systématiquement nettoyés (balises/scripts retirés, longueur limitée)
  avant tout enregistrement.
- **Limitation de débit (rate limiting)** — l'API d'administration refuse
  au-delà de 20 requêtes/minute par numéro appelant.
- **Clés sensibles côté serveur** — la vérification du code administrateur
  et toutes les actions d'administration passent désormais par l'Edge
  Function `admin-api`, seule détentrice de la clé de service Supabase. Le
  code administrateur est haché (jamais stocké ni lu en clair).
- **Écran Administration sécurisé** — il fallait auparavant seulement
  connaître le bouton caché pour y entrer ; il exige maintenant le numéro et
  le code administrateur, vérifiés côté serveur. Trois nouveaux onglets :
  - **Utilisateurs** : voir chaque compte, le bloquer ou le débloquer
    (blocage immédiat, y compris à distance sur un appareil déjà connecté).
  - **Forfaits & bonus** : modifier le prix des forfaits, offrir un bonus
    premium (nombre de jours au choix) à un numéro donné.
  - Comptes institutionnels et types de service : inchangés.

## Ce qu'il reste à faire de votre côté (impossible à faire à votre place)

1. **Firebase** : dans la console Firebase du projet `ci-alerteci-appli` →
   Authentication → Sign-in method → activer **Email/Password** (c'est ce
   fournisseur qui est utilisé techniquement ; l'utilisateur ne voit que
   « téléphone + code »).
2. **Supabase** : SQL Editor → coller et exécuter
   `supabase-sql/migration_v18_akwaba_firebase.sql` (une seule fois).
3. **Supabase Edge Function** : Edge Functions → Create a function → nom
   `admin-api` → coller le contenu de
   `supabase-edge-function/admin-api/index.ts` → Deploy.
4. **Paiement réel** : quand vous m'enverrez l'API de paiement, je la
   brancherai à l'écran `Paiement` (le point d'intégration est déjà repéré
   dans le code par un commentaire).
5. **APK** : poussez ce code sur votre dépôt GitHub (branche `main`) ou
   lancez manuellement le workflow **Construire l'APK Alerte CI** depuis
   l'onglet Actions — il recompile désormais `app.js` à partir du code
   source à chaque fois, automatiquement.

## Une chose à valider avec vous

Le mois Akwaba terminé, l'abonnement conditionne l'accès à **Alerte
Violence** *et* Alerte Enlèvement, comme demandé. Comme Alerte Violence est
la fonction d'urgence la plus critique de l'app, vérifiez que ce choix vous
convient toujours avant mise en production — je peux facilement exempter
Alerte Violence du blocage (garder Alerte Violence gratuite en permanence,
Enlèvement seule en Premium) si vous préférez.
