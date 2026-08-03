package ci.alerteci.appli;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {

    /** Indique si l'app est au premier plan (pour éviter de doubler l'alarme). */
    public static boolean isForeground = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BgLocationPlugin.class);
        super.onCreate(savedInstanceState);
        demanderPermissions();
    }

    /**
     * Demande les permissions nécessaires au démarrage :
     * - localisation (indispensable pour que la géolocalisation web ET le suivi
     *   fonctionnent : sans elle, aucune position n'est jamais envoyée) ;
     * - notifications (Android 13+) ;
     * puis la localisation en arrière-plan (« Toujours ») pour le suivi app fermée.
     */
    private void demanderPermissions() {
        try {
            List<String> aDemander = new ArrayList<>();

            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                aDemander.add(Manifest.permission.ACCESS_FINE_LOCATION);
                aDemander.add(Manifest.permission.ACCESS_COARSE_LOCATION);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                    && ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                aDemander.add(Manifest.permission.POST_NOTIFICATIONS);
            }

            if (!aDemander.isEmpty()) {
                ActivityCompat.requestPermissions(this, aDemander.toArray(new String[0]), 1001);
            } else {
                demanderLocalisationArrierePlan();
            }
        } catch (Exception e) {
            // ignore
        }
    }

    private void demanderLocalisationArrierePlan() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q
                    && ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                    == PackageManager.PERMISSION_GRANTED
                    && ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_BACKGROUND_LOCATION}, 1002);
            }
        } catch (Exception e) {
            // ignore
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1001) {
            demanderLocalisationArrierePlan();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        isForeground = true;
    }

    @Override
    public void onPause() {
        super.onPause();
        isForeground = false;
    }
}
