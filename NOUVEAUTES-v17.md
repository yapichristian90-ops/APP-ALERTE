# 🆕 Version v17 — Compatibilité iOS + Android (audit)

Cette version ne change PAS le fonctionnement de l'app. Elle prépare le
support iOS et corrige la configuration multiplateforme.

## Ce qui a été fait
- **Audit complet du code** pour iOS : toutes les fonctions sensibles (son des
  alarmes, enregistrement vocal, notifications, micro, cartes) sont compatibles
  iOS et protégées contre les plantages. Voir **GUIDE-iOS.md**.
- **capacitor.config.json** : section **iOS** ajoutée.
- **package.json** : `@capacitor/ios` ajouté.
- **configurer-ios.sh** : nouveau script (permissions iOS), à lancer sur un Mac.

## ⚠️ À lire absolument : GUIDE-iOS.md
Il explique honnêtement ce qui fonctionne sur iOS, et le fait que **compiler iOS
exige un Mac + Xcode + un compte Apple Developer (99 $/an)** — une règle d'Apple
que personne ne peut contourner, moi y compris (je ne peux pas compiler d'iOS).

## Android
Inchangé depuis la v16 (détection vocale permanente, forfaits/promos/bonus, etc.).

## ⚠️ Si l'Action GitHub devient ROUGE
Envoyez-moi le message d'erreur, je corrige.
