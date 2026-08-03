package ci.alerteci.appli;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.os.VibrationEffect;
import android.os.Vibrator;

/**
 * Sirène d'alerte : joue sirene.wav EN BOUCLE + vibration, via un service de
 * premier plan, jusqu'à ce que l'utilisateur appuie sur « Arrêter l'alarme ».
 * Fonctionne même lorsque l'application est fermée.
 */
public class SireneService extends Service {

    public static final String CHANNEL_ID = "alerte_sirene";
    public static final String ACTION_STOP = "ci.alerteci.appli.STOP_SIREN";
    private static final int NOTIF_ID = 4242;

    private MediaPlayer player;
    private Vibrator vibrator;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopSelf();
            return START_NOT_STICKY;
        }
        String title = (intent != null && intent.getStringExtra("title") != null)
                ? intent.getStringExtra("title") : "\uD83D\uDEA8 ALERTE CI";
        String body = (intent != null && intent.getStringExtra("body") != null)
                ? intent.getStringExtra("body") : "Une personne a besoin d'aide. Ouvrez l'application.";
        startForegroundWithNotif(title, body);
        startSiren();
        return START_STICKY;
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel ch = new NotificationChannel(
                    CHANNEL_ID, "Alerte d'urgence", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Sir\u00E8ne d'alerte d'urgence");
            ch.setSound(null, null); // le son est joué par le MediaPlayer (boucle)
            if (nm != null) nm.createNotificationChannel(ch);
        }
    }

    private void startForegroundWithNotif(String title, String body) {
        createChannel();

        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) piFlags |= PendingIntent.FLAG_IMMUTABLE;

        Intent stopIntent = new Intent(this, SireneService.class);
        stopIntent.setAction(ACTION_STOP);
        PendingIntent stopPi = PendingIntent.getService(this, 1, stopIntent, piFlags);

        Intent openIntent = new Intent(this, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPi = PendingIntent.getActivity(this, 2, openIntent, piFlags);

        Notification.Builder b;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            b = new Notification.Builder(this, CHANNEL_ID);
        } else {
            b = new Notification.Builder(this);
        }
        b.setContentTitle(title)
                .setContentText(body)
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setContentIntent(openPi)
                .setOngoing(true)
                .setAutoCancel(false)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Arr\u00EAter l'alarme", stopPi);

        Notification notif = b.build();
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(NOTIF_ID, notif,
                        android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
            } else {
                startForeground(NOTIF_ID, notif);
            }
        } catch (Exception e) {
            // Démarrage en premier plan refusé : on tente une notification simple.
            try {
                NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null) nm.notify(NOTIF_ID, notif);
            } catch (Exception ex) {
                // ignore
            }
        }
    }

    private void startSiren() {
        try {
            player = new MediaPlayer();
            AudioAttributes attrs = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build();
            player.setAudioAttributes(attrs);
            int resId = getResources().getIdentifier("sirene", "raw", getPackageName());
            if (resId != 0) {
                AssetFileDescriptor afd = getResources().openRawResourceFd(resId);
                player.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                afd.close();
                player.setLooping(true);
                player.prepare();
                player.start();
            }
        } catch (Exception e) {
            // ignore
        }
        try {
            vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (vibrator != null) {
                long[] pattern = {0, 600, 400};
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(VibrationEffect.createWaveform(pattern, 0));
                } else {
                    vibrator.vibrate(pattern, 0);
                }
            }
        } catch (Exception e) {
            // ignore
        }
    }

    @Override
    public void onDestroy() {
        try {
            if (player != null) {
                player.stop();
                player.release();
                player = null;
            }
        } catch (Exception e) {
            // ignore
        }
        try {
            if (vibrator != null) vibrator.cancel();
        } catch (Exception e) {
            // ignore
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
