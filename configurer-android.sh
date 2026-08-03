#!/bin/bash
set -e
echo "=== Configuration Android Alerte CI ==="

MANIFEST="android/app/src/main/AndroidManifest.xml"

# ── Permissions ──
add_perm() {
  local perm="$1"
  if ! grep -q "android.permission.$perm" "$MANIFEST"; then
    sed -i "s#<application#<uses-permission android:name=\"android.permission.$perm\" />\n    <application#" "$MANIFEST"
    echo "  + $perm"
  fi
}
add_perm "INTERNET"
add_perm "ACCESS_NETWORK_STATE"
add_perm "RECORD_AUDIO"
add_perm "MODIFY_AUDIO_SETTINGS"
add_perm "ACCESS_FINE_LOCATION"
add_perm "ACCESS_BACKGROUND_LOCATION"
add_perm "ACCESS_COARSE_LOCATION"
add_perm "POST_NOTIFICATIONS"
add_perm "VIBRATE"
add_perm "WAKE_LOCK"
add_perm "FOREGROUND_SERVICE"
add_perm "FOREGROUND_SERVICE_LOCATION"
add_perm "FOREGROUND_SERVICE_MEDIA_PLAYBACK"
add_perm "RECEIVE_BOOT_COMPLETED"
add_perm "SCHEDULE_EXACT_ALARM"
add_perm "USE_EXACT_ALARM"

# ── Firebase google-services.json ──
cp google-services.json android/app/google-services.json
echo "  google-services.json copié"

# ── Plugin Google Services dans build.gradle ──
if ! grep -q "com.google.gms.google-services" android/app/build.gradle; then
  echo "apply plugin: 'com.google.gms.google-services'" >> android/app/build.gradle
fi
if ! grep -q "com.google.gms:google-services" android/build.gradle; then
  sed -i "/dependencies {/a\\        classpath 'com.google.gms:google-services:4.4.2'" android/build.gradle
fi
if ! grep -q "firebase-messaging" android/app/build.gradle; then
  sed -i "/dependencies {/a\\    implementation 'com.google.firebase:firebase-messaging:24.0.0'" android/app/build.gradle
fi

# ── Icône de l'app (si fournie dans android-res) ──
if [ -d "android-res" ]; then
  cp -r android-res/* android/app/src/main/res/ 2>/dev/null || true
  echo "  icônes copiées"
fi

# ── Son de sirène ──
if [ -f "sirene.wav" ]; then
  mkdir -p android/app/src/main/res/raw
  cp sirene.wav android/app/src/main/res/raw/sirene.wav
  echo "  sirene.wav copié"
fi

# ── Code natif (sirène en boucle + suivi de position en arrière-plan) ──
PKG_DIR="android/app/src/main/java/ci/alerteci/appli"
if [ -d "native" ]; then
  mkdir -p "$PKG_DIR"
  cp native/*.java "$PKG_DIR"/
  echo "  fichiers natifs copiés (dont MainActivity)"
fi

# ── Enregistrement des services natifs dans le manifeste ──
python3 - "$MANIFEST" <<'PYEOF'
import sys
p = sys.argv[1]
s = open(p, encoding='utf-8').read()
services = '''
        <service android:name=".AlerteFirebaseService" android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
        <service android:name=".SireneService" android:exported="false" android:foregroundServiceType="mediaPlayback" />
        <service android:name=".LocationForegroundService" android:exported="false" android:foregroundServiceType="location" />
        <receiver android:name=".BootReceiver" android:exported="true" android:enabled="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>
'''
if '.AlerteFirebaseService' not in s and '</application>' in s:
    s = s.replace('</application>', services + '    </application>')
    open(p, 'w', encoding='utf-8').write(s)
    print("  services natifs enregistrés dans le manifeste")
else:
    print("  services natifs déjà présents (ou </application> introuvable)")
PYEOF

echo "=== Configuration terminée ==="
