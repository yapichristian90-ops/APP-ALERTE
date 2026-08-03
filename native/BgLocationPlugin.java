package ci.alerteci.appli;

import android.content.Context;
import android.content.Intent;
import androidx.core.content.ContextCompat;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Pont entre le web et le service natif de localisation.
 * Utilisation côté web :
 *   window.Capacitor.Plugins.BgLocation.saveContext({ phone })
 *   window.Capacitor.Plugins.BgLocation.start({ phone, nom, alerteId, contacts })
 *   window.Capacitor.Plugins.BgLocation.stop()
 */
@CapacitorPlugin(name = "BgLocation")
public class BgLocationPlugin extends Plugin {

    @PluginMethod
    public void saveContext(PluginCall call) {
        String phone = call.getString("phone", "");
        getContext().getSharedPreferences("alerteci", Context.MODE_PRIVATE)
                .edit().putString("phone", phone).apply();
        call.resolve();
    }

    @PluginMethod
    public void start(PluginCall call) {
        String phone = call.getString("phone", "");
        String nom = call.getString("nom", "");
        String alerteId = call.getString("alerteId", "moi");
        String contacts = call.getString("contacts", "");

        // Mémorise le contexte pour pouvoir reprendre le suivi après un redémarrage.
        getContext().getSharedPreferences("alerteci", Context.MODE_PRIVATE).edit()
                .putString("phone", phone)
                .putString("nom", nom)
                .putString("alerteId", alerteId)
                .putString("contacts", contacts)
                .putBoolean("suivi_actif", true)
                .apply();

        Intent i = new Intent(getContext(), LocationForegroundService.class);
        i.putExtra("phone", phone);
        i.putExtra("nom", nom);
        i.putExtra("alerteId", alerteId);
        i.putExtra("contacts", contacts);
        try {
            ContextCompat.startForegroundService(getContext(), i);
        } catch (Exception e) {
            // ignore
        }
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getContext().getSharedPreferences("alerteci", Context.MODE_PRIVATE).edit()
                .putBoolean("suivi_actif", false).apply();
        Intent i = new Intent(getContext(), LocationForegroundService.class);
        i.setAction(LocationForegroundService.ACTION_STOP);
        try {
            getContext().startService(i);
        } catch (Exception e) {
            // ignore
        }
        call.resolve();
    }
}
