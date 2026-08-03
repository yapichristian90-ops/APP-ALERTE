#!/bin/bash
# ============================================================================
# ALERTE CI — Configuration iOS (à lancer sur un Mac, après `npx cap add ios`)
# ----------------------------------------------------------------------------
# Ajoute au fichier Info.plist les descriptions de permissions (obligatoires,
# sinon iOS fait planter l'app dès qu'elle demande la localisation ou le micro)
# et les modes d'arrière-plan.
#
# Usage (sur Mac, à la racine du projet) :
#   npx cap add ios
#   npx cap sync ios
#   bash configurer-ios.sh
#   npx cap open ios     # ouvre Xcode pour compiler
# ============================================================================
set -e

PLIST="ios/App/App/Info.plist"
if [ ! -f "$PLIST" ]; then
  echo "❌ Info.plist introuvable. Lancez d'abord : npx cap add ios"
  exit 1
fi

pb() { /usr/libexec/PlistBuddy -c "$1" "$PLIST" 2>/dev/null || true; }
set_str() { pb "Delete :$1"; pb "Add :$1 string $2"; }

echo "→ Descriptions de permissions"
set_str "NSLocationWhenInUseUsageDescription" "Alerte CI utilise votre position pour permettre à vos contacts de confiance de vous retrouver en cas de danger."
set_str "NSLocationAlwaysAndWhenInUseUsageDescription" "Alerte CI partage votre position en permanence avec vos contacts de confiance, même en arrière-plan, pour vous retrouver si vous êtes en danger."
set_str "NSLocationAlwaysUsageDescription" "Alerte CI partage votre position en permanence avec vos contacts de confiance."
set_str "NSMicrophoneUsageDescription" "Alerte CI utilise le micro pour la détection vocale d'urgence et l'enregistrement de notes vocales."

echo "→ Modes d'arrière-plan (localisation, audio, notifications)"
pb "Delete :UIBackgroundModes"
pb "Add :UIBackgroundModes array"
pb "Add :UIBackgroundModes:0 string location"
pb "Add :UIBackgroundModes:1 string audio"
pb "Add :UIBackgroundModes:2 string remote-notification"
pb "Add :UIBackgroundModes:3 string fetch"

echo "→ Autoriser le chargement des cartes (OpenStreetMap) et Supabase"
pb "Delete :NSAppTransportSecurity"
pb "Add :NSAppTransportSecurity dict"
pb "Add :NSAppTransportSecurity:NSAllowsArbitraryLoads bool true"

echo "✅ Info.plist configuré. Ouvrez Xcode avec : npx cap open ios"
echo "   Dans Xcode : Signing & Capabilities → ajoutez « Push Notifications »"
echo "   et « Background Modes » (Location updates, Audio, Remote notifications)."
