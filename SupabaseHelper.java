package ci.alerteci.appli;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

/** Envoi de données vers Supabase depuis le natif (jetons FCM, positions GPS). */
public class SupabaseHelper {

    static final String URL_BASE = "https://dgwxyhtmuighwknchrae.supabase.co";
    static final String ANON =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnd3h5aHRtdWlnaHdrbmNocmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDY5MDAsImV4cCI6MjA5NzgyMjkwMH0.JJyoRXBqQYedgRbU_HdJEMyTo4xYtWH0HBSVdollAJ8";

    static void post(final String path, final String jsonBody) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                HttpURLConnection c = null;
                try {
                    URL u = new URL(URL_BASE + "/rest/v1/" + path);
                    c = (HttpURLConnection) u.openConnection();
                    c.setRequestMethod("POST");
                    c.setConnectTimeout(10000);
                    c.setReadTimeout(10000);
                    c.setDoOutput(true);
                    c.setRequestProperty("Content-Type", "application/json");
                    c.setRequestProperty("apikey", ANON);
                    c.setRequestProperty("Authorization", "Bearer " + ANON);
                    c.setRequestProperty("Prefer", "return=minimal");
                    OutputStream os = c.getOutputStream();
                    os.write(jsonBody.getBytes("UTF-8"));
                    os.flush();
                    os.close();
                    c.getResponseCode();
                } catch (Exception e) {
                    // ignore
                } finally {
                    if (c != null) c.disconnect();
                }
            }
        }).start();
    }

    static void saveToken(String token, String phone) {
        try {
            JSONObject o = new JSONObject();
            o.put("token", token);
            o.put("telephone", phone);
            o.put("plateforme", "android");
            post("device_tokens", o.toString());
        } catch (Exception e) {
            // ignore
        }
    }

    static void publishPosition(String phone, String nom, String[] cibles,
                                double lat, double lng, int precision, String alerteId) {
        try {
            JSONObject gps = new JSONObject();
            gps.put("lat", lat);
            gps.put("lng", lng);
            gps.put("precision", precision);

            JSONObject victime = new JSONObject();
            victime.put("nm", nom == null ? "" : nom);
            victime.put("ph", phone);

            JSONArray arr = new JSONArray();
            if (cibles != null) {
                for (String cc : cibles) {
                    if (cc != null && cc.length() > 0) arr.put(cc);
                }
            }

            JSONObject payload = new JSONObject();
            payload.put("type", "gps");
            payload.put("tracking", true);
            payload.put("urgence", false);
            payload.put("alerteId", alerteId);
            payload.put("victime", victime);
            payload.put("cibles", arr);
            payload.put("gps", gps);
            payload.put("lienMaps", "https://maps.google.com/?q=" + lat + "," + lng);
            payload.put("ts", System.currentTimeMillis());

            JSONObject row = new JSONObject();
            row.put("payload", payload);
            post("diffusions", row.toString());
        } catch (Exception e) {
            // ignore
        }
    }
}
