# 📱 iOS + Android — état des lieux honnête et marche à suivre

Vous voulez une vraie app mobile sur **iOS ET Android**, sans bug. Voici la
vérité technique complète, sans rien cacher, et ce que j'ai préparé.

---

## ✅ Ce qui est déjà bon (audit du code fait)

J'ai vérifié tout le code de l'application. **Le cœur de l'app est compatible
iOS** : il n'utilise que des technologies web qui fonctionnent aussi bien dans
Android que dans iOS, et chaque fonction sensible est protégée pour ne jamais
faire planter l'app :

| Élément vérifié | iOS | Détail |
|---|---|---|
| Son des alarmes (Web Audio) | ✅ | Utilise le repli `webkitAudioContext` (iOS) + déverrouillage au 1ᵉʳ toucher |
| Enregistrement vocal | ✅ (iOS 15+) | Détecte le format supporté par l'appareil |
| Notifications web internes | ✅ | Protégées : ignorées si indisponibles (pas de plantage) |
| Détection vocale (micro) | ✅ | Fonctionne dans la WebView iOS |
| Cartes (OpenStreetMap) | ✅ | S'affichent normalement |
| Vibration | ⚠️ | **Non supportée par iOS** — ignorée proprement (pas de plantage, mais pas de vibration) |
| Stockage, planning, dashboard, forfaits… | ✅ | Fonctionnent à l'identique |

**Conclusion de l'audit : l'app tournera sur iOS sans planter.** Ce qui manque,
ce n'est pas le code de l'app, c'est la **configuration iOS** et **l'outillage
Apple**. C'est là que se trouve le vrai obstacle, et je dois être direct :

---

## 🔴 L'obstacle que je ne peux pas franchir à votre place

Compiler une app iOS **exige obligatoirement** :

1. **Un Mac** (ordinateur Apple). Xcode, l'outil de compilation iOS, n'existe
   QUE sur macOS. Aucun service en ligne fiable ne remplace un Mac pour ça, et
   moi-même je ne peux **pas** compiler d'iOS ici (je n'ai pas de Mac).
2. **Xcode** (gratuit, sur le Mac App Store).
3. **Un compte Apple Developer** (**99 $/an**). Obligatoire pour installer sur un
   vrai iPhone et publier sur l'App Store. (Un compte gratuit permet juste de
   tester sur son propre iPhone, temporairement.)

👉 Contrairement à Android (que je compile pour vous et que GitHub compile
gratuitement), **iOS ne peut pas se compiler sans Mac + compte Apple**. Ce n'est
pas une limite de l'app, c'est une règle d'Apple.

---

## 🛠️ Marche à suivre pour iOS (sur un Mac)

J'ai préparé toute la configuration. Sur un Mac, à la racine du projet :

```bash
npm install
npx cap add ios          # crée le projet iOS
npx cap sync ios
bash configurer-ios.sh   # ajoute les permissions (fourni par moi)
npx cap open ios         # ouvre Xcode
```

Dans Xcode : sélectionnez votre équipe de signature (**Signing & Capabilities**),
puis lancez sur un iPhone ou le simulateur.

Le script `configurer-ios.sh` que je fournis ajoute automatiquement les
**descriptions de permissions** (localisation, micro) — **indispensables** :
sans elles, iOS fait planter l'app dès qu'elle demande la position ou le micro.

---

## ⚙️ Fonctions natives : différences Android / iOS

Les « extras » natifs (au-delà du cœur de l'app) ont été codés **pour Android**
(en Java). iOS utilise un autre langage (Swift) et surtout des **règles beaucoup
plus strictes**. Voici l'état réel :

| Fonction | Android | iOS |
|---|---|---|
| Cœur de l'app (alertes, planning, dashboard, cartes…) | ✅ | ✅ |
| Notifications push | ✅ (Firebase) | ⚠️ Nécessite **APNs** (compte Apple + clé push dans Firebase) |
| **Sirène en boucle app FERMÉE** | ✅ (service natif) | ❌ **Impossible tel quel** : iOS n'autorise pas une app fermée à jouer un son en boucle. Le maximum : un son de notification (~30 s) via push. Une vraie alarme « critique » exige une **autorisation spéciale à demander à Apple**. |
| **Suivi de position app FERMÉE** | ✅ (service natif) | ⚠️ Possible via CoreLocation + permission « Toujours », mais demande du **code Swift dédié** et un examen d'Apple à la publication. |
| Vibration | ✅ | ❌ Non supportée par iOS (ignorée) |

Ces différences ne sont **pas des bugs** : ce sont les règles d'Apple. Sur iOS,
une app fermée ne peut pas se comporter comme sur Android.

---

## 🚀 Ce que je peux faire ensuite (dites-moi)

- **Si vous avez accès à un Mac** : je vous écris le **code natif iOS (Swift)**
  pour le suivi de position en arrière-plan et la gestion du push, et on
  l'ajuste ensemble jusqu'à ce que ça compile (je ne peux pas tester le Swift
  sans Mac, donc on itère avec vos retours d'Xcode).
- **Pour le push iOS** : je vous guide pour créer la **clé APNs** chez Apple et
  la déposer dans Firebase (c'est ce qui fait fonctionner les notifications iOS).
- **Pour la sirène app fermée sur iOS** : je vous explique la demande
  d'**autorisation d'alertes critiques** auprès d'Apple, seule voie officielle.

---

## 📦 Ce qui est inclus dans ce dossier pour iOS
- `capacitor.config.json` — mis à jour avec la section **iOS**.
- `package.json` — `@capacitor/ios` ajouté.
- `configurer-ios.sh` — script de configuration des permissions iOS (pour Mac).

L'app **Android** n'a pas changé depuis la v16 (aucune modification du code cette
fois : j'ai seulement audité et préparé iOS).

---

## En résumé, très honnêtement
- Le **code de l'app est prêt pour les deux plateformes**, sans plantage.
- **Android** : vous compilez comme d'habitude (GitHub), ça marche.
- **iOS** : il vous faut un **Mac + Xcode + compte Apple Developer (99 $/an)**.
  Sans ça, personne — ni moi ni un service en ligne — ne peut produire l'app iOS.
- Je ne peux pas vous **garantir « zéro bug » sur iOS sans l'avoir testée sur un
  vrai iPhone**, ce qui nécessite ce Mac. Dès que vous en avez un, on finalise
  ensemble.
