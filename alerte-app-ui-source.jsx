import { useState, useEffect, useRef } from "react";

const C = {
  orange:"#F97316",orangeL:"#FFF7ED",orangeD:"#C2410C",
  green:"#16A34A",greenL:"#F0FDF4",
  white:"#FFFFFF",off:"#FAFAF9",surf:"#F5F5F4",surfH:"#E7E5E4",
  ink:"#1C1917",muted:"#78716C",faint:"#A8A29E",border:"rgba(0,0,0,0.07)",
};

const VILLES_CI = ["Yopougon","Cocody","Abobo","Adjamé","Plateau","Marcory","Treichville","Port-Bouët","Koumassi","Attécoubé","Songon","Anyama","Bouaké","Daloa","San-Pédro","Yamoussoukro","Korhogo","Man","Abengourou","Divo","Gagnoa","Odienné","Bondoukou","Séguéla","Duekoué","Touba","Ferkessédougou","Bouna","Agboville","Sassandra","Grand-Bassam","Aboisso","Soubré","Guiglo","Issia","Sinfra","Dimbokro","Bangolo","Vavoua","Bongouanou","Tiébissou","Zuénoula","Boundiali","Danané","Lakota","Grand-Lahou","Jacqueville","Adzopé","Agnibilékrou","Akoupé","Bocanda","Daoukro","Guitry","Katiola","Mankono","Méagui","Oumé","Tabou","Tingrela"];

/* ── Types de service institutionnel proposés à l'inscription ──────────────
   Liste par défaut, modifiable depuis le tableau de bord admin (ajout ou
   retrait d'un type) via l'état typesServiceDisponibles au niveau racine. ── */
const TYPES_SERVICE_DEFAUT = ["Ministère","Mairie / Commune","Police","Gendarmerie","AGEROUTE","ANAGED","Hôpital et service de santé public","La Ligue","SODEXAM","Autres services et organisations"];

/* ── Config des écrans "service public" côté citoyen (Alerte Info) ─────────
   Chaque service (sauf SODEXAM, qui garde son écran météo dédié existant)
   obtient un écran générique permettant de RECEVOIR les diffusions de ce
   service précis et de lui ENVOYER un signalement — sur le même modèle que
   l'écran Effondrement (Ministère de la Construction). ── */
const SERVICES_PUBLICS_CONFIG = [
  {sc:"sp_ministere",  nom:"Ministère",                              ic:"building", c:"#C2410C", bg:"rgba(249,115,22,.15)", grad:"linear-gradient(145deg,#7C2D12,#C2410C)", desc:"Signalez une situation à transmettre directement au ministère concerné."},
  {sc:"sp_mairie",      nom:"Mairie / Commune",                       ic:"building", c:"#2563EB", bg:"rgba(59,130,246,.15)", grad:"linear-gradient(145deg,#1E3A8A,#2563EB)", desc:"Signalez un problème municipal (voirie, éclairage, déchets...) à votre mairie."},
  {sc:"sp_police",      nom:"Police",                                 ic:"shield2",  c:"#1D4ED8", bg:"rgba(29,78,216,.15)",  grad:"linear-gradient(145deg,#1E3A8A,#1D4ED8)", desc:"Signalez un fait nécessitant l'intervention de la police."},
  {sc:"sp_gendarmerie",nom:"Gendarmerie",                            ic:"shield2",  c:"#15803D", bg:"rgba(21,128,61,.15)",  grad:"linear-gradient(145deg,#14532D,#15803D)", desc:"Signalez un fait relevant de la gendarmerie nationale."},
  {sc:"sp_routier",     nom:"AGEROUTE",                                ic:"building", c:"#B45309", bg:"rgba(180,83,9,.15)",   grad:"linear-gradient(145deg,#78350F,#B45309)", desc:"Signalez un danger ou une dégradation sur le réseau routier."},
  {sc:"sp_anaged",      nom:"ANAGED",                                  ic:"building", c:"#15803D", bg:"rgba(21,128,61,.15)",  grad:"linear-gradient(145deg,#14532D,#15803D)", desc:"Signalez un problème de gestion des déchets (collecte, dépôt sauvage, insalubrité)."},
  {sc:"sp_sante",       nom:"Hôpital et service de santé public",     ic:"alert",    c:"#BE123C", bg:"rgba(190,18,60,.15)",  grad:"linear-gradient(145deg,#881337,#BE123C)", desc:"Signalez une urgence sanitaire ou un besoin d'assistance médicale."},
  {sc:"sp_ligue",       nom:"La Ligue",                               ic:"shield2",  c:"#7C3AED", bg:"rgba(124,58,237,.15)", grad:"linear-gradient(145deg,#4C1D95,#7C3AED)", desc:"Signalez une situation à transmettre à La Ligue."},
  {sc:"sp_autres",      nom:"Autres services et organisations",      ic:"star",     c:"#0E7490", bg:"rgba(14,116,144,.15)", grad:"linear-gradient(145deg,#164E63,#0E7490)", desc:"Signalez une situation à transmettre à un autre service ou organisation."},
];

/* ── Fonctionnalités masquées pour cette version ────────────────────────────
   Mon Planning, Alerte Info et les écrans Service Public restent codés et
   fonctionnels mais sont retirés de la navigation visible. Il suffira de
   repasser l'indicateur concerné à true pour les republier dans une future
   version, sans réécrire ce code. ── */
const FEATURES = { planning:false, alerteInfo:false, servicesPublics:false };

/* ── Sanitisation des saisies utilisateur ────────────────────────────────
   Retire balises HTML/scripts et caractères de contrôle, borne la longueur.
   Appliquée avant tout stockage local ou envoi au serveur (défense en
   profondeur : le serveur revalide aussi de son côté). ── */
const saneTxt = (s, max=300) => String(s??"")
  .replace(/<[^>]*>/g,"")
  .replace(/[\x00-\x1f\x7f]/g,"")
  .replace(/\s+/g," ")
  .trim()
  .slice(0, max);
const saneTel = (s) => String(s??"").replace(/\D/g,"").slice(0,10);
const saneCode = (s) => String(s??"").replace(/\D/g,"").slice(0,6);

/* ── Abonnement « Akwaba » ────────────────────────────────────────────────
   30 jours offerts à la création du compte, puis forfait annuel payant pour
   garder l'accès à Alerte Violence et Alerte Enlèvement. Le contenu et le
   fonctionnement des deux alertes eux-mêmes ne changent pas : seul l'accès
   est conditionné à l'abonnement. ── */
const PRIX_PREMIUM_FCFA = 3000;
const essaiEnCours = (u) => !!(u && u.essaiFin && Date.now() < new Date(u.essaiFin).getTime());
const abonnementActif = (u) => !!(u && u.premiumExpire && Date.now() < new Date(u.premiumExpire).getTime());
const accesPremiumActif = (u) => essaiEnCours(u) || abonnementActif(u);
const joursRestantsEssai = (u) => {
  if(!u || !u.essaiFin) return 0;
  return Math.max(0, Math.ceil((new Date(u.essaiFin).getTime()-Date.now())/(24*60*60*1000)));
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:700 800;font-display:swap;src:local('Plus Jakarta Sans')}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--eo:cubic-bezier(0.25,0.46,0.45,0.94);--eio:cubic-bezier(0.77,0,0.175,1);--esp:cubic-bezier(0.34,1.56,0.64,1);--or:#F97316;--gr:#16A34A}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#F5F5F4;min-height:100vh;min-height:100dvh;display:flex;align-items:flex-start;justify-content:center;padding:0}
.shell{width:100%;max-width:430px;min-height:100vh;min-height:100dvh;background:#FAFAF9;border-radius:0;overflow:hidden;box-shadow:none;display:flex;flex-direction:column;position:relative}
@media(min-width:480px){body{padding:2rem 1rem;background:#E5E7EB}
.shell{border-radius:40px;min-height:auto;box-shadow:0 32px 80px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06)}
}
@media(max-width:380px){.scrttl{font-size:17px!important}
.user-name{font-size:18px!important}
.grid{grid-template-columns:1fr 1fr!important}
.qa{grid-template-columns:repeat(2,1fr)!important}
}
.sbar{display:flex;align-items:center;justify-content:space-between;padding:14px 28px 0;font-size:12px;font-weight:600;color:#1C1917}
.scr{display:none;flex:1;flex-direction:column;opacity:0;transform:translateX(20px);transition:opacity 280ms var(--eo),transform 280ms var(--eo)}
.scr.on{display:flex;opacity:1;transform:translateX(0)}
.splash{background:linear-gradient(160deg,#1C1917 0%,#292524 60%,#1C1917 100%);min-height:100vh;align-items:center;justify-content:center;flex-direction:column;padding:3rem 2rem}
.orb{width:120px;height:120px;border-radius:50%;background:conic-gradient(from 0deg,#F97316,#16A34A,#fff,#F97316);display:flex;align-items:center;justify-content:center;position:relative;animation:spin 8s linear infinite;margin-bottom:2rem}
.orb::after{content:'';position:absolute;inset:3px;border-radius:50%;background:#1C1917}
.orb-txt{position:relative;z-index:1;font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff;letter-spacing:-1px}
@keyframes spin{to{transform:rotate(360deg)}
}
.stitle{font-family:'Sora',sans-serif;font-size:38px;font-weight:800;color:#fff;letter-spacing:-2px;text-align:center;line-height:1;margin-bottom:.5rem}
.stitle span{color:var(--or)}
.stag{font-size:15px;color:rgba(255,255,255,.5);text-align:center;margin-bottom:3rem}
.flag{display:flex;gap:5px;margin-bottom:3rem}
.fs{width:28px;height:6px;border-radius:3px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:16px 24px;border-radius:16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;border:none;transition:transform 140ms var(--eo),box-shadow 140ms var(--eo),background 180ms ease;-webkit-tap-highlight-color:transparent;width:100%;letter-spacing:.2px}
.btn:active{transform:scale(.97)}
@media(hover:hover)and(pointer:fine){.btn:hover{transform:translateY(-1px)}
}
.btn-p{background:var(--or);color:#fff;box-shadow:0 8px 24px rgba(249,115,22,.35)}
.btn-s{background:rgba(255,255,255,.08);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.12)}
.btn-g{background:#F5F5F4;color:#1C1917}
.btn-gr{background:var(--gr);color:#fff;box-shadow:0 8px 24px rgba(22,163,74,.3)}
.btn-pu{background:#7C3AED;color:#fff;box-shadow:0 8px 24px rgba(124,58,237,.3)}
.bnav{display:flex;background:rgba(255,255,255,.95);backdrop-filter:blur(12px);border-top:1px solid rgba(0,0,0,.07);padding:10px 8px 18px;gap:4px;position:sticky;bottom:0}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:14px;cursor:pointer;border:none;background:transparent;transition:background 180ms ease,transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.ni:active{transform:scale(.93)}
.ni.a{background:#FFF7ED}
.ni.a .nlb{color:var(--or)}
.nlb{font-size:10px;font-weight:600;color:#A8A29E;transition:color 180ms ease}
.hdr{padding:24px 24px 0;display:flex;align-items:center;justify-content:space-between}
.av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),#FB923C);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:#fff;border:none;cursor:pointer;transition:transform 140ms var(--esp)}
.av:active{transform:scale(.9)}
.bnr{margin:20px 20px 0;background:linear-gradient(135deg,#1C1917 0%,#292524 100%);border-radius:24px;padding:20px;position:relative;overflow:hidden}
.bnr::before{content:'';position:absolute;top:-30px;right:-20px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,.25) 0%,transparent 70%)}
.bl{font-size:11px;font-weight:700;color:var(--or);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
.bt{font-family:'Sora',sans-serif;font-size:18px;font-weight:800;color:#fff;letter-spacing:-.5px}
.bd{font-size:12px;color:rgba(255,255,255,.5);margin-top:4px;margin-bottom:14px;line-height:1.5}
.sbb{display:inline-flex;align-items:center;gap:6px;background:var(--or);color:#fff;font-size:13px;font-weight:700;padding:10px 18px;border-radius:12px;border:none;cursor:pointer;transition:transform 140ms var(--eo),box-shadow 140ms ease;box-shadow:0 4px 16px rgba(249,115,22,.4);font-family:'Plus Jakarta Sans',sans-serif}
.sbb:active{transform:scale(.96)}
.sh{padding:20px 24px 10px;display:flex;align-items:center;justify-content:space-between}
.stl{font-size:15px;font-weight:700;color:#1C1917}
.sea{font-size:12px;font-weight:600;color:var(--or);background:none;border:none;cursor:pointer}
.grid{padding:0 20px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fc{border-radius:22px;padding:18px 16px;cursor:pointer;border:none;text-align:left;transition:transform 180ms var(--eo),box-shadow 180ms ease;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}
.fc:active{transform:scale(.96)}
@media(hover:hover)and(pointer:fine){.fc:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.12)}
}
.fc.or{background:linear-gradient(145deg,#FFF7ED,#FFEDD5)}
.fc.gn{background:linear-gradient(145deg,#F0FDF4,#DCFCE7)}
.fc.dk{background:linear-gradient(145deg,#1C1917,#292524);grid-column:span 2;display:flex;align-items:center;gap:16px}
.fc.wh{background:#fff;border:1px solid rgba(0,0,0,.07)}
.icw{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;flex-shrink:0}
.icw.or-bg{background:rgba(249,115,22,.15)}
.icw.gn-bg{background:rgba(22,163,74,.15)}
.icw.wh-bg{background:rgba(255,255,255,.12)}
.icw.sf-bg{background:#F5F5F4}
.icw.pu-bg{background:rgba(124,58,237,.15)}
.cn{font-size:13px;font-weight:700;color:#1C1917;margin-bottom:4px;line-height:1.2}
.cn.lt{color:#fff}
.cs{font-size:11px;color:#78716C;line-height:1.4}
.cs.lt{color:rgba(255,255,255,.5)}
.bg{display:inline-flex;align-items:center;font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;margin-bottom:8px;letter-spacing:.5px}
.bg-or{background:rgba(249,115,22,.12);color:var(--or)}
.bg-gn{background:rgba(22,163,74,.12);color:var(--gr)}
.bg-wh{background:rgba(255,255,255,.1);color:rgba(255,255,255,.8)}
.bg-pu{background:rgba(124,58,237,.12);color:#7C3AED}
.qa{padding:0 20px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.qb{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:18px;background:#fff;border:1px solid rgba(0,0,0,.07);cursor:pointer;transition:transform 140ms var(--eo),box-shadow 140ms ease;-webkit-tap-highlight-color:transparent}
.qb:active{transform:scale(.93)}
@media(hover:hover)and(pointer:fine){.qb:hover{box-shadow:0 6px 20px rgba(0,0,0,.08);transform:translateY(-2px)}
}
.ql{font-size:10px;font-weight:700;color:#78716C;text-align:center;line-height:1.3}
.scrhdr{display:flex;align-items:center;gap:12px;padding:20px 24px 16px}
.bk{width:38px;height:38px;border-radius:12px;background:#F5F5F4;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.bk:active{transform:scale(.9)}
.scrttl{font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:#1C1917;letter-spacing:-.5px}
.vhero{margin:0 20px 20px;background:linear-gradient(145deg,#7C2D12,#9A3412);border-radius:28px;padding:28px 24px;position:relative;overflow:hidden;text-align:center}
.vhero::before{content:'';position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(249,115,22,.2) 0%,transparent 70%)}
.pr{width:100px;height:100px;border-radius:50%;background:rgba(249,115,22,.15);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;position:relative}
.pr::before,.pr::after{content:'';position:absolute;inset:-10px;border-radius:50%;border:2px solid rgba(249,115,22,.3);animation:po 2s ease-out infinite}
.pr::after{animation-delay:.7s;inset:-20px;border-color:rgba(249,115,22,.15)}
@keyframes po{0%{transform:scale(.9);opacity:1}
100%{transform:scale(1.3);opacity:0}
}
.pi{width:64px;height:64px;border-radius:50%;background:var(--or);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(249,115,22,.5)}
.hl{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px}
.ht{font-family:'Sora',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:6px}
.hd{font-size:12px;color:rgba(255,255,255,.5);line-height:1.5}
.cl{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.ci{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:18px;padding:14px 16px;cursor:pointer;transition:transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.ci:active{transform:scale(.98)}
.cav{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff;flex-shrink:0}
.cst{margin-left:auto;display:flex;align-items:center;gap:4px}
.sd{width:7px;height:7px;border-radius:50%;background:var(--gr);animation:bk 2s ease infinite}
@keyframes bk{0%,100%{opacity:1}
50%{opacity:.4}
}
@keyframes shk{0%,100%{transform:translateX(0)}
20%{transform:translateX(-8px)}
40%{transform:translateX(8px)}
60%{transform:translateX(-6px)}
80%{transform:translateX(6px)}
}
.trg{padding:20px}
.tb{width:100%;padding:18px;background:linear-gradient(135deg,#EF4444,#DC2626);border:none;border-radius:20px;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 28px rgba(239,68,68,.4);transition:transform 200ms var(--esp),box-shadow 200ms ease;-webkit-tap-highlight-color:transparent}
.tb:active{transform:scale(.96);box-shadow:0 4px 16px rgba(239,68,68,.3)}
.ahero{margin:0 20px 20px;background:linear-gradient(145deg,#1E1B4B,#312E81);border-radius:28px;padding:28px 24px;position:relative;overflow:hidden;text-align:center}
.ai{width:72px;height:72px;border-radius:50%;background:#7C3AED;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 8px 24px rgba(124,58,237,.5)}
.tgr{display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:16px;padding:14px 16px;margin:0 20px 10px}
.tsw{width:48px;height:28px;border-radius:14px;border:none;cursor:pointer;transition:background 200ms ease;position:relative;flex-shrink:0}
.tsw.on{background:var(--gr)}
.tsw.off{background:#E7E5E4}
.tth{position:absolute;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:left 200ms var(--esp);box-shadow:0 2px 6px rgba(0,0,0,.15)}
.tth.on{left:23px}
.tth.off{left:3px}
.sbox{background:#F5F3FF;border:1.5px solid rgba(124,58,237,.2);border-radius:16px;padding:16px;margin-bottom:10px}
.arc{width:calc(100% - 40px);background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:18px;padding:16px;display:flex;align-items:center;gap:14px;margin:0 20px 16px}
.ab{height:6px;border-radius:3px;background:#E7E5E4;margin-top:8px;overflow:hidden}
.af{height:100%;border-radius:3px;background:var(--or);animation:fi 1s var(--eo) .3s backwards}
@keyframes fi{from{width:0}
}
.tl{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.ti{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:16px;padding:14px 16px;cursor:pointer;transition:transform 140ms var(--eo);-webkit-tap-highlight-color:transparent}
.ti:active{transform:scale(.98)}
.tc{width:24px;height:24px;border-radius:8px;border:2px solid #E7E5E4;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:border-color 180ms ease,background 180ms ease}
.tc.dn{background:var(--gr);border-color:var(--gr)}
.tt{font-size:14px;font-weight:600;color:#1C1917;flex:1}
.tt.dn{text-decoration:line-through;color:#A8A29E}
.ttm{font-size:11px;font-weight:700;color:var(--or);background:#FFF7ED;padding:3px 8px;border-radius:8px}
.atb{margin:12px 20px 0;padding:16px;background:#F5F5F4;border:1.5px dashed #E7E5E4;border-radius:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:600;color:#78716C;transition:background 180ms ease,border-color 180ms ease;-webkit-tap-highlight-color:transparent;font-family:'Plus Jakarta Sans',sans-serif}
.atb:hover{background:#FFEDD5;border-color:var(--or);color:var(--or)}
.wahero{margin:0 20px 16px;background:linear-gradient(145deg,#064E3B,#065F46);border-radius:24px;padding:20px}
.wai{width:48px;height:48px;border-radius:16px;background:#25D366;display:flex;align-items:center;justify-content:center}
.qal{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.qai{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:16px;overflow:hidden}
.qaq{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer}
.qach{font-size:12px;color:#A8A29E;transition:transform 200ms ease}
.qach.op{transform:rotate(180deg)}
.qaa{font-size:13px;color:#78716C;padding:0 16px 14px;line-height:1.5}
.inf{padding:0 20px;display:flex;flex-direction:column;gap:10px}
.ic{border-radius:22px;padding:18px;cursor:pointer;transition:transform 180ms var(--eo),box-shadow 180ms ease;-webkit-tap-highlight-color:transparent;border:none;text-align:left;width:100%}
.ic:active{transform:scale(.97)}
.icr{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.ici{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ic.mt{background:#EFF6FF;color:#1D4ED8}
.ic.ef{background:#FFF7ED;color:#C2410C}
.ic.in{background:#FFF1F2;color:#BE123C}
.rpt{padding:0 20px;display:flex;flex-direction:column;gap:10px}
.mu{display:flex;gap:8px}
.mb{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;background:#F5F5F4;border:1.5px dashed #E7E5E4;border-radius:14px;cursor:pointer;transition:background 180ms ease,border-color 180ms ease;font-family:'Plus Jakarta Sans',sans-serif}
.mb:hover{background:#FFF7ED;border-color:var(--or)}
.mb span{font-size:11px;font-weight:600;color:#78716C}
.lb{display:flex;align-items:center;gap:8px;background:#ECFDF5;border:1px solid rgba(22,163,74,.2);border-radius:12px;padding:12px 14px}
.isc{flex:1;overflow-y:auto;padding:0 20px}
.isc::-webkit-scrollbar{display:none}
.fst{font-size:12px;font-weight:700;color:#78716C;letter-spacing:.8px;text-transform:uppercase;margin:20px 0 10px}
.ig{display:flex;flex-direction:column;gap:10px;margin-bottom:4px}
.if{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid rgba(0,0,0,.07);border-radius:14px;padding:14px 16px;transition:border-color 180ms ease,box-shadow 180ms ease}
.if:focus-within{border-color:var(--or);box-shadow:0 0 0 3px rgba(249,115,22,.1)}
.if input,.if textarea,.if select{flex:1;border:none;outline:none;background:transparent;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:500;color:#1C1917;resize:none;appearance:none}
.if input::placeholder,.if textarea::placeholder{color:#A8A29E}
.ps{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.po{border:2px solid rgba(0,0,0,.07);border-radius:18px;padding:14px;cursor:pointer;transition:border-color 200ms ease,background 200ms ease,transform 140ms var(--eo);background:#fff;text-align:center;-webkit-tap-highlight-color:transparent;font-family:'Plus Jakarta Sans',sans-serif}
.po:active{transform:scale(.97)}
.po.sel{border-color:var(--or);background:#FFF7ED}
.po.sel-g{border-color:var(--gr);background:#F0FDF4}
.cgu{flex:1;overflow-y:auto;padding:0 20px 20px}
.cgu::-webkit-scrollbar{display:none}
.pm{padding:0 20px;display:flex;flex-direction:column;gap:8px}
.pmi{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:14px;padding:14px 16px;cursor:pointer;transition:background 140ms ease;-webkit-tap-highlight-color:transparent;font-family:'Plus Jakarta Sans',sans-serif}
.pmi:active{background:#F5F5F4}
.scrl{flex:1;overflow-y:auto;padding-bottom:8px}
.scrl::-webkit-scrollbar{display:none}
.si{opacity:0;transform:translateY(12px);animation:stin 320ms var(--eo) forwards}
@keyframes stin{to{opacity:1;transform:translateY(0)}
}
@keyframes pulse-bar{from{transform:scaleY(.4)}
to{transform:scaleY(1.4)}
}

`;
/* ── Logo ALERTE ─────────────────────────────────────────────────────────
   Bouclier + point d'exclamation, en dégradé orange (identité de marque déjà
   utilisée dans toute l'app). Vectoriel : net à toute taille, aucune image
   à charger. Utilisé sur l'écran d'accueil (Splash), Connexion et Inscription. ── */
const LogoMark = ({ s=64, bg=true }) => (
  <svg width={s} height={s} viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="alerteLogoBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FB923C"/>
        <stop offset="55%" stopColor="#F97316"/>
        <stop offset="100%" stopColor="#C2410C"/>
      </linearGradient>
      <linearGradient id="alerteLogoShield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF"/>
        <stop offset="100%" stopColor="#FFF7ED"/>
      </linearGradient>
    </defs>
    {bg&&<rect x="0" y="0" width="432" height="432" rx="96" fill="url(#alerteLogoBg)"/>}
    <g transform="translate(216,222)">
      <path d="M0 -108 L86 -76 C86 -6 70 62 0 116 C-70 62 -86 -6 -86 -76 Z" fill="url(#alerteLogoShield)"/>
      <rect x="-11" y="-56" width="22" height="86" rx="11" fill="#EA580C"/>
      <circle cx="0" cy="52" r="13" fill="#EA580C"/>
    </g>
  </svg>
);
const I = ({ n, s=20, c="currentColor", w=2 }) => {
  const d = {
    shield:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    calendar:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    phone:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>,
    bell:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    home:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    user:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    alert:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    lock:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    mic:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    cloud:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
    </svg>,
    building:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="18"/><path d="M16 8h4l3 3v10h-7V8z"/><line x1="5" y1="8" x2="5.01" y2="8"/><line x1="10" y1="8" x2="10.01" y2="8"/></svg>,
    fire:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-4.5-12.5"/></svg>,
    plus:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w+.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/>
    </svg>,
    arrow:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
    back:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/>
    </svg>,
    mail:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    eye:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    star:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    wa:
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0z"/></svg>,
    camera:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    video:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><polygon points="23,7 16,12 23,17 23,7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    pin:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    send:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></svg>,
    file:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
    chevd:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><polyline points="6,9 12,15 18,9"/></svg>,
    settings:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    help:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    shield2:
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>,
  };
  return d[n]||null;
};

const Nav = ({ a, go }) => {
  const items = [
    {id:"home",ic:"home",lb:"Accueil"},
    {id:"violence",ic:"shield",lb:"Violence"},
    ...(FEATURES.planning?[{id:"planning",ic:"calendar",lb:"Planning"}]:[]),
    ...(FEATURES.alerteInfo?[{id:"info",ic:"bell",lb:"Alertes"}]:[]),
    {id:"profil",ic:"user",lb:"Profil"},
  ];
  return (
    <nav className="bnav">
      {items.map(it=>(
        <button key={it.id} className={`ni ${a===it.id?"a":""}`} onClick={()=>go(it.id)}>
          <span style={{width:24,height:24,display:"flex",transform:a===it.id?"scale(1.15)":"scale(1)"}}>
            <I n={it.ic} s={22} c={a===it.id?"#F97316":"#A8A29E"} w={a===it.id?2.2:1.8}/>
          </span>
          <span className="nlb">{it.lb}</span>
        </button>
      ))}
    </nav>
  );
};

/* ── ÉCRAN ACCÈS RAPIDE (déjà inscrit) — PIN ou empreinte ─── */
const AccesRapide = ({go,userInfo={},onAcces}) => {
  const [pin,setPin]=useState("");
  const [err,setErr]=useState("");
  const [bioDispo,setBioDispo]=useState(false);
  const [shake,setShake]=useState(false);
  const nom=(userInfo.nm||"").split(" ")[0]||"";
  const ini=(userInfo.nm||"?").split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()||"??";

  useEffect(()=>{
    try{if(window.PublicKeyCredential)window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(ok=>setBioDispo(ok)).catch(()=>{});}catch(e){}
  },[]);

  const onPin=(v)=>{
    setPin(v); setErr("");
    if(v.length===6){
      setTimeout(()=>{
        // Si aucun PIN n'est enregistré (compte démo legacy), on accepte par tolérance.
        if(!userInfo.pin || v===userInfo.pin){
          onAcces?onAcces():go("home");
        } else {
          setErr("Code d'accès incorrect. Réessayez.");
          setShake(true);
          setTimeout(()=>{setShake(false);setPin("");},420);
        }
      },300);
    }
  };

  const validerBio=async()=>{
    try{
      const cred=await navigator.credentials.get({publicKey:{challenge:new Uint8Array(32),timeout:30000,userVerification:"required"}});
      if(cred){onAcces?onAcces():go("home");}
    }catch(e){setErr("Empreinte non reconnue. Utilisez votre code.");}
  };

  return (
    <div className="scr on" style={{display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(160deg,#1C1917,#292524)",padding:"40px 28px 32px",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"#fff"}}>{ini}</div>
        <p style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,color:"#fff"}}>{nom?`Bonjour ${nom} 👋`:"Bon retour 👋"}</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>Saisissez votre code d'accès</p>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:32,padding:"32px 24px"}}>
        <div style={{display:"flex",gap:10,marginBottom:24,animation:shake?"shk 380ms ease":"none"}}>
          {[0,1,2,3,4,5].map(i=>(
            <div key={i} style={{width:46,height:54,borderRadius:12,border:`2px solid ${err?"#DC2626":pin.length>i?C.orange:C.surfH}`,background:err?"#FFF1F2":pin.length>i?C.orangeL:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {pin.length>i&&<div style={{width:12,height:12,borderRadius:"50%",background:err?"#DC2626":C.orange}}/>}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:240,marginBottom:20}}>
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k,i)=>(
            <button key={i} onClick={()=>{
              if(k==="⌫") onPin(pin.slice(0,-1));
              else if(k&&pin.length<6) onPin(pin+k);
            }} style={{height:56,borderRadius:14,border:"none",cursor:k?"pointer":"default",background:k?(k==="⌫"?"#FFF1F2":"#fff"):"transparent",fontSize:k==="⌫"?20:22,fontWeight:700,color:k==="⌫"?"#DC2626":C.ink,fontFamily:"Sora,sans-serif",boxShadow:k&&k!=="⌫"?"0 2px 8px rgba(0,0,0,.06)":undefined}}>
              {k}
            </button>
          ))}
        </div>
        {err&&<p style={{fontSize:12,color:"#DC2626",fontWeight:600,marginBottom:12,textAlign:"center"}}>{err}</p>}
        {bioDispo&&(
          <button onClick={validerBio} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",borderRadius:14,border:`1px solid ${C.border}`,background:"#fff",cursor:"pointer",fontFamily:"Plus Jakarta Sans",marginBottom:16,fontSize:13,fontWeight:700,color:C.ink}}>
            <span style={{fontSize:22}}>👆</span>Utiliser l'empreinte digitale
          </button>
        )}
        <button onClick={()=>go("login")} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,color:C.faint,fontFamily:"Plus Jakarta Sans"}}>Se connecter avec un autre compte</button>
        <button onClick={()=>go("admin")} style={{marginTop:14,background:"none",border:"none",cursor:"pointer",fontSize:10,color:"rgba(0,0,0,.18)",fontFamily:"Plus Jakarta Sans"}}>Administration ALERTE CI</button>
      </div>
    </div>
  );
};

const Splash = ({go, userInfo={}, onAcces}) => {
  if(userInfo.nm&&userInfo.ph){
    return <AccesRapide go={go} userInfo={userInfo} onAcces={onAcces}/>;
  }
  return (
    <div className="scr on splash" style={{display:"flex"}}>
      <div style={{position:"relative",width:120,height:120,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"2rem"}}>
        <div className="orb" style={{marginBottom:0}}/>
        <div style={{position:"absolute",display:"flex"}}><LogoMark s={68} bg={false}/></div>
      </div>
      <h1 className="stitle">ALERTE<br/><span>CI</span></h1>
      <p className="stag">Votre sécurité, notre priorité</p>
      <div className="flag">
        <div className="fs" style={{background:"#F97316"}}/>
        <div className="fs" style={{background:"#FFFFFF"}}/>
        <div className="fs" style={{background:"#16A34A"}}/>
      </div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}>
        <button className="btn btn-p" onClick={()=>go("signup")}>Créer un compte <I n="arrow" s={16} c="#fff"/></button>
        <button className="btn btn-s" onClick={()=>go("login")}>Se connecter</button>
      </div>
      <p style={{marginTop:24,fontSize:11,color:"rgba(255,255,255,.25)",textAlign:"center"}}>Côte d'Ivoire · iOS & Android</p>
      <button onClick={()=>go("admin")} style={{marginTop:10,background:"none",border:"none",cursor:"pointer",fontSize:10,color:"rgba(255,255,255,.18)",fontFamily:"Plus Jakarta Sans",textAlign:"center"}}>
        Administration ALERTE CI
      </button>
    </div>
  );
};

/* ── REGISTRE DE DÉMONSTRATION (vidé pour la production) ─────────────
   Le tableau est conservé vide : toute la logique de connexion et de
   vérification d'unicité qui s'appuie dessus reste strictement identique,
   elle opère simplement sur un registre sans aucune donnée personnelle. */
const DEMO_ACCOUNTS = [];

/* ══════════════════════════════════════════════════════════════════════════
   COUCHE NATIONALE — SUPABASE
   Connexion au même projet que le tableau de bord administrateur, afin que
   chaque inscription, connexion et diffusion soit partagée à l'échelle du
   pays. Fonctionne en « best-effort » : si le réseau est indisponible,
   l'application continue exactement comme avant (mode local), et se
   resynchronise dès que possible. Aucune logique locale n'est modifiée.
══════════════════════════════════════════════════════════════════════════ */
const SB_URL = "https://dgwxyhtmuighwknchrae.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnd3h5aHRtdWlnaHdrbmNocmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDY5MDAsImV4cCI6MjA5NzgyMjkwMH0.JJyoRXBqQYedgRbU_HdJEMyTo4xYtWH0HBSVdollAJ8";
const DIFFUSION_TTL_MS = 24*60*60*1000;
const ESSAI_DUREE_MS = 30*24*60*60*1000;

/* ══════════════════════════════════════════════════════════════════════════
   AUTHENTIFICATION — Firebase Identity Toolkit (REST, sans SDK à charger).
   Le numéro de téléphone (10 chiffres) reste l'unique identifiant visible
   par l'utilisateur ; il devient un email technique interne pour Firebase,
   ce qui garantit nativement « un numéro = un seul compte » (Firebase
   refuse la création d'un 2e compte avec le même email technique).
   Les DONNÉES (profils, diffusions, institutions...) restent sur Supabase,
   interrogé avec la clé publique (anon) : c'est volontaire — cette clé est
   conçue pour être publique, comme documenté dans supabase-sql/admins.sql.
   Les opérations sensibles (administration) passent par l'Edge Function
   admin-api, qui seule détient la clé de service. ══════════════════════ */
const FB_API_KEY = "AIzaSyDmjB1He-ktZCXEv-GoW5932qYOXbBEpDA";
const FB_IDENTITY_URL = "https://identitytoolkit.googleapis.com/v1";
const FB_TOKEN_URL = "https://securetoken.googleapis.com/v1/token";
const ADMIN_API_URL = `${SB_URL}/functions/v1/admin-api`;

/* Identifiants techniques : le numéro de téléphone devient un email
   technique unique, et le code d'accès à 6 chiffres est renforcé par
   dérivation avant d'être utilisé comme mot de passe Firebase. L'utilisateur,
   lui, ne voit jamais rien d'autre que « téléphone + code d'accès ». */
const cloudEmail = (ph) => `u${saneTel(ph)}@alerteci.app`;
const cloudPass  = (ph,pin) => `CI!${saneCode(pin)}.${saneTel(ph)}`;

/* Identifiant d'appareil, généré une fois et conservé localement : sert à
   détecter qu'un même compte vient d'être ouvert sur un autre téléphone. */
const getDeviceId = () => {
  try{
    let id = window.localStorage.getItem("alerteci_device_id");
    if(!id){
      id = "dev-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10);
      window.localStorage.setItem("alerteci_device_id", id);
    }
    return id;
  }catch(e){ return "dev-inconnu"; }
};

async function fbRequest(path, body){
  try{
    const r = await fetch(`${FB_IDENTITY_URL}/${path}?key=${FB_API_KEY}`,{
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body),
    });
    const d = await r.json();
    if(!r.ok) return { error:(d.error&&d.error.message)||"ERREUR" };
    return d;
  }catch(e){ return { error:"RESEAU" }; }
}
const fbSignUp = (email,password) => fbRequest("accounts:signUp", {email,password,returnSecureToken:true});
const fbSignIn = (email,password) => fbRequest("accounts:signInWithPassword", {email,password,returnSecureToken:true});
async function fbRefresh(refreshToken){
  try{
    const r = await fetch(`${FB_TOKEN_URL}?key=${FB_API_KEY}`,{
      method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:`grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
    });
    const d = await r.json();
    if(!r.ok) return null;
    return d;
  }catch(e){ return null; }
}

/* Session Firebase locale : id_token (1h), refresh_token (longue durée). */
const cloudFbSession = () => {
  try{
    const brut = window.localStorage.getItem("alerteci_fb_session");
    return brut ? JSON.parse(brut) : null;
  }catch(e){ return null; }
};
const cloudSetFbSession = (s) => {
  try{
    if(s) window.localStorage.setItem("alerteci_fb_session", JSON.stringify(s));
    else  window.localStorage.removeItem("alerteci_fb_session");
  }catch(e){}
};
/* Reconnexion silencieuse via le refresh token Firebase — l'utilisateur ne
   voit rien, ne retape rien. */
async function cloudReconnexionSilencieuse(){
  const s = cloudFbSession();
  if(!s || !s.refreshToken) return null;
  const d = await fbRefresh(s.refreshToken);
  if(!d || !d.id_token) return null;
  cloudSetFbSession({ idToken:d.id_token, refreshToken:d.refresh_token, uid:d.user_id });
  return d.id_token;
}

/* Les appels de DONNÉES (profils, diffusions...) utilisent systématiquement
   la clé publique Supabase : la présence ou non d'un jeton Firebase ne change
   rien ici, Supabase ne connaît pas les jetons Firebase. */
const cloudHdr = () => ({
  "Content-Type": "application/json",
  "apikey": SB_KEY,
  "Authorization": `Bearer ${SB_KEY}`,
});

async function cloudGet(chemin){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/${chemin}`,{headers:cloudHdr()});
    if(!r.ok) return null;
    return await r.json();
  }catch(e){ return null; }
}

async function cloudInsert(table, ligne){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/${table}`,{
      method:"POST",
      headers:{...cloudHdr(), "Prefer":"return=representation"},
      body:JSON.stringify(ligne),
    });
    if(!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d) ? d[0] : d;
  }catch(e){ return null; }
}

/* Upsert par colonne unique (ex : telephone) — crée la fiche si absente,
   la met à jour sinon. Utilisé pour ne jamais dupliquer un profil. */
async function cloudUpsert(table, ligne, colConflit){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/${table}?on_conflict=${colConflit}`,{
      method:"POST",
      headers:{...cloudHdr(), "Prefer":"resolution=merge-duplicates,return=representation"},
      body:JSON.stringify(ligne),
    });
    if(!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d) ? d[0] : d;
  }catch(e){ return null; }
}

async function cloudUpdate(table, filtre, patch){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/${table}?${filtre}`,{
      method:"PATCH", headers:cloudHdr(), body:JSON.stringify(patch),
    });
    return r.ok;
  }catch(e){ return false; }
}

/* ── Inscription nationale : crée le compte Firebase (auth) puis la fiche
   Supabase associée (profil citoyen ou institution), retrouvée ensuite par
   NUMÉRO DE TÉLÉPHONE (et non plus par id Firebase, non compatible avec le
   schéma uuid existant). Retourne la fiche institution créée, `true` pour un
   citoyen, `{dejaExistant:true}` si ce numéro a déjà un compte, ou `null`
   en cas d'échec réseau. ── */
async function cloudSignup(compte){
  try{
    const email = cloudEmail(compte.ph);
    const password = cloudPass(compte.ph, compte.pin);
    const auth = await fbSignUp(email, password);
    if(auth.error==="EMAIL_EXISTS") return { dejaExistant:true };
    if(auth.error || !auth.localId) return null;
    cloudSetFbSession({ idToken:auth.idToken, refreshToken:auth.refreshToken, uid:auth.localId });
    const deviceId = getDeviceId();

    if(compte.plan==="institution"){
      let tsId = null;
      if(compte.typeService){
        const ts = await cloudGet(`types_service?nom=eq.${encodeURIComponent(compte.typeService)}&select=id`);
        tsId = ts && ts[0] ? ts[0].id : null;
      }
      const ligne = await cloudUpsert("institutions",{
        nom:saneTxt(compte.nm), commune:saneTxt(compte.commune)||null, responsable:saneTxt(compte.responsable)||null,
        telephone:compte.ph, email:compte.mail||null, statut:"en_attente",
        auth_uid:auth.localId, type_service_id:tsId, type_service:compte.typeService||null, session_id:deviceId,
      }, "telephone");
      return ligne || null;
    }

    const essaiFin = new Date(Date.now()+ESSAI_DUREE_MS).toISOString();
    await cloudUpsert("profiles",{
      auth_uid:auth.localId, nom:saneTxt(compte.nm), telephone:compte.ph, email:compte.mail||null,
      commune:compte.commune||null, statut:"actif", forfait:"akwaba_essai",
      essai_fin:essaiFin, session_id:deviceId, bloque:false,
    }, "telephone");
    return true;
  }catch(e){ return null; }
}

/* ── Connexion nationale : reconnaît un compte créé sur N'IMPORTE QUEL
   appareil du pays, puis l'enregistre dans le registre local de cet
   appareil pour les prochaines connexions hors-ligne. Chaque connexion
   réussie écrit l'identifiant de CET appareil comme seule session active :
   l'appareil précédemment connecté sera déconnecté (1 compte = 1 session). ── */
async function cloudLogin(ph, pin){
  try{
    const email = cloudEmail(ph);
    const password = cloudPass(ph, pin);
    const auth = await fbSignIn(email, password);
    if(auth.error || !auth.localId) return null;
    cloudSetFbSession({ idToken:auth.idToken, refreshToken:auth.refreshToken, uid:auth.localId });
    const deviceId = getDeviceId();

    const instRows = await cloudGet(`institutions?telephone=eq.${ph}&select=*`);
    const inst = instRows && instRows[0];
    if(inst){
      await cloudUpdate("institutions", `telephone=eq.${ph}`, { session_id:deviceId, derniere_connexion:new Date().toISOString() });
      const compte = {
        nm:inst.nom||"", ph, mail:inst.email||"",
        commune:inst.commune||"", pin, plan:"institution",
        statut:inst.statut||"en_attente", typeService:inst.type_service||"",
        responsable:inst.responsable||"", cloudId:inst.id||null,
        id:`acc-${Date.now()}`, creeLe:Date.now(),
      };
      cloudMemoriserLocal(compte);
      return compte;
    }

    const rows = await cloudGet(`profiles?telephone=eq.${ph}&select=*`);
    const prof = rows && rows[0];
    if(!prof) return null;
    if(prof.bloque) return { suspendu:true };
    await cloudUpdate("profiles", `telephone=eq.${ph}`, { session_id:deviceId, derniere_connexion:new Date().toISOString() });
    const plan = (prof.forfait && prof.forfait!=="gratuit" && prof.forfait!=="akwaba_essai") ? "premium" : "gratuit";
    const compte = {
      nm:prof.nom||"", ph, mail:prof.email||"",
      commune:prof.commune||"", pin, plan,
      essaiFin:prof.essai_fin||null, premiumExpire:prof.premium_expire||null,
      id:`acc-${Date.now()}`, creeLe:Date.now(),
    };
    cloudMemoriserLocal(compte);
    return compte;
  }catch(e){ return null; }
}

/* ── Vérifie que CET appareil est toujours la session active du compte. Si
   un autre appareil s'est connecté avec le même numéro depuis, l'identifiant
   de session enregistré côté serveur ne correspond plus au nôtre : on doit
   déconnecter cet appareil-ci. Appelé périodiquement pendant que l'app est
   ouverte (voir la racine AlerteCI). ── */
async function cloudSessionEncoreActive(ph){
  if(!ph) return true;
  const rows = await cloudGet(`profiles?telephone=eq.${ph}&select=session_id,bloque`);
  const prof = rows && rows[0];
  if(!prof) return true; // pas de donnée serveur = ne pas déconnecter par erreur réseau
  if(prof.bloque) return false;
  return prof.session_id === getDeviceId();
}

/* Ajoute au registre local un compte reconnu par le serveur (dédupliqué). */
function cloudMemoriserLocal(compte){
  try{
    const brut = window.localStorage.getItem("alerteci_comptes");
    const liste = brut ? JSON.parse(brut) : [];
    if(!liste.some(c=>c.ph===compte.ph)){
      liste.push(compte);
      window.localStorage.setItem("alerteci_comptes", JSON.stringify(liste));
    }
  }catch(e){}
}

/* ── Diffusion nationale : publie l'alerte pour tous les appareils. ── */
function cloudPublierDiffusion(alerte){
  cloudInsert("diffusions",{payload:alerte}).then(()=>{}).catch(()=>{});
}

/* ── Récupération des diffusions nationales de moins de 24h. ── */
async function cloudChargerDiffusions(){
  const depuis = new Date(Date.now()-DIFFUSION_TTL_MS).toISOString();
  const rows = await cloudGet(`diffusions?select=payload&created_at=gte.${encodeURIComponent(depuis)}&order=created_at.desc&limit=200`);
  if(!rows) return [];
  return rows.map(r=>r.payload).filter(a=>a&&a.id&&a.ts);
}

/* ── Types de service pilotés par le tableau de bord administrateur. ── */
async function cloudChargerTypesService(){
  const rows = await cloudGet(`types_service?actif=eq.true&select=nom&order=nom`);
  if(!rows || !rows.length) return [];
  return rows.map(r=>r.nom);
}

/* ── Statut d'une institution (validé/refusé depuis le dashboard admin). ── */
async function cloudStatutInstitution(cloudId){
  const rows = await cloudGet(`institutions?id=eq.${cloudId}&select=statut`);
  return (rows && rows[0]) ? rows[0].statut : null;
}

/* ── Validation d'institution répercutée au national (admin intégré). ── */
function cloudValiderInstitution(cloudId, statut){
  if(!cloudId) return;
  cloudUpdate("institutions", `id=eq.${cloudId}`, {statut, valide_le:new Date().toISOString()});
}

/* ══════════════════════════════════════════════════════════════════════════
   URGENCES CIBLÉES — Violence & Enlèvement
   Une urgence est une diffusion privée adressée à des numéros précis
   (les contacts d'urgence / de confiance). Elle ne circule QUE vers ces
   numéros : elle n'apparaît jamais dans le fil public Alerte Info, et
   surtout elle ne sonne JAMAIS sur le téléphone de la personne en danger —
   uniquement sur ceux des contacts, identifiés par leur numéro.
══════════════════════════════════════════════════════════════════════════ */
const normaliserPh = (ph) => String(ph||"").replace(/\D/g,"").slice(-10);

/* Dernier résultat d'envoi d'alerte — consulté par les écrans pour afficher
   la vérité : transmise ✓ ou ÉCHEC ✗ avec la raison exacte. */
let _dernierEnvoiUrgence=null;
function dernierEnvoiUrgence(){ return _dernierEnvoiUrgence; }
async function cloudPublierUrgence(payload){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/diffusions`,{
      method:"POST",
      headers:{...cloudHdr(), "Prefer":"return=minimal"},
      body:JSON.stringify({payload:{...payload, urgence:true}}),
    });
    let msg="";
    if(!r.ok){
      try{
        const d=await r.json();
        msg=(d&&(d.message||d.hint||d.details))||("Erreur HTTP "+r.status);
      }catch(e){ msg="Erreur HTTP "+r.status; }
    }
    _dernierEnvoiUrgence={ts:Date.now(), ok:r.ok, code:r.status, msg};
    return _dernierEnvoiUrgence;
  }catch(e){
    _dernierEnvoiUrgence={ts:Date.now(), ok:false, code:0, msg:"Pas de connexion internet"};
    return _dernierEnvoiUrgence;
  }
}

/* Récupère les urgences récentes qui ME ciblent (mon numéro dans cibles). */
async function cloudChargerUrgences(monPh){
  const moi = normaliserPh(monPh);
  if(!moi) return [];
  const depuis = new Date(Date.now()-DIFFUSION_TTL_MS).toISOString();
  const rows = await cloudGet(`diffusions?select=payload,created_at&created_at=gte.${encodeURIComponent(depuis)}&order=created_at.desc&limit=300`);
  if(!rows) return [];
  return rows
    .map(r=>r.payload)
    .filter(p=>p && p.urgence===true && Array.isArray(p.cibles) && p.cibles.map(normaliserPh).includes(moi));
}

/* ── Sirène d'urgence — jouée UNIQUEMENT sur le téléphone d'un contact
   qui reçoit une alerte, jamais sur celui de la personne en danger. ── */
let _sireneCtx = null;
/* Contexte audio GLOBAL : créé une fois, débloqué au premier toucher de
   l'utilisateur (obligation des WebView Android), puis réutilisé partout.
   Sans ce déblocage, une sirène déclenchée par le réseau resterait muette. */
/* Heure réelle du téléphone (fuseau local — GMT en Côte d'Ivoire),
   mise à jour automatiquement chaque seconde. */
const HeureLive = () => {
  const [h,setH]=useState(()=>new Date());
  useEffect(()=>{
    const id=setInterval(()=>setH(new Date()),1000);
    return ()=>clearInterval(id);
  },[]);
  return <>{h.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</>;
};

/* ── File d'attente des opérations natives Android ──
   Deux demandes de permission lancées en même temps (notifications à la
   connexion + GPS à l'activation, etc.) peuvent faire fermer brutalement
   l'application. Toutes les opérations natives passent donc ici, UNE PAR
   UNE, espacées de 700 ms. */
let _fileNative=Promise.resolve();
function enchainerNatif(operation){
  _fileNative=_fileNative
    .then(()=>new Promise(r=>setTimeout(r,700)))
    .then(()=>operation())
    .catch(()=>{});
  return _fileNative;
}

function _obtenirCtxAudio(){
  if(!_sireneCtx || _sireneCtx.state==="closed"){
    try{ _sireneCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ _sireneCtx=null; }
  }
  return _sireneCtx;
}
function _deverrouillerAudio(){
  const ctx=_obtenirCtxAudio();
  if(!ctx) return;
  try{
    if(ctx.state==="suspended") ctx.resume();
    /* Jouer un échantillon quasi inaudible pendant le geste : cela marque
       définitivement le contexte comme autorisé à émettre du son. */
    const o=ctx.createOscillator(), g=ctx.createGain();
    g.gain.value=0.0001; o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime+0.02);
  }catch(e){}
}
if(typeof window!=="undefined"){
  ["touchstart","pointerdown","click"].forEach(ev=>{
    try{ window.addEventListener(ev,_deverrouillerAudio,{passive:true}); }catch(e){}
  });
}
let _rafaleIds = [];
/* Rafale de notifications système SONORES : canal importance MAX, son de
   notification par défaut (fort), toutes les 4 s pendant 5 min. Ce canal
   n'est PAS soumis au blocage audio des WebView — c'est le filet ultime,
   qui sonne aussi écran verrouillé / app en arrière-plan. */
function _demarrerRafaleNotifs(titre, corps){
  try{
    const LN=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
    if(!LN) return;
    const notifs=[];
    /* ~30 min de notifications sonores (450 × 4 s), toutes annulées dès
       l'arrêt manuel — en pratique le contact arrête bien avant. */
    for(let i=0;i<450;i++){
      notifs.push({
        id:900000000+Math.floor(Math.random()*90000000),
        title:titre, body:corps,
        channelId:"sirene_urgence",
        schedule:{at:new Date(Date.now()+300+i*4000), allowWhileIdle:true},
      });
    }
    _rafaleIds=notifs.map(n=>n.id);
    enchainerNatif(()=>LN.createChannel({id:"sirene_urgence",name:"Sirène d'urgence",description:"Alarme sonore des alertes",importance:5,visibility:1,vibration:true,lights:true}));
    enchainerNatif(()=>LN.schedule({notifications:notifs}));
  }catch(e){}
}
function _arreterRafaleNotifs(){
  try{
    const LN=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
    if(!LN||!_rafaleIds.length) return;
    const ids=_rafaleIds.map(id=>({id})); _rafaleIds=[];
    enchainerNatif(()=>LN.cancel({notifications:ids}));
  }catch(e){ _rafaleIds=[]; }
}

/* ── SIRÈNE D'URGENCE — triple canal pour garantir le son sur tout Android ──
   1) élément <audio> HTML jouant une sirène WAV générée à la volée, en boucle
      (canal le plus fiable en WebView — le son passait ainsi au début).
   2) WebAudio en renfort, contexte FRAIS à chaque déclenchement.
   3) notifications système (canal sonnerie) pour l'arrière-plan/écran verrouillé.
   Vibration en plus. Tout s'arrête via arreterSireneUrgence(). */
let _sireneOsc = null;
let _sireneOsc2 = null;
let _sireneGain = null;
let _sireneLfo = null;
let _sireneWatch = null;
let _sireneVibLoop = null;
let _sireneTimeout5min = null;
let _sireneAnnonceLoop = null;
let _sireneAudioEl = null;

function _genererSireneWavURL(){
  try{
    const SR=22050, n=Math.floor(SR*2.0);
    const data=new Int16Array(n);
    let phase=0;
    for(let i=0;i<n;i++){
      const tt=i/SR;
      const freq=900+300*Math.sin(2*Math.PI*2.0*tt);
      phase+=2*Math.PI*freq/SR;
      let v=Math.sign(Math.sin(phase))*0.85;
      if(i<220) v*=i/220;
      if(i>n-220) v*=(n-i)/220;
      data[i]=Math.max(-32767,Math.min(32767,Math.floor(v*32767)));
    }
    const dataSize=data.length*2;
    const buf=new ArrayBuffer(44+dataSize), dv=new DataView(buf);
    const wr=(o,s)=>{ for(let i=0;i<s.length;i++) dv.setUint8(o+i,s.charCodeAt(i)); };
    wr(0,"RIFF"); dv.setUint32(4,36+dataSize,true); wr(8,"WAVE"); wr(12,"fmt ");
    dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,1,true);
    dv.setUint32(24,SR,true); dv.setUint32(28,SR*2,true);
    dv.setUint16(32,2,true); dv.setUint16(34,16,true); wr(36,"data");
    dv.setUint32(40,dataSize,true);
    new Int16Array(buf,44).set(data);
    return URL.createObjectURL(new Blob([buf],{type:"audio/wav"}));
  }catch(e){ return null; }
}

function jouerSireneUrgence(annonceVocale){
  arreterSireneUrgence();
  try{ _stopperMicroEcoute && _stopperMicroEcoute(); }catch(e){}

  // CANAL 1 : <audio> HTML en boucle
  try{
    const url=_genererSireneWavURL();
    if(url){
      _sireneAudioEl=new Audio(url);
      _sireneAudioEl.loop=true; _sireneAudioEl.volume=1.0;
      const lancer=()=>{ try{ const p=_sireneAudioEl.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} };
      lancer();
      let essais=0;
      const retry=setInterval(()=>{
        essais++;
        if(!_sireneAudioEl || essais>60){ clearInterval(retry); return; }
        if(_sireneAudioEl.paused) lancer();
      },500);
      _sireneAudioEl._retry=retry;
    }
  }catch(e){}

  // CANAL 2 : WebAudio, contexte frais
  let ctx=null;
  try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ ctx=null; }
  _sireneCtx=ctx;
  const demarrer=()=>{
    if(!ctx || _sireneOsc) return;
    try{ if(ctx.state==="suspended") ctx.resume(); }catch(e){}
    try{
      const comp=ctx.createDynamicsCompressor();
      comp.threshold.value=-6; comp.knee.value=0; comp.ratio.value=20; comp.attack.value=0; comp.release.value=0.05;
      comp.connect(ctx.destination);
      const g=ctx.createGain(); g.gain.value=0.8; g.connect(comp);
      const o=ctx.createOscillator(); o.type="square"; o.frequency.value=1200;
      const lfo=ctx.createOscillator(); lfo.type="triangle"; lfo.frequency.value=2.0;
      const lfoGain=ctx.createGain(); lfoGain.gain.value=300;
      lfo.connect(lfoGain); lfoGain.connect(o.frequency);
      o.connect(g); o.start(); lfo.start();
      _sireneOsc=o; _sireneGain=g; _sireneLfo=lfo;
    }catch(e){}
  };
  demarrer();
  _sireneWatch=setInterval(()=>{
    try{ if(ctx && ctx.state==="suspended") ctx.resume(); }catch(e){}
    if(!_sireneOsc) demarrer();
    if(_sireneAudioEl && _sireneAudioEl.paused){ try{ _sireneAudioEl.play().catch(()=>{}); }catch(e){} }
  },800);

  const vibrer=()=>{ try{ navigator.vibrate && navigator.vibrate([600,150,600,150,900]); }catch(e){} };
  vibrer();
  _sireneVibLoop=setInterval(vibrer,2500);

  if(annonceVocale && window.speechSynthesis){
    const annoncer=()=>{
      try{
        window.speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance(annonceVocale);
        u.lang="fr-FR"; u.rate=0.95; u.volume=1; u.pitch=1;
        window.speechSynthesis.speak(u);
      }catch(e){}
    };
    setTimeout(annoncer,1500);
    _sireneAnnonceLoop=setInterval(annoncer,9000);
  }

  _demarrerRafaleNotifs("🚨 ALERTE EN COURS", annonceVocale||"Une personne est en danger. Ouvrez Alerte CI !");
  /* AUCUN arrêt automatique : sirène en boucle jusqu'à l'arrêt manuel du contact. */
}

function arreterSireneUrgence(){
  _arreterRafaleNotifs();
  try{ clearTimeout(_sireneTimeout5min); _sireneTimeout5min=null; }catch(e){}
  try{ clearInterval(_sireneAnnonceLoop); _sireneAnnonceLoop=null; }catch(e){}
  try{ window.speechSynthesis && window.speechSynthesis.cancel(); }catch(e){}
  try{ clearInterval(_sireneWatch); _sireneWatch=null; }catch(e){}
  try{ clearInterval(_sireneVibLoop); _sireneVibLoop=null; }catch(e){}
  try{ navigator.vibrate && navigator.vibrate(0); }catch(e){}
  try{ if(_sireneAudioEl){ clearInterval(_sireneAudioEl._retry); _sireneAudioEl.pause(); _sireneAudioEl.src=""; } _sireneAudioEl=null; }catch(e){}
  try{ _sireneOsc && _sireneOsc.stop(); }catch(e){}
  try{ _sireneOsc2 && _sireneOsc2.stop(); }catch(e){}
  try{ _sireneLfo && _sireneLfo.stop(); }catch(e){}
  try{ _sireneGain && _sireneGain.disconnect(); }catch(e){}
  _sireneOsc=null; _sireneOsc2=null; _sireneLfo=null; _sireneGain=null;
  try{ _sireneCtx && _sireneCtx.close(); }catch(e){}
  _sireneCtx=null;
}



/* ── Pont notifications push (coque Android avec Firebase). Enregistre le
   jeton de l'appareil associé au numéro : le serveur pourra réveiller ce
   téléphone même verrouillé/app fermée. Sans plugin, ne fait rien. ── */
function cloudEnregistrerAppareil(token, ph){
  if(!token||!ph) return;
  cloudInsert("device_tokens",{token, telephone:normaliserPh(ph), plateforme:"android"}).then(()=>{}).catch(()=>{});
}
function initialiserPush(ph){
  try{
    const P = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.PushNotifications;
    if(!P || !ph) return;
    /* Différé et mis en file : ne jamais chevaucher une autre popup système. */
    enchainerNatif(()=>P.requestPermissions()).then(res=>{
      if(!res) return;
      if(res.receive!=="granted") return;
      P.addListener("registration",(t)=>cloudEnregistrerAppareil(t.value, ph));
      /* App au premier plan : une urgence poussée par le serveur fait
         sonner la sirène immédiatement (en plus de la notification système
         que Firebase affiche déjà seul quand l'app est fermée/verrouillée). */
      P.addListener("pushNotificationReceived",(notif)=>{
        try{
          const d=(notif&&notif.data)||{};
          if(d.type==="urgence"||d.urgence==="true"||d.urgence===true) jouerSireneUrgence();
        }catch(e){}
      });
      P.register();
    }).catch(()=>{});
  }catch(e){}
}

const Login = ({go, goBack, setPlan, setUserInfo, userInfo={}, comptesInscrits=[]}) => {
  const [ph, setPh] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [recup, setRecup] = useState(null);
  const [recupPh, setRecupPh] = useState("");
  const [codeSms, setCodeSms] = useState("");
  const [codeAttendu] = useState("1234"); // code de démo fixe
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");
  const [recupErr, setRecupErr] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countRef = useRef(null);

  const startCountdown = () => {
    setCountdown(60);
    clearInterval(countRef.current);
    countRef.current = setInterval(()=>{
      setCountdown(c=>{ if(c<=1){clearInterval(countRef.current);return 0;} return c-1; });
    },1000);
  };

  const envoyerCode = () => {
    if(recupPh.length<10){setRecupErr("Saisissez un numéro valide à 10 chiffres.");return;}
    setRecupErr(""); setSendingCode(true);
    setTimeout(()=>{
      setSendingCode(false);
      setRecup("saisir_code");
      startCountdown();
      playNotif();
    },1200);
  };

  const verifierCode = () => {
    if(codeSms!==codeAttendu){setRecupErr("Code incorrect. Vérifiez le SMS reçu et réessayez.");return;}
    setRecupErr("");
    setRecup("nouveau_pin");
  };

  const enregistrerPin = () => {
    if(newPin.length<6){setRecupErr("Le code d'accès doit contenir 6 chiffres.");return;}
    if(newPin!==newPinConfirm){setRecupErr("Les codes ne correspondent pas.");return;}
    setRecupErr("");
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      setRecup("succes");
      playNotif();
    },1000);
  };

  const handleLogin = (pinValue) => {
    if (ph.length < 10 || pinValue.length < 6) {setErr("Vérifiez votre numéro et votre code d'accès.");return;}

    /* ── Reconnaissance de TOUT compte créé à l'inscription ──────────────
       On cherche dans le registre complet des comptes créés en session
       (citoyens et institutions confondus, pas seulement le dernier) :
       la personne doit saisir elle-même son propre code d'accès pour se
       connecter — celui-ci n'est jamais pré-rempli ni affiché. */
    const compte = comptesInscrits.find(c => c.ph===ph && c.pin===pinValue);
    if(compte){
      setErr(""); setLoading(true);
      setPlan&&setPlan(compte.plan==="premium"?"premium":compte.plan==="institution"?"institution":"gratuit");
      setUserInfo&&setUserInfo(compte);
      const cible = compte.plan==="institution" ? "home_service" : "home";
      setTimeout(() => { setLoading(false); go(cible); }, 1000);
      return;
    }

    const found = DEMO_ACCOUNTS.find(a => a.ph === ph && a.pin === pinValue);
    if (found) {
      setErr(""); setLoading(true);
      setPlan&&setPlan(found.badge==="PREMIUM"?"premium":"gratuit");
      setUserInfo&&setUserInfo({nm:found.label,ph:found.ph,mail:"",commune:"",pin:found.pin,statut:found.target==="home_service"?"valide":undefined,plan:found.badge==="PREMIUM"?"premium":"gratuit"});
      setTimeout(() => { setLoading(false); go(found.target); }, 1000);
    } else {
      /* ── Compte inconnu sur CET appareil : vérification nationale. ──
         Reconnaît tout compte créé sur un autre téléphone (ou après une
         réinstallation), puis le mémorise localement pour les prochaines
         connexions même hors-ligne. La saisie reste strictement identique :
         numéro + code d'accès. ── */
      setErr(""); setLoading(true);
      cloudLogin(ph, pinValue).then((compte)=>{
        setLoading(false);
        if(!compte){ setErr("Numéro ou code d'accès incorrect."); setPin(""); return; }
        if(compte.suspendu){ setErr("Ce compte a été suspendu. Contactez le support."); setPin(""); return; }
        setPlan&&setPlan(compte.plan==="premium"?"premium":compte.plan==="institution"?"institution":"gratuit");
        setUserInfo&&setUserInfo(compte);
        go(compte.plan==="institution" ? "home_service" : "home");
      });
    }
  };

  const onPinChange = (v) => {
    setPin(v); setErr("");
    if(v.length===6) setTimeout(()=>handleLogin(v),150);
  };

  if(recup) return (
    <div className="scr on" style={{display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(160deg,#1C1917,#292524)",padding:"36px 28px 28px",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{width:52,height:52,borderRadius:16,background:"rgba(249,115,22,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I n="lock" s={26} c={C.orange}/>
        </div>
        <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:"#fff",letterSpacing:"-.3px"}}>
          {recup==="succes"?"Code d'accès réinitialisé ✓":"Récupération du compte"}
        </p>

        {recup!=="succes"&&(
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
            {["saisir_num","saisir_code","nouveau_pin"].map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:24,height:24,borderRadius:"50%", background:["saisir_num","saisir_code","nouveau_pin"].indexOf(recup)>=i?C.orange:"rgba(255,255,255,.15)", display:"flex",alignItems:"center",justifyContent:"center", fontSize:11,fontWeight:800,color:"#fff"}}>
                  {i+1}
                </div>
                {i<2&&<div style={{width:20,height:2,borderRadius:1,background:["saisir_num","saisir_code","nouveau_pin"].indexOf(recup)>i?"rgba(249,115,22,.6)":"rgba(255,255,255,.15)"}}/>}
              </div>
            ))}
          </div>
        )}
        <p style={{fontSize:12,color:"rgba(255,255,255,.5)",textAlign:"center"}}>
          {recup==="saisir_num"&&"Étape 1 · Entrez votre numéro enregistré"}
          {recup==="saisir_code"&&`Étape 2 · Code envoyé au ${recupPh}`}
          {recup==="nouveau_pin"&&"Étape 3 · Choisissez un nouveau code d'accès"}
          {recup==="succes"&&"Votre compte est de nouveau accessible"}
        </p>
      </div>

      <div className="isc" style={{flex:1}}>

        {recup==="saisir_num"&&(
          <div style={{paddingTop:20,display:"flex",flexDirection:"column",gap:10}}>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.5,marginBottom:4}}>
              Saisissez le numéro de téléphone associé à votre compte. Vous recevrez un code par SMS.
            </p>
            <div className="if" style={{border:`1.5px solid ${recupPh.length===10?"rgba(22,163,74,.4)":C.border}`}}>
              <I n="phone" s={18} c={C.faint}/>
              <input type="tel" value={recupPh}
                onChange={e=>{setRecupPh(e.target.value.replace(/\D/g,"").slice(0,10));setRecupErr("");}}
                placeholder="Numéro de téléphone (10 chiffres)" maxLength={10}
                style={{letterSpacing:recupPh.length>0?"1px":"normal"}}/>
              {recupPh.length===10&&<span style={{fontSize:12,color:C.green,fontWeight:700}}>✓</span>}
            </div>
            {recupErr&&<p style={{fontSize:12,color:"#DC2626",fontWeight:600,paddingLeft:4}}>{recupErr}</p>}
            <button className="btn btn-p"
              style={{opacity:recupPh.length===10&&!sendingCode?1:.5}}
              disabled={recupPh.length<10||sendingCode}
              onClick={envoyerCode}>
              {sendingCode
                ?<><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Envoi du code...</>
                :<>📱 Envoyer le code SMS</>}
            </button>
          </div>
        )}

        {recup==="saisir_code"&&(
          <div style={{paddingTop:20,display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:C.greenL,border:"1px solid rgba(22,163,74,.2)",borderRadius:14,padding:"12px 14px"}}>
              <p style={{fontSize:12,fontWeight:700,color:C.green,marginBottom:3}}>📲 Code envoyé !</p>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>
                Un code à 4 chiffres a été envoyé au <strong style={{color:C.ink}}>{recupPh}</strong>
              </p>
            </div>

            <div style={{display:"flex",justifyContent:"center",gap:10,padding:"8px 0"}}>
              {[0,1,2,3].map(pos=>(
                <input key={pos}
                  id={`code-${pos}`}
                  type="tel" maxLength={1}
                  value={codeSms[pos]||""}
                  onChange={e=>{
                    const v=e.target.value.replace(/\D/g,"");
                    const arr=codeSms.split("");
                    arr[pos]=v;
                    const next=arr.join("").slice(0,4);
                    setCodeSms(next);
                    setRecupErr("");
                    if(v&&pos<3) document.getElementById(`code-${pos+1}`)?.focus();
                  }}
                  onKeyDown={e=>{if(e.key==="Backspace"&&!codeSms[pos]&&pos>0) document.getElementById(`code-${pos-1}`)?.focus();}}
                  style={{width:56,height:64,borderRadius:14,border:`2px solid ${codeSms.length>pos?C.orange:C.surfH}`,
                    textAlign:"center",fontSize:28,fontWeight:800,color:C.ink,fontFamily:"Sora,sans-serif",
                    outline:"none",background:"#fff"}}/>
              ))}
            </div>
            {recupErr&&<p style={{fontSize:12,color:"#DC2626",fontWeight:600,textAlign:"center"}}>{recupErr}</p>}
            <button className="btn btn-p"
              style={{opacity:codeSms.length===4?1:.5}}
              disabled={codeSms.length<4}
              onClick={verifierCode}>
              Vérifier le code <I n="arrow" s={16} c="#fff"/>
            </button>
            <button
              style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700, color:countdown>0?C.faint:C.orange,fontFamily:"Plus Jakarta Sans",textAlign:"center"}}
              disabled={countdown>0}
              onClick={()=>{setCodeSms("");setRecupErr("");envoyerCode();}}>
              {countdown>0?`Renvoyer le code (${countdown}s)`:"Renvoyer le code"}
            </button>
          </div>
        )}

        {recup==="nouveau_pin"&&(
          <div style={{paddingTop:20,display:"flex",flexDirection:"column",gap:14}}>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.5,marginBottom:4}}>
              Choisissez un nouveau code d'accès à 6 chiffres. C'est ce code qui vous servira désormais à vous connecter.
            </p>
            <div>
              <p style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,textAlign:"center"}}>Nouveau code</p>
              <div style={{display:"flex",justifyContent:"center",gap:8}}>
                {[0,1,2,3,4,5].map(i=>(
                  <input key={i} id={`newpin-${i}`} type="password" inputMode="numeric" maxLength={1}
                    value={newPin[i]||""}
                    onChange={e=>{
                      const v=e.target.value.replace(/\D/g,"").slice(0,1);
                      const arr=newPin.split(""); arr[i]=v;
                      const next=arr.join("").slice(0,6);
                      setNewPin(next); setRecupErr("");
                      if(v&&i<5) document.getElementById(`newpin-${i+1}`)?.focus();
                    }}
                    onKeyDown={e=>{if(e.key==="Backspace"&&!newPin[i]&&i>0) document.getElementById(`newpin-${i-1}`)?.focus();}}
                    style={{width:42,height:50,borderRadius:12,border:`2px solid ${newPin.length>i?C.orange:C.surfH}`,textAlign:"center",fontSize:20,fontWeight:800,fontFamily:"Sora,sans-serif",color:C.ink,outline:"none",background:"#fff"}}/>
                ))}
              </div>
            </div>
            <div>
              <p style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,textAlign:"center"}}>Confirmer le code</p>
              <div style={{display:"flex",justifyContent:"center",gap:8}}>
                {[0,1,2,3,4,5].map(i=>(
                  <input key={i} id={`newpinc-${i}`} type="password" inputMode="numeric" maxLength={1}
                    value={newPinConfirm[i]||""}
                    onChange={e=>{
                      const v=e.target.value.replace(/\D/g,"").slice(0,1);
                      const arr=newPinConfirm.split(""); arr[i]=v;
                      const next=arr.join("").slice(0,6);
                      setNewPinConfirm(next); setRecupErr("");
                      if(v&&i<5) document.getElementById(`newpinc-${i+1}`)?.focus();
                    }}
                    onKeyDown={e=>{if(e.key==="Backspace"&&!newPinConfirm[i]&&i>0) document.getElementById(`newpinc-${i-1}`)?.focus();}}
                    style={{width:42,height:50,borderRadius:12,border:`2px solid ${newPinConfirm.length>i?(newPinConfirm===newPin.slice(0,newPinConfirm.length)?C.green:"#DC2626"):C.surfH}`,textAlign:"center",fontSize:20,fontWeight:800,fontFamily:"Sora,sans-serif",color:C.ink,outline:"none",background:"#fff"}}/>
                ))}
              </div>
            </div>
            {recupErr&&<p style={{fontSize:12,color:"#DC2626",fontWeight:600,textAlign:"center"}}>{recupErr}</p>}
            <button className="btn btn-p"
              style={{opacity:newPin.length===6&&newPin===newPinConfirm&&!loading?1:.5}}
              disabled={newPin.length<6||newPin!==newPinConfirm||loading}
              onClick={enregistrerPin}>
              {loading?<><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Enregistrement...</>:<><I n="check" s={16} c="#fff"/>Enregistrer le code d'accès</>}
            </button>
          </div>
        )}

        {recup==="succes"&&(
          <div style={{paddingTop:20,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <I n="check" s={34} c="#fff"/>
            </div>
            <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:C.ink}}>Code d'accès modifié !</p>
            <p style={{fontSize:13,color:C.muted,lineHeight:1.6}}>
              Votre code d'accès a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau code à 6 chiffres.
            </p>
            <button className="btn btn-p" onClick={()=>{setRecup(null);setCodeSms("");setNewPin("");setNewPinConfirm("");setRecupPh("");}}>
              Se connecter <I n="arrow" s={16} c="#fff"/>
            </button>
          </div>
        )}

        {recup!=="succes"&&(
          <button onClick={()=>{
            if(recup==="saisir_num"){setRecup(null);setRecupErr("");}
            else if(recup==="saisir_code"){setRecup("saisir_num");setCodeSms("");setRecupErr("");}
            else if(recup==="nouveau_pin"){setRecup("saisir_code");setNewPin("");setNewPinConfirm("");setRecupErr("");}
          }} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700, color:C.muted,fontFamily:"Plus Jakarta Sans",display:"flex",alignItems:"center",gap:6, marginTop:8,padding:"8px 0"}}>
            <I n="back" s={14} c={C.muted}/>Retour
          </button>
        )}
        <div style={{height:24}}/>
      </div>
    </div>
  );
  return (
    <div className="scr on" style={{display:"flex",flexDirection:"column"}}>

      <div style={{background:"linear-gradient(160deg,#1C1917,#292524)",padding:"36px 28px 28px",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{width:60,height:60,borderRadius:18,overflow:"hidden",boxShadow:"0 8px 20px rgba(249,115,22,.35)"}}>
          <LogoMark s={60}/>
        </div>
        <p style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,color:"#fff",letterSpacing:"-.5px"}}>Bon retour 👋</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,.5)",textAlign:"center"}}>Connectez-vous avec votre numéro et votre code d'accès</p>
      </div>

      <div className="isc" style={{flex:1,paddingBottom:0}}>

        <div style={{display:"flex",alignItems:"center",gap:12,marginTop:20,marginBottom:16}}>
          <div style={{flex:1,height:1,background:C.surfH}}/><span style={{fontSize:11,color:C.faint,fontWeight:600}}>Connexion</span><div style={{flex:1,height:1,background:C.surfH}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
          <div className="if">
            <I n="phone" s={18} c={C.faint}/>
            <input type="tel" value={ph} onChange={e=>{setPh(e.target.value.replace(/\D/g,"").slice(0,10));setErr("");}}
              placeholder="Numéro de téléphone (10 chiffres)" maxLength={10}
              style={{letterSpacing:ph.length>0?"1px":"normal"}}/>
            {ph.length===10&&<span style={{fontSize:12,color:C.green,fontWeight:700}}>✓</span>}
          </div>
        </div>

        <p style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,textAlign:"center"}}>Code d'accès (6 chiffres)</p>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14}}>
          {[0,1,2,3,4,5].map(i=>(
            <input key={i} id={`loginpin-${i}`} type="password" inputMode="numeric" maxLength={1}
              value={pin[i]||""}
              onChange={e=>{
                const v=e.target.value.replace(/\D/g,"").slice(0,1);
                const arr=pin.split(""); arr[i]=v;
                const next=arr.join("").slice(0,6);
                onPinChange(next);
                if(v&&i<5) document.getElementById(`loginpin-${i+1}`)?.focus();
              }}
              onKeyDown={e=>{if(e.key==="Backspace"&&!pin[i]&&i>0) document.getElementById(`loginpin-${i-1}`)?.focus();}}
              style={{width:42,height:50,borderRadius:12,border:`2px solid ${pin.length>i?C.orange:C.surfH}`,textAlign:"center",fontSize:20,fontWeight:800,fontFamily:"Sora,sans-serif",color:C.ink,outline:"none",background:"#fff"}}/>
          ))}
        </div>

        <button onClick={()=>{setRecup("saisir_num");setRecupPh(ph);setRecupErr("");}}
          style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,color:C.orange,fontFamily:"Plus Jakarta Sans",marginBottom:14,display:"block",textAlign:"right",width:"100%"}}>
          Code d'accès oublié ?
        </button>

        {err&&<div style={{background:"#FFF1F2",border:"1px solid rgba(190,18,60,.2)",borderRadius:12,padding:"10px 14px",marginBottom:12}}>
          <p style={{fontSize:12,color:"#BE123C",fontWeight:600}}>{err}</p>
        </div>}

        <button className="btn btn-p" onClick={()=>handleLogin(pin)} style={{opacity:loading?0.7:1}}>
          {loading?<><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Connexion...</>:<>Se connecter <I n="arrow" s={16} c="#fff"/></>}
        </button>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
          <div style={{flex:1,height:1,background:C.surfH}}/><span style={{fontSize:11,color:C.faint,fontWeight:600}}>Pas encore de compte ?</span><div style={{flex:1,height:1,background:C.surfH}}/>
        </div>
        <button className="btn btn-g" onClick={()=>go("signup")}>Créer un compte</button>
        <div style={{height:24}}/>
      </div>
    </div>
  );
};

/* Modale upgrade – s'affiche quand un gratuit tente d'accéder à une rubrique premium */
const UpgradeModal = ({onClose,onPay}) => (
  <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",zIndex:99,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
    <div style={{width:"100%",background:"#fff",borderRadius:"28px 28px 0 0",padding:"28px 24px 32px",animation:"stin 280ms var(--eo)"}} onClick={e=>e.stopPropagation()}>
      <div style={{width:40,height:4,borderRadius:2,background:C.surfH,margin:"0 auto 20px"}}/>
      <div style={{width:56,height:56,borderRadius:16,background:C.orangeL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:28}}>⭐</div>
      <p style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,color:C.ink,textAlign:"center",marginBottom:8}}>Abonnement Premium</p>
      <p style={{fontSize:13,color:C.muted,textAlign:"center",lineHeight:1.6,marginBottom:20}}>Alerte Violence et Alerte Enlèvement sont réservées aux comptes Premium après le mois d'essai gratuit Akwaba.</p>
      <div style={{background:C.surf,borderRadius:14,padding:"12px 14px",marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 0"}}>
          <span style={{fontSize:18}}>⭐</span>
          <span style={{fontSize:13,fontWeight:600,color:C.ink,flex:1}}>Abonnement annuel</span>
          <span style={{fontSize:12,fontWeight:700,color:C.orange}}>{PRIX_PREMIUM_FCFA.toLocaleString("fr-FR")} FCFA / an</span>
        </div>
      </div>
      <button className="btn btn-p" onClick={onPay}>S'abonner <I n="arrow" s={16} c="#fff"/></button>
      <button className="btn btn-g" style={{marginTop:8}} onClick={onClose}>Plus tard</button>
    </div>
  </div>
);

/* ── FEED ALERTES INFO ─────────────────────────────────────── */
const AlertesInfoFeed = ({go, alertesPubliques=[]}) => {
  const alertes = [...alertesPubliques]
    .sort((a,b)=>b.ts-a.ts)
    .slice(0,3);

  if(alertes.length===0){
    return (
      <div style={{padding:"0 20px"}}>
        <div style={{background:"#fff",border:"1px solid rgba(0,0,0,.07)",borderRadius:18,padding:"20px 16px",textAlign:"center"}}>
          <p style={{fontSize:12,color:"#A8A29E"}}>Aucune alerte active pour le moment</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
      {alertes.map((a,i)=>(
        <button key={a.id||i} onClick={()=>go(a.cible||"info")}
          style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:`1px solid ${a.urgent?(a.c||"#EF4444")+"33":"rgba(0,0,0,.07)"}`,borderRadius:18,padding:"14px 16px",cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"Plus Jakarta Sans,sans-serif"}}>
          <div style={{width:42,height:42,borderRadius:13,background:a.bg||"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
              <span style={{fontSize:9,fontWeight:800,color:a.c||"#78716C",background:a.bg||"#F5F5F4",padding:"2px 7px",borderRadius:6,letterSpacing:".5px"}}>{a.service}</span>
              {a.urgent&&<span style={{fontSize:8,fontWeight:800,color:"#fff",background:"#EF4444",padding:"2px 6px",borderRadius:6}}>URGENT</span>}
              <span style={{fontSize:10,color:"#A8A29E"}}>{formatHeureRelative(a.ts)}</span>
            </div>
            <p style={{fontSize:13,fontWeight:700,color:"#1C1917",marginBottom:2,lineHeight:1.2}}>{a.titre}</p>
            <p style={{fontSize:11,color:"#78716C",lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.apercu}</p>
          </div>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#A8A29E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
        </button>
      ))}
    </div>
  );
};

const Home = ({go, plan="gratuit", userInfo={}, alertesPubliques=[]}) => {
  const [showUpgrade,setShowUpgrade]=useState(false);
  const d=(n)=>({animationDelay:`${n*60}ms`});
  const nomAffiche = userInfo.nm || "Bienvenue";
  const initiales = nomAffiche.split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()||"??";
  const enEssai = essaiEnCours(userInfo);
  const premiumOk = accesPremiumActif(userInfo);
  const joursEssai = joursRestantsEssai(userInfo);

  const goProtected=(sc)=>{
    const premiumScreens=["violence","enlevement"];
    if(premiumScreens.includes(sc) && !premiumOk){
      setShowUpgrade(true);
    } else {
      go(sc);
    }
  };

  return (
    <div className="scr on" style={{display:"flex",position:"relative"}}>
      {showUpgrade&&<UpgradeModal onClose={()=>setShowUpgrade(false)} onPay={()=>{setShowUpgrade(false);go("paiement");}}/>}
      <div className="scrl">
        <div className="hdr">
          <div>
            <p style={{fontSize:13,color:C.muted,fontWeight:500}}>Bonjour 👋</p>
            <p style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800,color:C.ink,letterSpacing:"-.5px",marginTop:2}}>{nomAffiche}</p>
          </div>
          <button className="av" onClick={()=>go("profil")}>{initiales}</button>
        </div>
        {enEssai&&(
          <div className="si" style={d(0)}>
            <div className="bnr">
              <p className="bl">✦ ESSAI AKWABA</p>
              <p className="bt">{joursEssai} jour{joursEssai>1?"s":""} d'essai gratuit restant{joursEssai>1?"s":""}</p>
              <p className="bd">Accès complet à Alerte Violence et Alerte Enlèvement. Ensuite, {PRIX_PREMIUM_FCFA.toLocaleString("fr-FR")} FCFA / an pour continuer.</p>
              <button className="sbb" onClick={()=>go("paiement")}>S'abonner <I n="arrow" s={14} c="#fff"/></button>
            </div>
          </div>
        )}
        {!enEssai&&!premiumOk&&(
          <div className="si" style={d(0)}>
            <div className="bnr" style={{background:"linear-gradient(135deg,#450A0A,#7F1D1D)"}}>
              <p className="bl" style={{color:"#FCA5A5"}}>✦ ESSAI TERMINÉ</p>
              <p className="bt">Abonnement Premium requis</p>
              <p className="bd">Votre mois Akwaba est terminé. Abonnez-vous ({PRIX_PREMIUM_FCFA.toLocaleString("fr-FR")} FCFA / an) pour garder l'accès à Alerte Violence et Alerte Enlèvement.</p>
              <button className="sbb" onClick={()=>go("paiement")}>S'abonner <I n="arrow" s={14} c="#fff"/></button>
            </div>
          </div>
        )}
        {!enEssai&&premiumOk&&(
          <div className="si" style={{...d(0),margin:"16px 20px 0",background:"linear-gradient(135deg,#064E3B,#065F46)",borderRadius:24,padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:24}}>⭐</span>
            <div>
              <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:"1px"}}>Abonnement Premium actif</p>
              <p style={{fontSize:14,fontWeight:800,color:"#fff",marginTop:2}}>Accès complet à Alerte Violence et Alerte Enlèvement</p>
            </div>
          </div>
        )}
        <div className="sh" style={{marginTop:8}}><span className="stl">Accès rapide</span></div>
        <div className="qa">
          {[
            {sc:"violence",lock:!premiumOk,
              bg:!premiumOk?"linear-gradient(135deg,#94A3B8,#64748B)":"linear-gradient(135deg,#FF6B35,#F97316)",
              svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z" fill="#fff" opacity=".9"/><path d="M9 21h6M10 18v3M14 18v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
              lb:"Alerte\nViolence"},
            {sc:"enlevement",lock:!premiumOk,
              bg:!premiumOk?"linear-gradient(135deg,#94A3B8,#64748B)":"linear-gradient(135deg,#7C3AED,#5B21B6)",
              svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill="#fff" opacity=".9"/><circle cx="12" cy="10" r="3" fill="#5B21B6"/></svg>,
              lb:"Alerte\nEnlèvement"},
          ].map((it,i)=>(
            <button key={i} className="qb si" style={{...d(i+1),position:"relative",
              background:it.bg,borderRadius:18,padding:"16px 10px 12px",
              border:"none",cursor:"pointer",display:"flex",flexDirection:"column",
              alignItems:"center",gap:8,
              boxShadow:`0 4px 14px ${it.lock?"rgba(100,116,139,.3)":"rgba(0,0,0,.12)"}`}}
              onClick={()=>goProtected(it.sc)}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.2)", display:"flex",alignItems:"center",justifyContent:"center"}}>
                {it.svg}
              </div>
              <span style={{fontSize:11,fontWeight:700,color:"#fff",textAlign:"center", lineHeight:1.3,whiteSpace:"pre-line",opacity:.95}}>
                {it.lb}
              </span>
              {it.lock&&(
                <div style={{position:"absolute",top:6,right:6,width:18,height:18, borderRadius:"50%",background:"rgba(0,0,0,.2)", display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>
                  🔒
                </div>
              )}
            </button>
          ))}
        </div>

        {FEATURES.alerteInfo&&(
          <div className="sh">
            <span className="stl">Alertes & Informations</span>
            <button className="sea" onClick={()=>go("info")}>Voir tout</button>
          </div>
        )}
        {/* Rubrique masquée à la demande pour cette version — le code,
            les données (alertesPubliques) et la diffusion restent intacts.
        <AlertesInfoFeed go={go} alertesPubliques={alertesPubliques}/>
        */}
        <div style={{height:20}}/>
      </div>
      <Nav a="home" go={go}/>
    </div>
  );
};

const Violence = ({go,goBack,userInfo={}}) => {
  const nom = userInfo.nm && userInfo.nm.trim() ? userInfo.nm.trim() : "l'utilisateur";
  const [alarmeOn,setAlarmeOn]=useState(false);
  const [ecouteAuto,setEcouteAuto]=useState(false);
  const [notifEnvoyee,setNotifEnvoyee]=useState(false);
  const [alerteContact,setAlerteContact]=useState(null);
  const recoRef=useRef(null);
  const alarmeIntervalRef=useRef(null);
  const sonnerie=useRef(null);
  const [gpsVictime,setGpsVictime]=useState(null);
  const [gpsLoad,setGpsLoad]=useState(false);
  const [enDirect,setEnDirect]=useState(false);
  const enDirectRef=useRef(null);
  useEffect(()=>{
    if(navigator.geolocation){
      setGpsLoad(true);
      navigator.geolocation.getCurrentPosition(
        pos=>{ setGpsVictime({lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy)}); setGpsLoad(false); },
        ()=>{ setGpsLoad(false); /* GPS refusé ou indisponible → on laisse null, pas de fausse position */ },
        {timeout:10000,enableHighAccuracy:true}
      );
    }
  },[]);
  useEffect(()=>{
    if(enDirect&&alarmeOn){
      enDirectRef.current=setInterval(()=>{
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(
            pos=>setGpsVictime({lat:pos.coords.latitude,lng:pos.coords.longitude,acc:Math.round(pos.coords.accuracy)}),
            ()=>{ /* GPS indisponible, on garde la dernière position connue */ },
            {timeout:5000,enableHighAccuracy:true,maximumAge:0}
          );
        }
      },10000);
    } else {
      clearInterval(enDirectRef.current);
    }
    return ()=>clearInterval(enDirectRef.current);
  },[enDirect,alarmeOn]);

  const playAlarmeChezContact=()=>{
    try{
      const ctx=_obtenirCtxAudio();
      if(!ctx) return;
      try{ if(ctx.state==="suspended") ctx.resume(); }catch(e){}
      const compressor=ctx.createDynamicsCompressor();
      compressor.threshold.value=-6;
      compressor.knee.value=0;
      compressor.ratio.value=20;
      compressor.attack.value=0;
      compressor.release.value=0.05;
      compressor.connect(ctx.destination);

      const jouerBip=(t)=>{
        [[1400,0],[1402,0],[1398,0],[1000,0],[1002,0]].forEach(([freq])=>{
          [[1400,t,0.05],[1000,t+0.1,0.05],[1400,t+0.2,0.05],[1000,t+0.3,0.05],
           [1400,t+0.4,0.05],[1000,t+0.5,0.05],[1400,t+0.6,0.05],[1000,t+0.7,0.05]];
        });
        [[1400,t,0.05],[1000,t+0.1,0.05],[1400,t+0.2,0.05],[1000,t+0.3,0.05],
         [1400,t+0.4,0.05],[1000,t+0.5,0.05],[1400,t+0.6,0.05],[1000,t+0.7,0.05]].forEach(([f,st,d])=>{
          const o1=ctx.createOscillator(),g1=ctx.createGain();
          o1.connect(g1);g1.connect(compressor);
          o1.type="square";o1.frequency.value=f;
          g1.gain.setValueAtTime(0,ctx.currentTime+st);
          g1.gain.linearRampToValueAtTime(1.0,ctx.currentTime+st+0.002);
          g1.gain.linearRampToValueAtTime(0,ctx.currentTime+st+d);
          o1.start(ctx.currentTime+st);o1.stop(ctx.currentTime+st+d+0.002);
          const o2=ctx.createOscillator(),g2=ctx.createGain();
          o2.connect(g2);g2.connect(compressor);
          o2.type="sawtooth";o2.frequency.value=f*1.002;
          g2.gain.setValueAtTime(0,ctx.currentTime+st);
          g2.gain.linearRampToValueAtTime(0.8,ctx.currentTime+st+0.002);
          g2.gain.linearRampToValueAtTime(0,ctx.currentTime+st+d);
          o2.start(ctx.currentTime+st);o2.stop(ctx.currentTime+st+d+0.002);
        });
      };
      for(let i=0;i<4;i++) jouerBip(i*0.85);
    }catch(e){}
    if(navigator.vibrate){
      navigator.vibrate([300,100,300,100,600,200,300,100,300,100,600]);
    }
    const envoyerNotifSysteme=(posGps)=>{
      try{
        const coordsTxt=posGps
          ?`📍 GPS : ${posGps.lat.toFixed(5)}, ${posGps.lng.toFixed(5)} (±${posGps.acc}m)`
          :"📍 Position GPS non disponible";
        new Notification("🚨 ALERTE CI — URGENCE", {
          body:`⚠️ ${nom} EST EN DANGER !\nAppellez-la immédiatement.\n${coordsTxt}`,
          icon:"/favicon.ico",
          badge:"/favicon.ico",
          tag:"alerte-violence",
          requireInteraction:true,
          silent:false,
        });
      }catch(e){}
    };

    if(typeof Notification!=="undefined"){
      if(Notification.permission==="granted"){
        envoyerNotifSysteme(null); // sera appelé avec posGps lors du déclenchement réel
      } else if(Notification.permission!=="denied"){
        Notification.requestPermission().then(p=>{
          if(p==="granted") envoyerNotifSysteme(null);
        });
      }
    }
    setTimeout(()=>{
      if(!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const msg=`Alerte urgente ! ${nom} est en danger ! Appelez-la immédiatement !`;
      const u=new SpeechSynthesisUtterance(msg);
      const voix=window.speechSynthesis.getVoices();
      const frVoix=voix.find(v=>v.lang==="fr-FR"&&v.name.toLowerCase().includes("google"))
        ||voix.find(v=>v.lang==="fr-FR"&&!v.name.toLowerCase().includes("compact"))
        ||voix.find(v=>v.lang.startsWith("fr"))||voix[0];
      if(frVoix) u.voice=frVoix;
      u.lang="fr-FR"; u.rate=0.82; u.pitch=0.9; u.volume=1;
      window.speechSynthesis.speak(u);
    }, 900); // décalé pour que la sonnerie passe en premier
  };

  const [contacts,setContacts]=useState(()=>{
    try{ const s=window.localStorage.getItem("alerteci_contacts_violence"); return s?JSON.parse(s):[]; }catch(e){ return []; }
  });
  useEffect(()=>{ try{ window.localStorage.setItem("alerteci_contacts_violence", JSON.stringify(contacts)); }catch(e){} },[contacts]);
  const [showContacts,setShowContacts]=useState(false);
  const [editContact,setEditContact]=useState(null); // null | {idx, nm, ph} | "new"
  const COULEURS=["#F97316","#3B82F6","#16A34A","#8B5CF6","#EC4899","#EF4444"];

  const [notifContactEnvoyee,setNotifContactEnvoyee]=useState(null);

  const saveContact=()=>{
    if(!editContact||!editContact.nm.trim()||editContact.ph.length<10) return;
    const initiales=editContact.nm.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const couleur=COULEURS[editContact.idx!==undefined?editContact.idx%COULEURS.length:contacts.length%COULEURS.length];
    if(editContact.idx!==undefined){
      setContacts(p=>p.map((c,i)=>i===editContact.idx?{nm:editContact.nm.trim(),ph:editContact.ph,c:couleur,in:initiales}:c));
    } else {
      if(contacts.length>=3) return;
      setContacts(p=>[...p,{nm:editContact.nm.trim(),ph:editContact.ph,c:couleur,in:initiales}]);
    }
    const nmContact=editContact.nm.trim();
    const sendNotif=()=>{
      try{
        new Notification("🛡️ ALERTE CI — Contact d'urgence",{
          body:`Bonjour ${nmContact} ! Vous avez été désigné(e) contact d'urgence par ${nom}. Vous recevrez une alerte immédiate en cas de danger.`,
          tag:`urgence-violence-${editContact.ph}`,
          requireInteraction:true,
        });
      }catch(e){}
    };
    if(typeof Notification!=="undefined"){
      if(Notification.permission==="granted") sendNotif();
      else if(Notification.permission!=="denied") Notification.requestPermission().then(p=>{if(p==="granted") sendNotif();});
    }
    setEditContact(null);
    setNotifContactEnvoyee(nmContact);
    setTimeout(()=>setNotifContactEnvoyee(null),3500);
    playNotif();
  };

  const supprimerContact=(i)=>{
    setContacts(p=>p.filter((_,j)=>j!==i));
  };

  /* ── Alarme silencieuse sur le téléphone de la victime ──
     Le son NE joue PAS ici. Il est déclenché uniquement
     dans l'app des contacts d'urgence (modale alerteContact). ── */

  /* ── Envoi RÉEL aux contacts d'urgence via le serveur national ─────────
     L'alerte part vers les numéros enregistrés : elle sonnera sur LEURS
     téléphones (identifiés par leur numéro), et strictement rien ne se
     déclenche ici, sur le téléphone de la personne en danger — ni son,
     ni pop-up, pour ne pas attirer l'attention de l'agresseur. ── */
  const alerteIdRef=useRef(null);
  const dernierGpsRef=useRef(null);
  /* Tant que l'alerte est active et que le serveur refuse, on RÉESSAIE
     l'envoi toutes les 10 secondes — et l'écran affiche la vérité. */
  useEffect(()=>{
    if(!alarmeOn) return;
    const it=setInterval(()=>{
      const d=dernierEnvoiUrgence();
      if(d && !d.ok && alerteIdRef.current) envoyerAuxContacts(dernierGpsRef.current);
    }, 10000);
    return ()=>clearInterval(it);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[alarmeOn]);
  const envoyerAuxContacts=(posGps)=>{
    if(posGps) dernierGpsRef.current=posGps;
    if(posGps) setGpsVictime(posGps);
    if(!alerteIdRef.current) alerteIdRef.current=`urg-${Date.now()}`;
    cloudPublierUrgence({
      type:"violence",
      alerteId:alerteIdRef.current,
      victime:{ nm:nom, ph:userInfo.ph||"" },
      cibles:contacts.map(c=>c.ph),
      gps:posGps||null,
      lienMaps:posGps?`https://maps.google.com/?q=${posGps.lat},${posGps.lng}`:null,
      ts:Date.now(),
    });
  };

  /* ── Arrêter l'alerte ── */
  const stopAlarme=()=>{
    try{window.speechSynthesis&&window.speechSynthesis.cancel();}catch(e){}
    clearInterval(alarmeIntervalRef.current);
    clearInterval(enDirectRef.current);
    recoRef.current&&recoRef.current.stop();
    /* Prévenir les contacts que l'alerte est levée, puis clore le cycle. */
    if(alerteIdRef.current){
      cloudPublierUrgence({
        type:"violence", fin:true, alerteId:alerteIdRef.current,
        victime:{ nm:nom, ph:userInfo.ph||"" },
        cibles:contacts.map(c=>c.ph), ts:Date.now(),
      });
      alerteIdRef.current=null;
    }
    setAlarmeOn(false);
    setNotifEnvoyee(false);
    setEnDirect(false);
    setAlerteContact(null);
  };

  /* ── Déclencher : capture la position GPS réelle du téléphone
     AU MOMENT de la violence, puis envoie aux contacts ── */
  const declencherAlarme=()=>{
    setAlarmeOn(true);
    setNotifEnvoyee(true);
    setEnDirect(true);
    setGpsLoad(true);
    /* IMPORTANT : aucune sirène ICI. L'alarme sonne UNIQUEMENT chez les
       contacts d'urgence — le téléphone de la personne en danger reste
       silencieux pour ne pas aggraver la situation. Le déclenchement
       (manuel ou reconnaissance d'un des deux cris) est envoyé aux
       contacts, chez qui la sirène retentit en continu. */

    const envoyerAvecGps=(posGps)=>{
      setGpsLoad(false);
      envoyerAuxContacts(posGps);
      alarmeIntervalRef.current=setInterval(()=>{
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(
            pos=>envoyerAuxContacts({
              lat:pos.coords.latitude,
              lng:pos.coords.longitude,
              acc:Math.round(pos.coords.accuracy)
            }),
            ()=>envoyerAuxContacts(null), // envoie sans position si GPS indisponible
            {timeout:5000,enableHighAccuracy:true,maximumAge:0}
          );
        } else {
          envoyerAuxContacts(null);
        }
      },30000);
    };
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos=>{
          const posGps={
            lat:pos.coords.latitude,
            lng:pos.coords.longitude,
            acc:Math.round(pos.coords.accuracy)
          };
          envoyerAvecGps(posGps);
        },
        ()=>{
          envoyerAvecGps(null);
        },
        {timeout:8000,enableHighAccuracy:true,maximumAge:0}
      );
    } else {
      envoyerAvecGps(null);
    }
  };
  const [cris,setCris]=useState(()=>{
    /* Restaurer les 2 cris sauvegardés (audio + empreinte de reconnaissance). */
    const restaure=(i)=>{
      try{
        const s=window.localStorage.getItem("alerteci_cri_"+i);
        if(!s) return null;
        const d=JSON.parse(s);
        if(!d||!d.b64) return null;
        return {url:d.b64, duree:d.duree||1, empreinte:d.empreinte||null};
      }catch(e){ return null; }
    };
    return [restaure(0),restaure(1)];
  }); // [{url, duree, empreinte}] — cris enregistrés, conservés sur le téléphone
  const [enregCri,setEnregCri]=useState(null); // null | 0 | 1 (index en cours d'enregistrement)
  const [enregEcoute,setEnregEcoute]=useState(false);
  const enregRef=useRef(null); // MediaRecorder en cours
  const chunksRef=useRef([]);
  const streamRef=useRef(null);
  const debutEnregRef=useRef(0);

  const [criManuel,setCriManuel]=useState(["",""]); // saisie manuelle fallback (si micro indisponible)
  const [showManuel,setShowManuel]=useState([false,false]);
  const [lectureIdx,setLectureIdx]=useState(null); // index de la note vocale en cours de lecture
  const audioPlayerRef=useRef(null);

  const [aideMicro,setAideMicro]=useState(false);
  const enregistrerCri=async(idx)=>{
    setAideMicro(false);
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){
      setAideMicro(true);
      return;
    }
    arreterEcoute(); // suspendre l'écoute permanente pendant l'enregistrement
    setEnregCri(idx);
    setEnregEcoute(false); // true uniquement une fois le micro réellement ouvert
    let stream;
    // Sécurité : si le micro n'est jamais accordé (permission refusée,
    // navigateur sandboxé, etc.), on bascule vers la saisie manuelle après 4s.
    const securite=setTimeout(()=>{
      setEnregEcoute(false);
      setEnregCri(prev=>prev===idx?null:prev);
      setAideMicro(true);
      try{ streamRef.current&&streamRef.current.getTracks().forEach(t=>t.stop()); }catch(e){}
    },12000);
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
    }catch(e){
      clearTimeout(securite);
      setEnregEcoute(false); setEnregCri(null);
      setAideMicro(true);
      return;
    }
    clearTimeout(securite);
    streamRef.current=stream;
    setEnregEcoute(true);
    chunksRef.current=[];
    debutEnregRef.current=Date.now();
    /* Analyse en parallèle : on capture le SPECTRE du cri pendant qu'il est
       enregistré. Cette empreinte servira ensuite à le RECONNAÎTRE. */
    const spectres=[];
    let ctxEmp=null, rafEmp=null;
    try{
      ctxEmp=_obtenirCtxAudio();
      if(ctxEmp&&ctxEmp.state==="suspended") ctxEmp.resume();
      const srcE=ctxEmp.createMediaStreamSource(stream);
      const anE=ctxEmp.createAnalyser(); anE.fftSize=1024; anE.smoothingTimeConstant=0.3;
      srcE.connect(anE);
      const td=new Uint8Array(anE.frequencyBinCount);
      const fd=new Uint8Array(anE.frequencyBinCount);
      const capter=()=>{
        anE.getByteTimeDomainData(td);
        let s=0; for(let i=0;i<td.length;i++){const v=(td[i]-128)/128; s+=v*v;}
        if(Math.sqrt(s/td.length)>=0.10){
          anE.getByteFrequencyData(fd);
          const bandes=32, taille=Math.floor(fd.length/bandes), sp=[];
          for(let b=0;b<bandes;b++){let a=0;for(let i=0;i<taille;i++)a+=fd[b*taille+i];sp.push(a/taille);}
          spectres.push(sp);
        }
        rafEmp=requestAnimationFrame(capter);
      };
      rafEmp=requestAnimationFrame(capter);
    }catch(e){}
    let mr;
    try{
      mr=new window.MediaRecorder(stream);
    }catch(e){
      stream.getTracks().forEach(t=>t.stop());
      setEnregEcoute(false); setEnregCri(null);
      setAideMicro(true);
      return;
    }
    mr.ondataavailable=(e)=>{ if(e.data&&e.data.size>0) chunksRef.current.push(e.data); };
    mr.onstop=()=>{
      try{ cancelAnimationFrame(rafEmp); }catch(e){} /* contexte partagé : ne pas fermer */
      const duree=Math.max(0.1,(Date.now()-debutEnregRef.current)/1000);
      const blob=new Blob(chunksRef.current,{type:mr.mimeType||"audio/webm"});
      const url=URL.createObjectURL(blob);
      /* Empreinte = spectre moyen normalisé des instants forts du cri */
      let empreinte=null;
      if(spectres.length>=3){
        const n=spectres[0].length; const m=new Array(n).fill(0);
        spectres.forEach(s=>{for(let i=0;i<n;i++)m[i]+=s[i];});
        for(let i=0;i<n;i++)m[i]/=spectres.length;
        const somme=m.reduce((a,b)=>a+b,0)||1;
        empreinte=m.map(v=>v/somme);
      }
      setCris(p=>{const n=[...p]; n[idx]={url,duree,empreinte}; return n;});
      /* Persister le cri (audio + empreinte) : il survivra à la fermeture. */
      try{
        const lecteur=new FileReader();
        lecteur.onload=()=>{
          try{
            const cle="alerteci_cri_"+idx;
            window.localStorage.setItem(cle, JSON.stringify({b64:lecteur.result,duree,empreinte}));
          }catch(e){}
        };
        lecteur.readAsDataURL(blob);
      }catch(e){}
      setEnregEcoute(false); setEnregCri(null);
      try{ stream.getTracks().forEach(t=>t.stop()); }catch(e){}
      playNotif();
    };
    enregRef.current=mr;
    // Enregistrement plafonné à 5 secondes — suffisant pour un cri/mot déclencheur.
    try{
      mr.start();
      setTimeout(()=>{ try{ if(mr.state==="recording") mr.stop(); }catch(e){} },5000);
    }catch(e){
      stream.getTracks().forEach(t=>t.stop());
      setEnregEcoute(false); setEnregCri(null);
      setAideMicro(true);
    }
  };

  const arreterEnreg=(idx)=>{
    try{
      if(enregRef.current&&enregRef.current.state==="recording") enregRef.current.stop();
    }catch(e){}
  };

  const validerCriManuel=(idx)=>{
    const val=criManuel[idx].trim().toLowerCase();
    if(!val) return;
    setCris(p=>{const n=[...p]; n[idx]={texte:val}; return n;});
    setCriManuel(p=>{const n=[...p];n[idx]="";return n;});
    setShowManuel(p=>{const n=[...p];n[idx]=false;return n;});
    playNotif();
  };

  const annulerEnreg=()=>{
    try{ enregRef.current&&enregRef.current.state==="recording"&&enregRef.current.stop(); }catch(e){}
    try{ streamRef.current&&streamRef.current.getTracks().forEach(t=>t.stop()); }catch(e){}
    setEnregEcoute(false); setEnregCri(null);
  };

  /* ── Détection vocale automatique — TOUJOURS ACTIVE.
     Analyse le micro en continu (volume + empreinte sonore). Si les deux
     cris de référence sont enregistrés, l'alarme se déclenche quand le son
     détecté RESSEMBLE à l'un des deux (comparaison du spectre de fréquences)
     ou en cas de cri très fort (sécurité). Sans cris enregistrés, le volume
     seul suffit. L'écoute redémarre d'elle-même et ne peut pas être
     désactivée : c'est une protection permanente. ── */
  const ecouteVoulueRef=useRef(false);
  /* Préférence on/off de la détection vocale automatique (persistée). */
  const [detectionActivee,setDetectionActivee]=useState(()=>{
    try{ const v=window.localStorage.getItem("alerteci_detection_vocale"); return v===null?true:v==="1"; }
    catch(e){ return true; }
  });
  useEffect(()=>{ try{ window.localStorage.setItem("alerteci_detection_vocale", detectionActivee?"1":"0"); }catch(e){} },[detectionActivee]);
  const audioCtxRef=useRef(null);
  const analyseRef=useRef(null);
  const ecouteStreamRef=useRef(null);
  const sourceEcouteRef=useRef(null);
  const rafRef=useRef(null);
  const piquesRef=useRef(0);
  const spectresFortsRef=useRef([]); // spectres accumulés pendant le son fort
  const [ecouteErr,setEcouteErr]=useState("");
  const [testSirene,setTestSirene]=useState(false);
  const [diagRes,setDiagRes]=useState([]);
  const [txEtat,setTxEtat]=useState(null); // état réel de transmission de l'alerte
  useEffect(()=>{
    if(!alarmeOn){ setTxEtat(null); return; }
    const lire=()=>{ const d=dernierEnvoiUrgence(); if(d) setTxEtat({...d}); };
    lire();
    const it=setInterval(lire, 2000);
    return ()=>clearInterval(it);
  },[alarmeOn]);

  /* ── CRIS PAR DÉFAUT fournis par l'application ──
     Deux profils sonores types d'un cri humain de détresse (32 bandes de
     fréquences, normalisées) : un cri aigu soutenu, et un appel puissant
     plus grave. L'utilisateur peut y AJOUTER ses deux propres cris — et
     SEULS ces cris (défaut + personnels) déclenchent l'alarme. */
  const CRIS_DEFAUT=[
    /* Cri aigu type « AAAAH ! » — énergie concentrée 700 Hz – 3 kHz */
    [0.030,0.085,0.130,0.150,0.140,0.115,0.090,0.070,0.050,0.035,0.026,0.020,0.015,0.011,0.008,0.006,0.005,0.004,0.003,0.002,0.002,0.001,0.001,0.001,0.000,0.000,0.000,0.000,0.000,0.000,0.000,0.000],
    /* Appel puissant type « AU SECOURS ! » — énergie large 300 Hz – 2 kHz */
    [0.080,0.145,0.150,0.125,0.100,0.080,0.062,0.048,0.038,0.030,0.024,0.019,0.015,0.012,0.010,0.008,0.006,0.005,0.004,0.003,0.003,0.002,0.002,0.002,0.001,0.001,0.001,0.001,0.000,0.000,0.000,0.000],
  ];

  /* Similarité de FORME entre deux empreintes spectrales (corrélation centrée).
     On compare la FORME du spectre, pas son niveau : un bruit uniforme
     (moteur, musique forte, foule) donne ~0 face à un profil de cri, alors
     qu'un vrai cri — même d'une voix différente — garde une forte
     ressemblance de forme (bosse d'énergie dans les mêmes fréquences). */
  const similariteSpectrale=(a,b)=>{
    if(!a||!b||a.length!==b.length) return 0;
    const n=a.length;
    let ma=0,mb=0;
    for(let i=0;i<n;i++){ ma+=a[i]; mb+=b[i]; }
    ma/=n; mb/=n;
    let ps=0,na=0,nb=0;
    for(let i=0;i<n;i++){
      const va=a[i]-ma, vb=b[i]-mb;
      ps+=va*vb; na+=va*va; nb+=vb*vb;
    }
    if(na<1e-9||nb<1e-9) return 0; // spectre plat → aucune forme → rejet
    return ps/Math.sqrt(na*nb);
  };
  const moyenneSpectres=(liste)=>{
    if(!liste.length) return null;
    const n=liste[0].length; const m=new Array(n).fill(0);
    liste.forEach(s=>{ for(let i=0;i<n;i++) m[i]+=s[i]; });
    for(let i=0;i<n;i++) m[i]/=liste.length;
    const somme=m.reduce((x,y)=>x+y,0)||1;
    return m.map(v=>v/somme);
  };

  const demarrerEcoute=async()=>{
    if(ecouteVoulueRef.current) return; // déjà en cours
    setEcouteErr("");
    ecouteVoulueRef.current=true;
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
      setEcouteErr("Le micro n'est pas accessible sur cet appareil.");
      setEcouteAuto(false); ecouteVoulueRef.current=false; return;
    }
    let stream;
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    }catch(e){
      setEcouteErr("Micro refusé. Autorisez le microphone dans les réglages pour activer la protection vocale.");
      setEcouteAuto(false); ecouteVoulueRef.current=false; return;
    }
    ecouteStreamRef.current=stream;
    const ctx=_obtenirCtxAudio();
    if(!ctx){
      setEcouteErr("Analyse audio indisponible sur cet appareil.");
      setEcouteAuto(false); ecouteVoulueRef.current=false;
      try{ stream.getTracks().forEach(t=>t.stop()); }catch(_){}
      return;
    }
    audioCtxRef.current=ctx;
    try{ if(ctx.state==="suspended") await ctx.resume(); }catch(e){}
    const source=ctx.createMediaStreamSource(stream);
    sourceEcouteRef.current=source;
    const analyser=ctx.createAnalyser();
    analyser.fftSize=1024; analyser.smoothingTimeConstant=0.3;
    source.connect(analyser);
    analyseRef.current=analyser;
    setEcouteAuto(true);
    piquesRef.current=0;
    spectresFortsRef.current=[];
    const data=new Uint8Array(analyser.frequencyBinCount);
    const freq=new Uint8Array(analyser.frequencyBinCount);

    const SEUIL=0.13;        // niveau d'un cri
    const IMAGES_REQUISES=5; // ~0,25 s de son fort continu
    const SIM_MIN=0.45;      // ressemblance minimale avec un cri enregistré (tolérant)

    const extraireSpectre=()=>{
      analyser.getByteFrequencyData(freq);
      /* 32 bandes moyennées → empreinte compacte du timbre du son */
      const bandes=32, taille=Math.floor(freq.length/bandes), s=[];
      for(let b=0;b<bandes;b++){
        let acc=0;
        for(let i=0;i<taille;i++) acc+=freq[b*taille+i];
        s.push(acc/taille);
      }
      return s;
    };

    const boucle=()=>{
      if(!ecouteVoulueRef.current){ return; }
      analyser.getByteTimeDomainData(data);
      let somme=0;
      for(let i=0;i<data.length;i++){ const v=(data[i]-128)/128; somme+=v*v; }
      const rms=Math.sqrt(somme/data.length);
      if(rms>=SEUIL){
        piquesRef.current++;
        spectresFortsRef.current.push(extraireSpectre());
        if(spectresFortsRef.current.length>40) spectresFortsRef.current.shift();
        if(piquesRef.current>=IMAGES_REQUISES && !alarmeOn){
          /* RECONNAISSANCE STRICTE : seuls les cris PAR DÉFAUT de l'app et
             les cris ENREGISTRÉS par l'utilisateur comptent. Un son fort qui
             ne ressemble à AUCUN d'eux (musique, klaxon, dispute voisine…)
             ne déclenche JAMAIS l'alarme. */
          const empreintes=[
            ...CRIS_DEFAUT,
            ...(crisRef.current||[]).filter(c=>c&&c.empreinte).map(c=>c.empreinte),
          ];
          const spectreDetecte=moyenneSpectres(spectresFortsRef.current);
          const meilleure=Math.max(...empreintes.map(e=>similariteSpectrale(spectreDetecte,e)));
          const declenche = meilleure>=SIM_MIN;
          if(declenche){
            arreterEcoute();
            declencherAlarme(); // la sirène sonne ici ET chez les contacts
            return;
          }
          piquesRef.current=0; spectresFortsRef.current=[];
        }
      } else {
        piquesRef.current=Math.max(0,piquesRef.current-1);
        if(piquesRef.current===0) spectresFortsRef.current=[];
      }
      rafRef.current=requestAnimationFrame(boucle);
    };
    rafRef.current=requestAnimationFrame(boucle);
  };

  const arreterEcoute=()=>{
    ecouteVoulueRef.current=false;
    try{ cancelAnimationFrame(rafRef.current); }catch(e){}
    try{ ecouteStreamRef.current&&ecouteStreamRef.current.getTracks().forEach(t=>t.stop()); }catch(e){}
    try{ sourceEcouteRef.current&&sourceEcouteRef.current.disconnect(); }catch(e){}
    /* SURTOUT ne jamais fermer le contexte : il est partagé par tous les
       sons de l'application (sirène comprise). */
    audioCtxRef.current=null; analyseRef.current=null; ecouteStreamRef.current=null; sourceEcouteRef.current=null;
    piquesRef.current=0; spectresFortsRef.current=[];
    setEcouteAuto(false);
  };

  /* Écoute PERMANENTE : démarre toute seule à l'ouverture de l'écran, et
     redémarre automatiquement (fin d'alarme, enregistrement d'un cri…). */
  const crisRef=useRef(null);
  useEffect(()=>{ crisRef.current=cris; },[cris]);
  useEffect(()=>{
    _stopperMicroEcoute=arreterEcoute; // la sirène peut couper le micro
    if(!detectionActivee){ arreterEcoute(); return; } // désactivée par l'utilisateur
    const sireneActive=()=>{ try{ return !!_sireneOsc; }catch(e){ return false; } };
    const relance=setInterval(()=>{
      if(detectionActivee && !ecouteVoulueRef.current && !alarmeOn && enregCri===null && !sireneActive()){
        demarrerEcoute();
      }
    }, 2500);
    const t=setTimeout(()=>{ if(detectionActivee && !alarmeOn && enregCri===null && !sireneActive()) demarrerEcoute(); }, 600);
    return ()=>{ clearInterval(relance); clearTimeout(t); _stopperMicroEcoute=null; arreterEcoute(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[alarmeOn,enregCri,detectionActivee]);


  useEffect(()=>()=>{
    clearInterval(alarmeIntervalRef.current);
    window.speechSynthesis&&window.speechSynthesis.cancel();
    recoRef.current&&recoRef.current.stop();
    try{ enregRef.current&&enregRef.current.state==="recording"&&enregRef.current.stop(); }catch(e){}
    try{ streamRef.current&&streamRef.current.getTracks().forEach(t=>t.stop()); }catch(e){}
  },[]);

  return (
    <div className="scr on" style={{display:"flex",position:"relative"}}>

      {alerteContact&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:99,display:"flex",flexDirection:"column",animation:"stin 200ms var(--eo)"}}>
          <div style={{background:"linear-gradient(160deg,#0F0F1A,#1A0A0A)",flex:1,display:"flex",flexDirection:"column",padding:"14px 28px 0"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:600,color:"rgba(255,255,255,.7)",marginBottom:24}}>
              <span><HeureLive/></span>
            </div>
            <div style={{textAlign:"center",marginBottom:20}}>
              <p style={{fontFamily:"Sora,sans-serif",fontSize:48,fontWeight:800,color:"#fff",letterSpacing:"-2px"}}><HeureLive/></p>
              <p style={{fontSize:13,color:"rgba(255,255,255,.55)",marginTop:4}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</p>
            </div>
            <div style={{background:"rgba(220,38,38,.96)",borderRadius:20,padding:"0",overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px 8px",borderBottom:"1px solid rgba(255,255,255,.15)"}}>
                <span style={{fontSize:15}}>🚨</span>
                <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.9)",textTransform:"uppercase",letterSpacing:"1px"}}>ALERTE CI — URGENCE</p>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#fff",animation:"bk 0.8s ease infinite",marginLeft:"auto"}}/>
              </div>
              <div style={{padding:"14px 16px"}}>
                <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>🆘 ALERTE REÇUE — URGENCE</p>
                <p style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.9)",lineHeight:1.5,marginBottom:10}}>
                  <strong style={{color:"#FFE4E4"}}>{nom}</strong> est en danger !<br/>Appelez-la immédiatement.
                </p>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,background:"rgba(0,0,0,.2)",borderRadius:10,padding:"8px 12px"}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:alerteContact.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0}}>{alerteContact.in}</div>
                  <div>
                    <p style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>Notification reçue par</p>
                    <p style={{fontSize:12,fontWeight:700,color:"#fff"}}>{alerteContact.nm}</p>
                  </div>
                </div>
                {gpsVictime&&(
                  <div style={{marginBottom:10}}>
                    <a href={`https://www.google.com/maps?q=${gpsVictime.lat},${gpsVictime.lng}&z=17&hl=fr`} target="_blank" rel="noopener noreferrer"
                      style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:"rgba(22,163,74,.7)",borderRadius:10,textDecoration:"none"}}>
                      <span style={{fontSize:12}}>📍</span>
                      <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>GPS : {gpsVictime.lat.toFixed(4)}°, {gpsVictime.lng.toFixed(4)}° · Voir Maps</span>
                    </a>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <a href={`tel:${contacts.find(ct=>ct.in===alerteContact.in)?.ph||""}`}
                    style={{padding:"12px",borderRadius:12,background:"#fff",color:"#DC2626",fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:6,textDecoration:"none"}}>
                    <I n="phone" s={15} c="#DC2626"/>Appeler
                  </a>
                  <button onClick={()=>setAlerteContact(null)}
                    style={{padding:"12px",borderRadius:12,border:"1px solid rgba(255,255,255,.25)",background:"rgba(255,255,255,.1)",color:"#fff",fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    Fermer
                  </button>
                </div>
              </div>
            </div>
            <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,.3)",padding:"20px 0",marginTop:"auto"}}>Glissez vers le haut pour déverrouiller</p>
          </div>
        </div>
      )}
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={alarmeOn?"#DC2626":C.ink}/></button>
          <p className="scrttl" style={{color:alarmeOn?"#DC2626":C.ink}}>
            {alarmeOn?"🔴 ALARME ACTIVE":"Alerte Violence"}
          </p>
        </div>

        {alarmeOn&&(
          <div style={{margin:"0 20px 12px",background:"linear-gradient(135deg,#EF4444,#DC2626)",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,animation:"stin 300ms var(--eo)"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:"po 1.2s ease-out infinite"}}>
              <I n="alert" s={20} c="#fff"/>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:800,color:"#fff"}}>🔊 ALARME EN COURS</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.85)",marginTop:2}}>
                "Alerte urgente ! {nom} est en danger !"
              </p>
            </div>
            <button onClick={()=>envoyerAuxContacts()}
              style={{fontSize:10,fontWeight:700,color:"#fff",background:"rgba(255,255,255,.2)",border:"none",borderRadius:10,padding:"5px 10px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",flexShrink:0}}>
              Voir notif contact
            </button>
          </div>
        )}

        <div className="vhero" style={{background:alarmeOn?"linear-gradient(145deg,#7F1D1D,#991B1B)":"linear-gradient(145deg,#7C2D12,#9A3412)"}}>
          <div className="pr">
            <div className="pi" style={{background:alarmeOn?"#DC2626":C.orange}}>
              <I n="mic" s={28} c="#fff"/>
            </div>
          </div>
          <p className="hl">{ecouteAuto?"🎙️ ÉCOUTE ACTIVE — micro ouvert":"Signal vocal configuré"}</p>
          <p className="ht">{alarmeOn?"⚡ Contacts alertés":"Prête à vous protéger"}</p>
          <p className="hd">
            {alarmeOn
              ?(txEtat&&!txEtat.ok
                  ?`⚠️ PROBLÈME DE TRANSMISSION — vos contacts n'ont PAS encore reçu l'alerte.`
                  :`Vos contacts d'urgence reçoivent l'alerte dans leur application.`)
              :`Activez l'écoute automatique ou déclenchez manuellement. Message vocal : "Alerte urgente ! ${nom} est en danger !"`}
          </p>
        </div>

        {!alarmeOn&&(
          <div style={{margin:"0 20px 12px",background:"#fff",border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 16px"}}>
            <p style={{fontSize:12,fontWeight:800,color:C.ink,marginBottom:4}}>🎙️ Mes cris de détresse</p>
            <p style={{fontSize:11,color:C.muted,marginBottom:8,lineHeight:1.5}}>
              L'application reconnaît déjà <strong>2 cris de détresse par défaut</strong> (cri aigu, appel puissant). Vous pouvez y ajouter vos 2 propres cris (5s max chacun) pour une reconnaissance encore plus fiable. <strong>Seuls ces cris déclenchent l'alerte</strong> — silencieusement ici, avec sirène chez vos contacts d'urgence.
            </p>
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              <span style={{fontSize:10,fontWeight:800,background:C.greenL,color:"#166534",borderRadius:8,padding:"4px 8px"}}>✅ Cri aigu (défaut)</span>
              <span style={{fontSize:10,fontWeight:800,background:C.greenL,color:"#166534",borderRadius:8,padding:"4px 8px"}}>✅ Appel fort (défaut)</span>
            </div>
            <audio ref={audioPlayerRef} style={{display:"none"}} onEnded={()=>setLectureIdx(null)}/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[0,1].map(idx=>(
                <div key={idx} style={{background:C.surf,borderRadius:12,padding:"10px 12px", display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:"50%", background:cris[idx]?C.greenL:C.orangeL, display:"flex",alignItems:"center",justifyContent:"center", fontSize:14,flexShrink:0}}>
                    {cris[idx]?"✅":"🎤"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase", letterSpacing:".5px"}}>Cri {idx+1}</p>
                    {cris[idx]?(
                      cris[idx].url?(
                        <button
                          onClick={()=>{
                            if(!audioPlayerRef.current) return;
                            if(lectureIdx===idx){
                              audioPlayerRef.current.pause();
                              setLectureIdx(null);
                            } else {
                              audioPlayerRef.current.src=cris[idx].url;
                              audioPlayerRef.current.play().catch(()=>{});
                              setLectureIdx(idx);
                            }
                          }}
                          style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"Plus Jakarta Sans"}}>
                          <span style={{fontSize:13}}>{lectureIdx===idx?"⏸":"▶️"}</span>
                          <span style={{fontSize:12,fontWeight:700,color:C.green}}>
                            {lectureIdx===idx?"Lecture...":`Note vocale · ${cris[idx].duree.toFixed(1)}s`}
                          </span>
                        </button>
                      ):(
                        <p style={{fontSize:12,fontWeight:700,color:C.green, overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          "{cris[idx].texte}"
                        </p>
                      )
                    ):(
                      <p style={{fontSize:11,color:C.faint}}>Non enregistré</p>
                    )}
                  </div>
                  {enregCri===idx?(
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#EF4444", animation:"bk 0.6s ease infinite"}}/>
                      <span style={{fontSize:11,fontWeight:700,color:"#EF4444"}}>
                        {enregEcoute?"🎙️ Enregistrement...":"⏳ Préparation micro..."}
                      </span>
                      <button onClick={annulerEnreg}
                        style={{fontSize:10,fontWeight:700,color:C.faint,background:"#fff",
                          border:`1px solid ${C.border}`,borderRadius:8,padding:"3px 8px",
                          cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>✕</button>
                    </div>
                  ):(
                    <button
                      onClick={()=>enregistrerCri(idx)}
                      style={{fontSize:11,fontWeight:700, color:cris[idx]?C.orange:"#fff", background:cris[idx]?C.orangeL:C.orange, border:"none",borderRadius:10,padding:"6px 12px", cursor:"pointer",fontFamily:"Plus Jakarta Sans", flexShrink:0}}>
                      {cris[idx]?"🔄 Ré-enreg.":"🎤 Enregistrer"}
                    </button>
                  )}
                  {aideMicro&&(
                    <div style={{display:"flex",alignItems:"flex-start",gap:8,marginTop:6,background:"#FFF7ED",border:"1px solid rgba(249,115,22,.25)",borderRadius:12,padding:"10px 12px",animation:"stin 200ms var(--eo)"}}>
                      <span style={{fontSize:14,flexShrink:0}}>🎤</span>
                      <p style={{fontSize:11,color:"#9A3412",lineHeight:1.5,fontWeight:600}}>
                        Le microphone n'est pas accessible. L'enregistrement du cri est <strong>vocal</strong> : autorisez le micro quand votre téléphone le demande (ou dans Réglages → Applications → Alerte CI → Autorisations), puis réessayez.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {cris.filter(Boolean).length===0&&(
              <p style={{fontSize:10,color:C.faint,marginTop:8,textAlign:"center"}}>
                ℹ️ Sans cri enregistré, l'alerte se déclenche sur les mots-clés par défaut (au secours, aide, danger...)
              </p>
            )}
          </div>
        )}

        {alarmeOn&&txEtat&&(
          <div style={{margin:"0 20px 12px",background:txEtat.ok?"#F0FDF4":"#FEF2F2",
            border:`1.5px solid ${txEtat.ok?"rgba(22,163,74,.4)":"#FCA5A5"}`,borderRadius:14,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:800,color:txEtat.ok?"#166534":"#B91C1C",marginBottom:txEtat.ok?4:4}}>
              {txEtat.ok?"✓ Alerte transmise au serveur":"✗ L'alerte N'A PAS pu être transmise"}
            </p>
            {txEtat.ok&&(
              <p style={{fontSize:10,color:"#166534",lineHeight:1.5}}>
                La sirène sonne sur le téléphone de vos contacts qui ont l'application <strong>installée, connectée à leur numéro, et ouverte</strong>. Chacun doit avoir créé son compte avec le numéro que vous avez enregistré.
              </p>
            )}
            {!txEtat.ok&&(
              <p style={{fontSize:11,color:"#B91C1C",lineHeight:1.5,fontFamily:"monospace"}}>
                Raison : {txEtat.msg} (code {txEtat.code}) — nouvel essai automatique toutes les 10 s.
              </p>
            )}
          </div>
        )}
        {!alarmeOn&&(<>
          <div style={{margin:"0 20px 12px",background:"#fff",border:`1px solid ${ecouteAuto?"rgba(22,163,74,.3)":C.border}`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:ecouteAuto?C.greenL:C.surf,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <I n="mic" s={20} c={ecouteAuto?C.green:C.faint}/>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:700,color:C.ink}}>Détection vocale automatique</p>
              <p style={{fontSize:11,color:detectionActivee?(ecouteAuto?C.green:(ecouteErr?"#DC2626":C.muted)):C.muted,marginTop:2}}>
                {!detectionActivee ? "Désactivée — activez pour déclencher l'alarme sur un cri"
                  : (ecouteErr?ecouteErr:(ecouteAuto?"🟢 Micro actif — un cri reconnu déclenche l'alarme":"⏳ Activation en cours…"))}
              </p>
            </div>
            <button onClick={()=>{
                setDetectionActivee(v=>{ const nv=!v; if(!nv) arreterEcoute(); return nv; });
              }}
              aria-label="Activer ou désactiver la détection vocale"
              style={{width:52,height:30,borderRadius:15,border:"none",cursor:"pointer",flexShrink:0,padding:0,
                background:detectionActivee?C.green:"#D6D3D1",position:"relative",transition:"background 200ms"}}>
              <span style={{position:"absolute",top:3,left:detectionActivee?25:3,width:24,height:24,borderRadius:"50%",
                background:"#fff",transition:"left 200ms",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
            </button>
          </div>

          {/* ── TEST DU SON : permet de vérifier en 10 secondes que la sirène
              fonctionne sur CE téléphone. Si rien ne s'entend, c'est le
              volume MULTIMÉDIA du téléphone qu'il faut monter. ── */}
          <div style={{margin:"12px 20px 0",background:"#FFF7ED",border:"1.5px solid #FDBA74",borderRadius:16,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:800,color:"#9A3412",marginBottom:6}}>🔊 Tester la sirène sur ce téléphone</p>
            <p style={{fontSize:11,color:"#9A3412",opacity:.8,lineHeight:1.5,marginBottom:10}}>
              Appuyez, puis montez le <strong>volume</strong> avec les touches sur le côté du téléphone pendant que la sirène joue. C'est ce volume (multimédia) qu'utilisent les alertes.
            </p>
            <button onClick={()=>{
                if(testSirene){ arreterSireneUrgence(); setTestSirene(false); }
                else{
                  setTestSirene(true);
                  jouerSireneUrgence();
                  setTimeout(()=>{ arreterSireneUrgence(); setTestSirene(false); }, 10000);
                }
              }}
              style={{width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                background:testSirene?"#DC2626":"linear-gradient(135deg,#F97316,#EA580C)",
                fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:800,color:"#fff"}}>
              {testSirene?"⏹ Arrêter le test":"▶︎ Lancer le test sirène (10 s)"}
            </button>
          </div>

          {/* ── DIAGNOSTIC COMPLET : vérifie chaque maillon de la chaîne
              d'alerte SUR CE TÉLÉPHONE et affiche la vérité, étape par
              étape. Une capture d'écran de ce panneau suffit à identifier
              exactement ce qui bloque. ── */}
          <div style={{margin:"12px 20px 0",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:16,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:800,color:C.ink,marginBottom:8}}>🧪 Diagnostic complet de la chaîne d'alerte</p>
            <button onClick={async()=>{
                const res=[];
                const maj=()=>setDiagRes([...res]);
                // Étape 1 — le son
                res.push({l:"1. Son du téléphone",ok:null,d:"Sirène en cours 3 s… l'entendez-vous ?"}); maj();
                try{ jouerSireneUrgence(); }catch(e){}
                await new Promise(r=>setTimeout(r,3000));
                try{ arreterSireneUrgence(); }catch(e){}
                res[0]={l:"1. Son du téléphone",ok:"?",d:"Si vous n'avez RIEN entendu : montez le volume multimédia (touches côté) et relancez."}; maj();
                // Étape 2 — internet
                res.push({l:"2. Connexion internet",ok:null,d:"vérification…"}); maj();
                let netOk=false;
                try{ const r=await fetch(SB_URL+"/auth/v1/health",{method:"GET"}); netOk=r.status>0; }catch(e){}
                if(!netOk){ try{ const r2=await fetch(SB_URL+"/rest/v1/",{method:"GET"}); netOk=r2.status>0; }catch(e){} }
                res[1]={l:"2. Connexion internet",ok:netOk,d:netOk?"Le téléphone atteint le serveur.":"AUCUNE connexion au serveur — vérifiez internet/données mobiles."}; maj();
                // Étape 3 — écriture serveur (le cœur du transport d'alerte)
                res.push({l:"3. Envoi d'alerte au serveur",ok:null,d:"test d'écriture…"}); maj();
                try{
                  const r=await fetch(SB_URL+"/rest/v1/diffusions",{
                    method:"POST",
                    headers:{...cloudHdr(),"Prefer":"return=minimal"},
                    body:JSON.stringify({payload:{diag:true,urgence:false,cibles:[],ts:Date.now()}}),
                  });
                  if(r.ok) res[2]={l:"3. Envoi d'alerte au serveur",ok:true,d:"Le serveur accepte les alertes (code "+r.status+")."};
                  else{
                    let m="Erreur HTTP "+r.status;
                    try{ const d=await r.json(); m=(d&&(d.message||d.hint||d.details))||m; }catch(e){}
                    res[2]={l:"3. Envoi d'alerte au serveur",ok:false,d:"REFUSÉ : "+m+" (code "+r.status+")"};
                  }
                }catch(e){ res[2]={l:"3. Envoi d'alerte au serveur",ok:false,d:"Échec réseau pendant l'envoi."}; }
                maj();
                // Étape 4 — lecture serveur (ce que fait le téléphone du contact)
                res.push({l:"4. Réception des alertes",ok:null,d:"test de lecture…"}); maj();
                try{
                  const r=await fetch(SB_URL+"/rest/v1/diffusions?select=id&order=created_at.desc&limit=1",{headers:cloudHdr()});
                  if(r.ok){ const d=await r.json(); res[3]={l:"4. Réception des alertes",ok:true,d:"Lecture OK ("+(Array.isArray(d)?d.length:0)+" alerte(s) visibles)."}; }
                  else{
                    let m="Erreur HTTP "+r.status;
                    try{ const d=await r.json(); m=(d&&(d.message||d.hint||d.details))||m; }catch(e){}
                    res[3]={l:"4. Réception des alertes",ok:false,d:"REFUSÉ : "+m};
                  }
                }catch(e){ res[3]={l:"4. Réception des alertes",ok:false,d:"Échec réseau pendant la lecture."}; }
                maj();
                // Étape 5 — mes contacts
                res.push({l:"5. Mes contacts d'urgence",ok:contacts.length>0,
                  d:contacts.length?contacts.map(c=>`${c.nm} → ${normaliserPh(c.ph)}`).join(" · "):"AUCUN contact enregistré — l'alerte n'a personne à faire sonner !"});
                maj();
                // Étape 6 — BOUCLE COMPLÈTE : je m'envoie une alerte-test et je vérifie qu'elle me revient
                res.push({l:"6. Test aller-retour complet",ok:null,d:"envoi d'une alerte-test à votre propre numéro…"}); maj();
                try{
                  const monNum=normaliserPh(userInfo.ph);
                  const idTest="diagtest-"+Date.now();
                  await fetch(SB_URL+"/rest/v1/diffusions",{method:"POST",
                    headers:{...cloudHdr(),"Prefer":"return=minimal"},
                    body:JSON.stringify({payload:{type:"violence",diagtest:true,urgence:true,alerteId:idTest,victime:{nm:"Test",ph:"0000000000"},cibles:[monNum],ts:Date.now()}})});
                  await new Promise(r=>setTimeout(r,1500));
                  const depuis=new Date(Date.now()-3600000).toISOString();
                  const r=await fetch(SB_URL+"/rest/v1/diffusions?select=payload&created_at=gte."+encodeURIComponent(depuis)+"&order=created_at.desc&limit=50",{headers:cloudHdr()});
                  const rows=r.ok?await r.json():[];
                  const revenue=(rows||[]).map(x=>x.payload).find(p=>p&&p.alerteId===idTest&&Array.isArray(p.cibles)&&p.cibles.map(normaliserPh).includes(monNum));
                  if(revenue){
                    res[5]={l:"6. Test aller-retour complet",ok:true,d:"PARFAIT : une alerte ciblant votre numéro part et revient correctement. La transmission fonctionne de bout en bout. Le contact doit juste avoir l'app OUVERTE."};
                  } else {
                    res[5]={l:"6. Test aller-retour complet",ok:false,d:"L'alerte-test n'est pas revenue filtrée sur votre numéro. Problème de lecture/format des cibles."};
                  }
                }catch(e){ res[5]={l:"6. Test aller-retour complet",ok:false,d:"Échec pendant le test aller-retour."}; }
                maj();
              }}
              style={{width:"100%",padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                background:"linear-gradient(135deg,#4F46E5,#7C3AED)",
                fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:800,color:"#fff"}}>
              ▶︎ Lancer le diagnostic
            </button>
            {diagRes.length>0&&(
              <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                {diagRes.map((d,i)=>(
                  <div key={i} style={{background:d.ok===true?"#F0FDF4":(d.ok===false?"#FEF2F2":C.surf),
                    border:`1px solid ${d.ok===true?"rgba(22,163,74,.3)":(d.ok===false?"#FCA5A5":C.border)}`,
                    borderRadius:10,padding:"8px 10px"}}>
                    <p style={{fontSize:11,fontWeight:800,color:d.ok===true?"#166534":(d.ok===false?"#B91C1C":C.ink)}}>
                      {d.ok===true?"✓ ":(d.ok===false?"✗ ":"⏳ ")}{d.l}
                    </p>
                    <p style={{fontSize:10,color:C.muted,lineHeight:1.5,fontFamily:"monospace",wordBreak:"break-word"}}>{d.d}</p>
                  </div>
                ))}
                <p style={{fontSize:10,color:C.muted,textAlign:"center",marginTop:2}}>
                  📸 Envoyez une capture de ce panneau pour identifier le blocage exact.
                </p>
              </div>
            )}
          </div>
        </>)}

        <div className="sh">
          <span className="stl">Mes contacts d'urgence</span>
          {contacts.length<3&&(
            <button className="sea" onClick={()=>setEditContact({nm:"",ph:""})}>+ Ajouter</button>
          )}
        </div>

        {editContact&&(
          <div style={{margin:"0 20px 12px",background:"#fff",border:`1.5px solid ${C.orange}`,borderRadius:16,padding:"16px",animation:"stin 250ms var(--eo)"}}>
            <p style={{fontSize:13,fontWeight:800,color:C.ink,marginBottom:12}}>
              {editContact.idx!==undefined?"✏️ Modifier le contact":"➕ Ajouter un contact"}
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="if">
                <I n="user" s={16} c={C.faint}/>
                <input value={editContact.nm} onChange={e=>setEditContact(p=>({...p,nm:e.target.value}))}
                  placeholder="Nom et prénom" style={{fontSize:14}}/>
              </div>
              <div className="if" style={{border:`1.5px solid ${editContact.ph?.length===10?"rgba(22,163,74,.4)":C.border}`}}>
                <I n="phone" s={16} c={C.faint}/>
                <input type="tel" value={editContact.ph} maxLength={10}
                  onChange={e=>setEditContact(p=>({...p,ph:e.target.value.replace(/\D/g,"").slice(0,10)}))}
                  placeholder="Numéro (10 chiffres CI)" style={{fontSize:14,letterSpacing:"1px"}}/>
                {editContact.ph?.length===10&&<span style={{fontSize:12,color:C.green,fontWeight:700}}>✓</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-p" style={{flex:1, opacity:editContact.nm?.trim()&&editContact.ph?.length===10?1:.5}}
                disabled={!editContact.nm?.trim()||editContact.ph?.length<10}
                onClick={saveContact}>
                <I n="check" s={14} c="#fff"/>Enregistrer
              </button>
              <button className="btn btn-g" style={{flex:1}} onClick={()=>setEditContact(null)}>Annuler</button>
            </div>
          </div>
        )}

        <div className="cl">
          {contacts.length===0&&(
            <div style={{margin:"0 20px 12px",background:C.surf,borderRadius:14,padding:"20px",textAlign:"center"}}>
              <p style={{fontSize:13,color:C.muted}}>Aucun contact d'urgence.<br/>Ajoutez jusqu'à 3 contacts.</p>
            </div>
          )}
          {contacts.length===0&&!editContact&&(
            <div style={{margin:"0 20px 8px",background:C.surf,borderRadius:14, padding:"22px 20px",textAlign:"center"}}>
              <span style={{fontSize:28}}>🛡️</span>
              <p style={{fontSize:13,fontWeight:700,color:C.ink,marginTop:10,marginBottom:4}}>
                Aucun contact d'urgence
              </p>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>
                Ajoutez jusqu'à 3 contacts qui recevront l'alerte en cas de danger.
              </p>
              <button className="btn btn-p" style={{marginTop:14}}
                onClick={()=>setEditContact({nm:"",ph:""})}>
                <I n="plus" s={14} c="#fff"/>Ajouter un contact
              </button>
            </div>
          )}
          {contacts.map((ct,i)=>(
            <div key={i} className="ci si" style={{animationDelay:`${i*60}ms`,flexDirection:"column",padding:0,gap:0,overflow:"hidden"}}>

              <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px"}}>
                <div className="cav" style={{background:ct.c}}>{ct.in}</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:14,fontWeight:700,color:C.ink}}>{ct.nm}</p>
                  <p style={{fontSize:12,color:C.muted,marginTop:1}}>{ct.ph}</p>
                </div>
                <div className="cst">
                  {notifEnvoyee
                    ?<span style={{fontSize:11,fontWeight:700,color:"#DC2626",background:"#FFF1F2",padding:"3px 8px",borderRadius:20}}>⚡ Alerté</span>
                    :<><div className="sd"/><span style={{fontSize:11,fontWeight:600,color:C.green}}>Actif</span></>
                  }
                </div>
              </div>

              {!alarmeOn&&(
                <div style={{display:"flex",borderTop:`1px solid ${C.border}`}}>
                  <button onClick={()=>setEditContact({idx:i,nm:ct.nm,ph:ct.ph})}
                    style={{flex:1,padding:"9px",border:"none",cursor:"pointer", background:C.orangeL,fontFamily:"Plus Jakarta Sans",fontSize:12, fontWeight:700,color:C.orange,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    ✏️ Modifier
                  </button>
                  <div style={{width:1,background:C.border}}/>
                  <button onClick={()=>supprimerContact(i)}
                    style={{flex:1,padding:"9px",border:"none",cursor:"pointer", background:"#FFF1F2",fontFamily:"Plus Jakarta Sans",fontSize:12, fontWeight:700,color:"#DC2626",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    🗑️ Retirer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {contacts.length<3&&!editContact&&(
          <button className="atb" onClick={()=>setEditContact({nm:"",ph:""})}>
            <I n="plus" s={18} c={C.muted}/>Ajouter un contact ({contacts.length}/3)
          </button>
        )}

        <div className="trg">
          {!alarmeOn?(
            <>
              <button className="tb" onClick={declencherAlarme}>
                <I n="alert" s={22} c="#fff"/>Déclencher l'alarme
              </button>
              <p style={{textAlign:"center",fontSize:11,color:C.faint,marginTop:8}}>
                Appuyez pour déclencher manuellement
              </p>
            </>
          ):(
            <>
              <button className="tb"
                style={{background:"linear-gradient(135deg,#374151,#1F2937)"}}
                onClick={stopAlarme}>
                <I n="check" s={22} c="#fff"/>⏹ Arrêter l'alarme
              </button>
              <p style={{textAlign:"center",fontSize:11,color:"#EF4444",marginTop:8,fontWeight:700}}>
                Appuyez pour mettre fin à l'alerte
              </p>
            </>
          )}
        </div>
      </div>
      <Nav a="violence" go={go}/>
    </div>
  );
};



/* ══════════════════════════════════════════════════════════════════════════════
   RUBRIQUE ENLÈVEMENT / DISPARITION — suivi GPS en direct
   La personne en danger active le partage de sa position. Sa position est
   envoyée automatiquement à 3 contacts désignés et se met à jour en continu
   (via watchPosition) à chaque déplacement réel détecté par le GPS, sans
   action supplémentaire de sa part. Côté destinataire, la position affichée
   se synchronise dès que le partage émetteur est actualisé (état partagé en
   temps réel au niveau de l'app, voir partagesGps dans AlerteCI).
══════════════════════════════════════════════════════════════════════════════ */
const Enlevement = ({go,goBack,userInfo={},partagesGps=[],demarrerPartageGps,arreterPartageGps,majPositionGps}) => {
  const nom = userInfo.nm && userInfo.nm.trim() ? userInfo.nm.trim() : "l'utilisateur";
  const [contacts,setContacts]=useState(()=>{
    try{ const s=window.localStorage.getItem("alerteci_contacts_enlevement"); return s?JSON.parse(s):[]; }catch(e){ return []; }
  });
  useEffect(()=>{ try{ window.localStorage.setItem("alerteci_contacts_enlevement", JSON.stringify(contacts)); }catch(e){} },[contacts]);
  const [editContact,setEditContact]=useState(null); // null | {idx?, nm, ph}
  const COULEURS=["#7C3AED","#2563EB","#16A34A","#F97316","#EC4899","#0EA5E9"];
  const [notifContactEnvoyee,setNotifContactEnvoyee]=useState(null);

  const [partageActif,setPartageActif]=useState(false);
  const [position,setPosition]=useState(null); // {lat,lng,precision,ts}
  const [erreurGps,setErreurGps]=useState("");
  const watchIdRef=useRef(null);
  const monPartageId=useRef(`moi-${Date.now()}`);

  /* ── Note vocale de signalement jointe au partage GPS ──────────────────
     Enregistrée une fois (5s max) au moment de l'activation du partage,
     elle est envoyée avec la position à chaque contact de confiance et
     reste accessible/écoutable depuis l'écran tant que le partage est actif. */
  const [noteVocale,setNoteVocale]=useState(null); // {url, duree}
  const [enregNote,setEnregNote]=useState(false); // enregistrement en cours
  const [lectureNote,setLectureNote]=useState(false);
  const noteRecorderRef=useRef(null);
  const noteStreamRef=useRef(null);
  const noteChunksRef=useRef([]);
  const noteDebutRef=useRef(0);
  const notePlayerRef=useRef(null);

  const saveContact=()=>{
    if(!editContact||!editContact.nm.trim()||editContact.ph.length<10) return;
    const initiales=editContact.nm.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const couleur=COULEURS[editContact.idx!==undefined?editContact.idx%COULEURS.length:contacts.length%COULEURS.length];
    if(editContact.idx!==undefined){
      setContacts(p=>p.map((c,i)=>i===editContact.idx?{nm:editContact.nm.trim(),ph:editContact.ph,c:couleur,in:initiales}:c));
    } else {
      if(contacts.length>=3) return;
      setContacts(p=>[...p,{nm:editContact.nm.trim(),ph:editContact.ph,c:couleur,in:initiales}]);
    }
    const nmContact=editContact.nm.trim();
    const sendNotif=()=>{
      try{
        new Notification("🆘 ALERTE CI — Contact disparition",{
          body:`Bonjour ${nmContact} ! Vous avez été désigné(e) contact de confiance par ${nom} pour le suivi en cas de disparition. Vous recevrez sa position GPS en direct si le partage est activé.`,
          tag:`enlevement-${editContact.ph}`,
          requireInteraction:true,
        });
      }catch(e){}
    };
    if(typeof Notification!=="undefined"){
      if(Notification.permission==="granted") sendNotif();
      else if(Notification.permission!=="denied") Notification.requestPermission().then(p=>{if(p==="granted") sendNotif();});
    }
    setEditContact(null);
    setNotifContactEnvoyee(nmContact);
    setTimeout(()=>setNotifContactEnvoyee(null),3500);
    playNotif();
  };

  const supprimerContact=(i)=>setContacts(p=>p.filter((_,j)=>j!==i));

  /* ── Enregistrement de la note vocale de signalement (5s max) ───────────
     Jointe automatiquement à la position GPS transmise aux contacts. */
  const enregistrerNoteVocale=async()=>{
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){
      return;
    }
    setEnregNote(true);
    let stream;
    const securite=setTimeout(()=>{
      setEnregNote(false);
      try{ noteStreamRef.current&&noteStreamRef.current.getTracks().forEach(t=>t.stop()); }catch(e){}
    },4000);
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
    }catch(e){
      clearTimeout(securite);
      setEnregNote(false);
      return;
    }
    clearTimeout(securite);
    noteStreamRef.current=stream;
    noteChunksRef.current=[];
    noteDebutRef.current=Date.now();
    let mr;
    try{
      mr=new window.MediaRecorder(stream);
    }catch(e){
      stream.getTracks().forEach(t=>t.stop());
      setEnregNote(false);
      return;
    }
    mr.ondataavailable=(e)=>{ if(e.data&&e.data.size>0) noteChunksRef.current.push(e.data); };
    mr.onstop=()=>{
      const duree=Math.max(0.1,(Date.now()-noteDebutRef.current)/1000);
      const blob=new Blob(noteChunksRef.current,{type:mr.mimeType||"audio/webm"});
      const url=URL.createObjectURL(blob);
      setNoteVocale({url,duree});
      setEnregNote(false);
      try{ stream.getTracks().forEach(t=>t.stop()); }catch(e){}
      playNotif();
    };
    noteRecorderRef.current=mr;
    try{
      mr.start();
      setTimeout(()=>{ try{ if(mr.state==="recording") mr.stop(); }catch(e){} },5000);
    }catch(e){
      stream.getTracks().forEach(t=>t.stop());
      setEnregNote(false);
    }
  };

  const arreterEnregNote=()=>{
    try{ noteRecorderRef.current&&noteRecorderRef.current.state==="recording"&&noteRecorderRef.current.stop(); }catch(e){}
    try{ noteStreamRef.current&&noteStreamRef.current.getTracks().forEach(t=>t.stop()); }catch(e){}
    setEnregNote(false);
  };

  /* ── Démarrage du partage GPS en direct ──────────────────────────────────
     watchPosition déclenche un nouvel envoi à chaque actualisation réelle de
     la position par le GPS de l'appareil — aucune action manuelle requise. */
  /* Envoi throttlé de la position aux contacts de confiance : le serveur
     achemine le lien de position en direct vers leurs numéros. */
  const dernierEnvoiRef=useRef(0);
  const retryGpsRef=useRef(null);
  const envoyerPositionAuxContacts=(p)=>{
    const maintenant=Date.now();
    if(maintenant-dernierEnvoiRef.current<10000 && p) return; // max 1 envoi / 10s
    dernierEnvoiRef.current=maintenant;
    cloudPublierUrgence({
      type:"gps",
      alerteId:monPartageId.current,
      victime:{ nm:nom, ph:userInfo.ph||"" },
      cibles:contacts.map(c=>c.ph),
      gps:p?{lat:p.lat,lng:p.lng,precision:p.precision}:null,
      lienMaps:p?`https://maps.google.com/?q=${p.lat},${p.lng}`:null,
      ts:maintenant,
    });
  };

  const activerPartage=()=>{
    setErreurGps("");
    setPartageActif(true);
    demarrerPartageGps&&demarrerPartageGps(monPartageId.current,nom);
    /* IMPORTANT : aucune sirène ICI. La position part immédiatement vers
       les contacts de confiance, et c'est CHEZ EUX que l'alarme sonne en
       continu, avec le suivi de position en direct. Le téléphone de la
       personne suivie reste discret. */
    playNotif();

    /* 1. Les contacts de confiance sont prévenus IMMÉDIATEMENT, même si la
       position n'est pas encore disponible — le lien suivra dès qu'elle l'est. */
    dernierEnvoiRef.current=0;
    envoyerPositionAuxContacts(null);
    dernierEnvoiRef.current=0;

    const traiterPosition=(pos)=>{
      const p={
        lat:pos.coords.latitude, lng:pos.coords.longitude,
        precision:Math.round(pos.coords.accuracy||0), ts:Date.now(),
      };
      setErreurGps("");
      setPosition(p);
      majPositionGps&&majPositionGps(monPartageId.current,{
        id:monPartageId.current, nom, ph:userInfo.ph||"",
        lat:p.lat, lng:p.lng, precision:p.precision, ts:p.ts,
        contacts:contacts.map(c=>c.nm),
        noteVocale:noteVocale,
      });
      envoyerPositionAuxContacts(p);
    };

    /* 2. Suivi continu, avec relance automatique : tant qu'aucune position
       n'arrive, on redemande toutes les 10 secondes — le partage n'est
       jamais bloqué, il attend simplement l'autorisation ou le signal GPS. */
    if(navigator.geolocation){
      watchIdRef.current=navigator.geolocation.watchPosition(
        traiterPosition,
        ()=>{ setErreurGps("Recherche de position en cours… Si votre téléphone demande l'autorisation de localisation, acceptez-la : le partage démarrera tout seul."); },
        {enableHighAccuracy:true,maximumAge:0,timeout:15000}
      );
      retryGpsRef.current=setInterval(()=>{
        navigator.geolocation.getCurrentPosition(traiterPosition,()=>{},{enableHighAccuracy:true,timeout:8000,maximumAge:0});
      },10000);
    } else {
      setErreurGps("Recherche de position en cours… Le lien sera transmis à vos contacts dès qu'une position est disponible.");
    }
  };

  const arreterPartage=()=>{
    if(watchIdRef.current!==null){
      try{ navigator.geolocation.clearWatch(watchIdRef.current); }catch(e){}
      watchIdRef.current=null;
    }
    clearInterval(retryGpsRef.current);
    /* Prévenir les contacts que le partage est terminé. */
    cloudPublierUrgence({
      type:"gps", fin:true, alerteId:monPartageId.current,
      victime:{ nm:nom, ph:userInfo.ph||"" },
      cibles:contacts.map(c=>c.ph), ts:Date.now(),
    });
    monPartageId.current=`moi-${Date.now()}`;
    setErreurGps("");
    setPartageActif(false);
    arreterPartageGps&&arreterPartageGps(monPartageId.current);
  };

  useEffect(()=>()=>{
    if(watchIdRef.current!==null){
      try{ navigator.geolocation.clearWatch(watchIdRef.current); }catch(e){}
    }
    clearInterval(retryGpsRef.current);
    try{ noteRecorderRef.current&&noteRecorderRef.current.state==="recording"&&noteRecorderRef.current.stop(); }catch(e){}
    try{ noteStreamRef.current&&noteStreamRef.current.getTracks().forEach(t=>t.stop()); }catch(e){}
  },[]);

  const dureeEcoulee = position ? Math.max(0,Math.round((Date.now()-position.ts)/1000)) : null;

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={partageActif?"#7C3AED":C.ink}/></button>
          <p className="scrttl" style={{color:partageActif?"#7C3AED":C.ink}}>
            {partageActif?"🟣 PARTAGE GPS ACTIF":"Alerte Enlèvement"}
          </p>
        </div>

        <div className="vhero" style={{background:partageActif?"linear-gradient(145deg,#4C1D95,#6D28D9)":"linear-gradient(145deg,#312E81,#4338CA)"}}>
          <div className="pr">
            <div className="pi" style={{background:partageActif?"#7C3AED":"#4F46E5"}}>
              <I n="pin" s={28} c="#fff"/>
            </div>
          </div>
          <p className="hl">{partageActif?"📍 Position partagée en direct":"Suivi GPS contre les disparitions"}</p>
          <p className="ht">{partageActif?"Vos contacts vous suivent en temps réel":"Prêt à activer le partage"}</p>
          <p className="hd">
            {partageActif
              ?`Votre position se met à jour automatiquement et s'affiche en direct chez vos ${contacts.length||3} contacts de confiance, qui voient votre déplacement à chaque actualisation GPS.`
              :"En cas de disparition ou d'enlèvement présumé, activez le partage : votre position GPS sera envoyée en direct à vos contacts de confiance et se mettra à jour automatiquement."}
          </p>
        </div>

        {erreurGps&&(
          <div style={{margin:"0 20px 12px",background:"#FFF7ED",border:"1px solid rgba(249,115,22,.25)",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{display:"inline-block",width:14,height:14,border:"2px solid rgba(249,115,22,.4)",borderTopColor:"#F97316",borderRadius:"50%",animation:"spin 1s linear infinite",flexShrink:0}}/>
            <p style={{fontSize:12,color:"#9A3412",fontWeight:600,lineHeight:1.5}}>{erreurGps}</p>
          </div>
        )}

        {partageActif&&position&&(
          <div style={{margin:"0 20px 12px",background:"#fff",border:"1.5px solid rgba(124,58,237,.25)",borderRadius:16,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#7C3AED",animation:"bk 1.4s ease infinite",flexShrink:0}}/>
              <p style={{fontSize:12,fontWeight:800,color:C.ink}}>Position actuelle</p>
              <span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:C.muted}}>
                {dureeEcoulee<5?"À l'instant":`Il y a ${dureeEcoulee}s`}
              </span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div style={{background:C.surf,borderRadius:10,padding:"8px 10px"}}>
                <p style={{fontSize:9,fontWeight:700,color:C.faint,textTransform:"uppercase"}}>Latitude</p>
                <p style={{fontSize:13,fontWeight:700,color:C.ink,fontFamily:"monospace"}}>{position.lat.toFixed(5)}</p>
              </div>
              <div style={{background:C.surf,borderRadius:10,padding:"8px 10px"}}>
                <p style={{fontSize:9,fontWeight:700,color:C.faint,textTransform:"uppercase"}}>Longitude</p>
                <p style={{fontSize:13,fontWeight:700,color:C.ink,fontFamily:"monospace"}}>{position.lng.toFixed(5)}</p>
              </div>
            </div>
            <p style={{fontSize:11,color:C.muted}}>Précision ≈ {position.precision}m · Mise à jour automatique à chaque déplacement</p>

            <audio ref={notePlayerRef} style={{display:"none"}} onEnded={()=>setLectureNote(false)}/>
            <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
              <p style={{fontSize:10,fontWeight:700,color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:6}}>🎙️ Note vocale de signalement</p>
              {enregNote?(
                <div style={{display:"flex",alignItems:"center",gap:8,background:"#FFF1F2",borderRadius:10,padding:"8px 10px"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#EF4444",animation:"bk 0.6s ease infinite",flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:700,color:"#EF4444",flex:1}}>🎙️ Enregistrement...</span>
                  <button onClick={arreterEnregNote}
                    style={{fontSize:10,fontWeight:700,color:C.faint,background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,padding:"3px 8px",cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>✕</button>
                </div>
              ):noteVocale?(
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button
                    onClick={()=>{
                      if(!notePlayerRef.current) return;
                      if(lectureNote){ notePlayerRef.current.pause(); setLectureNote(false); }
                      else { notePlayerRef.current.src=noteVocale.url; notePlayerRef.current.play().catch(()=>{}); setLectureNote(true); }
                    }}
                    style={{display:"flex",alignItems:"center",gap:6,background:"#F5F3FF",border:"none",borderRadius:10,padding:"7px 12px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",flex:1}}>
                    <span style={{fontSize:13}}>{lectureNote?"⏸":"▶️"}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"#7C3AED"}}>
                      {lectureNote?"Lecture...":`Note vocale · ${noteVocale.duree.toFixed(1)}s`}
                    </span>
                  </button>
                  <button onClick={enregistrerNoteVocale}
                    style={{fontSize:11,fontWeight:700,color:"#7C3AED",background:"#F5F3FF",border:"none",borderRadius:10,padding:"7px 10px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",flexShrink:0}}>
                    🔄
                  </button>
                </div>
              ):(
                <button onClick={enregistrerNoteVocale}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",background:"#F5F3FF",border:"none",borderRadius:10,padding:"9px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,color:"#7C3AED"}}>
                  <I n="mic" s={14} c="#7C3AED"/> Enregistrer une note vocale (5s max)
                </button>
              )}
              <p style={{fontSize:10,color:C.faint,marginTop:6,lineHeight:1.4}}>Décrivez la situation à voix haute — cette note est envoyée avec votre position à vos 3 contacts de confiance.</p>
            </div>

            <a
              href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
              target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:10,padding:"9px",borderRadius:10,background:"#F5F3FF",color:"#7C3AED",fontSize:12,fontWeight:700,textDecoration:"none",fontFamily:"Plus Jakarta Sans"}}>
              <I n="pin" s={14} c="#7C3AED"/> Voir sur la carte
            </a>

            {/* ── Envoi du lien Google Maps de suivi aux contacts ─────────────
               Chaque bouton ouvre le SMS ou WhatsApp du contact, déjà rempli
               avec le lien Google Maps de la position ACTUELLE : le contact
               qui l'ouvre est redirigé directement sur Google Maps, sur la
               position exacte. Le lien est régénéré avec la dernière position
               connue à chaque appui — renvoyer = actualiser le suivi. ── */}
            <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
              <p style={{fontSize:10,fontWeight:700,color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:6}}>📤 Envoyer le lien de suivi aux contacts</p>
              {contacts.length===0?(
                <p style={{fontSize:11,color:C.muted,lineHeight:1.4}}>Ajoutez vos contacts de confiance ci-dessous : vous pourrez leur envoyer le lien Google Maps de votre position en un appui.</p>
              ):(
                <>
                  {contacts.map((ct,i)=>{
                    const lienMaps=`https://www.google.com/maps?q=${position.lat},${position.lng}`;
                    const message=`🆘 ALERTE CI — ${nom} partage sa position GPS en direct. Suivez sa position sur Google Maps : ${lienMaps}`;
                    const telInternational=`225${String(ct.ph).replace(/\D/g,"")}`;
                    return (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <div style={{width:28,height:28,borderRadius:9,background:ct.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",flexShrink:0}}>{ct.in}</div>
                        <span style={{fontSize:12,fontWeight:700,color:C.ink,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ct.nm}</span>
                        <a href={`sms:${ct.ph}?&body=${encodeURIComponent(message)}`}
                          style={{fontSize:11,fontWeight:700,color:"#7C3AED",background:"#F5F3FF",borderRadius:9,padding:"6px 10px",textDecoration:"none",fontFamily:"Plus Jakarta Sans",flexShrink:0}}>
                          💬 SMS
                        </a>
                        <a href={`https://wa.me/${telInternational}?text=${encodeURIComponent(message)}`}
                          target="_blank" rel="noreferrer"
                          style={{fontSize:11,fontWeight:700,color:"#16A34A",background:C.greenL,borderRadius:9,padding:"6px 10px",textDecoration:"none",fontFamily:"Plus Jakarta Sans",flexShrink:0}}>
                          🟢 WhatsApp
                        </a>
                      </div>
                    );
                  })}
                  <p style={{fontSize:10,color:C.faint,marginTop:4,lineHeight:1.4}}>Le lien envoyé contient votre position au moment de l'envoi — renvoyez-le après un déplacement pour actualiser le suivi chez vos contacts.</p>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{padding:"0 20px 12px"}}>
          {!partageActif?(
            <button className="btn btn-p" style={{background:"linear-gradient(135deg,#7C3AED,#6D28D9)"}} onClick={activerPartage}>
              <I n="pin" s={16} c="#fff"/>Activer le partage GPS en direct
            </button>
          ):(
            <button className="btn btn-g" onClick={arreterPartage}>
              <I n="check" s={16} c={C.ink}/>Arrêter le partage
            </button>
          )}
        </div>

        {notifContactEnvoyee&&(
          <div style={{margin:"0 20px 12px",background:C.greenL,border:"1px solid rgba(22,163,74,.25)", borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10, animation:"stin 280ms var(--eo)"}}>
            <span style={{fontSize:18}}>✅</span>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:C.green}}>Notification envoyée</p>
              <p style={{fontSize:11,color:C.muted,marginTop:1}}>
                <strong>{notifContactEnvoyee}</strong> a été désigné(e) contact de confiance pour le suivi GPS.
              </p>
            </div>
          </div>
        )}

        <div className="sh">
          <span className="stl">Mes contacts de confiance</span>
          {contacts.length<3&&(
            <button className="sea" onClick={()=>setEditContact({nm:"",ph:""})}>+ Ajouter</button>
          )}
        </div>

        {editContact&&(
          <div style={{margin:"0 20px 12px",background:"#fff",border:"1.5px solid #7C3AED",
            borderRadius:16,padding:"16px",animation:"stin 250ms var(--eo)"}}>
            <p style={{fontSize:13,fontWeight:800,color:C.ink,marginBottom:12}}>
              {editContact.idx!==undefined?"✏️ Modifier le contact":"➕ Ajouter un contact de confiance"}
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div className="if">
                <I n="user" s={16} c={C.faint}/>
                <input
                  value={editContact.nm}
                  onChange={e=>setEditContact(p=>({...p,nm:e.target.value}))}
                  placeholder="Nom et prénom"
                  autoFocus
                  style={{fontSize:14}}/>
              </div>
              <div className="if" style={{border:`1.5px solid ${editContact.ph?.length===10?"rgba(22,163,74,.4)":C.border}`}}>
                <I n="phone" s={16} c={C.faint}/>
                <input
                  type="tel"
                  value={editContact.ph}
                  maxLength={10}
                  onChange={e=>setEditContact(p=>({...p,ph:e.target.value.replace(/\D/g,"").slice(0,10)}))}
                  placeholder="Numéro CI (10 chiffres)"
                  style={{fontSize:14,letterSpacing:"1px"}}/>
                {editContact.ph?.length===10&&<span style={{fontSize:12,color:C.green,fontWeight:700}}>✓</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-p" style={{flex:1,background:"linear-gradient(135deg,#7C3AED,#6D28D9)",opacity:editContact.nm?.trim()&&editContact.ph?.length===10?1:.5}}
                disabled={!editContact.nm?.trim()||editContact.ph?.length<10}
                onClick={saveContact}>
                <I n="check" s={14} c="#fff"/>Enregistrer
              </button>
              <button className="btn btn-g" style={{flex:1}} onClick={()=>setEditContact(null)}>
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="cl">
          {contacts.length===0&&!editContact&&(
            <div style={{margin:"0 20px 12px",background:C.surf,borderRadius:14, padding:"24px 20px",textAlign:"center"}}>
              <span style={{fontSize:28}}>🆘</span>
              <p style={{fontSize:13,fontWeight:700,color:C.ink,marginTop:10,marginBottom:4}}>
                Aucun contact de confiance
              </p>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>
                Ajoutez jusqu'à 3 contacts qui recevront votre position GPS en direct en cas de disparition.
              </p>
              <button className="btn btn-p" style={{marginTop:14,background:"linear-gradient(135deg,#7C3AED,#6D28D9)"}}
                onClick={()=>setEditContact({nm:"",ph:""})}>
                <I n="plus" s={14} c="#fff"/>Ajouter un contact
              </button>
            </div>
          )}
          {contacts.map((ct,i)=>(
            <div key={i} className="ci si" style={{animationDelay:`${i*60}ms`}}>
              <div className="cav" style={{background:ct.c}}>{ct.in}</div>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:700,color:C.ink}}>{ct.nm}</p>
                <p style={{fontSize:12,color:C.muted,marginTop:1}}>{ct.ph}</p>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setEditContact({idx:i,nm:ct.nm,ph:ct.ph})}
                  style={{width:30,height:30,borderRadius:8,border:"none",cursor:"pointer",background:"#F5F3FF",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  ✏️
                </button>
                <button onClick={()=>supprimerContact(i)}
                  style={{width:30,height:30,borderRadius:8,border:"none",cursor:"pointer",background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Positions reçues des contacts qui ont, eux aussi, activé leur
               partage GPS (synchronisation automatique en temps réel) ── */}
        {partagesGps.filter(p=>p.id!==monPartageId.current).length>0&&(
          <>
            <div className="sh" style={{marginTop:4}}>
              <span className="stl">Positions reçues en direct</span>
            </div>
            <div style={{padding:"0 20px 8px",display:"flex",flexDirection:"column",gap:10}}>
              {partagesGps.filter(p=>p.id!==monPartageId.current).map((p,i)=>{
                const secEcoulees=Math.max(0,Math.round((Date.now()-p.ts)/1000));
                return (
                  <div key={p.id} className="si" style={{animationDelay:`${i*60}ms`,background:"#fff",border:"1.5px solid rgba(124,58,237,.2)",borderRadius:16,padding:"14px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:"#7C3AED",animation:"bk 1.4s ease infinite",flexShrink:0}}/>
                      <p style={{fontSize:13,fontWeight:800,color:C.ink}}>{p.nom}</p>
                      <span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:secEcoulees<30?C.green:C.muted}}>
                        {secEcoulees<5?"À l'instant":`Il y a ${secEcoulees}s`}
                      </span>
                    </div>
                    <p style={{fontSize:11,color:C.muted,marginBottom:8}}>
                      Position synchronisée automatiquement · précision ≈ {p.precision}m
                    </p>
                    {p.noteVocale&&(
                      <button
                        onClick={()=>{
                          if(!notePlayerRef.current) return;
                          notePlayerRef.current.src=p.noteVocale.url;
                          notePlayerRef.current.play().catch(()=>{});
                        }}
                        style={{display:"flex",alignItems:"center",gap:6,width:"100%",background:"#FFF7ED",border:"none",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",marginBottom:8}}>
                        <span style={{fontSize:13}}>▶️</span>
                        <span style={{fontSize:12,fontWeight:700,color:C.orange}}>Écouter la note vocale · {p.noteVocale.duree.toFixed(1)}s</span>
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                      target="_blank" rel="noreferrer"
                      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:"#F5F3FF",color:"#7C3AED",fontSize:12,fontWeight:700,textDecoration:"none",fontFamily:"Plus Jakarta Sans"}}>
                      <I n="pin" s={14} c="#7C3AED"/> Suivre sur la carte
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div style={{padding:"8px 20px 20px"}}>
          <div style={{background:"#F5F3FF",border:"1px solid rgba(124,58,237,.2)",borderRadius:14,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#7C3AED",marginBottom:4}}>ℹ️ Comment ça marche</p>
            <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Une fois activé, le partage GPS envoie automatiquement votre position à vos contacts à chaque déplacement détecté — aucune action de votre part n'est requise. Chez vos contacts, la position affichée se synchronise et s'actualise dès qu'ils ouvrent ou rafraîchissent l'écran.</p>
          </div>
        </div>
      </div>
      <Nav a="enlevement" go={go}/>
    </div>
  );
};



/* ── SONS ──────────────────────────────────────────────────────────────────── */
/* Sonnerie légère — notif envoyée/reçue */
const playNotif = () => {
  try {
    const ctx = _obtenirCtxAudio();
    if(!ctx) return;
    try{ if(ctx.state==="suspended") ctx.resume(); }catch(e){}
    const seq = [[880,0,80],[1100,90,80],[1320,180,120]];
    seq.forEach(([freq,delay,dur])=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type="sine"; o.frequency.value=freq;
      g.gain.setValueAtTime(0,ctx.currentTime+delay/1000);
      g.gain.linearRampToValueAtTime(0.18,ctx.currentTime+delay/1000+0.01);
      g.gain.linearRampToValueAtTime(0,ctx.currentTime+(delay+dur)/1000);
      o.start(ctx.currentTime+delay/1000);
      o.stop(ctx.currentTime+(delay+dur)/1000);
    });
  } catch(e){}
};

/* Alarme tâche — répétitive urgente */
/* ── Rappel de tâche : à l'heure indiquée, une alarme sonne EN BOUCLE
   pendant 45 secondes maximum, et la tâche est LUE À VOIX HAUTE (forte)
   plusieurs fois. Un bouton permet d'arrêter à tout moment. ── */
let _rappelInterval=null;
let _rappelTts=null;
let _rappelTimeout=null;
let _rappelCtx=null;
let _rappelAudio=null;
function demarrerRappelTache(txt, onFin, audioB64){
  arreterRappelTache();
  _rappelCtx=_obtenirCtxAudio();
  const salve=()=>{
    const ctx=_rappelCtx;
    if(!ctx) return;
    try{ if(ctx.state==="suspended") ctx.resume(); }catch(e){}
    try{
      const play=(freq,start,dur)=>{
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type="square"; o.frequency.value=freq;
        g.gain.setValueAtTime(0,ctx.currentTime+start);
        g.gain.linearRampToValueAtTime(0.5,ctx.currentTime+start+0.01);
        g.gain.linearRampToValueAtTime(0,ctx.currentTime+start+dur);
        o.start(ctx.currentTime+start); o.stop(ctx.currentTime+start+dur+0.01);
      };
      [0,0.35,0.70].forEach(t=>{ play(880,t,0.25); play(1100,t+0.12,0.25); });
    }catch(e){}
  };
  const lire=()=>{
    try{
      if(audioB64){
        /* Note vocale enregistrée par l'utilisateur : on rejoue SA voix. */
        try{ _rappelAudio&&_rappelAudio.pause(); }catch(e){}
        _rappelAudio=new Audio(audioB64);
        _rappelAudio.volume=1;
        _rappelAudio.play().catch(()=>{});
      } else if(window.speechSynthesis && txt){
        /* Sinon : lecture vocale RÉELLE du texte de la tâche, en entier. */
        window.speechSynthesis.cancel();
        const u=new SpeechSynthesisUtterance("Rappel de votre tâche : "+txt+". Je répète : "+txt);
        u.lang="fr-FR"; u.rate=0.9; u.volume=1; u.pitch=1;
        window.speechSynthesis.speak(u);
      }
    }catch(e){}
  };
  salve(); setTimeout(lire,1100);
  let compte=0;
  _rappelInterval=setInterval(()=>{
    compte++;
    salve();
    if(compte%8===3) lire(); // relit la tâche régulièrement pendant l'alarme
  }, 1500);
  try{ navigator.vibrate && navigator.vibrate([400,150,400]); }catch(e){}
  /* Arrêt automatique après 45 secondes */
  _rappelTimeout=setTimeout(()=>{ arreterRappelTache(); onFin&&onFin(); }, 45000);
}
function arreterRappelTache(){
  try{ _rappelAudio&&_rappelAudio.pause(); _rappelAudio=null; }catch(e){}
  try{ clearInterval(_rappelInterval); _rappelInterval=null; }catch(e){}
  try{ clearTimeout(_rappelTimeout); _rappelTimeout=null; }catch(e){}
  try{ window.speechSynthesis && window.speechSynthesis.cancel(); }catch(e){}
  try{ navigator.vibrate && navigator.vibrate(0); }catch(e){}
  _rappelCtx=null; /* le contexte global reste ouvert pour tous les sons */
}


/* Son notif Alerte Info — doux descendant */
const playNotifInfo = () => {
  try {
    const ctx = _obtenirCtxAudio();
    if(!ctx) return;
    try{ if(ctx.state==="suspended") ctx.resume(); }catch(e){}
    [[523,0,120],[440,130,120],[349,260,180]].forEach(([freq,delay,dur])=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type="sine"; o.frequency.value=freq;
      g.gain.setValueAtTime(0,ctx.currentTime+delay/1000);
      g.gain.linearRampToValueAtTime(0.16,ctx.currentTime+delay/1000+0.01);
      g.gain.linearRampToValueAtTime(0,ctx.currentTime+(delay+dur)/1000);
      o.start(ctx.currentTime+delay/1000); o.stop(ctx.currentTime+(delay+dur)/1000);
    });
  } catch(e){}
};

/* ── ÉCRAN AJOUTER UNE TÂCHE ───────────────────────────────────────────────── */
const AjouterTache = ({go,goBack,onAdd}) => {
  const [mode,setMode]=useState("ecrit"); // "ecrit" | "vocal"
  const [txt,setTxt]=useState("");
  const [heure,setHeure]=useState("08:00");
  const [vocal,setVocal]=useState(true);
  const [saved,setSaved]=useState(false);
  const [ecoute,setEcoute]=useState(false); // micro actif
  const [errVoix,setErrVoix]=useState("");
  const recoRef=useRef(null);

  const [audioNote,setAudioNote]=useState(null); // {b64, duree} note vocale enregistrée
  const [dureeEnreg,setDureeEnreg]=useState(0);
  const streamVocalRef=useRef(null);
  const chronoRef=useRef(null);
  const limiteRef=useRef(null);
  const dureeEnregRef=useRef(0);

  /* Enregistrement RÉEL de la voix : l'utilisateur parle librement, voit le
     chrono tourner, et appuie lui-même sur « Valider » pour terminer.
     Rien ne se coupe tout seul avant 60 secondes. */
  const startVoice=async()=>{
    setErrVoix("");
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){
      setErrVoix("Le micro n'est pas disponible sur cet appareil.");
      return;
    }
    let stream;
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true});
    }catch(e){
      setErrVoix("Micro refusé. Autorisez le microphone pour dicter votre tâche.");
      return;
    }
    streamVocalRef.current=stream;
    let mr;
    try{ mr=new window.MediaRecorder(stream); }catch(e){
      setErrVoix("Enregistrement indisponible sur cet appareil.");
      try{ stream.getTracks().forEach(t=>t.stop()); }catch(_){}
      return;
    }
    const chunks=[];
    mr.ondataavailable=(e)=>{ if(e.data&&e.data.size>0) chunks.push(e.data); };
    mr.onstop=()=>{
      try{ stream.getTracks().forEach(t=>t.stop()); }catch(e){}
      clearInterval(chronoRef.current); clearTimeout(limiteRef.current);
      const blob=new Blob(chunks,{type:mr.mimeType||"audio/webm"});
      const lecteur=new FileReader();
      lecteur.onload=()=>{
        setAudioNote({b64:lecteur.result,duree:dureeEnregRef.current});
        if(!txt.trim()) setTxt(`🎤 Note vocale (${dureeEnregRef.current}s)`);
      };
      lecteur.readAsDataURL(blob);
      setEcoute(false);
    };
    recoRef.current=mr;
    setEcoute(true);
    setDureeEnreg(0); dureeEnregRef.current=0;
    chronoRef.current=setInterval(()=>{
      dureeEnregRef.current+=1;
      setDureeEnreg(d=>d+1);
    },1000);
    /* Filet à 60 s — mais c'est l'utilisateur qui valide quand IL a fini. */
    limiteRef.current=setTimeout(()=>{ try{ mr.state==="recording"&&mr.stop(); }catch(e){} },60000);
    try{ mr.start(); }catch(e){
      setErrVoix("Impossible de démarrer l'enregistrement.");
      setEcoute(false);
      try{ stream.getTracks().forEach(t=>t.stop()); }catch(_){}
    }
  };
  const stopVoice=()=>{ // « Valider mon enregistrement »
    try{ recoRef.current&&recoRef.current.state==="recording"&&recoRef.current.stop(); }catch(e){}
    setEcoute(false);
  };
  const annulerVoice=()=>{
    try{ clearInterval(chronoRef.current); clearTimeout(limiteRef.current); }catch(e){}
    try{ recoRef.current&&recoRef.current.state==="recording"&&recoRef.current.stop(); }catch(e){}
    setTimeout(()=>setAudioNote(null),150);
    setEcoute(false); setDureeEnreg(0);
  };

  const handleSave=()=>{
    if(!txt.trim()&&!audioNote) return;
    onAdd&&onAdd({txt:txt.trim()||`🎤 Note vocale`,tm:heure,dn:false,audio:audioNote?audioNote.b64:null});
    setSaved(true);
    playNotif();
    setTimeout(()=>go("planning"),900);
  };

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Nouvelle tâche</p>
        </div>

        {saved?(
          <div style={{margin:"40px 20px",background:C.greenL,border:"1px solid rgba(22,163,74,.3)",borderRadius:20,padding:"32px 20px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><I n="check" s={26} c="#fff"/></div>
            <p style={{fontFamily:"Sora,sans-serif",fontSize:17,fontWeight:800,color:C.ink}}>Tâche enregistrée !</p>
            <p style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.5}}>L'alarme sonnera à <strong>{heure}</strong> avec lecture vocale.</p>
          </div>
        ):(
          <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>

            <p className="fst" style={{paddingTop:4}}>Mode de saisie</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {id:"ecrit",label:"Saisie écrite",icon:"check"},
                {id:"vocal",label:"Saisie vocale",icon:"mic"},
              ].map(m=>(
                <button key={m.id} onClick={()=>{setMode(m.id);setTxt("");setErrVoix("");setEcoute(false);}}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                    padding:"13px 10px",borderRadius:14,border:`2px solid ${mode===m.id?C.orange:"rgba(0,0,0,.07)"}`,
                    background:mode===m.id?C.orangeL:"#fff",cursor:"pointer",
                    fontFamily:"Plus Jakarta Sans"}}>
                  <I n={m.icon} s={18} c={mode===m.id?C.orange:C.faint}/>
                  <span style={{fontSize:13,fontWeight:700,color:mode===m.id?C.orange:C.muted}}>{m.label}</span>
                </button>
              ))}
            </div>

            {mode==="ecrit"&&(
              <>
                <p className="fst">Intitulé de la tâche</p>
                <div className="if" style={{alignItems:"flex-start",paddingTop:12}}>
                  <I n="check" s={18} c={C.faint}/>
                  <textarea rows={3} value={txt} onChange={e=>setTxt(e.target.value)}
                    placeholder="Ex : Appeler client Yopougon, Envoyer catalogue WhatsApp..."/>
                </div>
              </>
            )}

            {mode==="vocal"&&(
              <>
                <p className="fst">Dictez votre tâche</p>

                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"20px 0 8px"}}>
                  <button onClick={ecoute?stopVoice:startVoice}
                    style={{width:88,height:88,borderRadius:"50%",border:"none",cursor:"pointer", background:ecoute?"linear-gradient(135deg,#EF4444,#DC2626)":"linear-gradient(135deg,#F97316,#FB923C)", display:"flex",alignItems:"center",justifyContent:"center", boxShadow:ecoute?"0 0 0 8px rgba(239,68,68,.2),0 0 0 16px rgba(239,68,68,.1)":"0 8px 24px rgba(249,115,22,.4)", transition:"all 200ms var(--esp)"}}>
                    <I n="mic" s={34} c="#fff"/>
                  </button>
                  <p style={{fontSize:13,fontWeight:700,color:ecoute?"#EF4444":C.muted,textAlign:"center"}}>
                    {ecoute?`🔴 Enregistrement… ${dureeEnreg}s — parlez, prenez votre temps`:(audioNote?"Note vocale prête ✓":"Appuyez pour parler")}
                  </p>
                  {ecoute&&(
                    <div style={{display:"flex",gap:8,width:"100%",maxWidth:280}}>
                      <button onClick={stopVoice}
                        style={{flex:1,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",
                          background:C.green,fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:800,color:"#fff"}}>
                        ✓ Valider mon enregistrement
                      </button>
                      <button onClick={annulerVoice}
                        style={{padding:"12px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,cursor:"pointer",
                          background:"#fff",fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700,color:C.muted}}>
                        ✕
                      </button>
                    </div>
                  )}
                  {!ecoute&&audioNote&&(
                    <button onClick={()=>{try{const a=new Audio(audioNote.b64);a.play();}catch(e){}}}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:12,
                        border:`1.5px solid rgba(22,163,74,.35)`,cursor:"pointer",background:C.greenL,
                        fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700,color:C.green}}>
                      ▶︎ Réécouter ma note ({audioNote.duree}s)
                    </button>
                  )}
                  {ecoute&&(
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      {[0,1,2,3,4].map(i=>(
                        <div key={i} style={{width:4,borderRadius:2,background:"#EF4444",
                          height:8+Math.random()*16,
                          animation:`pulse-bar 0.5s ease ${i*0.1}s infinite alternate`}}/>
                      ))}
                    </div>
                  )}
                </div>

                {(txt||audioNote)&&!ecoute&&(
                  <div style={{background:C.greenL,border:"1px solid rgba(22,163,74,.2)",borderRadius:14,padding:"12px 14px"}}>
                    <p style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>Votre tâche</p>
                    <p style={{fontSize:14,fontWeight:600,color:C.ink,lineHeight:1.5}}>{txt}</p>
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={handleSave}
                        style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6, padding:"10px",borderRadius:10,border:"none",cursor:"pointer", background:C.green,fontFamily:"Plus Jakarta Sans", fontSize:13,fontWeight:700,color:"#fff", boxShadow:"0 4px 14px rgba(22,163,74,.3)"}}>
                        <I n="check" s={15} c="#fff"/>Enregistrer
                      </button>
                      <button onClick={()=>setTxt("")}
                        style={{padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer", background:"#FFF1F2",fontFamily:"Plus Jakarta Sans", fontSize:12,fontWeight:700,color:"#DC2626"}}>
                        ✕ Effacer
                      </button>
                    </div>
                  </div>
                )}
                {errVoix&&(
                  <div style={{background:"#FFF1F2",border:"1px solid rgba(239,68,68,.2)",borderRadius:12,padding:"10px 14px"}}>
                    <p style={{fontSize:12,color:"#DC2626"}}>{errVoix}</p>
                  </div>
                )}

                {txt&&(
                  <div className="if" style={{alignItems:"flex-start",paddingTop:12}}>
                    <I n="check" s={18} c={C.faint}/>
                    <textarea rows={2} value={txt} onChange={e=>setTxt(e.target.value)}
                      placeholder="Modifier si nécessaire..."/>
                  </div>
                )}
              </>
            )}

            <p className="fst">Heure de rappel</p>
            <div className="if">
              <I n="bell" s={18} c={C.orange}/>
              <input type="time" value={heure} onChange={e=>setHeure(e.target.value)}
                style={{flex:1,border:"none",outline:"none",background:"transparent", fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:700,color:C.ink}}/>
              <span style={{fontSize:11,fontWeight:700,color:C.orange,background:C.orangeL,padding:"3px 10px",borderRadius:20}}>Alarme</span>
            </div>

            <div style={{background:C.surf,borderRadius:16,padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
              <p style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".6px"}}>Options d'alarme</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <I n="mic" s={18} c={C.orange}/>
                  <div>
                    <p style={{fontSize:13,fontWeight:700,color:C.ink}}>Dictée vocale de la tâche</p>
                    <p style={{fontSize:11,color:C.muted,marginTop:1}}>L'alarme lit la tâche à voix haute</p>
                  </div>
                </div>
                <button className={`tsw ${vocal?"on":"off"}`} onClick={()=>setVocal(p=>!p)}>
                  <div className={`tth ${vocal?"on":"off"}`}/>
                </button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:8,borderTop:`1px solid ${C.surfH}`}}>
                <I n="bell" s={18} c="#8B5CF6"/>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:C.ink}}>Alarme sonore</p>
                  <p style={{fontSize:11,color:C.muted,marginTop:1}}>Toujours active · Ne peut pas être désactivée</p>
                </div>
                <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:C.green,background:C.greenL,padding:"3px 10px",borderRadius:20}}>Actif</span>
              </div>
            </div>

            <button style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              background:C.surf,border:`1.5px dashed ${C.surfH}`,borderRadius:14,padding:"13px",
              cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}
              onMouseOver={e=>{e.currentTarget.style.background=C.orangeL;e.currentTarget.style.borderColor=C.orange}}
              onMouseOut={e=>{e.currentTarget.style.background=C.surf;e.currentTarget.style.borderColor=C.surfH}}
              onClick={()=>demarrerRappelTache(txt||"tâche de test")}>
              <I n="bell" s={18} c={C.orange}/>
              <span style={{fontSize:13,fontWeight:700,color:C.orange}}>Tester le son de l'alarme</span>
            </button>

            <div style={{marginTop:4,marginBottom:20}}>
              <button className="btn btn-p" onClick={handleSave}
                style={{opacity:txt.trim()?1:.5}} disabled={!txt.trim()}>
                <I n="check" s={16} c="#fff"/>Enregistrer la tâche
              </button>
            </div>
          </div>
        )}
      </div>
      <Nav a="planning" go={go}/>
    </div>
  );
};

const Planning = ({go,goBack}) => {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const fmtDate = (d) => d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  const fmtDateShort = (k) => {
    const [y,m,d] = k.split("-");
    const dt = new Date(+y,+m-1,+d);
    return dt.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"});
  };
  const [journal,setJournal]=useState(()=>{
    try{
      const s=window.localStorage.getItem("alerteci_journal_taches");
      if(s){ const j=JSON.parse(s); if(j&&typeof j==="object") return {[todayKey]:[],...j}; }
    }catch(e){}
    return { [todayKey]: [] };
  });
  useEffect(()=>{ try{ window.localStorage.setItem("alerteci_journal_taches", JSON.stringify(journal)); }catch(e){} },[journal]);

  const [showAjout,setShowAjout]=useState(false);
  const [showArchives,setShowArchives]=useState(false);
  const firedRef=useRef(new Set());

  const taches = journal[todayKey] || [];
  const done = taches.filter(t=>t.dn).length;
  const sc = taches.length>0 ? Math.round((done/taches.length)*20) : 0;

  const toggleTache = (i) => setJournal(j=>({
    ...j,
    [todayKey]: (j[todayKey]||[]).map((t,idx)=>idx===i?{...t,dn:!t.dn}:t)
  }));

  const addTache = (t) => setJournal(j=>({
    ...j,
    [todayKey]: [...(j[todayKey]||[]), t]
  }));
  const archiveDates = Object.keys(journal)
    .filter(k=>k!==todayKey)
    .sort((a,b)=>b.localeCompare(a));

  /* Les états d'édition DOIVENT être déclarés avant tout return conditionnel
     (règle des hooks React) — sinon l'écran d'ajout fait planter le composant. */
  const [editingIdx,setEditingIdx]=useState(null);
  const [editTxt,setEditTxt]=useState("");

  if(showAjout) return (
    <AjouterTache
      go={(s)=>{setShowAjout(false); if(s!=="planning") go(s);}}
      goBack={()=>setShowAjout(false)}
      onAdd={addTache}/>
  );

  const startEdit=(i)=>{
    setEditingIdx(i);
    setEditTxt(taches[i].txt);
  };
  const saveEdit=(i)=>{
    if(!editTxt.trim()) return;
    setJournal(j=>({...j,[todayKey]:(j[todayKey]||[]).map((t,idx)=>idx===i?{...t,txt:editTxt.trim()}:t)}));
    setEditingIdx(null);
    playNotif();
  };
  const deleteTache=(i)=>{
    setJournal(j=>({...j,[todayKey]:(j[todayKey]||[]).filter((_,idx)=>idx!==i)}));
  };

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Mon Planning</p>
        </div>

        <div style={{padding:"0 20px 16px"}}>
          <div className="arc">
            <svg width="64" height="64" viewBox="0 0 64 64" style={{flexShrink:0}}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#E7E5E4" strokeWidth="6"/>
              <circle cx="32" cy="32" r="26" fill="none" stroke="#F97316" strokeWidth="6"
                strokeDasharray={`${taches.length>0?163.4*(done/taches.length):0} 163.4`}
                strokeLinecap="round" transform="rotate(-90 32 32)"
                style={{transition:"stroke-dasharray 800ms var(--eo)"}}/>
              <text x="32" y="37" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1C1917" fontFamily="Sora">{sc}</text>
            </svg>
            <div>
              <p style={{fontFamily:"Sora,sans-serif",fontSize:28,fontWeight:800,color:C.ink,letterSpacing:"-1px"}}>
                {sc}<span style={{fontSize:14,color:C.muted,fontWeight:600}}>/20</span>
              </p>
              <p style={{fontSize:11,fontWeight:600,color:C.muted,marginTop:2}}>
                Score journalier · {done}/{taches.length} tâche{taches.length>1?"s":""}
              </p>
              <div className="ab"><div className="af" style={{width:`${taches.length>0?(done/taches.length)*100:0}%`}}/></div>
            </div>
          </div>
        </div>

        <div className="sh">
          <span className="stl">Tâches du jour</span>
          <span style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"capitalize"}}>{fmtDate(today)}</span>
        </div>
        {taches.length===0?(
          <div style={{margin:"0 20px 8px",background:C.surf,borderRadius:16,padding:"24px 20px",textAlign:"center"}}>
            <p style={{fontSize:28,marginBottom:8}}>📋</p>
            <p style={{fontSize:14,fontWeight:700,color:C.ink,marginBottom:4}}>Aucune tâche pour aujourd'hui</p>
            <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Ajoutez votre première tâche du jour</p>
          </div>
        ):(
          <div className="tl">
            {taches.map((t,i)=>(
              <div key={i} className="si" style={{animationDelay:`${i*50}ms`,
                background:"#fff",border:`1px solid ${editingIdx===i?C.orange:C.border}`,
                borderRadius:16,marginBottom:0,overflow:"hidden"}}>
                {editingIdx===i?(
                  /* ── MODE ÉDITION ── */
                  <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
                    <div className="if" style={{marginBottom:0}}>
                      <I n="check" s={16} c={C.orange}/>
                      <input
                        value={editTxt}
                        onChange={e=>setEditTxt(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter")saveEdit(i);if(e.key==="Escape")setEditingIdx(null);}}
                        autoFocus
                        style={{fontSize:14,fontWeight:600}}
                      />
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>saveEdit(i)}
                        style={{flex:1,padding:"8px",borderRadius:10,border:"none",cursor:"pointer", background:C.green,color:"#fff",fontFamily:"Plus Jakarta Sans", fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                        <I n="check" s={13} c="#fff"/>Enregistrer
                      </button>
                      <button onClick={()=>setEditingIdx(null)}
                        style={{padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer", background:C.surf,color:C.muted,fontFamily:"Plus Jakarta Sans", fontSize:12,fontWeight:700}}>
                        Annuler
                      </button>
                    </div>
                  </div>
                ):(
                  /* ── MODE LECTURE ── */
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px"}}>

                    <button onClick={()=>toggleTache(i)}
                      style={{width:24,height:24,borderRadius:8,border:`2px solid ${t.dn?C.green:C.surfH}`,
                        background:t.dn?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",
                        cursor:"pointer",flexShrink:0,padding:0}}>
                      {t.dn&&<I n="check" s={14} c="#fff"/>}
                    </button>

                    <span style={{fontSize:14,fontWeight:600,flex:1, color:t.dn?C.faint:C.ink, textDecoration:t.dn?"line-through":"none"}}>
                      {t.txt}
                    </span>

                    <button onClick={()=>{
                        /* Lecture immédiate de la tâche : la note vocale de
                           l'utilisateur si elle existe, sinon lecture du texte. */
                        try{
                          if(t.audio){ const a=new Audio(t.audio); a.volume=1; a.play().catch(()=>{}); }
                          else if(window.speechSynthesis){
                            window.speechSynthesis.cancel();
                            const u=new SpeechSynthesisUtterance(t.txt);
                            u.lang="fr-FR"; u.rate=0.9; u.volume=1;
                            window.speechSynthesis.speak(u);
                          }
                        }catch(e){}
                      }}
                      style={{width:30,height:30,borderRadius:10,border:"none",cursor:"pointer",
                        background:C.orangeL,display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:14,flexShrink:0,padding:0}}>
                      🔊
                    </button>

                    <span style={{fontSize:11,fontWeight:700,color:C.orange,background:C.orangeL, padding:"3px 8px",borderRadius:8,flexShrink:0}}>
                      {t.tm}
                    </span>
                    {!t.dn&&<I n="bell" s={12} c={C.orange}/>}

                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      <button
                        onClick={e=>{e.stopPropagation();startEdit(i);}}
                        style={{width:28,height:28,borderRadius:8,border:"none",cursor:"pointer", background:C.orangeL,display:"flex",alignItems:"center",justifyContent:"center", transition:"transform 140ms ease",flexShrink:0}}
                        onMouseOver={e=>e.currentTarget.style.transform="scale(1.1)"}
                        onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                        <span style={{fontSize:13}}>✏️</span>
                      </button>
                      <button
                        onClick={e=>{e.stopPropagation();deleteTache(i);}}
                        style={{width:28,height:28,borderRadius:8,border:"none",cursor:"pointer", background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center", transition:"transform 140ms ease",flexShrink:0}}
                        onMouseOver={e=>e.currentTarget.style.transform="scale(1.1)"}
                        onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                        <span style={{fontSize:13}}>🗑️</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <button className="atb" onClick={()=>setShowAjout(true)}>
          <I n="plus" s={18} c={C.muted}/>Ajouter une tâche
        </button>

        {archiveDates.length>0&&(
          <div style={{padding:"16px 20px 0"}}>
            <button
              onClick={()=>setShowArchives(p=>!p)}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🗂️</span>
                <span style={{fontSize:13,fontWeight:700,color:C.ink}}>Archives</span>
                <span style={{fontSize:11,fontWeight:700,color:C.faint,background:C.surfH,padding:"2px 8px",borderRadius:20}}>
                  {archiveDates.length} jour{archiveDates.length>1?"s":""}
                </span>
              </div>
              <span style={{fontSize:11,color:C.orange,fontWeight:700,transform:showArchives?"rotate(180deg)":"rotate(0)",display:"inline-block"}}>▼</span>
            </button>

            {showArchives&&(
              <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:10,animation:"stin 250ms var(--eo)"}}>
                {archiveDates.map((dk,di)=>{
                  const dayTaches = journal[dk]||[];
                  const dayDone = dayTaches.filter(t=>t.dn).length;
                  const dayScore = dayTaches.length>0?Math.round((dayDone/dayTaches.length)*20):0;
                  return (
                    <div key={di} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>

                      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:C.surf,borderBottom:`1px solid ${C.border}`}}>
                        <div style={{width:32,height:32,borderRadius:10,background:dayScore>=15?C.greenL:dayScore>=10?C.orangeL:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:12,fontWeight:800,color:dayScore>=15?C.green:dayScore>=10?C.orange:"#DC2626"}}>{dayScore}</span>
                        </div>
                        <div style={{flex:1}}>
                          <p style={{fontSize:13,fontWeight:700,color:C.ink,textTransform:"capitalize"}}>{fmtDateShort(dk)}</p>
                          <p style={{fontSize:11,color:C.muted,marginTop:1}}>{dayDone}/{dayTaches.length} tâche{dayTaches.length>1?"s":""} · Score {dayScore}/20</p>
                        </div>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20, background:dayDone===dayTaches.length?C.greenL:"#FFF7ED", color:dayDone===dayTaches.length?C.green:C.orange}}>
                          {dayDone===dayTaches.length?"✓ Complété":"Partiel"}
                        </span>
                      </div>

                      <div style={{display:"flex",flexDirection:"column",gap:0}}>
                        {dayTaches.map((t,ti)=>(
                          <div key={ti} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:ti<dayTaches.length-1?`1px solid ${C.border}`:"none",opacity:0.85}}>
                            <div style={{width:18,height:18,borderRadius:5,background:t.dn?C.green:C.surfH,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              {t.dn&&<I n="check" s={11} c="#fff"/>}
                            </div>
                            <span style={{fontSize:12,color:t.dn?C.muted:C.ink,flex:1,textDecoration:t.dn?"line-through":"none"}}>{t.txt}</span>
                            <span style={{fontSize:10,fontWeight:600,color:C.faint,background:C.surf,padding:"2px 7px",borderRadius:8}}>{t.tm}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div style={{height:20}}/>
      </div>
      <Nav a="planning" go={go}/>
    </div>
  );
};

/* ── LISTE CLIENTS D'UNE COMMUNE ─────────────────────────────────────────── */
const Info = ({go,goBack,plan="gratuit",alertesPubliques=[]}) => {
  const alertesTriees = [...alertesPubliques].sort((a,b)=>b.ts-a.ts);
  useEffect(()=>{
    if(alertesTriees.some(a=>a.urgent)) playNotifInfo();
  },[]);
  return (
  <div className="scr on" style={{display:"flex"}}>
    <div className="scrl">
      <div className="scrhdr">
        <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
        <p className="scrttl">Alertes Info</p>
        <span className="bg" style={{marginLeft:"auto", background:plan==="premium"?C.orange+"18":C.green+"18", color:plan==="premium"?C.orange:C.green}}>
          {plan==="premium"?"PREMIUM":"GRATUIT"}
        </span>
      </div>
      <div className="inf">
        <button className="ic mt si" style={{animationDelay:"0ms"}} onClick={()=>{playNotifInfo();}}>
          <div className="icr">
            <div className="ici" style={{background:"rgba(59,130,246,.15)"}}><I n="cloud" s={22} c="#2563EB"/></div>
            <div><p style={{fontSize:15,fontWeight:700,color:"#1D4ED8"}}>Alerte Météo</p><p style={{fontSize:11,fontWeight:600,color:"rgba(29,78,216,.6)",marginTop:2}}>Partenaire : SODEXAM</p></div>
          </div>
          <p style={{fontSize:12,color:"rgba(29,78,216,.7)",lineHeight:1.5,marginBottom:10}}>Recevez les alertes météo en temps réel avec lecture vocale et codes couleurs d'urgence pour les fortes pluies.</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,background:"rgba(59,130,246,.1)",color:"#2563EB"}}>
              <I n="bell" s={12} c="#2563EB"/> Notifications actives
            </span>
            <span style={{fontSize:10,color:"rgba(29,78,216,.5)"}}>· Toucher pour simuler une notif</span>
          </div>
        </button>
        <button className="ic ef si" style={{animationDelay:"80ms"}} onClick={()=>go("effondrement")}>
          <div className="icr">
            <div className="ici" style={{background:"rgba(249,115,22,.15)"}}><I n="building" s={22} c="#C2410C"/></div>
            <div><p style={{fontSize:15,fontWeight:700,color:"#C2410C"}}>Alerte Effondrement</p><p style={{fontSize:11,fontWeight:600,color:"rgba(194,65,12,.6)",marginTop:2}}>Partenaire : Min. Construction</p></div>
          </div>
          <p style={{fontSize:12,color:"rgba(194,65,12,.7)",lineHeight:1.5,marginBottom:10}}>Signalez un bâtiment dangereux avec texte, photo, vidéo et localisation GPS obligatoire. Transmis directement au Ministère.</p>
          <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,background:"rgba(249,115,22,.1)",color:"#C2410C"}}>
            <I n="alert" s={12} c="#C2410C"/> Signaler un danger →
          </span>
        </button>
        <button className="ic in si" style={{animationDelay:"160ms"}} onClick={()=>go("incendie")}>
          <div className="icr">
            <div className="ici" style={{background:"rgba(220,38,38,.15)"}}><I n="fire" s={22} c="#BE123C"/></div>
            <div><p style={{fontSize:15,fontWeight:700,color:"#BE123C"}}>Incendie & Danger</p><p style={{fontSize:11,fontWeight:600,color:"rgba(190,18,60,.6)",marginTop:2}}>Partenaire : Pompiers CI</p></div>
          </div>
          <p style={{fontSize:12,color:"rgba(190,18,60,.7)",lineHeight:1.5,marginBottom:10}}>Alertez les pompiers en cas d'incendie ou d'inondation. Envoyez vidéo et localisation GPS en urgence.</p>
          <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,background:"rgba(220,38,38,.1)",color:"#BE123C"}}>
            <I n="phone" s={12} c="#BE123C"/> Envoyer une alerte →
          </span>
        </button>

        {/* ── Un écran "recevoir + donner des infos" par service public,
               sur le modèle Effondrement/Ministère de la Construction.
               SODEXAM garde son écran météo dédié ci-dessus, inchangé. ── */}
        {SERVICES_PUBLICS_CONFIG.map((s,i)=>(
          <button key={s.sc} className="ic si" style={{animationDelay:`${240+i*60}ms`}} onClick={()=>go(s.sc)}>
            <div className="icr">
              <div className="ici" style={{background:s.bg}}><I n={s.ic} s={22} c={s.c}/></div>
              <div><p style={{fontSize:15,fontWeight:700,color:s.c}}>{s.nom}</p><p style={{fontSize:11,fontWeight:600,color:s.c+"99",marginTop:2}}>Recevoir et donner des infos</p></div>
            </div>
            <p style={{fontSize:12,color:s.c+"B3",lineHeight:1.5,marginBottom:10}}>{s.desc}</p>
            <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:20,background:s.bg,color:s.c}}>
              <I n="arrow" s={12} c={s.c}/> Ouvrir →
            </span>
          </button>
        ))}
      </div>

      <div className="sh" style={{marginTop:4}}>
        <span className="stl">Dernières alertes</span>
        {alertesTriees.filter(a=>a.urgent).length>0&&(
          <span style={{fontSize:10,fontWeight:800,color:"#fff",background:"#EF4444",padding:"3px 10px",borderRadius:20,animation:"bk 2s ease infinite"}}>
            {alertesTriees.filter(a=>a.urgent).length} urgent{alertesTriees.filter(a=>a.urgent).length>1?"s":""}
          </span>
        )}
      </div>
      {/* Liste des dernières alertes masquée à la demande — alertesTriees,
          la diffusion service public, l'expiration 24h et le useEffect de
          notification restent pleinement fonctionnels en arrière-plan.
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {alertesTriees.length===0&&(
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:16,padding:"24px 16px",textAlign:"center"}}>
            <p style={{fontSize:12,color:C.faint}}>Aucune alerte active pour le moment. Les alertes expirent automatiquement après 24h.</p>
          </div>
        )}
        {alertesTriees.map((a,i)=>(
          <button key={a.id} className="si"
            style={{animationDelay:`${i*60}ms`,
              display:"flex",alignItems:"flex-start",gap:12,
              background:"#fff",border:`1.5px solid ${a.urgent?a.c+"44":C.border}`,
              borderRadius:16,padding:"14px",cursor:"pointer",
              fontFamily:"Plus Jakarta Sans",textAlign:"left",
              position:"relative",overflow:"hidden"}}
            onClick={()=>{playNotifInfo();go(a.cible||"info");}}>
            {a.urgent&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:a.c,borderRadius:"16px 0 0 16px"}}/>}
            <div style={{width:40,height:40,borderRadius:12,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,marginLeft:a.urgent?4:0}}>
              {a.icon}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:800,color:a.c,background:a.bg,padding:"2px 8px",borderRadius:20}}>{a.service}</span>
                {a.urgent&&<span style={{fontSize:9,fontWeight:800,color:"#fff",background:a.c,padding:"2px 6px",borderRadius:20}}>URGENT</span>}
                <span style={{fontSize:10,color:C.faint,marginLeft:"auto"}}>{formatHeureRelative(a.ts)}</span>
              </div>
              <p style={{fontSize:13,fontWeight:800,color:C.ink,marginBottom:3,lineHeight:1.3}}>{a.titre}</p>
              <p style={{fontSize:11,color:C.muted,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{a.apercu}</p>
            </div>
            <I n="arrow" s={13} c={C.faint} style={{flexShrink:0,marginTop:4}}/>
          </button>
        ))}
      </div>
      */}
    </div>
    <Nav a="info" go={go}/>
  </div>
  );
};

/* ── ÉCRAN GÉNÉRIQUE "SERVICE PUBLIC" (recevoir + donner des infos) ─────────
   Réutilisé pour chaque type de service (sauf SODEXAM) : sur le modèle de
   l'écran Effondrement existant pour le Ministère de la Construction, avec
   en plus la réception en direct des informations diffusées par CE service
   précis (filtrage de alertesPubliques par nom de service). ── */
const ServicePublicEcran = ({go,goBack,config,alertesPubliques=[],ajouterAlertePublique}) => {
  const [tab,setTab]=useState("recevoir"); // "recevoir" | "envoyer"
  const [sent,setSent]=useState(false);
  const [desc,setDesc]=useState("");
  const [adresse,setAdresse]=useState("");
  const [medias,setMedias]=useState([]);
  const [gps,setGps]=useState(null);
  const [gpsLoad,setGpsLoad]=useState(false);
  const photoRef=useRef(null);
  const videoRef=useRef(null);

  const mesAlertes = [...alertesPubliques].filter(a=>a.service===config.nom).sort((a,b)=>b.ts-a.ts);

  useEffect(()=>{
    if(navigator.geolocation){
      setGpsLoad(true);
      navigator.geolocation.getCurrentPosition(
        pos=>{setGps({lat:pos.coords.latitude.toFixed(4),lng:pos.coords.longitude.toFixed(4)});setGpsLoad(false);},
        ()=>{setGpsLoad(false);},
        {timeout:10000,enableHighAccuracy:true}
      );
    }
  },[]);

  const addMedia=(files,type)=>{
    if(!files||!files.length) return;
    const arr=Array.from(files).map(f=>({nom:f.nom||f.name,type}));
    setMedias(p=>[...p,...arr]);
    playNotif();
  };

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">{config.nom}</p>
        </div>

        <div style={{margin:"0 20px 14px",background:config.grad,borderRadius:22,padding:"18px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n={config.ic} s={20} c="#fff"/></div>
            <div>
              <p style={{fontSize:14,fontWeight:800,color:"#fff",fontFamily:"Sora"}}>{config.nom}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Recevoir et donner des informations</p>
            </div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>{config.desc}</p>
        </div>

        <div style={{padding:"0 20px 14px",display:"flex",gap:8}}>
          {[{id:"recevoir",lb:"Infos reçues"},{id:"envoyer",lb:"Signaler"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSent(false);}}
              style={{flex:1,padding:"10px 6px",borderRadius:12,border:t.id===tab?"none":`1px solid ${C.border}`,cursor:"pointer",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,background:tab===t.id?config.c:"#fff",color:tab===t.id?"#fff":C.muted,boxShadow:tab===t.id?`0 4px 14px ${config.c}40`:"none"}}>
              {t.lb}
            </button>
          ))}
        </div>

        {tab==="recevoir"&&(
          <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {mesAlertes.length===0&&(
              <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:16,padding:"28px 20px",textAlign:"center"}}>
                <p style={{fontSize:28,marginBottom:8}}>📭</p>
                <p style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>Aucune information pour le moment</p>
                <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Les informations diffusées par {config.nom} apparaîtront ici et resteront visibles 24h.</p>
              </div>
            )}
            {mesAlertes.map((a,i)=>(
              <div key={a.id} className="si" style={{animationDelay:`${i*60}ms`,background:"#fff",border:`1.5px solid ${a.urgent?config.c+"55":C.border}`,borderRadius:16,padding:"14px",position:"relative",overflow:"hidden"}}>
                {a.urgent&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:4,background:config.c}}/>}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,marginLeft:a.urgent?6:0}}>
                  <div style={{width:36,height:36,borderRadius:12,background:config.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>{a.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <p style={{fontSize:12,fontWeight:800,color:config.c}}>{a.citoyen?"Signalement d'un citoyen":(a.institution||config.nom)}</p>
                      {a.citoyen&&<span style={{fontSize:9,fontWeight:700,color:C.muted,background:C.surf,padding:"2px 7px",borderRadius:20}}>COMMUNAUTÉ</span>}
                      {a.urgent&&<span style={{fontSize:9,fontWeight:800,color:"#fff",background:config.c,padding:"2px 7px",borderRadius:20}}>URGENT</span>}
                    </div>
                    <p style={{fontSize:11,color:C.muted,marginTop:1}}>{formatHeureRelative(a.ts)}</p>
                  </div>
                </div>
                <p style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.5,marginLeft:a.urgent?6:0,marginBottom:4}}>{a.apercu}</p>
              </div>
            ))}
          </div>
        )}

        {tab==="envoyer"&&(
          sent?(
            <div style={{margin:"0 20px 20px",background:C.greenL,border:"1px solid rgba(22,163,74,.3)",borderRadius:20,padding:"28px 20px",textAlign:"center"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n="check" s={28} c="#fff"/></div>
              <p style={{fontSize:18,fontWeight:800,color:C.ink,fontFamily:"Sora"}}>Signalement envoyé</p>
              <p style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.5}}>Votre signalement a été transmis à {config.nom}.</p>
              {gps&&<p style={{fontSize:11,color:C.faint,marginTop:6}}>📍 GPS : {gps.lat}° N, {gps.lng}° W</p>}
              <button className="btn btn-g" style={{marginTop:20}} onClick={()=>{setSent(false);setDesc("");setAdresse("");setMedias([]);}}>Nouveau signalement</button>
            </div>
          ):(
            <div className="rpt">
              <p className="fst" style={{paddingTop:4}}>Description de la situation</p>
              <div className="if" style={{alignItems:"flex-start",paddingTop:12}}>
                <I n="alert" s={18} c={C.faint}/>
                <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Décrivez la situation à signaler..."/>
              </div>
              <div className="if"><I n="pin" s={18} c={C.faint}/><input value={adresse} onChange={e=>setAdresse(e.target.value)} placeholder="Adresse ou description du lieu"/></div>

              <p className="fst">Photos / Vidéos</p>
              <div className="mu">
                <button className="mb" onClick={()=>photoRef.current&&photoRef.current.click()}>
                  <I n="camera" s={22} c={config.c}/><span>Photo</span>
                </button>
                <button className="mb" onClick={()=>videoRef.current&&videoRef.current.click()}>
                  <I n="video" s={22} c={config.c}/><span>Vidéo</span>
                </button>
              </div>
              <input ref={photoRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>addMedia(e.target.files,"photo")}/>
              <input ref={videoRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>addMedia(e.target.files,"vidéo")}/>
              {medias.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                  {medias.map((m,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:4,background:m.type==="photo"?C.orangeL:C.greenL,borderRadius:20,padding:"4px 10px"}}>
                      <I n={m.type==="photo"?"camera":"video"} s={12} c={m.type==="photo"?C.orange:C.green}/>
                      <span style={{fontSize:10,fontWeight:700,color:m.type==="photo"?C.orange:C.green}}>{m.nom.slice(0,14)}</span>
                      <button onClick={()=>setMedias(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:C.faint,lineHeight:1}}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <p className="fst">Localisation GPS</p>
              <div className="lb">
                <I n="pin" s={18} c={config.c}/>
                <div>
                  <p style={{fontSize:12,fontWeight:600,color:config.c}}>{gpsLoad?"Détection en cours...":gps?"Position détectée automatiquement":"Position non disponible"}</p>
                  {gps&&<p style={{fontSize:11,color:C.faint,marginTop:2}}>{gps.lat}° N, {gps.lng}° W</p>}
                </div>
                <span style={{fontSize:11,fontWeight:700,color:config.c,background:config.bg,padding:"3px 8px",borderRadius:20,marginLeft:"auto"}}>Recommandé</span>
              </div>
              <button className="btn btn-p" style={{background:config.c,marginTop:6,marginBottom:20,opacity:!desc.trim()?0.5:1}} disabled={!desc.trim()} onClick={()=>{
                setSent(true);
                playNotif();
                /* Le signalement citoyen est aussi diffusé aux autres utilisateurs
                   de la sous-rubrique, comme une information communautaire en
                   temps réel — clairement distingué d'une diffusion officielle. */
                ajouterAlertePublique && ajouterAlertePublique({
                  urgent:false,
                  c:config.c, bg:config.bg, icon:"👤",
                  service:config.nom, cible:config.sc,
                  citoyen:true,
                  titre:"Signalement d'un citoyen",
                  apercu:desc.trim()+(adresse.trim()?` (${adresse.trim()})`:""),
                });
              }}>
                <I n="send" s={16} c="#fff"/>Envoyer à {config.nom}
              </button>
            </div>
          )
        )}
      </div>
      <Nav a="info" go={go}/>
    </div>
  );
};

const Effondrement = ({go,goBack}) => {
  const [sent,setSent]=useState(false);
  const [desc,setDesc]=useState("");
  const [adresse,setAdresse]=useState("");
  const [medias,setMedias]=useState([]);
  const [gps,setGps]=useState(null);
  const [gpsLoad,setGpsLoad]=useState(false);
  const photoRef=useRef(null);
  const videoRef=useRef(null);

  useEffect(()=>{
    if(navigator.geolocation){
      setGpsLoad(true);
      navigator.geolocation.getCurrentPosition(
        pos=>{setGps({lat:pos.coords.latitude.toFixed(4),lng:pos.coords.longitude.toFixed(4)});setGpsLoad(false);},
        ()=>{setGpsLoad(false);}, /* GPS refusé → null, pas de fausse position */
        {timeout:10000,enableHighAccuracy:true}
      );
    }
  },[]);

  const addMedia=(files,type)=>{
    if(!files||!files.length) return;
    const arr=Array.from(files).map(f=>({nom:f.nom||f.name,type}));
    setMedias(p=>[...p,...arr]);
    playNotif();
  };

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Alerte Effondrement</p>
        </div>
        <div style={{margin:"0 20px 16px",background:"linear-gradient(145deg,#7C2D12,#C2410C)",borderRadius:22,padding:"18px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="building" s={20} c="#fff"/></div>
            <div>
              <p style={{fontSize:14,fontWeight:800,color:"#fff",fontFamily:"Sora"}}>Ministère de la Construction</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Signalement direct · Gratuit</p>
            </div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>Votre signalement sera transmis directement dans la messagerie du Ministère pour une prise en charge rapide.</p>
        </div>
        {sent?(
          <div style={{margin:"20px",background:C.greenL,border:"1px solid rgba(22,163,74,.3)",borderRadius:20,padding:"28px 20px",textAlign:"center"}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n="check" s={28} c="#fff"/></div>
            <p style={{fontSize:18,fontWeight:800,color:C.ink,fontFamily:"Sora"}}>Signalement envoyé</p>
            <p style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.5}}>Votre alerte a été transmise au Ministère de la Construction. Réf : #EFF-2406-0047</p>
            {gps&&<p style={{fontSize:11,color:C.faint,marginTop:6}}>📍 GPS : {gps.lat}° N, {gps.lng}° W</p>}
            <button className="btn btn-g" style={{marginTop:20}} onClick={()=>{setSent(false);go("info");}}>Retour aux alertes</button>
          </div>
        ):(
          <div className="rpt">
            <p className="fst" style={{paddingTop:4}}>Description du danger</p>
            <div className="if" style={{alignItems:"flex-start",paddingTop:12}}>
              <I n="alert" s={18} c={C.faint}/>
              <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Décrivez le danger : type de bâtiment, fissures visibles, nombre de personnes à risque..."/>
            </div>
            <div className="if"><I n="building" s={18} c={C.faint}/><input value={adresse} onChange={e=>setAdresse(e.target.value)} placeholder="Adresse ou description du lieu"/></div>

            <p className="fst">Photos / Vidéos</p>
            <div className="mu">
              <button className="mb" onClick={()=>photoRef.current&&photoRef.current.click()}>
                <I n="camera" s={22} c={C.orange}/><span>Photo</span>
              </button>
              <button className="mb" onClick={()=>videoRef.current&&videoRef.current.click()}>
                <I n="video" s={22} c={C.orange}/><span>Vidéo</span>
              </button>
            </div>
            <input ref={photoRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>addMedia(e.target.files,"photo")}/>
            <input ref={videoRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>addMedia(e.target.files,"vidéo")}/>
            {medias.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                {medias.map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4,background:m.type==="photo"?C.orangeL:C.greenL,borderRadius:20,padding:"4px 10px"}}>
                    <I n={m.type==="photo"?"camera":"video"} s={12} c={m.type==="photo"?C.orange:C.green}/>
                    <span style={{fontSize:10,fontWeight:700,color:m.type==="photo"?C.orange:C.green}}>{m.nom.slice(0,14)}</span>
                    <button onClick={()=>setMedias(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:C.faint,lineHeight:1}}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <p className="fst">Localisation GPS</p>
            <div className="lb">
              <I n="pin" s={18} c={C.green}/>
              <div>
                <p style={{fontSize:12,fontWeight:600,color:C.green}}>{gpsLoad?"Détection en cours...":"Position détectée automatiquement"}</p>
                {gps&&<p style={{fontSize:11,color:C.faint,marginTop:2}}>{gps.lat}° N, {gps.lng}° W</p>}
              </div>
              <span style={{fontSize:11,fontWeight:700,color:C.green,background:"rgba(22,163,74,.1)",padding:"3px 8px",borderRadius:20,marginLeft:"auto"}}>Requis</span>
            </div>
            <button className="btn btn-p" style={{background:"#C2410C",marginTop:6,marginBottom:20,opacity:(!desc.trim()||!gps)?0.5:1}} disabled={!desc.trim()||!gps} onClick={()=>{setSent(true);playNotif();}}>
              <I n="send" s={16} c="#fff"/>Envoyer au Ministère
            </button>
          </div>
        )}
      </div>
      <Nav a="info" go={go}/>
    </div>
  );
};

const Incendie = ({go,goBack}) => {
  const [sent,setSent]=useState(false);
  const [typeUrgence,setTypeUrgence]=useState(null);
  const [medias,setMedias]=useState([]);
  const [gps,setGps]=useState(null);
  const [gpsLoad,setGpsLoad]=useState(false);
  const videoRef=useRef(null);
  const galerieRef=useRef(null);

  useEffect(()=>{
    if(navigator.geolocation){
      setGpsLoad(true);
      navigator.geolocation.getCurrentPosition(
        pos=>{setGps({lat:pos.coords.latitude.toFixed(4),lng:pos.coords.longitude.toFixed(4)});setGpsLoad(false);},
        ()=>{setGpsLoad(false);}, /* GPS refusé → null, pas de fausse position */
        {timeout:10000,enableHighAccuracy:true}
      );
    }
  },[]);

  const addMedia=(files,type)=>{
    if(!files||!files.length) return;
    const arr=Array.from(files).map(f=>({nom:f.nom||f.name,type}));
    setMedias(p=>[...p,...arr]);
    playNotif();
  };

  const types=[
    {lb:"Incendie",ic:"fire",c:"#BE123C",bg:"#FFF1F2"},
    {lb:"Inondation",ic:"cloud",c:"#2563EB",bg:"#EFF6FF"},
    {lb:"Personne bloquée",ic:"alert",c:"#D97706",bg:"#FFFBEB"},
    {lb:"Explosion",ic:"alert",c:"#7C3AED",bg:"#F5F3FF"},
  ];

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Incendie & Danger</p>
        </div>
        <div style={{margin:"0 20px 16px",background:"linear-gradient(145deg,#881337,#BE123C)",borderRadius:22,padding:"18px 20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><I n="fire" s={20} c="#fff"/></div>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:800,color:"#fff",fontFamily:"Sora"}}>Pompiers de Côte d'Ivoire</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Urgence directe · Gratuit</p>
            </div>
            <div style={{background:"rgba(255,255,255,.15)",borderRadius:12,padding:"6px 12px"}}><p style={{fontSize:13,fontWeight:800,color:"#fff"}}>180</p></div>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>Votre alerte avec vidéo et localisation GPS sera transmise immédiatement dans la messagerie des pompiers.</p>
        </div>
        {sent?(
          <div style={{margin:"20px",background:"#FFF1F2",border:"1px solid rgba(190,18,60,.2)",borderRadius:20,padding:"28px 20px",textAlign:"center"}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:"#BE123C",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I n="check" s={28} c="#fff"/></div>
            <p style={{fontSize:18,fontWeight:800,color:C.ink,fontFamily:"Sora"}}>Alerte envoyée !</p>
            <p style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.5}}>Les pompiers ont reçu votre alerte. Restez en sécurité. Réf : #INC-2406-0012</p>
            {typeUrgence!==null&&<p style={{fontSize:11,color:C.faint,marginTop:4}}>Type : {types[typeUrgence].lb}</p>}
            {gps&&<p style={{fontSize:11,color:C.faint,marginTop:2}}>📍 GPS : {gps.lat}° N, {gps.lng}° W</p>}
            <button className="btn btn-g" style={{marginTop:20}} onClick={()=>{setSent(false);go("info");}}>Retour aux alertes</button>
          </div>
        ):(
          <div className="rpt">
            <p className="fst" style={{paddingTop:4}}>Type d'urgence</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {types.map((t,i)=>(
                <button key={i}
                  onClick={()=>setTypeUrgence(typeUrgence===i?null:i)}
                  style={{background:typeUrgence===i?t.c:t.bg,border:`2px solid ${typeUrgence===i?t.c:t.c+"33"}`,borderRadius:14,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"Plus Jakarta Sans",transform:typeUrgence===i?"scale(1.03)":"scale(1)"}}>
                  <I n={t.ic} s={18} c={typeUrgence===i?"#fff":t.c}/>
                  <span style={{fontSize:13,fontWeight:700,color:typeUrgence===i?"#fff":t.c}}>{t.lb}</span>
                  {typeUrgence===i&&<span style={{marginLeft:"auto",fontSize:14}}>✓</span>}
                </button>
              ))}
            </div>
            {typeUrgence!==null&&(
              <div style={{background:types[typeUrgence].bg,border:`1px solid ${types[typeUrgence].c}33`,borderRadius:12,padding:"8px 12px",display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                <I n="check" s={14} c={types[typeUrgence].c}/>
                <span style={{fontSize:12,fontWeight:700,color:types[typeUrgence].c}}>Sélectionné : {types[typeUrgence].lb}</span>
              </div>
            )}

            <p className="fst">Vidéo de la situation</p>
            <div className="mu">
              <button className="mb" style={{flex:2}} onClick={()=>videoRef.current&&videoRef.current.click()}>
                <I n="video" s={24} c="#BE123C"/><span style={{color:"#BE123C",fontWeight:700}}>Filmer maintenant</span>
              </button>
              <button className="mb" onClick={()=>galerieRef.current&&galerieRef.current.click()}>
                <I n="camera" s={22} c={C.orange}/><span>Galerie</span>
              </button>
            </div>
            <input ref={videoRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>addMedia(e.target.files,"vidéo")}/>
            <input ref={galerieRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}} onChange={e=>addMedia(e.target.files,"galerie")}/>
            {medias.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                {medias.map((m,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:4,background:"#FFF1F2",borderRadius:20,padding:"4px 10px"}}>
                    <I n="video" s={12} c="#BE123C"/>
                    <span style={{fontSize:10,fontWeight:700,color:"#BE123C"}}>{m.nom.slice(0,14)}</span>
                    <button onClick={()=>setMedias(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:C.faint}}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <p className="fst">Localisation GPS</p>
            <div className="lb">
              <I n="pin" s={18} c={C.green}/>
              <div>
                <p style={{fontSize:12,fontWeight:600,color:C.green}}>{gpsLoad?"Détection en cours...":"Position détectée automatiquement"}</p>
                {gps&&<p style={{fontSize:11,color:C.faint,marginTop:2}}>{gps.lat}° N, {gps.lng}° W</p>}
              </div>
              <span style={{fontSize:11,fontWeight:700,color:C.green,background:"rgba(22,163,74,.1)",padding:"3px 8px",borderRadius:20,marginLeft:"auto"}}>Requis</span>
            </div>
            <div style={{background:"#FFF1F2",border:"1px solid rgba(190,18,60,.2)",borderRadius:14,padding:"12px 14px"}}>
              <p style={{fontSize:12,fontWeight:700,color:"#BE123C",marginBottom:4}}>En cas de danger immédiat</p>
              <p style={{fontSize:12,color:C.muted}}>Appelez directement le <strong>180</strong> (Pompiers) ou le <strong>170</strong> (SAMU)</p>
            </div>
            <button className="btn btn-p"
              style={{background:"#BE123C",marginTop:6,marginBottom:20,opacity:(typeUrgence!==null&&gps)?1:0.5}}
              disabled={typeUrgence===null||!gps}
              onClick={()=>{setSent(true);playNotif();}}>
              <I n="send" s={16} c="#fff"/>Alerter les pompiers maintenant
            </button>
          </div>
        )}
      </div>
      <Nav a="info" go={go}/>
    </div>
  );
};

/* ── PAIEMENT PREMIUM ──────────────────────────────────────────────────────── */
const Paiement = ({go,goBack,onSuccess}) => {
  const [method,setMethod]=useState(null);
  const [done,setDone]=useState(false);
  const [numMM,setNumMM]=useState("");
  const [errPay,setErrPay]=useState("");

  const prix = `${PRIX_PREMIUM_FCFA.toLocaleString("fr-FR")} FCFA / an`;
  const montant = `${PRIX_PREMIUM_FCFA.toLocaleString("fr-FR")} FCFA`;

  const isMM = ["orange","mtn","moov","wave"].includes(method);
  /* ── Paiement ────────────────────────────────────────────────────────
     Simulation locale en attendant le branchement de la vraie API de
     paiement (Mobile Money / carte) qui sera fournie plus tard : le point
     d'intégration est ici, à l'endroit exact où l'appel réseau réel
     remplacera cette activation immédiate. ── */
  const valider=()=>{
    setErrPay("");
    if(isMM){
      if(numMM.length<10){setErrPay("Veuillez saisir votre numéro Mobile Money (10 chiffres CI).");return;}
    }
    playNotif();
    setDone(true);
  };

  if(done) return (
    <div className="scr on" style={{display:"flex",flexDirection:"column"}}>
      <div className="scrhdr">
        <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
        <p className="scrttl">Paiement</p>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px",textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
          <I n="check" s={36} c="#fff"/>
        </div>
        <p style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800,color:C.ink,letterSpacing:"-.5px",marginBottom:10}}>Abonnement activé !</p>
        <p style={{fontSize:14,color:C.muted,lineHeight:1.6,marginBottom:28}}>Votre forfait Premium ALERTE CI est maintenant actif. Profitez de toutes les fonctionnalités.</p>
        <button className="btn btn-p" onClick={()=>onSuccess?onSuccess():go("home")}>Accéder à l'application <I n="arrow" s={16} c="#fff"/></button>
      </div>
    </div>
  );
  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="isc" style={{paddingTop:0}}>
        <div className="scrhdr" style={{padding:"20px 24px 16px"}}>
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Abonnement Premium</p>
        </div>

        <div style={{margin:"0 20px 20px",background:"linear-gradient(135deg,#1C1917,#292524)",borderRadius:22,padding:"20px"}}>
          <p style={{fontSize:11,fontWeight:700,color:C.orange,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>✦ ABONNEMENT ANNUEL</p>
          <p style={{fontFamily:"Sora,sans-serif",fontSize:26,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>{prix}</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:4}}>Accès complet · Alerte Violence · Alerte Enlèvement</p>
          <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Alerte Violence","Alerte Enlèvement"].map((f,i)=>(
              <span key={i} style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20,background:"rgba(249,115,22,.15)",color:C.orange}}>{f}</span>
            ))}
          </div>
        </div>
        <p className="fst" style={{padding:"0 20px"}}>Choisir le mode de paiement</p>
        <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,marginBottom:8}}>
          {[
            {id:"orange",label:"Orange Money",color:"#FF6200",logo:"🟠"},
            {id:"mtn",label:"MTN Mobile Money",color:"#FFCC00",logo:"🟡"},
            {id:"moov",label:"Moov Money",color:"#00AEEF",logo:"🔷"},
            {id:"wave",label:"Wave CI",color:"#1A73E8",logo:"🔵"},
          ].map((m)=>(
            <button key={m.id} onClick={()=>{setMethod(m.id);setErrPay("");}}
              style={{display:"flex",alignItems:"center",gap:14,background:"#fff",border:`2px solid ${method===m.id?m.color:"rgba(0,0,0,.07)"}`,borderRadius:16,padding:"14px 16px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",transform:method===m.id?"scale(1.01)":"scale(1)"}}>
              <span style={{fontSize:28}}>{m.logo}</span>
              <div style={{flex:1,textAlign:"left"}}>
                <p style={{fontSize:14,fontWeight:700,color:C.ink}}>{m.label}</p>
                <p style={{fontSize:11,color:C.muted,marginTop:2}}>Paiement instantané · Numéro CI 10 chiffres</p>
              </div>
              <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${method===m.id?m.color:C.surfH}`,background:method===m.id?m.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {method===m.id&&<I n="check" s={11} c="#fff"/>}
              </div>
            </button>
          ))}

          {isMM&&(
            <div style={{animation:"stin 280ms var(--eo)"}}>
              <div className="if" style={{border:`1.5px solid ${numMM.length===10?"rgba(22,163,74,.4)":C.border}`}}>
                <I n="phone" s={18} c={C.faint}/>
                <input type="tel" value={numMM}
                  onChange={e=>setNumMM(e.target.value.replace(/\D/g,"").slice(0,10))}
                  placeholder="Numéro Mobile Money (10 chiffres CI) *"
                  maxLength={10}
                  style={{letterSpacing:numMM.length>0?"1px":"normal"}}/>
                {numMM.length===10
                  ?<span style={{fontSize:12,color:C.green,fontWeight:700}}>✓</span>
                  :<span style={{fontSize:9,fontWeight:700,color:"#DC2626",flexShrink:0}}>Requis</span>
                }
              </div>
            </div>
          )}

          {errPay&&(
            <div style={{background:"#FFF1F2",border:"1px solid rgba(220,38,38,.2)",borderRadius:12,padding:"10px 14px"}}>
              <p style={{fontSize:12,color:"#DC2626",fontWeight:600}}>⚠️ {errPay}</p>
            </div>
          )}
        </div>

        <div style={{padding:"12px 20px 8px"}}>
          <button className="btn btn-p"
            style={{opacity:method?1:.5}}
            disabled={!method}
            onClick={valider}>
            Payer {montant} <I n="arrow" s={16} c="#fff"/>
          </button>
        </div>
        <p style={{fontSize:11,color:C.faint,textAlign:"center",paddingBottom:20}}>🔒 Paiement chiffré et sécurisé · 1 compte = 1 appareil</p>
      </div>
    </div>
  );
};

/* ── INSCRIPTION ─────────────────────────────────────────────────────────────── */
const Signup = ({go,goBack,onSignup,userInfo={},comptesInscrits=[],typesService=TYPES_SERVICE_DEFAUT}) => {
  const [type,setType]=useState(null); // "user" | "service"
  const [plan,setPlan]=useState("premium");
  const [cgu,setCgu]=useState(false);
  const [nm,setNm]=useState("");
  const [ph,setPh]=useState("");
  const [mail,setMail]=useState(""); // facultatif
  const [commune,setCommune]=useState("");
  const [pw,setPw]=useState("");
  const [nomInstitution,setNomInstitution]=useState("");
  const [typeService,setTypeService]=useState("");
  const [villeInstitution,setVilleInstitution]=useState("");
  const [responsable,setResponsable]=useState("");
  const [phInstitution,setPhInstitution]=useState("");
  const [mailInstitution,setMailInstitution]=useState(""); // facultatif
  const [pwInstitution,setPwInstitution]=useState("");

  /* ── Détection de compte déjà existant ──────────────────────────────────
     Un numéro est considéré "déjà inscrit" s'il correspond à un compte de
     démonstration ou au compte créé pendant cette session. Dans ce cas,
     on bloque l'inscription et on invite la personne à se connecter avec
     son code d'accès plutôt que de recréer un compte. */
  const compteExistant = ph.length===10 && (
    DEMO_ACCOUNTS.some(c=>c.ph===ph) || comptesInscrits.some(c=>c.ph===ph)
  );
  /* ── Idem côté institutionnel : un numéro professionnel déjà enregistré
     ne peut pas créer un second compte institutionnel. ── */
  const institutionExistante = phInstitution.length===10 && (
    DEMO_ACCOUNTS.some(c=>c.ph===phInstitution) || comptesInscrits.some(c=>c.ph===phInstitution)
  );

  /* ── Tous les champs sont obligatoires sauf l'email ── */
  const institutionValide = nomInstitution.trim() && typeService && villeInstitution.trim()
    && responsable.trim() && phInstitution.length===10 && pwInstitution.length===6 && !institutionExistante;

  /* ── Choix du type de compte ── */
  if(!type) return (
    <div className="scr on" style={{display:"flex",flexDirection:"column"}}>
      <div className="scrhdr">
        <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
        <p className="scrttl">Créer un compte</p>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px 40px"}}>
        <div style={{marginBottom:28,textAlign:"center"}}>
          <p style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,color:C.ink,letterSpacing:"-.5px",marginBottom:6}}>Vous êtes ?</p>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.5}}>Choisissez le type de compte qui correspond à votre situation</p>
        </div>
        <div style={{width:"100%",display:"flex",flexDirection:"column",gap:14}}>
          <button onClick={()=>setType("user")} style={{background:"#fff",border:"2px solid rgba(0,0,0,.07)",borderRadius:22,padding:"22px 20px",cursor:"pointer",textAlign:"left",fontFamily:"Plus Jakarta Sans"}} onMouseOver={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(249,115,22,.12)"}} onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,.07)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
              <div style={{width:48,height:48,borderRadius:16,background:C.orangeL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <I n="user" s={24} c={C.orange}/>
              </div>
              <div>
                <p style={{fontSize:16,fontWeight:800,color:C.ink,letterSpacing:"-.3px"}}>Utilisateur particulier</p>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:C.orangeL,color:C.orange}}>GRATUIT · PREMIUM</span>
              </div>
            </div>
            <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Accédez aux services de sécurité, planning personnel et alertes publiques pour votre usage quotidien.</p>
          </button>
          <button onClick={()=>setType("service")} style={{background:"#fff",border:"2px solid rgba(0,0,0,.07)",borderRadius:22,padding:"22px 20px",cursor:"pointer",textAlign:"left",fontFamily:"Plus Jakarta Sans"}} onMouseOver={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(22,163,74,.12)"}} onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,.07)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
              <div style={{width:48,height:48,borderRadius:16,background:C.greenL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <I n="building" s={24} c={C.green}/>
              </div>
              <div>
                <p style={{fontSize:16,fontWeight:800,color:C.ink,letterSpacing:"-.3px"}}>Service public / Institution</p>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:C.greenL,color:C.green}}>SOUMIS À VALIDATION</span>
              </div>
            </div>
            <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Pour les ministères, mairies, pompiers, police et autres services institutionnels. Votre inscription sera validée par l'administrateur ALERTE CI.</p>
          </button>
        </div>
      </div>
    </div>
  );
  /* ── Formulaire Service public ── */
  if(type==="service") return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrhdr">
        <button className="bk" onClick={()=>setType(null)}><I n="back" s={18} c={C.ink}/></button>
        <p className="scrttl">Compte Institutionnel</p>
      </div>
      <div className="isc">
        <div style={{background:C.greenL,border:"1px solid rgba(22,163,74,.2)",borderRadius:16,padding:"14px 16px",marginBottom:4}}>
          <p style={{fontSize:12,fontWeight:700,color:C.green,marginBottom:4}}>🏛 Inscription institutionnelle</p>
          <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Votre demande sera examinée et validée par notre équipe dans un délai de 24 à 72h ouvrables. Vous recevrez une notification par email et SMS à la validation.</p>
        </div>
        <p className="fst">Informations de l'institution</p>
        <div className="ig">
          <div className="if si" style={{animationDelay:"0ms"}}>
            <I n="building" s={18} c={C.faint}/>
            <input type="text" value={nomInstitution} onChange={e=>setNomInstitution(e.target.value)} placeholder="Nom de l'institution / service *"/>
          </div>
          <div className="if si" style={{animationDelay:"40ms"}}>
            <I n="star" s={18} c={C.faint}/>
            <select value={typeService} onChange={e=>setTypeService(e.target.value)} style={{flex:1,border:"none",outline:"none",background:"transparent",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:500,color:typeService?C.ink:C.faint,appearance:"none"}}>
              <option value="">Type de service *</option>
              {typesService.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="if si" style={{animationDelay:"80ms"}}>
            <I n="pin" s={18} c={C.faint}/>
            <input type="text" value={villeInstitution} onChange={e=>setVilleInstitution(e.target.value)} placeholder="Ville / Commune d'implantation *"/>
          </div>
        </div>
        <p className="fst">Responsable du compte</p>
        <div className="ig">
          <div className="if si" style={{animationDelay:"120ms"}}>
            <I n="user" s={18} c={C.faint}/>
            <input type="text" value={responsable} onChange={e=>setResponsable(e.target.value)} placeholder="Nom et prénom du responsable *"/>
          </div>
          <div className="if si" style={{animationDelay:"160ms"}}>
            <I n="phone" s={18} c={C.faint}/>
            <input type="tel" value={phInstitution} onChange={e=>setPhInstitution(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="Téléphone professionnel (10 chiffres) *" maxLength={10}/>
            {phInstitution.length===10&&!institutionExistante&&<span style={{fontSize:11,color:C.green,fontWeight:700}}>✓</span>}
          </div>
          {institutionExistante&&(
            <div style={{background:"#FFF7ED",border:"1.5px solid rgba(249,115,22,.3)",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10,animation:"stin 200ms var(--eo)"}}>
              <span style={{fontSize:18,flexShrink:0}}>ℹ️</span>
              <div style={{flex:1}}>
                <p style={{fontSize:12,fontWeight:800,color:C.orange,marginBottom:3}}>Ce numéro est déjà inscrit</p>
                <p style={{fontSize:11,color:C.muted,lineHeight:1.5,marginBottom:8}}>Un compte institutionnel existe déjà avec ce numéro. Connectez-vous avec votre code d'accès au lieu de créer un nouveau compte.</p>
                <button onClick={()=>go("login")}
                  style={{fontSize:12,fontWeight:700,color:"#fff",background:C.orange,border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>
                  Se connecter →
                </button>
              </div>
            </div>
          )}
          <div className="if si" style={{animationDelay:"200ms"}}>
            <I n="mail" s={18} c={C.faint}/>
            <input type="email" value={mailInstitution} onChange={e=>setMailInstitution(e.target.value)} placeholder="Email officiel (.gouv.ci ou institutionnel)"/>
            <span style={{fontSize:9,fontWeight:700,color:C.faint,background:C.surf,padding:"2px 6px",borderRadius:8,flexShrink:0}}>Optionnel</span>
          </div>
          <div className="if si" style={{animationDelay:"240ms",flexDirection:"column",alignItems:"stretch",gap:8,background:"transparent",border:"none",padding:0}}>
            <p className="fst" style={{paddingTop:4}}>Créez votre code d'accès (6 chiffres) *</p>
            <p style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:-6,marginBottom:4,lineHeight:1.5}}>
              Ce code vous servira, avec votre numéro de téléphone, à vous reconnecter au tableau de bord institutionnel.
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              {[0,1,2,3,4,5].map(i=>(
                <input key={i} id={`pwi-${i}`} type="password" inputMode="numeric"
                  maxLength={1} value={pwInstitution[i]||""}
                  onChange={e=>{
                    const v=e.target.value.replace(/\D/g,"").slice(0,1);
                    const arr=pwInstitution.split("");
                    arr[i]=v;
                    const next=arr.join("").slice(0,6);
                    setPwInstitution(next);
                    if(v&&i<5) document.getElementById(`pwi-${i+1}`)?.focus();
                  }}
                  onKeyDown={e=>{if(e.key==="Backspace"&&!pwInstitution[i]&&i>0) document.getElementById(`pwi-${i-1}`)?.focus();}}
                  style={{width:44,height:52,borderRadius:12,
                    border:`2px solid ${pwInstitution.length>i?C.green:C.surfH}`,
                    textAlign:"center",fontSize:20,fontWeight:800,color:C.ink,
                    fontFamily:"Plus Jakarta Sans",outline:"none",
                    background:pwInstitution.length>i?C.greenL:"#fff"}}/>
              ))}
            </div>
          </div>
        </div>
        <p className="fst">Document justificatif</p>
        <button className="mb" style={{width:"100%",flexDirection:"row",gap:12,marginBottom:16}}>
          <I n="file" s={22} c={C.green}/>
          <span style={{fontSize:13,fontWeight:600,color:C.green}}>Joindre une lettre officielle ou attestation</span>
        </button>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:16,padding:"4px 0"}}>
          <button onClick={()=>setCgu(p=>!p)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${cgu?C.orange:C.surfH}`,background:cgu?C.orange:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1}}>
            {cgu&&<I n="check" s={13} c="#fff"/>}
          </button>
          <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>J'atteste représenter officiellement cette institution et j'accepte les <button onClick={()=>go("cgu")} style={{background:"none",border:"none",cursor:"pointer",color:C.orange,fontWeight:700,fontSize:12,fontFamily:"inherit"}}>Conditions d'utilisation</button></p>
        </div>
        <div style={{marginBottom:8}}>
          <button className="btn btn-gr" style={{opacity:cgu&&institutionValide?1:.5}} disabled={!cgu||!institutionValide}
            onClick={()=>{
              onSignup&&onSignup({
                nm:nomInstitution.trim(), ph:phInstitution, mail:mailInstitution.trim(),
                commune:villeInstitution.trim(), pin:pwInstitution,
                typeService, responsable:responsable.trim(),
                statut:"en_attente", plan:"institution", target:"home_service",
              });
              go("home_service");
            }}>
            Soumettre la demande <I n="send" s={16} c="#fff"/>
          </button>
        </div>
        <p style={{fontSize:11,color:C.faint,textAlign:"center",paddingBottom:16}}>* Champs obligatoires (sauf email) · Validation sous 24-72h · Notification email & SMS</p>
      </div>
    </div>
  );
  /* ── Formulaire Utilisateur particulier ── */
  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrhdr">
        <button className="bk" onClick={()=>setType(null)}><I n="back" s={18} c={C.ink}/></button>
        <p className="scrttl">Compte Utilisateur</p>
      </div>
      <div className="isc">
        <p className="fst">Informations personnelles</p>
        <div className="ig">
          <div className="if si" style={{animationDelay:"0ms"}}>
            <I n="user" s={18} c={C.faint}/>
            <input type="text" value={nm} onChange={e=>setNm(e.target.value)} placeholder="Nom et prénom *"/>
          </div>
          <div className="if si" style={{animationDelay:"60ms"}}>
            <I n="phone" s={18} c={C.faint}/>
            <input type="tel" value={ph} onChange={e=>setPh(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="0X XX XX XX XX (10 chiffres CI) *" maxLength={10}/>
            {ph.length===10&&!compteExistant&&<span style={{fontSize:11,color:C.green,fontWeight:700}}>✓</span>}
          </div>
          {compteExistant&&(
            <div style={{background:"#FFF7ED",border:"1.5px solid rgba(249,115,22,.3)",borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10,animation:"stin 200ms var(--eo)"}}>
              <span style={{fontSize:18,flexShrink:0}}>ℹ️</span>
              <div style={{flex:1}}>
                <p style={{fontSize:12,fontWeight:800,color:C.orange,marginBottom:3}}>Ce numéro est déjà inscrit</p>
                <p style={{fontSize:11,color:C.muted,lineHeight:1.5,marginBottom:8}}>Un compte ALERTE CI existe déjà avec ce numéro de téléphone. Connectez-vous avec votre code d'accès au lieu de créer un nouveau compte.</p>
                <button onClick={()=>go("login")}
                  style={{fontSize:12,fontWeight:700,color:"#fff",background:C.orange,border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>
                  Se connecter →
                </button>
              </div>
            </div>
          )}
          <div className="if si" style={{animationDelay:"120ms"}}>
            <I n="mail" s={18} c={C.faint}/>
            <input type="email" value={mail} onChange={e=>setMail(e.target.value)} placeholder="Adresse email (facultatif)"/>
            <span style={{fontSize:9,fontWeight:700,color:C.faint,background:C.surf,padding:"2px 6px",borderRadius:8,flexShrink:0}}>Optionnel</span>
          </div>
          <div className="if si" style={{animationDelay:"180ms"}}>
            <I n="pin" s={18} c={C.faint}/>
            <select value={commune} onChange={e=>setCommune(e.target.value)} style={{flex:1,border:"none",outline:"none",background:"transparent",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:500,color:C.ink,appearance:"none"}}>
              <option value="">Commune de résidence</option>
              {VILLES_CI.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="if si" style={{animationDelay:"240ms",flexDirection:"column",alignItems:"stretch",gap:8,background:"transparent",border:"none",padding:0}}>
            <p className="fst" style={{paddingTop:4}}>Créez votre code d'accès (6 chiffres) *</p>
            <p style={{fontSize:11,color:C.muted,textAlign:"center",marginTop:-6,marginBottom:4,lineHeight:1.5}}>
              Ce code remplace le mot de passe : il vous servira désormais, avec votre numéro, à vous reconnecter à votre compte.
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              {[0,1,2,3,4,5].map(i=>(
                <input key={i} id={`pw-${i}`} type="password" inputMode="numeric"
                  maxLength={1} value={pw[i]||""}
                  onChange={e=>{
                    const v=e.target.value.replace(/\D/g,"").slice(0,1);
                    const arr=pw.split("");
                    arr[i]=v;
                    const next=arr.join("").slice(0,6);
                    setPw(next);
                    if(v&&i<5) document.getElementById(`pw-${i+1}`)?.focus();
                  }}
                  onKeyDown={e=>{if(e.key==="Backspace"&&!pw[i]&&i>0) document.getElementById(`pw-${i-1}`)?.focus();}}
                  style={{width:44,height:52,borderRadius:12,
                    border:`2px solid ${pw.length>i?C.orange:C.surfH}`,
                    textAlign:"center",fontSize:22,fontWeight:800,
                    fontFamily:"Sora,sans-serif",color:C.ink,
                    outline:"none",background:"#fff",
                    transition:"border-color 180ms ease"}}/>
              ))}
            </div>
            {pw.length>0&&pw.length<6&&(
              <p style={{fontSize:11,color:C.faint,textAlign:"center"}}>{6-pw.length} chiffre(s) restant(s)</p>
            )}
            {pw.length===6&&(
              <p style={{fontSize:11,color:C.green,fontWeight:700,textAlign:"center"}}>✓ Code complet — retenez-le bien, il vous servira à chaque connexion</p>
            )}
          </div>
        </div>
        <div style={{background:"linear-gradient(135deg,#1C1917,#292524)",borderRadius:18,padding:"16px 18px",marginTop:20,marginBottom:16}}>
          <p style={{fontSize:11,fontWeight:700,color:C.orange,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>✦ OFFERT À LA CRÉATION</p>
          <p style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:800,color:"#fff",marginBottom:4}}>1 mois d'essai gratuit — Akwaba</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,.55)",lineHeight:1.5}}>Accès complet à Alerte Violence et Alerte Enlèvement dès la création du compte. Ensuite, {PRIX_PREMIUM_FCFA.toLocaleString("fr-FR")} FCFA / an pour continuer.</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"4px 0"}}>
          <button onClick={()=>setCgu(p=>!p)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${cgu?C.orange:C.surfH}`,background:cgu?C.orange:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            {cgu&&<I n="check" s={13} c="#fff"/>}
          </button>
          <p style={{fontSize:12,color:C.muted}}>J'accepte les <button onClick={()=>go("cgu")} style={{background:"none",border:"none",cursor:"pointer",color:C.orange,fontWeight:700,fontSize:12,fontFamily:"inherit"}}>Conditions d'utilisation</button> et la politique de confidentialité</p>
        </div>
        <div style={{marginBottom:8}}>
          <button className="btn btn-p"
            onClick={()=>{
              onSignup&&onSignup({nm:saneTxt(nm,120),ph,mail,commune,pin:pw,plan:"gratuit"});
              go("home");
            }}
            style={{opacity:cgu&&nm.trim()&&ph.length===10&&pw.length===6&&!compteExistant?1:.5}}
            disabled={!cgu||!nm.trim()||ph.length<10||pw.length<6||compteExistant}>
            Créer mon compte — démarrer l'essai Akwaba <I n="arrow" s={16} c="#fff"/>
          </button>
        </div>
        <p style={{fontSize:11,color:C.faint,textAlign:"center",paddingBottom:16}}>1 compte = 1 numéro = 1 appareil connecté · Connexion par code d'accès uniquement</p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   PARCOURS SERVICE PUBLIC — 2 écrans : HomeService + ProfilService
   Nav réduite : Accueil | Profil
══════════════════════════════════════════════════════════════════════════════ */

const NavService = ({a,go}) => {
  const items=[{id:"home_service",ic:"home",lb:"Accueil"},{id:"profil_service",ic:"user",lb:"Profil"}];
  return (
    <nav className="bnav">
      {items.map(it=>(
        <button key={it.id} className={`ni ${a===it.id?"a":""}`} onClick={()=>go(it.id)}>
          <span style={{width:24,height:24,display:"flex",transform:a===it.id?"scale(1.15)":"scale(1)"}}>
            <I n={it.ic} s={22} c={a===it.id?"#16A34A":"#A8A29E"} w={a===it.id?2.2:1.8}/>
          </span>
          <span style={{fontSize:10,fontWeight:600,color:a===it.id?"#16A34A":"#A8A29E",transition:"color 180ms ease"}}>{it.lb}</span>
        </button>
      ))}
    </nav>
  );
};

/* ── Statuts de validation d'un compte institutionnel ──────────────────────
   Un compte institutionnel n'est marqué "validé et actif" qu'après examen
   par l'équipe ALERTE CI (dashboard admin, hors périmètre de cette maquette
   citoyen/service). Tant que ce n'est pas le cas, le statut réel est
   "en_attente" (par défaut à l'inscription) ou "refuse". Les comptes sans
   statut explicite (connexion historique/démo) sont considérés validés. ── */
const STATUTS_INSTITUTION = {
  valide:     {bg:C.greenL,   border:"rgba(22,163,74,.25)", dot:C.green,  txt:C.green,  label:"Compte validé et actif",                  badge:"VALIDÉ"},
  en_attente: {bg:"#FFF7ED",  border:"rgba(249,115,22,.3)", dot:C.orange, txt:C.orange, label:"Compte en attente de validation",         badge:"EN EXAMEN"},
  refuse:     {bg:"#FFF1F2",  border:"rgba(220,38,38,.25)", dot:"#DC2626",txt:"#DC2626",label:"Demande refusée — contactez le support",  badge:"REFUSÉ"},
};

const HomeService = ({go,goBack,userInfo={},alertesPubliques=[],ajouterAlertePublique}) => {
  const nomService = userInfo.nm && userInfo.nm.trim() ? userInfo.nm.trim() : "Service Public";
  const statutCompte = userInfo.statut || "valide"; // compte sans statut explicite = legacy validé
  const [alertes]=useState([]);
  const [msg,setMsg]=useState("");
  const [sent,setSent]=useState(false);
  const [tab,setTab]=useState("alertes"); // "alertes" | "diffuser"
  const [urgentDiffuse,setUrgentDiffuse]=useState(false);

  /* ── Le type de service institutionnel (choisi à l'inscription) détermine
     automatiquement l'écran citoyen où la diffusion doit apparaître :
     "service" porte ce type pour le filtrage côté Alerte Info, tandis que
     le NOM réel de l'institution (nomService) reste visible dans le
     contenu du message diffusé. SODEXAM garde son écran météo existant. ── */
  const ROUTAGE_PAR_TYPE = {
    "Ministère":                          {c:"#C2410C", bg:"rgba(249,115,22,.15)", icon:"🏛️", cible:"sp_ministere"},
    "Mairie / Commune":                   {c:"#2563EB", bg:"rgba(59,130,246,.15)", icon:"🏢", cible:"sp_mairie"},
    "Police":                             {c:"#1D4ED8", bg:"rgba(29,78,216,.15)",  icon:"🚓", cible:"sp_police"},
    "Gendarmerie":                        {c:"#15803D", bg:"rgba(21,128,61,.15)",  icon:"🪖", cible:"sp_gendarmerie"},
    "AGEROUTE":                           {c:"#B45309", bg:"rgba(180,83,9,.15)",   icon:"🚧", cible:"sp_routier"},
    "ANAGED":                              {c:"#15803D", bg:"rgba(21,128,61,.15)",  icon:"🗑️", cible:"sp_anaged"},
    "Hôpital et service de santé public": {c:"#BE123C", bg:"rgba(190,18,60,.15)",  icon:"🏥", cible:"sp_sante"},
    "La Ligue":                           {c:"#7C3AED", bg:"rgba(124,58,237,.15)", icon:"⚖️", cible:"sp_ligue"},
    "SODEXAM":                            {c:"#2563EB", bg:"rgba(59,130,246,.15)", icon:"🌧️", cible:"info"},
    "Autres services et organisations":   {c:"#0E7490", bg:"rgba(14,116,144,.15)", icon:"📢", cible:"sp_autres"},
  };
  const routage = ROUTAGE_PAR_TYPE[userInfo.typeService] || {c:C.green, bg:C.greenL, icon:"📢", cible:"sp_autres"};

  const diffuser = () => {
    if(!msg.trim()) return;
    ajouterAlertePublique && ajouterAlertePublique({
      urgent: urgentDiffuse,
      c: routage.c, bg: routage.bg, icon: routage.icon,
      service: userInfo.typeService||nomService, cible: routage.cible,
      institution: nomService,
      titre: msg.trim().slice(0,70)+(msg.trim().length>70?"…":""),
      apercu: msg.trim(),
    });
    playNotif();
    setSent(true);
    setMsg("");
    setUrgentDiffuse(false);
  };
  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">

        <div style={{padding:"24px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{fontSize:13,color:C.muted,fontWeight:500}}>{nomService}</p>
            <p style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,color:C.ink,letterSpacing:"-.5px",marginTop:2}}>Tableau de bord</p>
          </div>
          <div style={{width:44,height:44,borderRadius:50,background:"linear-gradient(135deg,#16A34A,#15803D)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <I n="building" s={22} c="#fff"/>
          </div>
        </div>

        {(() => {
          const s = STATUTS_INSTITUTION[statutCompte] || STATUTS_INSTITUTION.valide;
          return (
            <div style={{margin:"16px 20px 0",background:s.bg,border:`1px solid ${s.border}`,borderRadius:16,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:s.dot,animation:statutCompte==="valide"?"bk 2s ease infinite":"none",flexShrink:0}}/>
              <p style={{fontSize:12,fontWeight:700,color:s.txt}}>{s.label}</p>
              <span style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:s.txt,background:`${s.dot}1A`,padding:"2px 8px",borderRadius:20}}>{s.badge}</span>
            </div>
          );
        })()}

        <div style={{padding:"14px 20px 0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {val:alertes.length,lb:"Alertes reçues",c:C.orange,bg:C.orangeL},
            {val:alertes.filter(a=>a.urgent).length,lb:"Urgentes",c:"#DC2626",bg:"#FFF1F2"},
          ].map((k,i)=>(
            <div key={i} style={{background:k.bg,borderRadius:16,padding:"14px 16px"}}>
              <p style={{fontFamily:"Sora,sans-serif",fontSize:28,fontWeight:800,color:k.c,letterSpacing:"-1px"}}>{k.val}</p>
              <p style={{fontSize:11,fontWeight:600,color:k.c,opacity:.7,marginTop:2}}>{k.lb}</p>
            </div>
          ))}
        </div>

        <div style={{padding:"16px 20px 0",display:"flex",gap:8}}>
          {[{id:"alertes",lb:"Reçues"},{id:"diffuser",lb:"Diffuser"},{id:"mesinfos",lb:"Mes infos"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSent(false);}} style={{flex:1,padding:"10px 6px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,background:tab===t.id?C.green:"#fff",color:tab===t.id?"#fff":C.muted,boxShadow:tab===t.id?"0 4px 14px rgba(22,163,74,.25)":"none"}}>
              {t.lb}
            </button>
          ))}
        </div>

        {tab==="alertes"&&(
          <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:10}}>
            {alertes.length===0&&(
              <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:"28px 20px",textAlign:"center"}}>
                <p style={{fontSize:28,marginBottom:8}}>📭</p>
                <p style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>Aucun signalement reçu</p>
                <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Les signalements citoyens transmis à votre service apparaîtront ici.</p>
              </div>
            )}
            {alertes.map((a,i)=>(
              <div key={i} className="si" style={{animationDelay:`${i*50}ms`,background:"#fff",border:`1.5px solid ${a.urgent?"rgba(220,38,38,.2)":"rgba(0,0,0,.07)"}`,borderRadius:18,padding:"14px 16px",cursor:"pointer"}}
                onMouseOver={e=>e.currentTarget.style.transform="translateY(-1px)"}
                onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:36,height:36,borderRadius:12,background:a.urgent?"#FFF1F2":C.orangeL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <I n="building" s={18} c={a.urgent?"#DC2626":C.orange}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <p style={{fontSize:13,fontWeight:700,color:C.ink}}>{a.user}</p>
                      {a.urgent&&<span style={{fontSize:9,fontWeight:800,color:"#DC2626",background:"#FFF1F2",padding:"2px 7px",borderRadius:20,letterSpacing:".5px"}}>URGENT</span>}
                    </div>
                    <p style={{fontSize:11,color:C.muted,marginTop:1}}>{a.commune} · {a.heure}</p>
                  </div>
                </div>
                <p style={{fontSize:12,color:C.muted,lineHeight:1.5,marginBottom:10}}>{a.msg}</p>
                <div style={{display:"flex",gap:8}}>
                  <button style={{flex:1,padding:"8px",background:C.greenL,border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,color:C.green,fontFamily:"Plus Jakarta Sans"}} onClick={playNotif}>Traiter</button>
                  <button style={{flex:1,padding:"8px",background:C.surf,border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,color:C.muted,fontFamily:"Plus Jakarta Sans"}}>Archiver</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="diffuser"&&(
          <div style={{padding:"14px 20px"}}>
            {statutCompte!=="valide"?(
              <div style={{background:"#FFF7ED",border:"1px solid rgba(249,115,22,.3)",borderRadius:20,padding:"28px 20px",textAlign:"center",marginTop:8}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:C.orange,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
                  <span style={{fontSize:26}}>⏳</span>
                </div>
                <p style={{fontSize:17,fontWeight:800,color:C.ink,fontFamily:"Sora"}}>
                  {statutCompte==="refuse"?"Compte non autorisé":"Validation en cours"}
                </p>
                <p style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.5}}>
                  {statutCompte==="refuse"
                    ?"Votre demande d'inscription institutionnelle a été refusée. Contactez le support ALERTE CI pour plus d'informations."
                    :"Votre compte est en attente de validation par l'équipe ALERTE CI. La diffusion d'informations sera activée dès l'approbation de votre demande (24 à 72h ouvrables)."}
                </p>
              </div>
            ):sent?(
              <div style={{background:C.greenL,border:"1px solid rgba(22,163,74,.3)",borderRadius:20,padding:"28px 20px",textAlign:"center",marginTop:8}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><I n="check" s={26} c="#fff"/></div>
                <p style={{fontSize:17,fontWeight:800,color:C.ink,fontFamily:"Sora"}}>Information diffusée</p>
                <p style={{fontSize:13,color:C.muted,marginTop:8,lineHeight:1.5}}>Votre message a été envoyé à tous les utilisateurs ALERTE CI concernés.</p>
                <button className="btn btn-g" style={{marginTop:20}} onClick={()=>setSent(false)}>Nouveau message</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:C.surf,borderRadius:16,padding:"12px 14px"}}>
                  <p style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:4}}>Destinataires</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {["Tous les utilisateurs","Par commune","Par code alerte"].map((d,i)=>(
                      <button key={i} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${i===0?C.green:"rgba(0,0,0,.1)"}`,background:i===0?C.greenL:"#fff",color:i===0?C.green:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,background:routage.bg,borderRadius:14,padding:"12px 14px"}}>
                  <span style={{fontSize:20}}>{routage.icon}</span>
                  <div>
                    <p style={{fontSize:12,fontWeight:700,color:routage.c}}>Diffusion automatique</p>
                    <p style={{fontSize:11,color:C.muted,marginTop:1}}>Votre message apparaîtra chez les citoyens dans l'écran {userInfo.typeService||"Service Public"} d'Alerte Info.</p>
                  </div>
                </div>
                <div className="if" style={{alignItems:"flex-start",paddingTop:12}}>
                  <I n="alert" s={18} c={C.faint} style={{marginTop:2}}/>
                  <textarea rows={4} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Rédigez votre message d'information ou d'alerte à destination des citoyens..."/>
                </div>
                <button onClick={()=>setUrgentDiffuse(p=>!p)}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,border:`1.5px solid ${urgentDiffuse?"#DC2626":C.border}`,background:urgentDiffuse?"#FFF1F2":"#fff",cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>
                  <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${urgentDiffuse?"#DC2626":C.surfH}`,background:urgentDiffuse?"#DC2626":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {urgentDiffuse&&<I n="check" s={11} c="#fff"/>}
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:urgentDiffuse?"#DC2626":C.muted}}>Marquer comme URGENT</span>
                </button>
                <div style={{display:"flex",gap:10,marginBottom:8}}>
                  <button className="mb" style={{flex:1}}><I n="camera" s={20} c={C.muted}/><span>Photo</span></button>
                  <button className="mb" style={{flex:1}}><I n="video" s={20} c={C.muted}/><span>Vidéo</span></button>
                </div>
                <p style={{fontSize:11,color:C.faint,textAlign:"center"}}>⏱ Cette information sera visible 24h dans Alerte Info et à l'Accueil des utilisateurs</p>
                <button className="btn btn-gr" onClick={diffuser} style={{opacity:msg.trim()?1:.5}} disabled={!msg.trim()}>
                  <I n="send" s={16} c="#fff"/>Diffuser aux utilisateurs
                </button>
              </div>
            )}
          </div>
        )}

        {tab==="mesinfos"&&(() => {
          /* "Mes infos" n'affiche que les publications de CE compte précis —
             jamais les données de démonstration des autres services. */
          const mesAlertes = alertesPubliques.filter(a=>!a.citoyen && (a.institution||a.service)===nomService);
          return (
          <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:10}}>
            {mesAlertes.length===0&&(
              <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:"28px 20px",textAlign:"center"}}>
                <p style={{fontSize:28,marginBottom:8}}>📭</p>
                <p style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>Aucune information diffusée</p>
                <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Vos publications apparaîtront ici avec leur temps restant avant expiration (24h).</p>
              </div>
            )}
            {[...mesAlertes].sort((a,b)=>b.ts-a.ts).map((a,i)=>{
              const heuresRestantes = Math.max(0, 24-((Date.now()-a.ts)/(60*60*1000)));
              return (
                <div key={a.id} className="si" style={{animationDelay:`${i*50}ms`,background:"#fff",border:`1.5px solid ${a.urgent?"rgba(220,38,38,.2)":C.border}`,borderRadius:18,padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:12,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>{a.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <p style={{fontSize:13,fontWeight:700,color:C.ink}}>{a.titre}</p>
                        {a.urgent&&<span style={{fontSize:9,fontWeight:800,color:"#fff",background:"#DC2626",padding:"2px 7px",borderRadius:20,flexShrink:0}}>URGENT</span>}
                      </div>
                      <p style={{fontSize:11,color:C.muted,marginTop:1}}>{formatHeureRelative(a.ts)}</p>
                    </div>
                  </div>
                  <p style={{fontSize:12,color:C.muted,lineHeight:1.5,marginBottom:10}}>{a.apercu}</p>
                  <div style={{display:"flex",alignItems:"center",gap:6,background:C.surf,borderRadius:10,padding:"6px 10px"}}>
                    <span style={{fontSize:10}}>⏱</span>
                    <span style={{fontSize:11,fontWeight:700,color:heuresRestantes<2?"#DC2626":C.muted}}>
                      {heuresRestantes<1?`Expire dans ${Math.round(heuresRestantes*60)} min`:`Expire dans ${Math.round(heuresRestantes)}h`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          );
        })()}
        <div style={{height:8}}/>
      </div>
      <NavService a="home_service" go={go}/>
    </div>
  );
};

const ProfilService = ({go,goBack,userInfo={},seDeconnecter}) => {
  const nomService = userInfo.nm && userInfo.nm.trim() ? userInfo.nm.trim() : "Service Public";
  const statutCompte = userInfo.statut || "valide";
  const s = STATUTS_INSTITUTION[statutCompte] || STATUTS_INSTITUTION.valide;
  return (
  <div className="scr on" style={{display:"flex"}}>
    <div className="scrl">
      <div style={{padding:"24px 24px 0"}}>
        <p style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800,color:C.ink,letterSpacing:"-.5px"}}>Mon profil</p>
      </div>
      <div style={{padding:"20px 20px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#16A34A,#15803D)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I n="building" s={36} c="#fff"/>
        </div>
        <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:C.ink,letterSpacing:"-.3px",textAlign:"center"}}>{nomService}</p>
        {userInfo.typeService&&<p style={{fontSize:12,color:C.muted}}>{userInfo.typeService}</p>}
        <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:s.bg,color:s.txt,letterSpacing:".5px",display:"flex",alignItems:"center",gap:5}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:s.dot,animation:statutCompte==="valide"?"bk 2s ease infinite":"none"}}/>
          {s.label.toUpperCase()}
        </span>
      </div>
      <div className="pm">
        {[
          {ic:"user",lb:userInfo.responsable||"Responsable du compte"},
          {ic:"phone",lb:userInfo.ph||"Non renseigné"},
          {ic:"mail",lb:userInfo.mail||"Non renseigné"},
          {ic:"pin",lb:userInfo.commune||"Non renseignée"},
        ].map((it,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px"}}>
            <I n={it.ic} s={18} c={C.green}/>
            <span style={{fontSize:14,fontWeight:500,color:C.ink}}>{it.lb}</span>
          </div>
        ))}
        <div style={{height:8}}/>
        {[
          {ic:"settings",lb:"Paramètres du compte",sc:"parametres_service"},
          {ic:"file",lb:"Conditions d'utilisation",sc:"cgu"},
          {ic:"shield2",lb:"Politique de confidentialité",sc:"cgu"},
        ].map((it,i)=>(
          <button key={i} className="pmi" onClick={()=>it.sc&&go(it.sc)}>
            <div style={{width:34,height:34,borderRadius:10,background:C.surf,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <I n={it.ic} s={17} c={C.muted}/>
            </div>
            <span style={{fontSize:14,fontWeight:600,color:C.ink,flex:1,textAlign:"left"}}>{it.lb}</span>
            <I n="arrow" s={14} c={C.faint}/>
          </button>
        ))}
        <div style={{height:4}}/>
        <button className="btn btn-g" onClick={()=>seDeconnecter?seDeconnecter():go("splash")}>Se déconnecter</button>
      </div>
      <div style={{height:24}}/>
    </div>
    <NavService a="profil_service" go={go}/>
  </div>
  );
};

/* ── Paramètres du compte institutionnel ──────────────────────────────── */
const ParametresService = ({go,goBack,userInfo={},setUserInfo}) => {
  const [edit,setEdit]=useState(false);
  const [draft,setDraft]=useState({
    responsable:userInfo.responsable||"", ph:userInfo.ph||"",
    mail:userInfo.mail||"", commune:userInfo.commune||"",
  });
  const [notifSon,setNotifSon]=useState(true);
  const [notifPush,setNotifPush]=useState(true);
  const [saved,setSaved]=useState(false);

  const enregistrer=()=>{
    setUserInfo&&setUserInfo(p=>({...p,...draft}));
    setEdit(false);
    setSaved(true);
    playNotif();
    setTimeout(()=>setSaved(false),2500);
  };

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Paramètres du compte</p>
        </div>
        <div className="pm">
          {saved&&(
            <div style={{background:C.greenL,border:"1px solid rgba(22,163,74,.25)",borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>✅</span>
              <p style={{fontSize:13,fontWeight:700,color:C.green}}>Informations mises à jour</p>
            </div>
          )}

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <p className="fst" style={{marginTop:0,marginBottom:0}}>Informations du responsable</p>
            {!edit&&(
              <button onClick={()=>{setDraft({responsable:userInfo.responsable||"",ph:userInfo.ph||"",mail:userInfo.mail||"",commune:userInfo.commune||""});setEdit(true);}}
                style={{fontSize:12,fontWeight:700,color:C.green,background:"none",border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>
                ✏️ Modifier
              </button>
            )}
          </div>

          {!edit?(
            [
              {ic:"user",lb:"Responsable",val:userInfo.responsable||"Non renseigné"},
              {ic:"phone",lb:"Téléphone",val:userInfo.ph||"Non renseigné"},
              {ic:"mail",lb:"Email",val:userInfo.mail||"Non renseigné"},
              {ic:"pin",lb:"Commune",val:userInfo.commune||"Non renseignée"},
            ].map((it,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px"}}>
                <I n={it.ic} s={18} c={C.green}/>
                <div>
                  <p style={{fontSize:10,fontWeight:700,color:C.faint,textTransform:"uppercase"}}>{it.lb}</p>
                  <p style={{fontSize:14,fontWeight:500,color:C.ink}}>{it.val}</p>
                </div>
              </div>
            ))
          ):(
            <div style={{background:"#fff",border:`1.5px solid ${C.green}`,borderRadius:16,padding:16,display:"flex",flexDirection:"column",gap:10}}>
              <div className="if">
                <I n="user" s={16} c={C.faint}/>
                <input value={draft.responsable} onChange={e=>setDraft(p=>({...p,responsable:e.target.value}))} placeholder="Nom du responsable"/>
              </div>
              <div className="if">
                <I n="phone" s={16} c={C.faint}/>
                <input value={draft.ph} maxLength={10} onChange={e=>setDraft(p=>({...p,ph:e.target.value.replace(/\D/g,"").slice(0,10)}))} placeholder="Téléphone (10 chiffres)"/>
              </div>
              <div className="if">
                <I n="mail" s={16} c={C.faint}/>
                <input value={draft.mail} onChange={e=>setDraft(p=>({...p,mail:e.target.value}))} placeholder="Email officiel"/>
              </div>
              <div className="if">
                <I n="pin" s={16} c={C.faint}/>
                <input value={draft.commune} onChange={e=>setDraft(p=>({...p,commune:e.target.value}))} placeholder="Commune d'implantation"/>
              </div>
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button className="btn btn-gr" style={{flex:1}} onClick={enregistrer}><I n="check" s={14} c="#fff"/>Enregistrer</button>
                <button className="btn btn-g" style={{flex:1}} onClick={()=>setEdit(false)}>Annuler</button>
              </div>
            </div>
          )}

          <p className="fst">Notifications</p>
          {[
            {lb:"Son de notification",sub:"Jouer un son à chaque diffusion envoyée",val:notifSon,set:setNotifSon},
            {lb:"Notifications push",sub:"Être notifié des signalements reçus",val:notifPush,set:setNotifPush},
          ].map((it,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px"}}>
              <div>
                <p style={{fontSize:14,fontWeight:600,color:C.ink}}>{it.lb}</p>
                <p style={{fontSize:11,color:C.muted,marginTop:2}}>{it.sub}</p>
              </div>
              <button className={`tsw ${it.val?"on":"off"}`} onClick={()=>{it.set(p=>!p);playNotif();}}>
                <div className={`tth ${it.val?"on":"off"}`}/>
              </button>
            </div>
          ))}

          <p className="fst">Compte</p>
          <button className="pmi" onClick={()=>go("cgu")}>
            <div style={{width:34,height:34,borderRadius:10,background:C.surf,display:"flex",alignItems:"center",justifyContent:"center"}}><I n="file" s={17} c={C.muted}/></div>
            <span style={{fontSize:14,fontWeight:600,color:C.ink,flex:1,textAlign:"left"}}>Conditions d'utilisation</span>
            <I n="arrow" s={14} c={C.faint}/>
          </button>
          <div style={{height:4}}/>
          <button className="btn btn-g" onClick={()=>go("splash")} style={{color:"#DC2626"}}>Supprimer ce compte institutionnel</button>
          <div style={{height:20}}/>
        </div>
      </div>
      <NavService a="profil_service" go={go}/>
    </div>
  );
};

const Cgu = ({go,goBack}) => (
  <div className="scr on" style={{display:"flex"}}>
    <div className="scrhdr">
      <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
      <p className="scrttl">Conditions d'utilisation</p>
    </div>
    <div className="cgu">
      <div style={{background:C.orangeL,borderRadius:16,padding:"14px 16px",marginBottom:20,border:"1px solid rgba(249,115,22,.2)"}}>
        <p style={{fontSize:13,fontWeight:700,color:C.orange}}>ALERTE CI — Côte d'Ivoire</p>
        <p style={{fontSize:11,color:C.muted,marginTop:4}}>Dernière mise à jour : Juin 2025</p>
      </div>
      {[
        {t:"1. Objet de l'application",p:"ALERTE CI est une application mobile destinée aux résidents de Côte d'Ivoire, offrant des services de sécurité personnelle, de productivité et d'alertes publiques. L'application est disponible sur iOS et Android."},
        {t:"2. Compte unique par appareil",p:"Chaque compte ALERTE CI est strictement lié à un seul appareil à la fois. Toute tentative de connexion simultanée sur deux appareils entraînera la déconnexion automatique du premier appareil."},
        {t:"3. Forfaits et abonnements",p:"L'application propose un forfait gratuit donnant accès aux services Alerte Info et Alerte Violence, et un forfait annuel payant (10 000 FCFA/an ou 1 000 FCFA/mois) donnant accès à toutes les fonctionnalités. Le paiement s'effectue via Mobile Money, Wave CI ou carte bancaire."},
        {t:"4. Utilisation responsable",p:"L'utilisateur s'engage à utiliser l'application de manière responsable. Tout abus, fausse alerte ou utilisation malveillante pourra entraîner la suspension du compte."},
        {t:"5. Données personnelles et protection de la vie privée",p:"ALERTE CI collecte uniquement les données nécessaires au fonctionnement du service : nom, numéro de téléphone (10 chiffres CI), commune, email (facultatif) et localisation GPS — cette dernière n'étant activée que lors d'un signalement d'urgence ou d'un partage de position volontaire (Alerte Enlèvement). Ces données sont conservées de façon sécurisée et ne sont jamais vendues à des tiers ni utilisées à des fins publicitaires. Elles sont partagées uniquement avec les services publics concernés par un signalement, et avec les contacts de confiance explicitement désignés par l'utilisateur. Conformément à la réglementation ivoirienne sur la protection des données à caractère personnel, l'utilisateur dispose à tout moment d'un droit d'accès, de rectification et de suppression de ses données, exerçable depuis Mon Profil ou auprès du support ALERTE CI. Les notes vocales et signalements expirent et sont supprimés automatiquement après 24 heures, sauf nécessité légale de conservation plus longue."},
        {t:"6. Services partenaires",p:"L'application est connectée à des services publics : SODEXAM (météo), Ministère de la Construction (effondrements) et Corps des Pompiers (incendies). ALERTE CI n'est pas responsable des délais d'intervention."},
        {t:"8. Modification des CGU",p:"ALERTE CI se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront notifiés par notification push en cas de modification substantielle."},
      ].map((s,i)=>(
        <div key={i} style={{marginBottom:20}}>
          <p style={{fontSize:14,fontWeight:700,color:C.ink,marginBottom:8}}>{s.t}</p>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{s.p}</p>
        </div>
      ))}
      <button className="btn btn-p" style={{marginBottom:8}} onClick={goBack}>J'ai compris <I n="check" s={16} c="#fff"/></button>
    </div>
  </div>
);

const Faq = ({go,goBack}) => {
  const [op,setOp]=useState(null);
  const faqs=[
    {q:"Comment fonctionne l'Alerte Violence ?",a:"Vous enregistrez un signal vocal unique dans l'app. Quand l'application détecte ce signal, elle déclenche une alarme et notifie vos 3 contacts d'urgence simultanément."},
    {q:"Mes contacts doivent-ils avoir l'application ?",a:"Pour Voleur Téléphones, vos contacts autorisés doivent avoir un abonnement Premium actif. Pour l'Alerte Violence, ils reçoivent une simple notification."},
    {q:"Peut-on avoir 2 appareils connectés en même temps ?",a:"Non. ALERTE CI est limité à 1 appareil par compte. Si vous vous connectez sur un nouvel appareil, l'ancien sera automatiquement déconnecté."},
    {q:"Comment payer l'abonnement annuel ?",a:"Le paiement s'effectue directement dans l'application via Mobile Money (Orange, MTN), Wave CI, Moov Money ou carte bancaire Visa/Mastercard. Forfait annuel : 10 000 FCFA/an ou 1 000 FCFA/mois."},
    {q:"Les numéros CI sont à combien de chiffres ?",a:"Les numéros ivoiriens sont à 10 chiffres (ex: 0700000000). L'application accepte uniquement les formats valides à 10 chiffres."},
    {q:"La localisation GPS est-elle toujours active ?",a:"Non. La localisation GPS n'est activée que lors de l'envoi d'un signalement (Effondrement ou Incendie). Elle est obligatoire dans ce cas pour permettre une intervention rapide."},
    {q:"L'application fonctionne-t-elle sans connexion ?",a:"Certaines fonctionnalités nécessitent internet (alertes, météo). L'alerte violence peut fonctionner en mode dégradé via SMS si configuré."},
    {q:"Comment contacter le support ALERTE CI ?",a:"Via la rubrique 'Aide & Support' dans votre profil, par email ou via notre WhatsApp officiel disponible sur la page À propos."},
  ];
  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Questions fréquentes</p>
        </div>
        <div style={{padding:"0 20px 12px"}}>
          <div className="if"><I n="help" s={18} c={C.faint}/><input placeholder="Rechercher une question..."/></div>
        </div>
        <div className="qal">
          {faqs.map((it,i)=>(
            <div key={i} className="qai si" style={{animationDelay:`${i*30}ms`}}>
              <div className="qaq" onClick={()=>setOp(op===i?null:i)}>
                <p style={{fontSize:13,fontWeight:600,color:C.ink,flex:1,lineHeight:1.4}}>{it.q}</p>
                <span className={`qach ${op===i?"op":""}`}><I n="chevd" s={16} c={C.faint}/></span>
              </div>
              {op===i&&<p className="qaa">{it.a}</p>}
            </div>
          ))}
        </div>
        <div style={{height:24}}/>
      </div>
      <Nav a="profil" go={go}/>
    </div>
  );
};

const Profil = ({go,goBack,userInfo={},setUserInfo,plan="gratuit",setPlan,seDeconnecter}) => {
  const [edit,setEdit]=useState(false);
  const [infos,setInfos]=useState({
    nm: userInfo.nm||"",
    ph: userInfo.ph||"",
    mail: userInfo.mail||"",
    commune: userInfo.commune||""
  });
  const [draft,setDraft]=useState({...infos});
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    const i={nm:userInfo.nm||"",ph:userInfo.ph||"",mail:userInfo.mail||"",commune:userInfo.commune||""};
    setInfos(i); setDraft(i);
  },[userInfo.nm,userInfo.ph]);

  const handleSave=()=>{
    setInfos({...draft});
    setUserInfo&&setUserInfo(p=>({...p,...draft}));
    setSaved(true);
    playNotif();
    setTimeout(()=>{setSaved(false);setEdit(false);},1200);
  };

  const planActif = userInfo.plan||plan;
  const forfaitLabel = planActif==="premium"?"PREMIUM":"GRATUIT";
  const forfaitColor = planActif==="premium"?C.orange:C.green;
  const initiales = (infos.nm||"?").split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()||"??";
  const [showGestionAbonnement,setShowGestionAbonnement]=useState(false);

  return (
    <div className="scr on" style={{display:"flex",position:"relative"}}>

      {showGestionAbonnement&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",zIndex:99, display:"flex",alignItems:"flex-end"}}
          onClick={()=>setShowGestionAbonnement(false)}>
          <div style={{width:"100%",background:"#fff",borderRadius:"28px 28px 0 0", padding:"20px 24px 36px",animation:"stin 280ms var(--eo)"}}
            onClick={e=>e.stopPropagation()}>
            <div style={{width:36,height:4,borderRadius:2,background:C.surfH,margin:"0 auto 20px"}}/>
            <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:C.ink, textAlign:"center",marginBottom:6,letterSpacing:"-.3px"}}>⭐ Gérer mon Abonnement</p>
            <p style={{fontSize:12,color:C.muted,textAlign:"center",marginBottom:20}}>
              Forfait actuel : <strong style={{color:forfaitColor}}>FORFAIT {forfaitLabel}</strong>
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>

              <button onClick={()=>{setShowGestionAbonnement(false);go("paiement");}}
                style={{display:"flex",alignItems:"center",gap:12,padding:"16px",
                  borderRadius:16,border:`2px solid ${planActif==="premium"?C.orange:"rgba(0,0,0,.07)"}`,
                  background:planActif==="premium"?C.orangeL:"#fff",cursor:"pointer",
                  fontFamily:"Plus Jakarta Sans"}}>
                <span style={{fontSize:24}}>⭐</span>
                <div style={{flex:1,textAlign:"left"}}>
                  <p style={{fontSize:14,fontWeight:800,color:C.ink}}>Premium Annuel</p>
                  <p style={{fontSize:12,color:C.muted,marginTop:2}}>Planning · Alerte Enlèvement · 10 000 FCFA/an</p>
                </div>
                {planActif==="premium"&&<span style={{fontSize:10,fontWeight:800,color:C.orange,background:C.orangeL,padding:"3px 8px",borderRadius:20}}>Actif</span>}
                <I n="arrow" s={14} c={C.faint}/>
              </button>

              <button onClick={()=>{setShowGestionAbonnement(false);go("paiement");}}
                style={{display:"flex",alignItems:"center",gap:12,padding:"16px", borderRadius:16,border:"2px solid rgba(0,0,0,.07)", background:"#fff",cursor:"pointer", fontFamily:"Plus Jakarta Sans"}}>
                <span style={{fontSize:24}}>🔄</span>
                <div style={{flex:1,textAlign:"left"}}>
                  <p style={{fontSize:14,fontWeight:800,color:C.ink}}>Premium Mensuel</p>
                  <p style={{fontSize:12,color:C.muted,marginTop:2}}>Sans engagement · 1 000 FCFA/mois</p>
                </div>
                <I n="arrow" s={14} c={C.faint}/>
              </button>

              <button onClick={()=>{
                  setUserInfo&&setUserInfo(p=>({...p,plan:"gratuit"}));
                  setPlan&&setPlan("gratuit"); // bloque accès rubriques premium immédiatement
                  setShowGestionAbonnement(false);
                  playNotif();
                }}
                style={{display:"flex",alignItems:"center",gap:12,padding:"16px",
                  borderRadius:16,border:`2px solid ${planActif==="gratuit"?"rgba(22,163,74,.4)":"rgba(0,0,0,.07)"}`,
                  background:planActif==="gratuit"?C.greenL:"#fff",cursor:"pointer",
                  fontFamily:"Plus Jakarta Sans"}}>
                <span style={{fontSize:24}}>🟢</span>
                <div style={{flex:1,textAlign:"left"}}>
                  <p style={{fontSize:14,fontWeight:800,color:C.ink}}>Forfait Gratuit</p>
                  <p style={{fontSize:12,color:C.muted,marginTop:2}}>Alerte Violence + Alerte Info · 0 FCFA</p>
                </div>
                {planActif==="gratuit"&&<span style={{fontSize:10,fontWeight:800,color:C.green,background:C.greenL,padding:"3px 8px",borderRadius:20}}>Actif</span>}
              </button>
            </div>
            <button className="btn btn-g" style={{marginTop:14}}
              onClick={()=>setShowGestionAbonnement(false)}>Fermer</button>
          </div>
        </div>
      )}
      <div className="scrl">
        <div style={{padding:"24px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <p style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800,color:C.ink,letterSpacing:"-.5px"}}>Mon profil</p>
          {!edit&&(
            <button onClick={()=>{setDraft({...infos});setEdit(true);}}
              style={{fontSize:12,fontWeight:700,color:C.orange,background:C.orangeL,border:"none",borderRadius:10,padding:"7px 14px",cursor:"pointer"}}>
              ✏️ Modifier
            </button>
          )}
        </div>

        <div style={{padding:"20px 20px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:"#fff"}}>
            {initiales}
          </div>
          {!edit&&(infos.nm?<p style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,color:C.ink,letterSpacing:"-.5px"}}>{infos.nm}</p>:<p style={{fontSize:13,color:C.muted}}>Nom non renseigné</p>)}
          <span className="bg bg-or" style={{background:forfaitColor+"18",color:forfaitColor}}>FORFAIT {forfaitLabel}</span>
        </div>

        <div className="pm">
          {edit?(
            /* ── MODE ÉDITION ── */
            <>
              <p className="fst" style={{marginTop:0}}>Modifier mes informations</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div className="if">
                  <I n="user" s={18} c={C.faint}/>
                  <input value={draft.nm} onChange={e=>setDraft(d=>({...d,nm:e.target.value}))}
                    placeholder="Nom et prénom"/>
                </div>
                <div className="if">
                  <I n="phone" s={18} c={C.faint}/>
                  <input type="tel" value={draft.ph} onChange={e=>setDraft(d=>({...d,ph:e.target.value}))}
                    placeholder="Téléphone (10 chiffres)" maxLength={10}/>
                </div>
                <div className="if">
                  <I n="mail" s={18} c={C.faint}/>
                  <input type="email" value={draft.mail} onChange={e=>setDraft(d=>({...d,mail:e.target.value}))}
                    placeholder="Email (facultatif)"/>
                  <span style={{fontSize:9,fontWeight:700,color:C.faint,background:C.surf,padding:"2px 6px",borderRadius:8,flexShrink:0}}>Optionnel</span>
                </div>
                <div className="if">
                  <I n="pin" s={18} c={C.faint}/>
                  <select value={draft.commune} onChange={e=>setDraft(d=>({...d,commune:e.target.value}))}
                    style={{flex:1,border:"none",outline:"none",background:"transparent",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:500,color:C.ink,appearance:"none"}}>
                    {VILLES_CI.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:10,marginTop:4}}>
                <button className="btn btn-g" style={{flex:1}} onClick={()=>setEdit(false)}>Annuler</button>
                <button className="btn btn-p" style={{flex:1,opacity:saved?1:1}} onClick={handleSave}>
                  {saved?<><I n="check" s={16} c="#fff"/>Enregistré !</>:<><I n="check" s={16} c="#fff"/>Sauvegarder</>}
                </button>
              </div>
            </>
          ):(
            /* ── MODE LECTURE ── */
            <>
              <p className="fst" style={{marginTop:0}}>Informations personnelles</p>
              {[
                {ic:"user",  label:"Nom complet",    val:infos.nm,      fallback:"Non renseigné"},
                {ic:"phone", label:"Téléphone",       val:infos.ph,      fallback:"Non renseigné"},
                {ic:"mail",  label:"Email",            val:infos.mail,    fallback:"Non renseigné"},
                {ic:"pin",   label:"Commune",          val:infos.commune, fallback:"Non renseignée"},
              ].map((it,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:it.val?C.orangeL:C.surf,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <I n={it.ic} s={17} c={it.val?C.orange:C.faint}/>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:11,fontWeight:700,color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:2}}>{it.label}</p>
                    <p style={{fontSize:14,fontWeight:it.val?600:400,color:it.val?C.ink:C.faint}}>{it.val||it.fallback}</p>
                  </div>
                  {it.val&&<span style={{fontSize:12,color:C.green}}>✓</span>}
                </div>
              ))}
              <div style={{height:8}}/>
              {[
                {ic:"settings",lb:"Paramètres",sc:"parametres"},
                {ic:"help",lb:"FAQ — Questions fréquentes",sc:"faq"},
                {ic:"file",lb:"Conditions d'utilisation",sc:"cgu"},
                {ic:"shield2",lb:"Politique de confidentialité",sc:"cgu"},
              ].map((it,i)=>(
                <button key={i} className="pmi" onClick={()=>it.sc&&go(it.sc)}>
                  <div style={{width:34,height:34,borderRadius:10,background:C.surf,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <I n={it.ic} s={17} c={C.muted}/>
                  </div>
                  <span style={{fontSize:14,fontWeight:600,color:C.ink,flex:1,textAlign:"left"}}>{it.lb}</span>
                  <I n="arrow" s={14} c={C.faint}/>
                </button>
              ))}
              <div style={{height:4}}/>

              <button className="btn btn-p"
                style={{background:planActif==="premium"?"linear-gradient(135deg,#7C3AED,#8B5CF6)":undefined}}
                onClick={()=>setShowGestionAbonnement(true)}>
                ⭐ Gérer mon Abonnement
              </button>
              <button className="btn btn-g" onClick={()=>{seDeconnecter?seDeconnecter():go("splash");}}>Se déconnecter</button>
            </>
          )}
        </div>
        <div style={{height:24}}/>
      </div>
      <Nav a="profil" go={go}/>
    </div>
  );
};

const Parametres = ({go,goBack}) => {
  const [notifSon,setNotifSon]=useState(true);
  const [notifPush,setNotifPush]=useState(true);
  const [darkMode,setDarkMode]=useState(false);
  const [langue,setLangue]=useState("fr");
  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Paramètres</p>
        </div>
        <div className="pm">
          <p className="fst" style={{marginTop:0}}>Notifications</p>
          {[
            {lb:"Son de notification",sub:"Jouer un son à chaque alerte",val:notifSon,set:setNotifSon},
            {lb:"Notifications push",sub:"Recevoir les alertes en arrière-plan",val:notifPush,set:setNotifPush},
          ].map((it,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px"}}>
              <div>
                <p style={{fontSize:14,fontWeight:600,color:C.ink}}>{it.lb}</p>
                <p style={{fontSize:11,color:C.muted,marginTop:2}}>{it.sub}</p>
              </div>
              <button className={`tsw ${it.val?"on":"off"}`} onClick={()=>{it.set(p=>!p);playNotif();}}>
                <div className={`tth ${it.val?"on":"off"}`}/>
              </button>
            </div>
          ))}
          <p className="fst">Affichage</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px"}}>
            <div>
              <p style={{fontSize:14,fontWeight:600,color:C.ink}}>Mode sombre</p>
              <p style={{fontSize:11,color:C.muted,marginTop:2}}>Thème foncé pour l'interface</p>
            </div>
            <button className={`tsw ${darkMode?"on":"off"}`} onClick={()=>setDarkMode(p=>!p)}>
              <div className={`tth ${darkMode?"on":"off"}`}/>
            </button>
          </div>
          <p className="fst">Langue</p>
          <div style={{display:"flex",gap:8}}>
            {[{id:"fr",lb:"Français"},{id:"dj",lb:"Dioula"},{id:"en",lb:"English"}].map(l=>(
              <button key={l.id} onClick={()=>setLangue(l.id)}
                style={{flex:1,padding:"12px 6px",borderRadius:12,border:`2px solid ${langue===l.id?C.orange:C.border}`,background:langue===l.id?C.orangeL:"#fff",cursor:"pointer",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,color:langue===l.id?C.orange:C.muted}}>
                {l.lb}
              </button>
            ))}
          </div>
          <p className="fst">Compte</p>
          <button className="pmi" onClick={()=>go("profil")}>
            <div style={{width:34,height:34,borderRadius:10,background:C.surf,display:"flex",alignItems:"center",justifyContent:"center"}}><I n="user" s={17} c={C.muted}/></div>
            <span style={{fontSize:14,fontWeight:600,color:C.ink,flex:1,textAlign:"left"}}>Modifier mes informations</span>
            <I n="arrow" s={14} c={C.faint}/>
          </button>
          <button className="pmi" onClick={()=>go("cgu")}>
            <div style={{width:34,height:34,borderRadius:10,background:C.surf,display:"flex",alignItems:"center",justifyContent:"center"}}><I n="file" s={17} c={C.muted}/></div>
            <span style={{fontSize:14,fontWeight:600,color:C.ink,flex:1,textAlign:"left"}}>Conditions d'utilisation</span>
            <I n="arrow" s={14} c={C.faint}/>
          </button>
          <div style={{height:4}}/>
          <button className="btn btn-g" onClick={()=>go("splash")} style={{color:"#DC2626"}}>Supprimer mon compte</button>
          <div style={{height:20}}/>
        </div>
      </div>
      <Nav a="profil" go={go}/>
    </div>
  );
};

/* ── STORE PARTAGÉ DES ALERTES SERVICES PUBLICS ──────────────────────────────
   Toute alerte diffusée par un Service Public (HomeService) est ajoutée ici.
   Elle apparaît alors automatiquement dans :
     - l'écran Alerte Info (Info)
     - la section "Alertes & Informations" de l'Accueil (AlertesInfoFeed)
   Chaque alerte possède un timestamp (ts) et disparaît automatiquement
   24h après sa création (filtrage par expiration, pas de suppression manuelle). ── */
const DUREE_VIE_ALERTE_MS = 24*60*60*1000; // 24 heures

const alerteEstValide = (a) => (Date.now() - a.ts) < DUREE_VIE_ALERTE_MS;

/* Alertes officielles de démonstration, déjà en place au démarrage de l'app.
   Elles utilisent aussi un timestamp réel et disparaîtront après 24h comme les autres. */
const formatHeureRelative = (ts) => {
  const diffMs = Date.now()-ts;
  const min = Math.floor(diffMs/60000);
  if(min<1) return "À l'instant";
  if(min<60) return `Il y a ${min} min`;
  const h = Math.floor(min/60);
  if(h<24) return `Il y a ${h}h`;
  return "Hier";
};

/* ══════════════════════════════════════════════════════════════════════════════
   TABLEAU DE BORD ADMINISTRATEUR
   Permet de valider ou refuser chaque compte institutionnel créé, et de
   gérer la liste des types de service proposés à l'inscription. Une fois
   un compte validé ici, son statut passe à "valide" : la diffusion
   d'informations devient possible côté Service Public, et ses publications
   apparaissent automatiquement chez les citoyens dans Alerte Info.
══════════════════════════════════════════════════════════════════════════════ */
/* ── Appel de l'Edge Function admin-api ────────────────────────────────────
   Chaque appel envoie numéro + code d'accès admin ; la fonction (côté
   serveur, seule détentrice de la clé service_role Supabase) revérifie ces
   identifiants à CHAQUE requête avant d'exécuter l'action. Rien de sensible
   ne transite ni ne reste dans le navigateur. ── */
async function adminApi(session, action, payload){
  try{
    const r = await fetch(ADMIN_API_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SB_KEY},
      body:JSON.stringify({telephone:session.ph, code:session.code, action, payload}),
    });
    const d = await r.json().catch(()=>({}));
    if(!r.ok) return { error: d.error || `Erreur (${r.status})` };
    return d;
  }catch(e){ return { error:"Réseau indisponible." }; }
}

/* ── Portail d'accès administrateur ────────────────────────────────────────
   Auparavant, l'écran Administration s'ouvrait sans aucune vérification :
   n'importe qui découvrant le bouton caché y accédait directement. Ce
   portail impose désormais le numéro + code à 6 chiffres de la table
   `admins`, vérifié côté serveur (voir supabase-edge-function/admin-api). ── */
const AdminGate = ({onAuth}) => {
  const [ph,setPh]=useState("");
  const [code,setCode]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const valider=async()=>{
    if(ph.length<10||code.length<6){setErr("Numéro et code administrateur requis.");return;}
    setLoading(true); setErr("");
    const res = await adminApi({ph,code}, "login", {});
    setLoading(false);
    if(res.error){ setErr(res.error==="CODE_INVALIDE"?"Numéro ou code incorrect.":res.error); return; }
    onAuth({ph,code});
  };

  return (
    <div className="scr on" style={{display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(160deg,#1C1917,#292524)",padding:"36px 28px 28px",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{width:52,height:52,borderRadius:16,background:"rgba(249,115,22,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <I n="lock" s={26} c={C.orange}/>
        </div>
        <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:"#fff"}}>Administration ALERTE CI</p>
        <p style={{fontSize:12,color:"rgba(255,255,255,.5)",textAlign:"center"}}>Accès réservé — numéro et code administrateur</p>
      </div>
      <div className="isc" style={{flex:1,paddingTop:20,display:"flex",flexDirection:"column",gap:10}}>
        <div className="if" style={{border:`1.5px solid ${ph.length===10?"rgba(22,163,74,.4)":C.border}`}}>
          <I n="phone" s={18} c={C.faint}/>
          <input type="tel" value={ph} onChange={e=>{setPh(saneTel(e.target.value));setErr("");}} placeholder="Numéro administrateur (10 chiffres)" maxLength={10}/>
        </div>
        <div className="if" style={{border:`1.5px solid ${code.length===6?"rgba(22,163,74,.4)":C.border}`}}>
          <I n="lock" s={18} c={C.faint}/>
          <input type="password" inputMode="numeric" value={code} onChange={e=>{setCode(saneCode(e.target.value));setErr("");}} placeholder="Code administrateur (6 chiffres)" maxLength={6}/>
        </div>
        {err&&<p style={{fontSize:12,color:"#DC2626",fontWeight:600,paddingLeft:4}}>{err}</p>}
        <button className="btn btn-p" style={{opacity:ph.length===10&&code.length===6&&!loading?1:.5}} disabled={ph.length<10||code.length<6||loading} onClick={valider}>
          {loading?"Vérification...":"Entrer"} <I n="arrow" s={16} c="#fff"/>
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = ({go,goBack,comptesInscrits=[],validerCompteInstitution,typesServiceDisponibles=[],ajouterTypeService,retirerTypeService}) => {
  const [adminSession,setAdminSession]=useState(null);
  const [tab,setTab]=useState("comptes"); // "comptes" | "utilisateurs" | "forfaits" | "types"
  const [nouveauType,setNouveauType]=useState("");
  const [utilisateurs,setUtilisateurs]=useState([]);
  const [forfaits,setForfaits]=useState([]);
  const [bonusTel,setBonusTel]=useState("");
  const [bonusJours,setBonusJours]=useState("30");
  const [bonusMotif,setBonusMotif]=useState("");
  const [adminMsg,setAdminMsg]=useState("");

  const chargerUtilisateurs=async()=>{
    const res = await adminApi(adminSession, "list_users", {});
    if(!res.error) setUtilisateurs(res.utilisateurs||[]);
  };
  const chargerForfaits=async()=>{
    const res = await adminApi(adminSession, "list_forfaits", {});
    if(!res.error) setForfaits(res.forfaits||[]);
  };
  useEffect(()=>{
    if(!adminSession) return;
    if(tab==="utilisateurs") chargerUtilisateurs();
    if(tab==="forfaits") chargerForfaits();
  },[adminSession, tab]);

  const basculerBlocage=async(telephone,bloque)=>{
    const res = await adminApi(adminSession, "toggle_block", {telephone, bloque:!bloque});
    if(!res.error) chargerUtilisateurs();
  };
  const majPrixForfait=async(slug,prix)=>{
    const res = await adminApi(adminSession, "update_forfait", {slug, prix:Number(prix)});
    if(!res.error){ setAdminMsg("Forfait mis à jour ✓"); chargerForfaits(); }
  };
  const offrirBonus=async()=>{
    setAdminMsg("");
    if(bonusTel.length!==10||!bonusJours){ setAdminMsg("Numéro (10 chiffres) et durée requis."); return; }
    const res = await adminApi(adminSession, "grant_bonus", {telephone:bonusTel, jours:Number(bonusJours), motif:saneTxt(bonusMotif,140)});
    if(res.error){ setAdminMsg(res.error); return; }
    setAdminMsg(`Bonus de ${bonusJours} jours offert au ${bonusTel} ✓`);
    setBonusTel(""); setBonusMotif("");
  };

  if(!adminSession) return <AdminGate onAuth={setAdminSession}/>;

  const institutions = comptesInscrits.filter(c=>c.plan==="institution");
  const enAttente = institutions.filter(c=>c.statut==="en_attente");
  const traites = institutions.filter(c=>c.statut!=="en_attente");

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Administration</p>
        </div>

        <div style={{padding:"16px 20px 0",display:"flex",gap:8,overflowX:"auto"}}>
          {[{id:"comptes",lb:`Institutions (${enAttente.length})`},{id:"utilisateurs",lb:"Utilisateurs"},{id:"forfaits",lb:"Forfaits & bonus"},{id:"types",lb:"Types de service"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"10px 14px",borderRadius:12,border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans",fontSize:12,fontWeight:700,whiteSpace:"nowrap",background:tab===t.id?C.ink:"#fff",color:tab===t.id?"#fff":C.muted,boxShadow:tab===t.id?"0 4px 14px rgba(0,0,0,.15)":"none",border:tab===t.id?"none":`1px solid ${C.border}`}}>
              {t.lb}
            </button>
          ))}
        </div>

        {tab==="comptes"&&(
          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
            {institutions.length===0&&(
              <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:"28px 20px",textAlign:"center"}}>
                <p style={{fontSize:28,marginBottom:8}}>🏛️</p>
                <p style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>Aucun compte institutionnel</p>
                <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Les inscriptions de services publics apparaîtront ici automatiquement.</p>
              </div>
            )}

            {enAttente.length>0&&(
              <p style={{fontSize:11,fontWeight:700,color:C.orange,textTransform:"uppercase",letterSpacing:".5px",marginTop:4}}>À examiner</p>
            )}
            {enAttente.map(c=>(
              <div key={c.id} className="si" style={{background:"#fff",border:"1.5px solid rgba(249,115,22,.3)",borderRadius:18,padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:38,height:38,borderRadius:12,background:C.orangeL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <I n="building" s={18} c={C.orange}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:14,fontWeight:800,color:C.ink}}>{c.nm}</p>
                    <p style={{fontSize:11,color:C.muted}}>{c.typeService} · {c.commune}</p>
                  </div>
                  <span style={{fontSize:9,fontWeight:800,color:C.orange,background:C.orangeL,padding:"3px 8px",borderRadius:20,flexShrink:0}}>EN EXAMEN</span>
                </div>
                <div style={{background:C.surf,borderRadius:12,padding:"10px 12px",marginBottom:10,display:"flex",flexDirection:"column",gap:4}}>
                  <p style={{fontSize:11,color:C.muted}}><strong style={{color:C.ink}}>Responsable :</strong> {c.responsable||"—"}</p>
                  <p style={{fontSize:11,color:C.muted}}><strong style={{color:C.ink}}>Téléphone :</strong> {c.ph}</p>
                  {c.mail&&<p style={{fontSize:11,color:C.muted}}><strong style={{color:C.ink}}>Email :</strong> {c.mail}</p>}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>validerCompteInstitution&&validerCompteInstitution(c.id,"valide")}
                    style={{flex:1,padding:"9px",background:C.green,border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,color:"#fff",fontFamily:"Plus Jakarta Sans",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <I n="check" s={14} c="#fff"/>Valider
                  </button>
                  <button onClick={()=>validerCompteInstitution&&validerCompteInstitution(c.id,"refuse")}
                    style={{flex:1,padding:"9px",background:"#FFF1F2",border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,color:"#DC2626",fontFamily:"Plus Jakarta Sans"}}>
                    Refuser
                  </button>
                </div>
              </div>
            ))}

            {traites.length>0&&(
              <p style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".5px",marginTop:8}}>Déjà traités</p>
            )}
            {traites.map(c=>{
              const s = STATUTS_INSTITUTION[c.statut] || STATUTS_INSTITUTION.valide;
              return (
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px"}}>
                  <div style={{width:32,height:32,borderRadius:10,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <I n="building" s={16} c={s.txt}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.ink}}>{c.nm}</p>
                    <p style={{fontSize:10,color:C.muted}}>{c.typeService}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:9,fontWeight:800,color:s.txt,background:s.bg,padding:"3px 8px",borderRadius:20}}>{s.badge}</span>
                    {c.statut==="refuse"&&(
                      <button onClick={()=>validerCompteInstitution&&validerCompteInstitution(c.id,"valide")}
                        style={{fontSize:10,fontWeight:700,color:C.green,background:C.greenL,border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontFamily:"Plus Jakarta Sans"}}>
                        Revalider
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="utilisateurs"&&(
          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
            <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Comptes utilisateurs enregistrés sur le serveur national. Bloquer un compte empêche immédiatement toute connexion, y compris depuis un appareil déjà connecté.</p>
            {utilisateurs.length===0&&(
              <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:"28px 20px",textAlign:"center"}}>
                <p style={{fontSize:28,marginBottom:8}}>👥</p>
                <p style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>Aucun utilisateur chargé</p>
                <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Les comptes créés depuis n'importe quel téléphone apparaîtront ici.</p>
              </div>
            )}
            {utilisateurs.map(u=>{
              const enEss = essaiEnCours(u.essaiFin?{essaiFin:u.essaiFin}:{});
              const abo = abonnementActif(u.premiumExpire?{premiumExpire:u.premiumExpire}:{});
              return (
                <div key={u.telephone} style={{background:"#fff",border:`1px solid ${u.bloque?"rgba(220,38,38,.35)":C.border}`,borderRadius:16,padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:10,background:u.bloque?"#FFF1F2":C.orangeL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <I n="user" s={16} c={u.bloque?"#DC2626":C.orange}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:800,color:C.ink}}>{u.nom||"—"}</p>
                      <p style={{fontSize:11,color:C.muted}}>{u.telephone}</p>
                    </div>
                    <span style={{fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:20,background:u.bloque?"#FFF1F2":abo?"#F0FDF4":enEss?C.orangeL:"#F5F5F4",color:u.bloque?"#DC2626":abo?C.green:enEss?C.orange:C.muted}}>
                      {u.bloque?"BLOQUÉ":abo?"PREMIUM":enEss?"ESSAI AKWABA":"EXPIRÉ"}
                    </span>
                  </div>
                  <button onClick={()=>basculerBlocage(u.telephone,u.bloque)}
                    style={{width:"100%",padding:"9px",background:u.bloque?C.green:"#FFF1F2",border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,color:u.bloque?"#fff":"#DC2626",fontFamily:"Plus Jakarta Sans"}}>
                    {u.bloque?"Débloquer ce compte":"Bloquer ce compte"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab==="forfaits"&&(
          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
            <p className="fst" style={{margin:"0 0 4px"}}>Forfaits</p>
            {forfaits.map(f=>(
              <div key={f.slug} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px"}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:700,color:C.ink}}>{f.nom}</p>
                  <p style={{fontSize:10,color:C.muted}}>{f.duree_jours?`${f.duree_jours} jours`:"Sans durée"}</p>
                </div>
                <input type="number" defaultValue={f.prix} onBlur={e=>majPrixForfait(f.slug,e.target.value)}
                  style={{width:90,padding:"8px 10px",borderRadius:10,border:`1.5px solid ${C.border}`,textAlign:"right",fontFamily:"Plus Jakarta Sans",fontWeight:700,fontSize:13,color:C.ink}}/>
                <span style={{fontSize:11,color:C.muted}}>FCFA</span>
              </div>
            ))}
            {forfaits.length===0&&<p style={{fontSize:12,color:C.faint,textAlign:"center",padding:"12px 0"}}>Chargement des forfaits...</p>}

            <p className="fst">Offrir un bonus premium</p>
            <div className="ig">
              <div className="if"><I n="phone" s={16} c={C.faint}/>
                <input type="tel" value={bonusTel} onChange={e=>setBonusTel(saneTel(e.target.value))} placeholder="Numéro (10 chiffres)" maxLength={10}/>
              </div>
              <div className="if"><I n="calendar" s={16} c={C.faint}/>
                <input type="number" value={bonusJours} onChange={e=>setBonusJours(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="Durée du bonus (jours)"/>
              </div>
              <div className="if"><I n="star" s={16} c={C.faint}/>
                <input type="text" value={bonusMotif} onChange={e=>setBonusMotif(e.target.value)} placeholder="Motif (optionnel)"/>
              </div>
            </div>
            <button onClick={offrirBonus} style={{padding:"12px",borderRadius:12,border:"none",cursor:"pointer",background:C.green,color:"#fff",fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700}}>
              Offrir le bonus
            </button>
            {adminMsg&&<p style={{fontSize:12,color:C.muted,textAlign:"center"}}>{adminMsg}</p>}
          </div>
        )}

        {tab==="types"&&(
          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
            <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Ces types de service apparaissent dans la liste déroulante de l'inscription institutionnelle.</p>
            <div style={{display:"flex",gap:8}}>
              <div className="if" style={{flex:1,marginBottom:0}}>
                <I n="plus" s={16} c={C.faint}/>
                <input value={nouveauType} onChange={e=>setNouveauType(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"){ajouterTypeService&&ajouterTypeService(nouveauType);setNouveauType("");}}}
                  placeholder="Nouveau type de service..."/>
              </div>
              <button onClick={()=>{ajouterTypeService&&ajouterTypeService(nouveauType);setNouveauType("");}}
                style={{padding:"0 16px",borderRadius:12,border:"none",cursor:"pointer",background:C.ink,color:"#fff",fontFamily:"Plus Jakarta Sans",fontSize:13,fontWeight:700,flexShrink:0}}>
                Ajouter
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
              {typesServiceDisponibles.map((t,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px"}}>
                  <I n="star" s={16} c={C.muted}/>
                  <span style={{flex:1,fontSize:13,fontWeight:600,color:C.ink}}>{t}</span>
                  <button onClick={()=>retirerTypeService&&retirerTypeService(t)}
                    style={{width:28,height:28,borderRadius:8,border:"none",cursor:"pointer",background:"#FFF1F2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    🗑️
                  </button>
                </div>
              ))}
              {typesServiceDisponibles.length===0&&(
                <p style={{fontSize:12,color:C.faint,textAlign:"center",padding:"20px 0"}}>Aucun type de service disponible. Ajoutez-en au moins un.</p>
              )}
            </div>
          </div>
        )}
        <div style={{height:24}}/>
      </div>
    </div>
  );
};

export default function AlerteCI() {
  const [history,setHistory]=useState(["splash"]);
  const screen=history[history.length-1];

  /* ── Session active persistante ───────────────────────────────────────
     userInfo et plan décrivent le compte actuellement connecté. Sans
     persistance, fermer l'application (même sans se déconnecter) revenait
     toujours à l'écran d'accueil sans session, obligeant à retaper le code
     d'accès — désormais la session survit au redémarrage, exactement comme
     le registre des comptes. La déconnexion explicite (Se déconnecter)
     reste le seul moyen d'effacer cette session active. ── */
  const [plan,setPlan]=useState(()=>{
    try{ return window.localStorage.getItem("alerteci_session_plan") || "gratuit"; }
    catch(e){ return "gratuit"; }
  });
  const [userInfo,setUserInfo]=useState(()=>{
    try{
      const sauvegarde = window.localStorage.getItem("alerteci_session_user");
      return sauvegarde ? JSON.parse(sauvegarde) : {nm:"",ph:"",mail:"",commune:"",plan:"gratuit"};
    }catch(e){ return {nm:"",ph:"",mail:"",commune:"",plan:"gratuit"}; }
  });
  useEffect(()=>{
    try{ window.localStorage.setItem("alerteci_session_plan", plan); }catch(e){}
  },[plan]);
  useEffect(()=>{
    try{ window.localStorage.setItem("alerteci_session_user", JSON.stringify(userInfo)); }catch(e){}
  },[userInfo]);
  /* Enregistrement push (ne fait rien si la coque n'a pas le plugin). */
  useEffect(()=>{
    if(!userInfo.ph) return;
    /* 5 s après la connexion : laisse la navigation et les éventuelles
       autres popups système se terminer avant de demander le push. */
    const t=setTimeout(()=>initialiserPush(userInfo.ph), 5000);
    return ()=>clearTimeout(t);
  },[userInfo.ph]);

  /* Rubriques masquées pour cette version (voir FEATURES) : toute tentative
     de navigation vers l'un de ces écrans est silencieusement redirigée vers
     l'Accueil, au cas où un lien interne oublié y pointerait encore. */
  const ecransMasques = new Set([
    ...(FEATURES.planning?[]:["planning"]),
    ...(FEATURES.alerteInfo?[]:["info"]),
    ...(FEATURES.servicesPublics?[]:SERVICES_PUBLICS_CONFIG.map(s=>s.sc)),
  ]);
  const go=(s)=>{
    const cible = ecransMasques.has(s) ? "home" : s;
    const roots=["splash","home","home_service"];
    if(roots.includes(cible)){setHistory([cible]);}
    else{setHistory(p=>[...p,cible]);}
  };
  const goBack=()=>{
    setHistory(p=>{if(p.length<=1)return p;return p.slice(0,-1);});
  };


  /* ── Alertes publiques partagées (Service Public → Alerte Info + Accueil) ──
     Persistant : comme les comptes survivent désormais à la fermeture de
     l'app, les diffusions doivent aussi survivre (elles expirent de toute
     façon automatiquement après 24h via la purge ci-dessous). ── */
  const [alertesPubliques,setAlertesPubliques]=useState(()=>{
    try{
      const sauvegarde = window.localStorage.getItem("alerteci_alertes");
      return sauvegarde ? JSON.parse(sauvegarde).filter(alerteEstValide) : [];
    }catch(e){ return []; }
  });
  useEffect(()=>{
    try{ window.localStorage.setItem("alerteci_alertes", JSON.stringify(alertesPubliques)); }catch(e){}
  },[alertesPubliques]);

  // Purge automatique des alertes ayant dépassé 24h, vérifiée chaque minute
  useEffect(()=>{
    const purge=()=>setAlertesPubliques(prev=>prev.filter(alerteEstValide));
    purge();
    const it=setInterval(purge,60000);
    return ()=>clearInterval(it);
  },[]);

  /* ── SYNCHRONISATION NATIONALE (toutes les 30 secondes) ─────────────────
     · Diffusions publiées depuis n'importe quel appareil du pays
     · Types de service pilotés par le tableau de bord administrateur
     · Statut du compte institutionnel connecté (validation dashboard)
     Le tout en best-effort : hors connexion, l'app reste 100% locale. ── */
  /* ── Urgences reçues : alerte Violence ou suivi GPS qui CIBLE mon numéro.
     Le téléphone du contact sonne et affiche l'écran d'urgence plein écran ;
     celui de la personne en danger, lui, ne signale jamais rien. ── */
  /* ── RAPPELS DE TÂCHES — moteur GLOBAL, actif partout dans l'app.
     Le déclencheur vit ici, au niveau racine : peu importe l'écran affiché,
     l'alarme sonne à l'heure de chaque tâche (rattrapage jusqu'à 3 min si
     l'appareil était occupé). En parallèle, chaque tâche est AUSSI
     programmée en notification système Android (via le module natif) :
     elle sonnera à l'heure exacte même app en arrière-plan ou écran
     verrouillé. ── */
  const [rappelTache,setRappelTache]=useState(null); // {txt} → overlay + alarme 45 s
  const rappelsSonnesRef=useRef(null);
  useEffect(()=>{
    /* Charger la mémoire des rappels déjà sonnés (persistée, par jour). */
    try{
      const s=window.localStorage.getItem("alerteci_rappels_sonnes");
      rappelsSonnesRef.current=new Set(s?JSON.parse(s):[]);
    }catch(e){ rappelsSonnesRef.current=new Set(); }

    const cleJour=()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
    const lireTaches=()=>{
      try{
        const s=window.localStorage.getItem("alerteci_journal_taches");
        if(!s) return [];
        const j=JSON.parse(s);
        let taches=(j&&j[cleJour()])||[];
        /* Juste après minuit : les tâches « à 00H » saisies la veille sont
           rangées dans le journal de la veille — on les inclut aussi. */
        const now=new Date();
        if(now.getHours()===0 && now.getMinutes()<=5){
          const hier=new Date(now.getTime()-86400000);
          const cleHier=`${hier.getFullYear()}-${String(hier.getMonth()+1).padStart(2,"0")}-${String(hier.getDate()).padStart(2,"0")}`;
          const tHier=((j&&j[cleHier])||[]).filter(t=>t&&/^00:0[0-5]$/.test(t.tm||""));
          taches=[...taches,...tHier];
        }
        return taches;
      }catch(e){ return []; }
    };
    const marquerSonne=(cle)=>{
      rappelsSonnesRef.current.add(cle);
      try{ window.localStorage.setItem("alerteci_rappels_sonnes", JSON.stringify([...rappelsSonnesRef.current].slice(-200))); }catch(e){}
    };

    const verifier=()=>{
      const now=new Date();
      const minutesNow=now.getHours()*60+now.getMinutes();
      const jour=cleJour();
      lireTaches().forEach(t=>{
        if(!t||!t.tm||t.dn) return;
        const m=/^(\d{1,2}):(\d{2})$/.exec(t.tm);
        if(!m) return;
        const minutesTache=parseInt(m[1],10)*60+parseInt(m[2],10);
        const ecart=minutesNow-minutesTache;
        const cle=jour+"|"+t.tm+"|"+t.txt;
        /* Sonne à l'heure pile, avec rattrapage si l'app était occupée (≤3 min). */
        if(ecart>=0 && ecart<=3 && !rappelsSonnesRef.current.has(cle)){
          marquerSonne(cle);
          setRappelTache({txt:t.txt});
          demarrerRappelTache(t.txt, ()=>setRappelTache(null), t.audio||null);
        }
      });
    };
    verifier();
    const id=setInterval(verifier,10000);

    /* ── Notifications système natives : programmer chaque tâche à venir.
       Elles sonnent à l'heure exacte, même app fermée en arrière-plan ou
       écran verrouillé — c'est Android qui les déclenche, pas l'app. ── */
    let permLN=null; // demandée UNE seule fois par session, en file
    const programmerNatives=async()=>{
      try{
        const LN=window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.LocalNotifications;
        if(!LN) return;
        if(permLN===null){
          permLN=await enchainerNatif(()=>LN.requestPermissions()).catch(()=>null);
          if(permLN&&permLN.display==="granted"){
            await enchainerNatif(()=>LN.createChannel({id:"rappels_taches",name:"Rappels de tâches",description:"Alarmes de rappel du planning",importance:5,visibility:1,vibration:true})).catch(()=>{});
          }
        }
        if(!permLN||permLN.display!=="granted") return;
        /* Annuler les programmations précédentes pour repartir proprement. */
        let anciens=[];
        try{ anciens=JSON.parse(window.localStorage.getItem("alerteci_notifs_programmees")||"[]"); }catch(e){}
        if(anciens.length){
          try{ await LN.cancel({notifications:anciens.map(id=>({id}))}); }catch(e){}
        }
        const now=new Date();
        const aVenir=lireTaches().filter(t=>{
          if(!t||!t.tm||t.dn) return false;
          return /^(\d{1,2}):(\d{2})$/.test(t.tm);
        });
        if(!aVenir.length){ try{ window.localStorage.setItem("alerteci_notifs_programmees","[]"); }catch(e){} return; }
        const notifs=aVenir.map(t=>{
          const m=/^(\d{1,2}):(\d{2})$/.exec(t.tm);
          const d=new Date(); d.setHours(parseInt(m[1],10),parseInt(m[2],10),0,0);
          /* Heure déjà passée aujourd'hui (ex: tâche à 00H saisie l'après-midi)
             → l'alarme est programmée pour la prochaine occurrence (demain). */
          if(d.getTime()<=now.getTime()+15000) d.setDate(d.getDate()+1);
          let h=0; const sTxt=t.tm+"|"+t.txt;
          for(let i=0;i<sTxt.length;i++){ h=((h*31)+sTxt.charCodeAt(i))|0; }
          return {
            id:Math.abs(h)%2000000000,
            title:"⏰ Rappel de tâche",
            body:t.txt,
            schedule:{at:d, allowWhileIdle:true},
            channelId:"rappels_taches",
          };
        });
        await LN.schedule({notifications:notifs});
        try{ window.localStorage.setItem("alerteci_notifs_programmees", JSON.stringify(notifs.map(n=>n.id))); }catch(e){}
      }catch(e){}
    };
    const tNat=setTimeout(programmerNatives, 8000);
    const idNat=setInterval(programmerNatives, 60000);

    return ()=>{ clearInterval(id); clearInterval(idNat); clearTimeout(tNat); };
  },[]);

  const [urgenceRecue,setUrgenceRecue]=useState(null);
  const urgencesSonneesRef=useRef(new Set());
  const arreteesLocalementRef=useRef(new Set()); // sirènes que CE contact a coupées
  const fermesDefRef=useRef(new Set());          // écrans d'alerte fermés définitivement ici
  const [histoPositions,setHistoPositions]=useState([]); // historique GPS reçu chez le contact

  useEffect(()=>{
    let actif=true;
    const synchroniser=async()=>{
      const distantes = await cloudChargerDiffusions();
      if(actif && distantes.length){
        setAlertesPubliques(prev=>{
          const dejaLa = new Set(prev.map(a=>a.id));
          const nouvelles = distantes.filter(a=>!a.urgence && !dejaLa.has(a.id) && alerteEstValide(a));
          if(!nouvelles.length) return prev;
          return [...nouvelles, ...prev].sort((a,b)=>b.ts-a.ts);
        });
      }
      /* Urgences qui me sont adressées (mon numéro dans la liste des cibles) */
      if(userInfo.ph){
        const urgences = await cloudChargerUrgences(userInfo.ph);
        if(actif && urgences.length){
          const parAlerte = {};
          urgences.forEach(u=>{
            if(!u.alerteId) return;
            const connu = parAlerte[u.alerteId];
            if(!connu || (u.ts||0)>(connu.ts||0)) parAlerte[u.alerteId]=u;
          });
          Object.values(parAlerte).forEach(u=>{
            if(u.fin){
              /* La personne en danger a levé l'alerte : on coupe partout. */
              urgencesSonneesRef.current.add(u.alerteId);
              arreteesLocalementRef.current.add(u.alerteId);
              arreterSireneUrgence();
              setUrgenceRecue(prev=>prev&&prev.alerteId===u.alerteId?null:prev);
              return;
            }
            /* Ne pas sonner pour ma propre alerte (je suis l'émetteur). */
            if(normaliserPh(u.victime&&u.victime.ph)===normaliserPh(userInfo.ph)) return;
            /* Ce contact a fermé définitivement cet écran d'alerte : ne plus rien afficher. */
            if(fermesDefRef.current.has(u.alerteId)) return;
            const dejaSonnee = urgencesSonneesRef.current.has(u.alerteId);
            const sireneCoupee = arreteesLocalementRef.current.has(u.alerteId);
            if(!dejaSonnee){
              urgencesSonneesRef.current.add(u.alerteId);
              if(u.gps) setHistoPositions([{lat:u.gps.lat,lng:u.gps.lng,ts:u.ts||Date.now()}]);
              setUrgenceRecue(u);
              /* La sirène sonne en continu — sauf si CE contact l'a déjà
                 coupée pour cette alerte (les autres contacts continuent). */
              if(!sireneCoupee){
                const nomVictime=(u.victime&&u.victime.nm)||"Un proche";
                jouerSireneUrgence(u.type==="gps"
                  ? `${nomVictime} partage sa position avec vous. Suivez son déplacement dans l'application.`
                  : `Alerte ! ${nomVictime} est en danger ! ${nomVictime} est en danger !`);
              }
            } else {
              /* Mise à jour EN DIRECT : les nouvelles positions continuent de
                 s'afficher chez le contact, même si sa sirène est coupée.
                 Chaque position enrichit l'historique du trajet. */
              if(u.gps) setHistoPositions(prev=>{
                const der=prev[prev.length-1];
                if(der && der.lat===u.gps.lat && der.lng===u.gps.lng) return prev;
                return [...prev.slice(-49),{lat:u.gps.lat,lng:u.gps.lng,ts:u.ts||Date.now()}];
              });
              setUrgenceRecue(prev=>prev&&prev.alerteId===u.alerteId?u:prev);
            }
          });
        }
      }
      const types = await cloudChargerTypesService();
      if(actif && types.length) setTypesServiceDisponibles(types);
      if(userInfo.plan==="institution" && userInfo.cloudId){
        const statut = await cloudStatutInstitution(userInfo.cloudId);
        if(actif && statut && statut!==userInfo.statut){
          setUserInfo(prev=>({...prev, statut}));
          setComptesInscrits(prev=>prev.map(c=>c.cloudId===userInfo.cloudId?{...c,statut}:c));
        }
      }
    };
    synchroniser();
    const it=setInterval(synchroniser,3000);
    return ()=>{actif=false;clearInterval(it);};
  },[userInfo.plan,userInfo.cloudId,userInfo.statut,userInfo.ph]);

  /* ── Bouton retour du téléphone (Android) : revient toujours à l'écran
     précédent de l'application, jusqu'à l'accueil, SANS JAMAIS la fermer.
     Un état factice est constamment ré-empilé : chaque appui « retour » est
     capté par l'app et ne referme jamais la WebView, même à l'accueil. ── */
  useEffect(()=>{
    try{ window.history.pushState({alerteci:true},""); window.history.pushState({alerteci:true},""); }catch(e){}
    const onPop=()=>{
      setHistory(p=>{
        if(p.length<=1) return p;                 // déjà à la racine → on ne sort pas
        const suivant=p.slice(0,-1);
        const der=suivant[suivant.length-1];
        if(der==="splash") return [userInfo.plan==="institution"?"home_service":"home"];
        return suivant;
      });
      try{ window.history.pushState({alerteci:true},""); }catch(e){}
    };
    window.addEventListener("popstate",onPop);
    return ()=>window.removeEventListener("popstate",onPop);
  },[userInfo.plan]);

  /* ── Pop-up de notification en direct ────────────────────────────────────
     Dès qu'une information est diffusée (par un service public OU par un
     citoyen qui signale une situation à un service), un pop-up apparaît
     en haut de l'écran chez TOUS les autres comptes connectés pendant la
     session, peu importe l'écran sur lequel ils se trouvent. ── */
  const [notifPopup,setNotifPopup]=useState(null); // {titre, texte, icon, c, bg} | null
  const notifPopupTimerRef=useRef(null);
  const afficherNotifPopup=(data)=>{
    setNotifPopup(data);
    clearTimeout(notifPopupTimerRef.current);
    notifPopupTimerRef.current=setTimeout(()=>setNotifPopup(null),4500);
  };

  const ajouterAlertePublique=(alerte)=>{
    const diffusion = {...alerte, id:`svc-${Date.now()}`, ts:Date.now()};
    setAlertesPubliques(prev=>[diffusion, ...prev]);
    /* Diffusion nationale : la même alerte part vers le serveur pour
       apparaître sur tous les téléphones du pays (best-effort). */
    cloudPublierDiffusion(diffusion);
    afficherNotifPopup({
      titre: alerte.institution || alerte.service || "Nouvelle information",
      texte: alerte.apercu || alerte.titre || "",
      icon: alerte.icon || "📢",
      c: alerte.c || C.green,
      bg: alerte.bg || C.greenL,
    });
  };

  /* ── Partages GPS en direct (rubrique Enlèvement / Disparition) ──────────
     Chaque partage actif est un objet {id, nom, ph, lat, lng, precision, ts,
     contacts}. La mise à jour de la position se fait en continu via
     majPositionGps (appelé par watchPosition côté émetteur), et tous les
     écrans qui consultent partagesGps se synchronisent automatiquement dès
     que cet état change — c'est ce qui permet au destinataire de voir la
     position se mettre à jour à chaque actualisation. ── */
  const [partagesGps,setPartagesGps]=useState([]);

  const demarrerPartageGps=(id,nom)=>{
    setPartagesGps(prev=>prev.some(p=>p.id===id)?prev:[...prev,{id,nom,lat:null,lng:null,precision:null,ts:Date.now(),contacts:[]}]);
  };
  const majPositionGps=(id,data)=>{
    setPartagesGps(prev=>{
      const existe=prev.some(p=>p.id===id);
      if(existe) return prev.map(p=>p.id===id?{...p,...data}:p);
      return [...prev,data];
    });
  };
  const arreterPartageGps=(id)=>{
    setPartagesGps(prev=>prev.filter(p=>p.id!==id));
  };

  /* ── REGISTRE CENTRAL DES COMPTES CRÉÉS — PERSISTANT ─────────────────────
     Chaque inscription (citoyen ou institution) est conservée ici avec son
     numéro et son code d'accès, afin que l'écran de Connexion puisse
     reconnaître N'IMPORTE QUEL compte créé — pas seulement le dernier, et
     pas seulement pendant la session en cours. Sauvegardé dans localStorage
     pour survivre à la fermeture de l'application : sans cela, fermer puis
     rouvrir l'app effaçait tout l'état React et rendait les codes d'accès
     déjà créés "non reconnus" à la reconnexion — c'est le bug corrigé ici. */
  const [comptesInscrits,setComptesInscrits]=useState(()=>{
    try{
      const sauvegarde = window.localStorage.getItem("alerteci_comptes");
      return sauvegarde ? JSON.parse(sauvegarde) : [];
    }catch(e){ return []; }
  });
  useEffect(()=>{
    try{ window.localStorage.setItem("alerteci_comptes", JSON.stringify(comptesInscrits)); }catch(e){}
  },[comptesInscrits]);

  /* ── Types de service institutionnel — modifiables depuis le dashboard admin,
     persistant pour ne pas perdre les ajouts/retraits à la fermeture de l'app ── */
  const [typesServiceDisponibles,setTypesServiceDisponibles]=useState(()=>{
    try{
      const sauvegarde = window.localStorage.getItem("alerteci_types_service");
      return sauvegarde ? JSON.parse(sauvegarde) : TYPES_SERVICE_DEFAUT;
    }catch(e){ return TYPES_SERVICE_DEFAUT; }
  });
  useEffect(()=>{
    try{ window.localStorage.setItem("alerteci_types_service", JSON.stringify(typesServiceDisponibles)); }catch(e){}
  },[typesServiceDisponibles]);
  const ajouterTypeService=(nom)=>{
    const n=nom.trim();
    if(!n) return;
    setTypesServiceDisponibles(prev=>prev.includes(n)?prev:[...prev,n]);
  };
  const retirerTypeService=(nom)=>{
    setTypesServiceDisponibles(prev=>prev.filter(t=>t!==nom));
  };

  const onSignup=(info)=>{
    const essaiFin = info.plan==="institution" ? undefined : new Date(Date.now()+ESSAI_DUREE_MS).toISOString();
    const compteComplet={
      ...info,
      nm:saneTxt(info.nm,120), commune:saneTxt(info.commune,80),
      responsable:info.responsable?saneTxt(info.responsable,120):info.responsable,
      id:`acc-${Date.now()}`, creeLe:Date.now(), essaiFin,
    };
    setComptesInscrits(prev=>[...prev, compteComplet]);
    setUserInfo(compteComplet);
    setPlan(info.plan);
    /* Inscription nationale : le compte est créé sur Firebase (auth) puis
       sur Supabase (fiche), partagés avec le tableau de bord administrateur.
       Pour une institution, on récupère son identifiant national (cloudId)
       afin que la validation effectuée depuis le dashboard se répercute sur
       ce compte. Si le numéro est déjà utilisé, on le signale au registre
       local pour éviter un doublon silencieux. */
    cloudSignup(compteComplet).then((res)=>{
      if(res && res.dejaExistant){
        setComptesInscrits(prev=>prev.filter(c=>c.id!==compteComplet.id));
        return;
      }
      if(res && res.id){
        setComptesInscrits(prev=>prev.map(c=>c.id===compteComplet.id?{...c,cloudId:res.id}:c));
        setUserInfo(prev=>prev.id===compteComplet.id?{...prev,cloudId:res.id}:prev);
      }
    }).catch(()=>{});
  };

  /* ── Déconnexion ───────────────────────────────────────────────────────
     Maintenant que la session active est persistée (pour rester connecté
     après fermeture de l'app), il faut explicitement la VIDER ici — sinon
     "Se déconnecter" ne ferait que naviguer vers le Splash sans effacer
     userInfo/plan, et la session reviendrait automatiquement au prochain
     démarrage malgré la déconnexion. Le compte lui-même reste dans le
     registre comptesInscrits : seule la session active est effacée. ── */
  const seDeconnecter=()=>{
    cloudSetFbSession(null);
    setUserInfo({nm:"",ph:"",mail:"",commune:"",plan:"gratuit"});
    setPlan("gratuit");
    go("splash");
  };

  /* ── Session unique par numéro ────────────────────────────────────────
     Vérifie régulièrement, pendant que l'app est ouverte, que cet appareil
     est toujours celui enregistré côté serveur pour ce numéro. Si un autre
     appareil s'est connecté entre-temps avec le même numéro (ou si le compte
     a été bloqué depuis le dashboard admin), la session locale est fermée. ── */
  const [sessionExpulsee,setSessionExpulsee]=useState(false);
  useEffect(()=>{
    if(!userInfo.ph || userInfo.plan==="institution") return;
    const verifier=async()=>{
      const active = await cloudSessionEncoreActive(userInfo.ph);
      if(!active){
        cloudSetFbSession(null);
        setUserInfo({nm:"",ph:"",mail:"",commune:"",plan:"gratuit"});
        setPlan("gratuit");
        setSessionExpulsee(true);
        go("splash");
      }
    };
    const it=setInterval(verifier,45000);
    return ()=>clearInterval(it);
  },[userInfo.ph]);

  /* ── Validation / refus d'un compte institutionnel par l'admin ─────────
     Une fois validé, le statut passe à "valide" à la fois dans le registre
     et dans userInfo si c'est le compte actuellement connecté — c'est ce
     qui débloque immédiatement la diffusion côté Service Public. ── */
  const validerCompteInstitution=(id,nouveauStatut)=>{
    setComptesInscrits(prev=>prev.map(c=>c.id===id?{...c,statut:nouveauStatut}:c));
    setUserInfo(prev=>prev.id===id?{...prev,statut:nouveauStatut}:prev);
    /* Répercuter la décision au national (visible depuis le dashboard). */
    const compte = comptesInscrits.find(c=>c.id===id);
    if(compte && compte.cloudId) cloudValiderInstitution(compte.cloudId, nouveauStatut);
  };
  const onPaiementSuccess=()=>{
    const premiumExpire = new Date(Date.now()+365*24*60*60*1000).toISOString();
    setPlan("premium");
    setUserInfo(p=>({...p,plan:"premium",premiumExpire}));
    if(userInfo.ph){
      cloudUpdate("profiles", `telephone=eq.${userInfo.ph}`, { forfait:"premium_annuel", premium_expire:premiumExpire }).catch(()=>{});
    }
    go("home");
  };

  /* ── Confirmation rapide du code d'accès (AccesRapide) ───────────────────
     Route vers le bon tableau de bord selon le type de compte restauré —
     un compte institutionnel doit retrouver home_service, pas l'écran
     citoyen, sans quoi la session restaurée serait incorrecte. ── */
  const onAcces=()=>go(userInfo.plan==="institution"?"home_service":"home");

  const screens={
    splash:<Splash go={go} userInfo={userInfo} onAcces={onAcces}/>,
    login:<Login go={go} goBack={goBack} setPlan={setPlan} setUserInfo={setUserInfo} userInfo={userInfo} comptesInscrits={comptesInscrits}/>,
    home:<Home go={go} plan={plan} userInfo={userInfo} alertesPubliques={alertesPubliques}/>,
    violence:<Violence go={go} goBack={goBack} userInfo={userInfo}/>,
    enlevement:<Enlevement go={go} goBack={goBack} userInfo={userInfo} partagesGps={partagesGps} demarrerPartageGps={demarrerPartageGps} arreterPartageGps={arreterPartageGps} majPositionGps={majPositionGps}/>,

    planning:<Planning go={go} goBack={goBack}/>,
    info:<Info go={go} goBack={goBack} plan={plan} alertesPubliques={alertesPubliques}/>,
    ...Object.fromEntries(SERVICES_PUBLICS_CONFIG.map(s=>[s.sc,<ServicePublicEcran key={s.sc} go={go} goBack={goBack} config={s} alertesPubliques={alertesPubliques} ajouterAlertePublique={ajouterAlertePublique}/>])),
    effondrement:<Effondrement go={go} goBack={goBack}/>,
    incendie:<Incendie go={go} goBack={goBack}/>,
    signup:<Signup go={go} goBack={goBack} onSignup={onSignup} userInfo={userInfo} comptesInscrits={comptesInscrits} typesService={typesServiceDisponibles}/>,
    paiement:<Paiement go={go} goBack={goBack} onSuccess={onPaiementSuccess}/>,
    parametres:<Parametres go={go} goBack={goBack}/>,
    home_service:<HomeService go={go} userInfo={userInfo} alertesPubliques={alertesPubliques} ajouterAlertePublique={ajouterAlertePublique}/>,
    profil_service:<ProfilService go={go} goBack={goBack} userInfo={userInfo} seDeconnecter={seDeconnecter}/>,
    parametres_service:<ParametresService go={go} goBack={goBack} userInfo={userInfo} setUserInfo={setUserInfo}/>,
    cgu:<Cgu go={go} goBack={goBack}/>,
    faq:<Faq go={go} goBack={goBack}/>,
    profil:<Profil go={go} goBack={goBack} userInfo={userInfo} setUserInfo={setUserInfo} plan={plan} setPlan={setPlan} seDeconnecter={seDeconnecter}/>,
    admin:<AdminDashboard go={go} goBack={goBack} comptesInscrits={comptesInscrits} validerCompteInstitution={validerCompteInstitution} typesServiceDisponibles={typesServiceDisponibles} ajouterTypeService={ajouterTypeService} retirerTypeService={retirerTypeService}/>,
  };
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="shell">
        <div className="sbar">
          <span><HeureLive/></span>
        </div>
        {rappelTache&&(
          <div style={{position:"fixed",inset:0,zIndex:220,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"stin 200ms var(--eo)"}}>
            <div style={{background:"linear-gradient(160deg,#7C2D12,#9A3412)",borderRadius:24,padding:"28px 22px",maxWidth:340,width:"100%",textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",animation:"bk 1s ease infinite"}}>
                <span style={{fontSize:30}}>⏰</span>
              </div>
              <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>Rappel de tâche</p>
              <p style={{fontSize:14,color:"rgba(255,255,255,.85)",lineHeight:1.5,marginBottom:6}}>{rappelTache.txt}</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.55)",marginBottom:18}}>L'alarme et la lecture vocale s'arrêteront d'elles-mêmes après 45 secondes.</p>
              <button onClick={()=>{arreterRappelTache();setRappelTache(null);}}
                style={{width:"100%",background:"#fff",border:"none",borderRadius:14,padding:"14px",cursor:"pointer",
                  fontSize:14,fontWeight:800,color:"#7C2D12",fontFamily:"Plus Jakarta Sans"}}>
                ✓ J'ai compris — arrêter le rappel
              </button>
            </div>
          </div>
        )}
        {urgenceRecue&&(
          <div onClick={()=>{ try{ _deverrouillerAudio(); if(!_sireneOsc && !arreteesLocalementRef.current.has(urgenceRecue.alerteId)) jouerSireneUrgence(); }catch(e){} }} style={{position:"absolute",inset:0,zIndex:300,display:"flex",flexDirection:"column",
            background:urgenceRecue.type==="gps"?"linear-gradient(165deg,#2E1065,#4C1D95)":"linear-gradient(165deg,#450A0A,#7F1D1D)",
            animation:"stin 250ms var(--esp)",overflowY:"auto"}}>
            <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"28px 24px",gap:14}}>
              <div style={{textAlign:"center"}}>
                <div style={{width:72,height:72,borderRadius:"50%",margin:"0 auto 14px",
                  background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:34,animation:"bk 0.9s ease infinite"}}>
                  {urgenceRecue.type==="gps"?"📍":"🚨"}
                </div>
                <p style={{fontFamily:"Sora,sans-serif",fontSize:21,fontWeight:800,color:"#fff",letterSpacing:"-.4px",marginBottom:6}}>
                  {urgenceRecue.type==="gps"?"SUIVI DE POSITION EN DIRECT":"ALERTE URGENCE"}
                </p>
                <p style={{fontSize:14,color:"rgba(255,255,255,.85)",fontWeight:700,lineHeight:1.5}}>
                  {urgenceRecue.type==="gps"
                    ?<><strong style={{color:"#DDD6FE"}}>{(urgenceRecue.victime&&urgenceRecue.victime.nm)||"Un proche"}</strong> partage sa position avec vous suite à un risque de disparition.</>
                    :<><strong style={{color:"#FECACA"}}>{(urgenceRecue.victime&&urgenceRecue.victime.nm)||"Un proche"}</strong> est en danger !<br/>Appelez immédiatement.</>}
                </p>
              </div>

              {urgenceRecue.victime&&urgenceRecue.victime.ph&&(
                <a href={`tel:${urgenceRecue.victime.ph}`}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                    background:"#16A34A",borderRadius:16,padding:"16px",textDecoration:"none",
                    boxShadow:"0 8px 24px rgba(22,163,74,.4)"}}>
                  <span style={{fontSize:18}}>📞</span>
                  <span style={{fontSize:15,fontWeight:800,color:"#fff",fontFamily:"Sora,sans-serif"}}>
                    APPELER {(urgenceRecue.victime.nm||"").split(" ")[0].toUpperCase()} · {urgenceRecue.victime.ph}
                  </span>
                </a>
              )}

              <div style={{background:"rgba(0,0,0,.25)",borderRadius:16,padding:"14px 16px"}}>
                <p style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>
                  📍 Position {urgenceRecue.gps?"en direct":""}
                </p>
                {urgenceRecue.gps?(
                  <>
                    {/* Carte de suivi en direct — le contact voit la position
                        sur une vraie carte avec marqueur et badge live. */}
                    <div style={{borderRadius:14,overflow:"hidden",marginBottom:10,border:"2px solid rgba(255,255,255,.2)",background:"#1A1A2E",position:"relative",height:170}}>
                      <iframe
                        title="Position en direct"
                        width="100%" height="170" frameBorder="0" scrolling="no"
                        style={{border:0,display:"block"}}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${urgenceRecue.gps.lng-0.004}%2C${urgenceRecue.gps.lat-0.003}%2C${urgenceRecue.gps.lng+0.004}%2C${urgenceRecue.gps.lat+0.003}&layer=mapnik&marker=${urgenceRecue.gps.lat}%2C${urgenceRecue.gps.lng}`}
                      />
                      <div style={{position:"absolute",top:8,left:8,background:"rgba(220,38,38,.95)",borderRadius:20,padding:"4px 10px",display:"flex",alignItems:"center",gap:6,pointerEvents:"none"}}>
                        <span style={{width:7,height:7,borderRadius:"50%",background:"#fff",animation:"bk 1s ease infinite"}}/>
                        <span style={{fontSize:10,fontWeight:800,color:"#fff"}}>EN DIRECT</span>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                      <div><p style={{fontSize:9,color:"rgba(255,255,255,.5)",fontWeight:700}}>LATITUDE</p><p style={{fontSize:14,fontWeight:700,color:"#fff",fontFamily:"monospace"}}>{urgenceRecue.gps.lat.toFixed(5)}</p></div>
                      <div><p style={{fontSize:9,color:"rgba(255,255,255,.5)",fontWeight:700}}>LONGITUDE</p><p style={{fontSize:14,fontWeight:700,color:"#fff",fontFamily:"monospace"}}>{urgenceRecue.gps.lng.toFixed(5)}</p></div>
                    </div>
                    {urgenceRecue.lienMaps&&(
                      <a href={urgenceRecue.lienMaps} target="_blank" rel="noreferrer"
                        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                          background:"rgba(255,255,255,.95)",borderRadius:12,padding:"12px",textDecoration:"none",marginBottom:10}}>
                        <span style={{fontSize:15}}>🗺️</span>
                        <span style={{fontSize:13,fontWeight:800,color:"#1C1917"}}>Ouvrir dans Google Maps</span>
                      </a>
                    )}
                    {/* Historique des positions reçues — chez le contact
                        uniquement. Trace le parcours de la personne suivie. */}
                    {histoPositions.length>1&&(
                      <div style={{marginTop:4}}>
                        <p style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>🕓 Historique du trajet ({histoPositions.length} points)</p>
                        <div style={{maxHeight:120,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                          {histoPositions.slice().reverse().map((h,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.06)",borderRadius:8,padding:"6px 10px"}}>
                              <span style={{width:6,height:6,borderRadius:"50%",background:i===0?"#22C55E":"rgba(255,255,255,.4)",flexShrink:0}}/>
                              <span style={{fontSize:11,color:"rgba(255,255,255,.85)",fontFamily:"monospace",flex:1}}>{h.lat.toFixed(5)}, {h.lng.toFixed(5)}</span>
                              <span style={{fontSize:10,color:"rgba(255,255,255,.5)"}}>{new Date(h.ts).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p style={{fontSize:10,color:"rgba(255,255,255,.45)",marginTop:8,textAlign:"center"}}>
                      Dernière position {new Date(urgenceRecue.ts||Date.now()).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})} · mise à jour automatique
                    </p>
                  </>
                ):(
                  <p style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>
                    Recherche de la position en cours… Le lien s'affichera ici automatiquement dès qu'elle est disponible.
                  </p>
                )}
              </div>

              {!(urgenceRecue&&arreteesLocalementRef.current.has(urgenceRecue.alerteId))&&(
                <button onClick={()=>{
                    /* Arrêt LOCAL : coupe MA sirène uniquement. Les autres
                       contacts continuent de sonner jusqu'à leur propre arrêt.
                       Pour un suivi GPS, l'écran et les positions RESTENT
                       affichés et continuent de se mettre à jour. */
                    if(urgenceRecue&&urgenceRecue.alerteId) arreteesLocalementRef.current.add(urgenceRecue.alerteId);
                    arreterSireneUrgence();
                    if(urgenceRecue&&urgenceRecue.type!=="gps") setUrgenceRecue(null);
                    else setUrgenceRecue(prev=>prev?{...prev}:prev);
                  }}
                  style={{background:"rgba(255,255,255,.14)",border:"1.5px solid rgba(255,255,255,.3)",
                    borderRadius:14,padding:"13px",cursor:"pointer",color:"#fff",
                    fontSize:13,fontWeight:800,fontFamily:"Plus Jakarta Sans"}}>
                  ✓ J'ai pris connaissance — arrêter l'alarme
                </button>
              )}
              {urgenceRecue&&urgenceRecue.type==="gps"&&(
                <button onClick={()=>{
                    /* Fermer le suivi : n'affiche plus cette alerte ici. */
                    if(urgenceRecue.alerteId){ fermesDefRef.current.add(urgenceRecue.alerteId); arreteesLocalementRef.current.add(urgenceRecue.alerteId); }
                    arreterSireneUrgence();
                    setUrgenceRecue(null);
                    setHistoPositions([]);
                  }}
                  style={{background:"transparent",border:"1.5px solid rgba(255,255,255,.25)",
                    borderRadius:14,padding:"11px",cursor:"pointer",color:"rgba(255,255,255,.75)",
                    fontSize:12,fontWeight:700,fontFamily:"Plus Jakarta Sans",marginTop:8}}>
                  ✕ Fermer le suivi de position
                </button>
              )}
            </div>
          </div>
        )}
        {notifPopup&&(
          <div
            onClick={()=>setNotifPopup(null)}
            style={{
              position:"absolute", top:14, left:12, right:12, zIndex:200,
              background:"#fff", borderRadius:18, padding:"12px 14px",
              boxShadow:"0 12px 32px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.04)",
              display:"flex", alignItems:"center", gap:12, cursor:"pointer",
              animation:"stin 280ms var(--esp)",
            }}>
            <div style={{width:40,height:40,borderRadius:12,background:notifPopup.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
              {notifPopup.icon}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:13,fontWeight:800,color:notifPopup.c}}>{notifPopup.titre}</p>
              <p style={{fontSize:12,color:C.muted,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{notifPopup.texte}</p>
            </div>
            <button onClick={(e)=>{e.stopPropagation();setNotifPopup(null);}}
              style={{background:"none",border:"none",cursor:"pointer",color:C.faint,fontSize:14,flexShrink:0,padding:4}}>✕</button>
          </div>
        )}
        {screens[screen]}
      </div>
    </>
  );
}
