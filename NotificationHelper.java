package ci.alerteci.appli;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

/**
 * Notifications classiques (sans sirène) : informations diffusées par un
 * service public vers les citoyens, et signalements citoyens vers un service.
 * Fonctionne même lorsque l'application est fermée.
 */
public class NotificationHelper {

    public static final String CHANNEL_INFO = "alerte_infos";
    private static int compteur = 5000;

    public static void afficher(Context ctx, String titre, String corps, boolean prioritaire) {
        try {
            NotificationManager nm =
                    (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel ch = new NotificationChannel(
                        CHANNEL_INFO,
                        "Informations et signalements",
                        NotificationManager.IMPORTANCE_HIGH);
                ch.setDescription("Informations des services publics et signalements citoyens");
                ch.enableVibration(true);
                nm.createNotificationChannel(ch);
            }

            int piFlags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) piFlags |= PendingIntent.FLAG_IMMUTABLE;

            Intent openIntent = new Intent(ctx, MainActivity.class);
            openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent openPi = PendingIntent.getActivity(ctx, 7, openIntent, piFlags);

            Notification.Builder b;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                b = new Notification.Builder(ctx, CHANNEL_INFO);
            } else {
                b = new Notification.Builder(ctx);
            }
            b.setContentTitle(titre == null ? "Alerte CI" : titre)
                    .setContentText(corps == null ? "" : corps)
                    .setStyle(new Notification.BigTextStyle().bigText(corps == null ? "" : corps))
                    .setSmallIcon(prioritaire
                            ? android.R.drawable.ic_dialog_email
                            : android.R.drawable.ic_dialog_info)
                    .setContentIntent(openPi)
                    .setAutoCancel(true);

            nm.notify(compteur++, b.build());
        } catch (Exception e) {
            // ignore
        }
    }
}
