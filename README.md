# ALERTE Côte d'Ivoire

Application mobile de sécurité personnelle pour la Côte d'Ivoire : **Alerte
Violence** (déclenchement discret ou manuel, sirène et position envoyées aux
contacts d'urgence) et **Alerte Enlèvement** (localisation en temps réel
partagée avec des numéros de confiance). Réécrite intégralement en **React
Native + Expo Router (TypeScript)**, compatible **iOS et Android** à partir
d'une seule base de code.

## Design

Le design a été entièrement redessiné à partir du logo fourni (bouclier
dégradé orange avec repère de localisation, `branding/icon-192.png`) : une
palette orange chaleureuse pour l'identité générale, une teinte rouge dédiée
aux écrans Alerte Violence, une teinte bleue pour Alerte Enlèvement, une
typographie système large et lisible, et des composants réutilisables
(`src/components`) formant un mini design-system cohérent. Voir
`src/theme/colors.ts`.

## Architecture

```
app/                      Écrans (Expo Router — routage par fichiers)
  index.tsx                Écran de lancement (logo, redirection selon session)
  (auth)/                  Inscription, connexion, forfait, paiement, CGU
  (app)/                   Onglets Accueil / Profil une fois connecté
    home/violence/         Alerte Violence (SOS, cri discret, contacts)
    home/kidnap/           Alerte Enlèvement (recherche, carte, confiance)
    profile/                Profil, FAQ, abonnement
  legal/                   CGU et Politique de Confidentialité (lecture libre)
  alerte-recue/[alertId]   Écran plein écran reçu par un contact d'urgence
  admin/                   Tableau de bord administrateur — jamais lié
                            depuis la navigation utilisateur

src/
  theme/                   Couleurs, typographie, espacements
  components/              Composants UI réutilisables
  services/                Accès Supabase (auth, alertes, paiement, position…)
  store/                   État global (zustand) : session utilisateur, admin
  constants/                Communes, validation téléphone, FAQ, textes légaux

supabase/
  schema.sql               Schéma PostgreSQL complet + Row Level Security
  functions/                Fonctions Edge (Deno) : alertes, recherche, paiement, admin

legal/                     CGU.md et POLITIQUE_CONFIDENTIALITE.md (sources)
```

## Choix techniques clés

- **Expo Router** pour une navigation par fichiers claire et un déploiement
  iOS/Android/Web unifié.
- **Supabase** (PostgreSQL + Auth + Edge Functions + Realtime) comme backend.
  L'inscription « numéro de téléphone + code secret » repose en réalité sur
  Supabase Auth (email/mot de passe), le numéro étant converti en un email
  technique invisible pour l'utilisateur (`src/services/auth.ts`). Cela
  fournit gratuitement un hachage sécurisé du code secret, un `auth.uid()`
  fiable pour les policies RLS, et le Realtime pour les alertes instantanées.
- **Row Level Security stricte** : chaque utilisateur ne voit que ses
  propres données ; un contact d'urgence ne voit que les alertes qui lui
  sont destinées ; une recherche Alerte Enlèvement n'aboutit que si le
  demandeur est un numéro de confiance déclaré par la personne recherchée
  (voir `supabase/schema.sql`).
- **Notifications push (Expo Push API)** pour réveiller l'écran d'alerte
  plein écran et la sirène chez les contacts, même application fermée.
- **Détection du cri discret** : heuristique de niveau sonore locale (aucun
  audio envoyé au serveur), voir le commentaire détaillé dans
  `src/services/screamDetector.ts`. Ce n'est pas un modèle de classification
  vocale ; une évolution possible serait un modèle on-device (TensorFlow
  Lite) pour réduire les faux positifs.

## Configuration du backend (à faire avant la première exécution)

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Exécuter `supabase/schema.sql` dans l'éditeur SQL du projet.
3. Déployer les fonctions Edge (`supabase functions deploy <nom>` pour
   chaque dossier de `supabase/functions/`, avec la Supabase CLI).
4. Renseigner les variables d'environnement Expo (fichier `.env` local, non
   commité) :
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxx
   ```
5. **Créer le premier administrateur principal** : après avoir créé un
   compte utilisateur normal depuis l'application avec le numéro qui doit
   administrer la plateforme, insérer manuellement une ligne dans
   `admin_roles` via l'éditeur SQL Supabase :
   ```sql
   insert into admin_roles (id, full_name, phone, role, status)
   values ('<uuid de auth.users>', 'Nom Complet', '+225XXXXXXXXXX', 'admin_principal', 'actif');
   ```
   Tous les éditeurs suivants sont ensuite invités depuis le tableau de bord
   (`/admin/editors`) par cet administrateur principal.

## Paiement mobile money (Orange Money, MTN Money, Moov Money, Wave)

Aucun identifiant marchand réel n'est fourni dans ce projet (impossible à
générer sans compte réel). `supabase/functions/initiate-payment/index.ts`
contient la logique prête à brancher sur un agrégateur ivoirien (CinetPay ou
PayDunya couvrent les quatre moyens de paiement avec un seul contrat) : le
paiement est créé en base en statut `en_attente`, et
`supabase/functions/payment-webhook/index.ts` l'active dès réception de la
confirmation du prestataire.

## Lancer le projet

```bash
npm install
npx expo start        # puis 'i' pour iOS, 'a' pour Android
```

## Conformité App Store / Play Store

- `legal/CGU.md` et `legal/POLITIQUE_CONFIDENTIALITE.md` couvrent les
  points exigés par Apple et Google (données collectées, finalités,
  permissions, droits de l'utilisateur, suppression de compte).
- Les permissions sensibles (position en arrière-plan, microphone) ont
  chacune un texte de justification dédié dans `app.json`
  (`NSLocationAlwaysAndWhenInUseUsageDescription`,
  `NSMicrophoneUsageDescription`, etc.), requis pour la validation Apple.
- Avant publication : renseigner une vraie clé Google Maps Android dans
  `app.json` (`android.config.googleMaps.apiKey`), héberger les documents
  légaux sur une URL publique (les stores demandent un lien), et créer les
  visuels de store (captures d'écran, icône 1024×1024) à partir de
  `branding/`.
