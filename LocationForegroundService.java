package ci.alerteci.appli;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Looper;

/**
 * Suivi de position en arrière-plan : envoie la position GPS à Supabase toutes
 * les ~15 s, même lorsque l'application est fermée, pour que les contacts de
 * confiance puissent retrouver la personne. S'arrête sur action « Arrêter ».
 */
public class LocationForegroundService extends Service implements LocationListener {

    public static final String CHANNEL_ID = "alerte_position";
    public static final String ACTION_STOP = "ci.alerteci.appli.STOP_LOC";
    private static final int NOTIF_ID = 4243;

    private LocationManager lm;
    private String phone = "";
    private String nom = "";
    private String[] cibles = new String[0];
    private String alerteId = "moi";
    private long lastPost = 0;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopSelf();
            return START_NOT_STICKY;
        }
        if (intent != null) {
            phone = intent.getStringExtra("phone") != null ? intent.getStringExtra("phone") : "";
            nom = intent.getStringExtra("nom") != null ? intent.getStringExtra("nom") : "";
            alerteId = intent.getStringExtra("alerteId") != null ? intent.getStringExtra("alerteId") : "moi";
            String cs = intent.getStringExtra("contacts");
            cibles = (cs != null && cs.length() > 0) ? cs.split(",") : new String[0];
        }
        startForegroundWithNotif();
        startUpdates();
        return START_STICKY;
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel ch = new NotificationChannel(
                    CHANNEL_ID, "Partage de position", NotificationManager.IMPORTANCE_LOW);
            ch.setDescription("Votre position est partag\u00E9e avec vos contacts de confiance");
            if (nm != null) nm.createNotificationChannel(ch);
        }
    }

    private void startForegroundWithNotif() {
        createChannel();

        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) piFlags |= PendingIntent.FLAG_IMMUTABLE;

        Intent stopIntent = new Intent(this, LocationForegroundService.class);
        stopIntent.setAction(ACTION_STOP);
        PendingIntent stopPi = PendingIntent.getService(this, 3, stopIntent, piFlags);

        Intent openIntent = new Intent(this, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openPi = PendingIntent.getActivity(this, 4, openIntent, piFlags);

        Notification.Builder b;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            b = new Notification.Builder(this, CHANNEL_ID);
        } else {
            b = new Notification.Builder(this);
        }
        b.setContentTitle("Partage de position actif")
                .setContentText("Vos contacts de confiance peuvent vous localiser.")
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setContentIntent(openPi)
                .setOngoing(true)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Arr\u00EAter le partage", stopPi);

        Notification notif = b.build();
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(NOTIF_ID, notif,
                        android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
            } else {
                startForeground(NOTIF_ID, notif);
            }
        } catch (Exception e) {
            try {
                stopSelf();
            } catch (Exception ex) {
                // ignore
            }
        }
    }

    private void startUpdates() {
        try {
            lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            if (lm == null) return;
            if (androidx.core.content.ContextCompat.checkSelfPermission(this,
                    android.Manifest.permission.ACCESS_FINE_LOCATION)
                    != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                return;
            }
            if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 15000, 5, this, Looper.getMainLooper());
            }
            if (lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 15000, 5, this, Looper.getMainLooper());
            }
        } catch (Exception e) {
            // ignore
        }
    }

    @Override
    public void onLocationChanged(Location location) {
        if (location == null) return;
        long now = System.currentTimeMillis();
        if (now - lastPost < 12000) return;
        lastPost = now;
        SupabaseHelper.publishPosition(phone, nom, cibles,
                location.getLatitude(), location.getLongitude(),
                (int) location.getAccuracy(), alerteId);
    }

    @Override public void onProviderEnabled(String provider) { }
    @Override public void onProviderDisabled(String provider) { }
    @Override public void onStatusChanged(String provider, int status, Bundle extras) { }

    @Override
    public void onDestroy() {
        try {
            if (lm != null) lm.removeUpdates(this);
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
