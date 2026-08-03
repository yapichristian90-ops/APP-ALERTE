# 🟢 Compiler l'application Alerte CI — 4 étapes

> Durée : ~10 minutes. Aucune connaissance technique requise.
> Ne lisez que ce fichier.

---

## Étape 1 — Créer un espace sur GitHub
1. Allez sur **github.com**, créez un compte gratuit si besoin.
2. En haut à droite : **+** → **New repository**.
3. Nom : **alerte-ci**. Cochez **Private**. Cliquez **Create repository**.

## Étape 2 — Déposer les fichiers
1. Sur la page : cliquez **uploading an existing file**.
2. Ouvrez le dossier que je vous ai envoyé, sélectionnez **tout** (Ctrl+A),
   glissez-le dans la zone de dépôt.
3. En bas : bouton vert **Commit changes**.

## Étape 3 — Ajouter l'instruction de compilation
1. Onglet **Actions** en haut.
2. Cliquez **set up a workflow yourself**.
3. **Effacez tout**, puis ouvrez **workflow-a-copier.txt**, copiez tout,
   collez dans l'éditeur GitHub.
4. Bouton vert **Commit changes...** → **Commit changes**.

## Étape 4 — Récupérer l'application
1. Onglet **Actions**. Attendez que le rond devienne **vert ✅** (~5 min).
2. Cliquez sur la ligne, descendez à **Artifacts** → **alerte-ci-app**.
3. Le fichier `.zip` téléchargé contient **app-debug.apk**.
4. Installez-le sur le téléphone (désinstallez l'ancienne version d'abord).

---

## ❌ Si un rond devient ROUGE
Cliquez dessus, faites une capture d'écran et envoyez-la moi.
