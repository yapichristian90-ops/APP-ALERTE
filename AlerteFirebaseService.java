package ci.alerteci.appli;

import android.content.Intent;
import androidx.core.content.ContextCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.util.Map;

/**
 * Reçoit les messages Firebase (FCM), y compris quand l'application est
 * fermée ou en arrière-plan, et démarre la sirène pour les alertes d'urgence.
 */
public class AlerteFirebaseService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        if (data == null) return;

        String type = data.get("type");
        boolean urgence = "urgence".equals(type) || "true".equals(data.get("urgence"));

        String title = data.get("title");
        String body = data.get("body");

        if (!urgence) {
            // Information d'un service public ou signalement citoyen :
            // notification classique (pas de sirène), même application fermée.
            if ("info_publique".equals(type) || "signalement".equals(type)) {
                NotificationHelper.afficher(
                        this,
                        title != null ? title : "Alerte CI",
                        body != null ? body : "",
                        "signalement".equals(type));
            }
            return;
        }

        // Si l'app est déjà au premier plan, le web joue déjà l'alarme : on évite le doublon.
        if (MainActivity.isForeground) return;

        Intent i = new Intent(this, SireneService.class);
        if (title != null) i.putExtra("title", title);
        if (body != null) i.putExtra("body", body);
        try {
            ContextCompat.startForegroundService(this, i);
        } catch (Exception e) {
            // ignore
        }
    }

    @Override
    public void onNewToken(String token) {
        // Le jeton est aussi enregistré côté web. Ici, on l'enregistre depuis le
        // natif si le numéro de l'utilisateur est connu (défini par le web via saveContext).
        try {
            String phone = getSharedPreferences("alerteci", MODE_PRIVATE).getString("phone", "");
            if (phone != null && phone.length() >= 8) {
                SupabaseHelper.saveToken(token, phone);
            }
        } catch (Exception e) {
            // ignore
        }
    }
}
