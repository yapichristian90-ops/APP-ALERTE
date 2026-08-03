package ci.alerteci.appli;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import androidx.core.content.ContextCompat;

/**
 * Après un redémarrage du téléphone, reprend automatiquement le suivi de
 * position si l'utilisateur l'avait activé (contacts de confiance enregistrés).
 * Sans cela, une personne disparue deviendrait introuvable dès que son
 * téléphone redémarre.
 */
public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || intent.getAction() == null) return;
        String action = intent.getAction();
        if (!Intent.ACTION_BOOT_COMPLETED.equals(action)
                && !"android.intent.action.QUICKBOOT_POWERON".equals(action)) {
            return;
        }
        try {
            SharedPreferences sp = context.getSharedPreferences("alerteci", Context.MODE_PRIVATE);
            if (!sp.getBoolean("suivi_actif", false)) return;

            String contacts = sp.getString("contacts", "");
            if (contacts == null || contacts.length() == 0) return;

            Intent i = new Intent(context, LocationForegroundService.class);
            i.putExtra("phone", sp.getString("phone", ""));
            i.putExtra("nom", sp.getString("nom", ""));
            i.putExtra("alerteId", sp.getString("alerteId", "moi"));
            i.putExtra("contacts", contacts);
            ContextCompat.startForegroundService(context, i);
        } catch (Exception e) {
            // ignore
        }
    }
}
