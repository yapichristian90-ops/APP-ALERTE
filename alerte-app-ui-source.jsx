import { useState, useEffect, useRef } from "react";

const C = {
  orange:"#F97316",orangeL:"#FFF7ED",orangeD:"#C2410C",
  green:"#16A34A",greenL:"#F0FDF4",
  white:"#FFFFFF",off:"#FAFAF9",surf:"#F5F5F4",surfH:"#E7E5E4",
  ink:"#1C1917",muted:"#78716C",faint:"#A8A29E",border:"rgba(0,0,0,0.07)",
};

const VILLES_CI = ["Yopougon","Cocody","Abobo","Adjamé","Plateau","Marcory","Treichville","Port-Bouët","Koumassi","Attécoubé","Songon","Anyama","Bouaké","Daloa","San-Pédro","Yamoussoukro","Korhogo","Man","Abengourou","Divo","Gagnoa","Odienné","Bondoukou","Séguéla","Duekoué","Touba","Ferkessédougou","Bouna","Agboville","Sassandra","Grand-Bassam","Aboisso","Soubré","Guiglo","Issia","Sinfra","Dimbokro","Bangolo","Vavoua","Bongouanou","Tiébissou","Zuénoula","Boundiali","Danané","Lakota","Grand-Lahou","Jacqueville","Adzopé","Agnibilékrou","Akoupé","Bocanda","Daoukro","Guitry","Katiola","Mankono","Méagui","Oumé","Tabou","Tingrela"];

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
const AccesRapide = ({go,userInfo={},onAcces,comptesInscrits=[],seDeconnecter}) => {
  const [pin,setPin]=useState("");
  const [err,setErr]=useState("");
  const [bioDispo,setBioDispo]=useState(false);
  const [shake,setShake]=useState(false);
  const nom=(userInfo.nm||"").split(" ")[0]||"";
  const ini=(userInfo.nm||"?").split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()||"??";

  /* ── Un blocage décidé côté admin doit fermer l'accès rapide aussi, pas
     seulement le formulaire de connexion — sinon un compte bloqué resterait
     utilisable via le code PIN déjà mémorisé sur l'appareil. ── */
  const compteBloque = comptesInscrits.some(c=>c.ph===userInfo.ph && c.bloque);

  useEffect(()=>{
    try{if(window.PublicKeyCredential)window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(ok=>setBioDispo(ok)).catch(()=>{});}catch(e){}
  },[]);

  if(compteBloque) return (
    <div className="scr on" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
      <span style={{fontSize:40,marginBottom:14}}>🚫</span>
      <p style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:C.ink,marginBottom:8}}>Compte bloqué</p>
      <p style={{fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:20}}>Ce compte a été bloqué. Contactez le support ALERTE CI pour plus d'informations.</p>
      <button className="btn btn-g" onClick={()=>{seDeconnecter&&seDeconnecter();go("splash");}}>Retour</button>
    </div>
  );

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

const Splash = ({go, userInfo={}, onAcces, comptesInscrits=[], seDeconnecter}) => {
  if(userInfo.nm&&userInfo.ph){
    return <AccesRapide go={go} userInfo={userInfo} onAcces={onAcces} comptesInscrits={comptesInscrits} seDeconnecter={seDeconnecter}/>;
  }
  return (
    <div className="scr on splash" style={{display:"flex"}}>
      <div className="orb">
        <svg width="60" height="60" viewBox="0 0 216 216" style={{position:"relative",zIndex:1}}>
          <defs>
            <linearGradient id="orbShield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFF3E8"/>
            </linearGradient>
            <linearGradient id="orbPin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB923C"/><stop offset="100%" stopColor="#C2410C"/>
            </linearGradient>
          </defs>
          <g transform="translate(108,107)">
            <path d="M0 -56 L45 -39 C45 -2 36 33 0 61 C-36 33 -45 -2 -45 -39 Z" fill="url(#orbShield)"/>
            <g transform="translate(0,-3)">
              <path d="M0 -23 C13.5 -23 23.5 -12.5 23.5 1 C23.5 17 7 33 0 40 C-7 33 -23.5 17 -23.5 1 C-23.5 -12.5 -13.5 -23 0 -23 Z" fill="url(#orbPin)"/>
              <circle cx="0" cy="0" r="9" fill="url(#orbShield)"/>
            </g>
          </g>
        </svg>
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

/* Identifiants techniques : le numéro de téléphone (10 chiffres) devient un
   email technique unique, et le code d'accès à 6 chiffres est renforcé par
   dérivation avant d'être utilisé comme mot de passe serveur. L'utilisateur,
   lui, ne voit jamais rien d'autre que « téléphone + code d'accès ». */
const cloudEmail = (ph) => `u${String(ph).replace(/\D/g,"")}@alerteci.app`;
const cloudPass  = (ph,pin) => `CI!${pin}.${String(ph).replace(/\D/g,"")}`;

const cloudHdr = (token) => ({
  "Content-Type": "application/json",
  "apikey": SB_KEY,
  "Authorization": `Bearer ${token || SB_KEY}`,
});

let _cloudToken = null;
const cloudToken = () => {
  if(_cloudToken) return _cloudToken;
  try{ _cloudToken = window.localStorage.getItem("alerteci_cloud_token") || null; }catch(e){}
  return _cloudToken;
};
const cloudSetToken = (t) => {
  _cloudToken = t || null;
  try{
    if(t) window.localStorage.setItem("alerteci_cloud_token", t);
    else  window.localStorage.removeItem("alerteci_cloud_token");
  }catch(e){}
};

/* Reconnexion silencieuse avec la session locale (ph+pin déjà connus de
   l'appareil) quand le jeton serveur a expiré — l'utilisateur ne voit rien. */
async function cloudReconnexionSilencieuse(){
  try{
    const brut = window.localStorage.getItem("alerteci_session_user");
    const s = brut ? JSON.parse(brut) : null;
    if(!s || !s.ph || !s.pin) return null;
    const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`,{
      method:"POST", headers:cloudHdr(),
      body:JSON.stringify({email:cloudEmail(s.ph), password:cloudPass(s.ph,s.pin)}),
    });
    if(!r.ok) return null;
    const d = await r.json();
    if(d.access_token){ cloudSetToken(d.access_token); return d.access_token; }
    return null;
  }catch(e){ return null; }
}

async function cloudGet(chemin, token){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/${chemin}`,{headers:cloudHdr(token||cloudToken())});
    if(!r.ok) return null;
    return await r.json();
  }catch(e){ return null; }
}

async function cloudInsert(table, ligne, token, dejaRetente){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/${table}`,{
      method:"POST",
      headers:{...cloudHdr(token||cloudToken()), "Prefer":"return=representation"},
      body:JSON.stringify(ligne),
    });
    if(r.status===401 && !dejaRetente){
      const nt = await cloudReconnexionSilencieuse();
      if(nt) return cloudInsert(table, ligne, nt, true);
    }
    if(!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d) ? d[0] : d;
  }catch(e){ return null; }
}

async function cloudUpdate(table, filtre, patch, token, dejaRetente){
  try{
    const r = await fetch(`${SB_URL}/rest/v1/${table}?${filtre}`,{
      method:"PATCH", headers:cloudHdr(token||cloudToken()), body:JSON.stringify(patch),
    });
    if(r.status===401 && !dejaRetente){
      const nt = await cloudReconnexionSilencieuse();
      if(nt) return cloudUpdate(table, filtre, patch, nt, true);
    }
    return r.ok;
  }catch(e){ return false; }
}

/* ── Inscription nationale : crée le compte serveur (profil citoyen)
   sur le projet Supabase partagé. ── */
async function cloudSignup(compte){
  try{
    const r = await fetch(`${SB_URL}/auth/v1/signup`,{
      method:"POST", headers:cloudHdr(),
      body:JSON.stringify({
        email: cloudEmail(compte.ph),
        password: cloudPass(compte.ph, compte.pin),
        data: { nm:compte.nm||"", plan:compte.plan||"gratuit", commune:compte.commune||"" },
      }),
    });
    const d = await r.json();
    const uid = d.user && d.user.id ? d.user.id : d.id;
    if(!uid) return null;
    if(d.access_token) cloudSetToken(d.access_token);
    const token = d.access_token || null;

    const slug = compte.plan==="premium" ? "premium" : "gratuit";
    const forfaits = await cloudGet(`forfaits?slug=eq.${slug}&select=id`, token);
    await cloudInsert("profiles",{
      id:uid, nom:compte.nm, telephone:compte.ph, email:compte.mail||null,
      commune:compte.commune||null, forfait_id:(forfaits&&forfaits[0])?forfaits[0].id:null, statut:"actif",
    }, token);
    return true;
  }catch(e){ return null; }
}

/* ── Connexion nationale : reconnaît un compte créé sur N'IMPORTE QUEL
   appareil du pays, puis l'enregistre dans le registre local de cet
   appareil pour les prochaines connexions hors-ligne. ── */
async function cloudLogin(ph, pin){
  try{
    const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`,{
      method:"POST", headers:cloudHdr(),
      body:JSON.stringify({email:cloudEmail(ph), password:cloudPass(ph,pin)}),
    });
    if(!r.ok) return null;
    const d = await r.json();
    const uid = d.user && d.user.id;
    if(!uid || !d.access_token) return null;
    cloudSetToken(d.access_token);
    const meta = (d.user && d.user.user_metadata) || {};

    const rows = await cloudGet(`profiles?id=eq.${uid}&select=*,forfaits(slug)`, d.access_token);
    const prof = rows && rows[0];
    if(prof && prof.statut==="suspendu") return { suspendu:true };
    const plan = (prof && prof.forfaits && prof.forfaits.slug==="premium") ? "premium"
               : (meta.plan==="premium" ? "premium" : "gratuit");
    const compte = {
      nm:(prof&&prof.nom)||meta.nm||"", ph, mail:(prof&&prof.email)||"",
      commune:(prof&&prof.commune)||meta.commune||"", pin, plan,
      id:`acc-${Date.now()}`, creeLe:Date.now(),
    };
    cloudMemoriserLocal(compte);
    return compte;
  }catch(e){ return null; }
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
      headers:{...cloudHdr(cloudToken()), "Prefer":"return=minimal"},
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
       On cherche dans le registre complet des comptes créés en session,
       pas seulement le dernier : la personne doit saisir elle-même son
       propre code d'accès pour se connecter — celui-ci n'est jamais
       pré-rempli ni affiché. */
    const compte = comptesInscrits.find(c => c.ph===ph && c.pin===pinValue);
    if(compte){
      if(compte.bloque){ setErr("Ce compte a été bloqué. Contactez le support."); setPin(""); return; }
      setErr(""); setLoading(true);
      setPlan&&setPlan(compte.plan==="premium"?"premium":"gratuit");
      setUserInfo&&setUserInfo(compte);
      setTimeout(() => { setLoading(false); go("home"); }, 1000);
      return;
    }

    const found = DEMO_ACCOUNTS.find(a => a.ph === ph && a.pin === pinValue);
    if (found) {
      setErr(""); setLoading(true);
      setPlan&&setPlan(found.badge==="PREMIUM"?"premium":"gratuit");
      setUserInfo&&setUserInfo({nm:found.label,ph:found.ph,mail:"",commune:"",pin:found.pin,plan:found.badge==="PREMIUM"?"premium":"gratuit"});
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
        setPlan&&setPlan(compte.plan==="premium"?"premium":"gratuit");
        setUserInfo&&setUserInfo(compte);
        go("home");
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
        <div style={{width:60,height:60,borderRadius:"50%",background:"conic-gradient(from 0deg,#F97316,#16A34A,#fff,#F97316)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{position:"absolute",inset:3,borderRadius:"50%",background:"#1C1917",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:17,color:"#fff"}}>A</span>
          </div>
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
      <p style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,color:C.ink,textAlign:"center",marginBottom:8}}>Fonctionnalité Premium</p>
      <p style={{fontSize:13,color:C.muted,textAlign:"center",lineHeight:1.6,marginBottom:20}}>Cette rubrique est réservée aux abonnés Premium.</p>
      <div style={{background:C.surf,borderRadius:14,padding:"12px 14px",marginBottom:18}}>
        {[{ic:"⭐",lb:"Forfait annuel",px:"3 000 FCFA / an"}].map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"4px 0"}}>
            <span style={{fontSize:18}}>{f.ic}</span>
            <span style={{fontSize:13,fontWeight:600,color:C.ink,flex:1}}>{f.lb}</span>
            <span style={{fontSize:12,fontWeight:700,color:C.orange}}>{f.px}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-p" onClick={onPay}>S'abonner <I n="arrow" s={16} c="#fff"/></button>
      <button className="btn btn-g" style={{marginTop:8}} onClick={onClose}>Plus tard</button>
    </div>
  </div>
);

const Home = ({go, plan="gratuit", userInfo={}, essai=null}) => {
  const [showUpgrade,setShowUpgrade]=useState(false);
  const d=(n)=>({animationDelay:`${n*60}ms`});
  const nomAffiche = userInfo.nm || "Bienvenue";
  const initiales = nomAffiche.split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase()||"??";

  const goProtected=(sc)=>{
    const premiumScreens=["violence","enlevement"];
    if(plan==="gratuit" && premiumScreens.includes(sc)){
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
        {plan==="gratuit"&&(
          <div className="si" style={d(0)}>
            <div className="bnr">
              <p className="bl">✦ FORFAIT GRATUIT</p>
              <p className="bt">Passez au Premium</p>
              <p className="bd">Accédez à Alerte Violence et à Alerte Enlèvement — 3 000 FCFA/an.</p>
              <button className="sbb" onClick={()=>go("paiement")}>S'abonner <I n="arrow" s={14} c="#fff"/></button>
            </div>
          </div>
        )}
        {plan==="premium"&&essai&&essai.actif&&(
          <div className="si" style={{...d(0),margin:"16px 20px 0",background:"linear-gradient(135deg,#7C2D12,#C2410C)",borderRadius:24,padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:24}}>🎁</span>
            <div style={{flex:1}}>
              <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.75)",textTransform:"uppercase",letterSpacing:"1px"}}>Essai gratuit actif</p>
              <p style={{fontSize:14,fontWeight:800,color:"#fff",marginTop:2}}>
                {essai.joursRestants<=1?"Dernier jour":`Encore ${essai.joursRestants} jours`} d'accès à Alerte Violence et Alerte Enlèvement
              </p>
              <button className="sbb" style={{marginTop:8,background:"rgba(255,255,255,.18)"}} onClick={()=>go("paiement")}>S'abonner maintenant <I n="arrow" s={14} c="#fff"/></button>
            </div>
          </div>
        )}
        {plan==="premium"&&(!essai||!essai.actif)&&(
          <div className="si" style={{...d(0),margin:"16px 20px 0",background:"linear-gradient(135deg,#064E3B,#065F46)",borderRadius:24,padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:24}}>⭐</span>
            <div>
              <p style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:"1px"}}>Forfait Premium actif</p>
              <p style={{fontSize:14,fontWeight:800,color:"#fff",marginTop:2}}>Accès complet à Alerte Violence et Alerte Enlèvement</p>
            </div>
          </div>
        )}
        <div className="sh" style={{marginTop:8}}><span className="stl">Accès rapide</span></div>
        <div className="qa">
          {[
            {sc:"violence",lock:plan==="gratuit",
              bg:plan==="gratuit"?"linear-gradient(135deg,#94A3B8,#64748B)":"linear-gradient(135deg,#FF6B35,#F97316)",
              svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z" fill="#fff" opacity=".9"/><path d="M9 21h6M10 18v3M14 18v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
              lb:"Alerte\nViolence"},
            {sc:"enlevement",lock:plan==="gratuit",
              bg:plan==="gratuit"?"linear-gradient(135deg,#94A3B8,#64748B)":"linear-gradient(135deg,#7C3AED,#5B21B6)",
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
                    headers:{...cloudHdr(cloudToken()),"Prefer":"return=minimal"},
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
                  const r=await fetch(SB_URL+"/rest/v1/diffusions?select=id&order=created_at.desc&limit=1",{headers:cloudHdr(cloudToken())});
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
                    headers:{...cloudHdr(cloudToken()),"Prefer":"return=minimal"},
                    body:JSON.stringify({payload:{type:"violence",diagtest:true,urgence:true,alerteId:idTest,victime:{nm:"Test",ph:"0000000000"},cibles:[monNum],ts:Date.now()}})});
                  await new Promise(r=>setTimeout(r,1500));
                  const depuis=new Date(Date.now()-3600000).toISOString();
                  const r=await fetch(SB_URL+"/rest/v1/diffusions?select=payload&created_at=gte."+encodeURIComponent(depuis)+"&order=created_at.desc&limit=50",{headers:cloudHdr(cloudToken())});
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

  /* ── Recherche d'une personne disparue par numéro ────────────────────────
     Si ce numéro vous a désigné comme contact de confiance et partage déjà
     sa position (reçue automatiquement dans partagesGps), elle s'affiche
     immédiatement — aucune action n'est requise de la personne recherchée. */
  const [rechercheNum,setRechercheNum]=useState("");
  const [rechercheFaite,setRechercheFaite]=useState(false);
  const resultatRecherche = rechercheFaite && rechercheNum.length===10
    ? partagesGps.find(p=>String(p.ph||"").replace(/\D/g,"").slice(-10)===rechercheNum) || null
    : null;

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
          body:`Bonjour ${nmContact} ! Vous avez été désigné(e) contact de confiance par ${nom} pour le suivi en cas de disparition. Vous recevrez automatiquement sa position GPS en direct, en permanence.`,
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

  /* ── Partage automatique et permanent ────────────────────────────────────
     Dès qu'un contact de confiance existe, le partage démarre tout seul —
     l'utilisateur n'a jamais à l'activer, y compris en cas de danger réel où
     il n'aurait pas le temps ou la présence d'esprit d'appuyer sur un bouton.
     S'il ne reste plus aucun contact, le partage s'arrête (rien à partager). */
  useEffect(()=>{
    if(contacts.length>0 && !partageActif){
      activerPartage();
    } else if(contacts.length===0 && partageActif){
      arreterPartage();
    }
  },[contacts.length]);

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
          <p className="ht">{partageActif?"Vos contacts vous suivent en temps réel":"Ajoutez un contact de confiance"}</p>
          <p className="hd">
            {partageActif
              ?`Votre position se met à jour automatiquement et s'affiche en direct chez vos ${contacts.length} contact${contacts.length>1?"s":""} de confiance, qui voient votre déplacement à chaque actualisation GPS — sans aucune action de votre part, même en cas de danger.`
              :"Ajoutez vos contacts de confiance ci-dessous : votre position leur sera alors partagée automatiquement et en permanence, sans aucune action de votre part, même en cas de danger."}
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
          {partageActif?(
            <div style={{display:"flex",alignItems:"center",gap:10,background:"#F5F3FF",border:"1.5px solid rgba(124,58,237,.25)",borderRadius:14,padding:"12px 14px"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#7C3AED",animation:"bk 1.4s ease infinite",flexShrink:0}}/>
              <p style={{fontSize:12,fontWeight:700,color:"#5B21B6",lineHeight:1.5}}>Partage automatique actif — vos contacts de confiance voient votre position en direct, en permanence.</p>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:10,background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px"}}>
              <I n="pin" s={16} c={C.faint}/>
              <p style={{fontSize:12,fontWeight:600,color:C.muted,lineHeight:1.5}}>Ajoutez un contact de confiance ci-dessous pour démarrer le partage automatique de votre position.</p>
            </div>
          )}
        </div>

        <div style={{margin:"0 20px 12px",background:"#fff",border:`1px solid ${C.border}`,borderRadius:16,padding:"16px"}}>
          <p style={{fontSize:13,fontWeight:800,color:C.ink,marginBottom:4}}>🔍 Rechercher une personne disparue</p>
          <p style={{fontSize:11,color:C.muted,lineHeight:1.5,marginBottom:10}}>Entrez le numéro d'une personne qui vous a ajouté comme contact de confiance dans SON application. Sa position s'affiche ici en direct — elle n'a rien à faire au moment du danger, son téléphone envoie sa position automatiquement.</p>
          <div style={{display:"flex",gap:8}}>
            <div className="if" style={{flex:1,marginBottom:0}}>
              <I n="phone" s={16} c={C.faint}/>
              <input type="tel" value={rechercheNum} maxLength={10}
                onChange={e=>{setRechercheNum(e.target.value.replace(/\D/g,"").slice(0,10));setRechercheFaite(false);}}
                placeholder="Numéro (10 chiffres)"/>
            </div>
            <button className="btn btn-p" style={{width:"auto",padding:"0 18px",background:"linear-gradient(135deg,#7C3AED,#6D28D9)"}}
              disabled={rechercheNum.length!==10}
              onClick={()=>setRechercheFaite(true)}>
              Rechercher
            </button>
          </div>
          {rechercheFaite&&(
            resultatRecherche?(
              <div style={{marginTop:12,background:"#F5F3FF",border:"1px solid rgba(124,58,237,.25)",borderRadius:14,padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#7C3AED",animation:"bk 1.4s ease infinite",flexShrink:0}}/>
                  <p style={{fontSize:13,fontWeight:800,color:C.ink}}>{resultatRecherche.nom}</p>
                </div>
                <p style={{fontSize:11,color:C.muted,marginBottom:8}}>Position partagée en direct · précision ≈ {resultatRecherche.precision}m</p>
                <a href={`https://www.google.com/maps?q=${resultatRecherche.lat},${resultatRecherche.lng}`} target="_blank" rel="noreferrer"
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:"#7C3AED",color:"#fff",fontSize:12,fontWeight:700,textDecoration:"none",fontFamily:"Plus Jakarta Sans"}}>
                  <I n="pin" s={14} c="#fff"/> Voir sa position sur la carte
                </a>
              </div>
            ):(
              <div style={{marginTop:12,background:"#FFF7ED",border:"1px solid rgba(249,115,22,.25)",borderRadius:14,padding:"12px 14px"}}>
                <p style={{fontSize:12,color:"#9A3412",fontWeight:600,lineHeight:1.5}}>Aucune position en direct pour ce numéro pour l'instant. Assurez-vous que cette personne vous a bien ajouté comme contact de confiance dans son application — le suivi apparaîtra ici automatiquement dès qu'elle le fait.</p>
              </div>
            )
          )}
        </div>

        {contacts.length===0&&(
          <div style={{margin:"0 20px 12px",background:"#FFF7ED",border:"1px solid rgba(249,115,22,.3)",borderRadius:16,padding:"14px 16px",display:"flex",gap:10}}>
            <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
            <div>
              <p style={{fontSize:13,fontWeight:800,color:C.orange,marginBottom:3}}>Ajoutez un contact de confiance</p>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Dès que vous ajoutez un contact de confiance ci-dessous, votre position sera partagée automatiquement avec lui, sans aucune action de votre part.</p>
            </div>
          </div>
        )}

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
            <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Dès qu'un contact de confiance est ajouté, le partage GPS envoie automatiquement et en permanence votre position à ce contact à chaque déplacement détecté — aucune action de votre part n'est requise, même en cas de danger. Chez vos contacts, la position affichée se synchronise et s'actualise dès qu'ils ouvrent ou rafraîchissent l'écran.</p>
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

/* ── PAIEMENT PREMIUM ──────────────────────────────────────────────────────── */
const Paiement = ({go,goBack,onSuccess}) => {
  const [method,setMethod]=useState(null);
  const [done,setDone]=useState(false);
  const [numMM,setNumMM]=useState("");
  const [errPay,setErrPay]=useState("");

  const prix = "3 000 FCFA / an";
  const montant = "3 000 FCFA";

  const isMM = ["orange","mtn","moov","wave"].includes(method);
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
          <p className="scrttl">Paiement Premium</p>
        </div>

        <div style={{margin:"0 20px 14px",background:C.orangeL,border:"1px solid rgba(249,115,22,.2)",borderRadius:18,padding:"14px 16px",textAlign:"center"}}>
          <p style={{fontSize:9,fontWeight:800,color:"#fff",background:C.orange,display:"inline-block",padding:"3px 10px",borderRadius:20,marginBottom:8}}>⭐ ABONNEMENT ANNUEL</p>
          <p style={{fontSize:22,fontWeight:800,color:C.orange,letterSpacing:"-.5px"}}>3 000 FCFA</p>
          <p style={{fontSize:11,fontWeight:600,color:C.muted,marginTop:2}}>par an · sans engagement caché</p>
        </div>

        <div style={{margin:"0 20px 20px",background:"linear-gradient(135deg,#1C1917,#292524)",borderRadius:22,padding:"20px"}}>
          <p style={{fontSize:11,fontWeight:700,color:C.orange,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>✦ FORFAIT PREMIUM — ANNUEL</p>
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
const Signup = ({go,goBack,onSignup,userInfo={},comptesInscrits=[]}) => {
  const [plan,setPlan]=useState("premium");
  const [cgu,setCgu]=useState(false);
  const [nm,setNm]=useState("");
  const [ph,setPh]=useState("");
  const [mail,setMail]=useState(""); // facultatif
  const [commune,setCommune]=useState("");
  const [pw,setPw]=useState("");

  /* ── Détection de compte déjà existant ──────────────────────────────────
     Un numéro est considéré "déjà inscrit" s'il correspond à un compte de
     démonstration ou au compte créé pendant cette session. Dans ce cas,
     on bloque l'inscription et on invite la personne à se connecter avec
     son code d'accès plutôt que de recréer un compte. */
  const compteExistant = ph.length===10 && (
    DEMO_ACCOUNTS.some(c=>c.ph===ph) || comptesInscrits.some(c=>c.ph===ph)
  );

  /* ── Inscription utilisateur particulier ── */
  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrhdr">
        <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
        <p className="scrttl">Créer un compte</p>
      </div>
      <div className="isc">
        <p className="fst" style={{marginTop:0}}>Informations personnelles</p>
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
        <p className="fst">Choisir un forfait</p>
        <div style={{background:C.orangeL,border:"1px solid rgba(249,115,22,.2)",borderRadius:14,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{fontSize:18,flexShrink:0}}>🎁</span>
          <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}><strong style={{color:C.orange}}>1 mois d'essai Premium offert</strong> dès la création de votre compte, quel que soit le forfait choisi ci-dessous. Accès complet à Alerte Violence et Alerte Enlèvement pendant 30 jours.</p>
        </div>
        <div className="ps">
          <button className={`po ${plan==="free"?"sel-g":""}`} onClick={()=>setPlan("free")}>
            <p style={{fontSize:22,marginBottom:6}}>🟢</p>
            <p style={{fontSize:13,fontWeight:700,color:C.ink}}>Gratuit</p>
            <p style={{fontSize:11,fontWeight:600,color:C.green,marginTop:3}}>0 FCFA</p>
          </button>
          <button className={`po ${plan==="premium"?"sel":""}`} onClick={()=>setPlan("premium")}>
            <p style={{fontSize:22,marginBottom:6}}>⭐</p>
            <p style={{fontSize:13,fontWeight:700,color:C.ink}}>Premium</p>
            <p style={{fontSize:11,fontWeight:600,color:C.orange,marginTop:3}}>3 000 FCFA/an</p>
          </button>
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
              onSignup&&onSignup({nm:nm.trim(),ph,mail,commune,pin:pw,plan:plan==="premium"?"premium":"gratuit"});
              if(plan==="premium") go("paiement");
              else go("home");
            }}
            style={{opacity:cgu&&nm.trim()&&ph.length===10&&pw.length===6&&!compteExistant?1:.5}}
            disabled={!cgu||!nm.trim()||ph.length<10||pw.length<6||compteExistant}>
            {plan==="premium"?"Continuer vers le paiement":"Créer mon compte"} <I n="arrow" s={16} c="#fff"/>
          </button>
        </div>
        <p style={{fontSize:11,color:C.faint,textAlign:"center",paddingBottom:16}}>1 compte = 1 appareil · Connexion par code d'accès uniquement</p>
      </div>
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
        {t:"1. Objet de l'application",p:"ALERTE CI est une application mobile destinée aux résidents de Côte d'Ivoire, offrant des services de sécurité personnelle en cas de violence ou de disparition. L'application est disponible sur iOS et Android."},
        {t:"2. Compte unique par appareil",p:"Chaque compte ALERTE CI est strictement lié à un seul appareil à la fois. Toute tentative de connexion simultanée sur deux appareils entraînera la déconnexion automatique du premier appareil."},
        {t:"3. Forfaits et abonnements",p:"L'application propose un mois d'essai gratuit à la création du compte, donnant accès à Alerte Violence et Alerte Enlèvement. Passé ce délai, un abonnement annuel est nécessaire pour continuer à y accéder (3 000 FCFA/an). Le paiement s'effectue via Mobile Money, Wave CI ou carte bancaire."},
        {t:"4. Utilisation responsable",p:"L'utilisateur s'engage à utiliser l'application de manière responsable. Tout abus, fausse alerte ou utilisation malveillante pourra entraîner la suspension du compte."},
        {t:"5. Données personnelles et protection de la vie privée",p:"ALERTE CI collecte uniquement les données nécessaires au fonctionnement du service : nom, numéro de téléphone (10 chiffres CI), commune, email (facultatif) et localisation GPS — cette dernière n'étant activée que lors d'un signalement d'urgence ou d'un partage de position volontaire (Alerte Enlèvement). Ces données sont conservées de façon sécurisée et ne sont jamais vendues à des tiers ni utilisées à des fins publicitaires. Elles sont partagées uniquement avec les contacts de confiance explicitement désignés par l'utilisateur. Conformément à la réglementation ivoirienne sur la protection des données à caractère personnel, l'utilisateur dispose à tout moment d'un droit d'accès, de rectification et de suppression de ses données, exerçable depuis Mon Profil ou auprès du support ALERTE CI. Les notes vocales et signalements expirent et sont supprimés automatiquement après 24 heures, sauf nécessité légale de conservation plus longue."},
        {t:"6. Modification des CGU",p:"ALERTE CI se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront notifiés par notification push en cas de modification substantielle."},
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
    {q:"Mes contacts doivent-ils avoir l'application ?",a:"Pour l'Alerte Violence et l'Alerte Enlèvement, vos contacts reçoivent une simple notification — ils n'ont pas besoin d'installer l'application."},
    {q:"Peut-on avoir 2 appareils connectés en même temps ?",a:"Non. ALERTE CI est limité à 1 appareil par compte. Si vous vous connectez sur un nouvel appareil, l'ancien sera automatiquement déconnecté."},
    {q:"L'essai gratuit, comment ça marche ?",a:"Dès la création de votre compte, vous bénéficiez d'un mois d'accès Premium gratuit à Alerte Violence et Alerte Enlèvement. Passé ce délai, un abonnement est nécessaire pour continuer à y accéder."},
    {q:"Comment payer l'abonnement annuel ?",a:"Le paiement s'effectue directement dans l'application via Mobile Money (Orange, MTN), Wave CI, Moov Money ou carte bancaire Visa/Mastercard. Forfait annuel : 3 000 FCFA/an."},
    {q:"Les numéros CI sont à combien de chiffres ?",a:"Les numéros ivoiriens sont à 10 chiffres (ex: 0700000000). L'application accepte uniquement les formats valides à 10 chiffres."},
    {q:"La localisation GPS est-elle toujours active ?",a:"Non. La localisation GPS n'est activée que lors d'une Alerte Violence ou d'un partage de position (Alerte Enlèvement)."},
    {q:"L'application fonctionne-t-elle sans connexion ?",a:"Certaines fonctionnalités nécessitent internet. L'alerte violence peut fonctionner en mode dégradé via SMS si configuré."},
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
                  <p style={{fontSize:12,color:C.muted,marginTop:2}}>Alerte Violence · Alerte Enlèvement · 3 000 FCFA/an</p>
                </div>
                {planActif==="premium"&&<span style={{fontSize:10,fontWeight:800,color:C.orange,background:C.orangeL,padding:"3px 8px",borderRadius:20}}>Actif</span>}
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
                  <p style={{fontSize:12,color:C.muted,marginTop:2}}>Alerte Violence et Alerte Enlèvement verrouillées · 0 FCFA</p>
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

/* ══════════════════════════════════════════════════════════════════════════════
   TABLEAU DE BORD ADMINISTRATEUR — gestion des utilisateurs
   Liste tous les comptes citoyens inscrits sur cet appareil et permet de
   bloquer/débloquer l'accès à l'application (un compte bloqué ne peut plus
   se reconnecter, cf. vérification dans Login). ── */
const AdminDashboard = ({go,goBack,comptesInscrits=[],basculerBlocageCompte}) => {
  const [recherche,setRecherche]=useState("");
  const comptes = comptesInscrits.filter(c=>{
    if(!recherche.trim()) return true;
    const q=recherche.trim().toLowerCase();
    return (c.nm||"").toLowerCase().includes(q) || (c.ph||"").includes(q);
  });
  const actifs = comptes.filter(c=>!c.bloque);
  const bloques = comptes.filter(c=>c.bloque);

  return (
    <div className="scr on" style={{display:"flex"}}>
      <div className="scrl">
        <div className="scrhdr">
          <button className="bk" onClick={goBack}><I n="back" s={18} c={C.ink}/></button>
          <p className="scrttl">Administration</p>
        </div>

        <div style={{padding:"0 20px 14px"}}>
          <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{comptesInscrits.length} compte{comptesInscrits.length>1?"s":""} utilisateur{comptesInscrits.length>1?"s":""} inscrit{comptesInscrits.length>1?"s":""} sur cet appareil.</p>
        </div>

        <div style={{padding:"0 20px 14px"}}>
          <div className="if" style={{marginBottom:0}}>
            <I n="user" s={16} c={C.faint}/>
            <input value={recherche} onChange={e=>setRecherche(e.target.value)} placeholder="Rechercher un nom ou un numéro..."/>
          </div>
        </div>

        <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
          {comptes.length===0&&(
            <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:18,padding:"28px 20px",textAlign:"center"}}>
              <p style={{fontSize:28,marginBottom:8}}>👥</p>
              <p style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>Aucun compte trouvé</p>
              <p style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Les nouvelles inscriptions apparaîtront ici automatiquement.</p>
            </div>
          )}

          {actifs.length>0&&comptes.length>0&&(
            <p style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".5px",marginTop:4}}>Comptes actifs ({actifs.length})</p>
          )}
          {actifs.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px"}}>
              <div style={{width:36,height:36,borderRadius:11,background:C.orangeL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <I n="user" s={17} c={C.orange}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:700,color:C.ink}}>{c.nm||"—"}</p>
                <p style={{fontSize:11,color:C.muted}}>{c.ph} · {c.commune||"commune non renseignée"} · {c.plan==="premium"?"Premium":"Gratuit"}</p>
              </div>
              <button onClick={()=>basculerBlocageCompte&&basculerBlocageCompte(c.id)}
                style={{fontSize:11,fontWeight:700,color:"#DC2626",background:"#FFF1F2",border:"none",borderRadius:9,padding:"7px 12px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",flexShrink:0}}>
                Bloquer
              </button>
            </div>
          ))}

          {bloques.length>0&&(
            <p style={{fontSize:11,fontWeight:700,color:"#DC2626",textTransform:"uppercase",letterSpacing:".5px",marginTop:8}}>Comptes bloqués ({bloques.length})</p>
          )}
          {bloques.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,background:"#FFF1F2",border:"1px solid rgba(220,38,38,.25)",borderRadius:14,padding:"12px 14px"}}>
              <div style={{width:36,height:36,borderRadius:11,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <I n="user" s={17} c="#DC2626"/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:700,color:C.ink}}>{c.nm||"—"}</p>
                <p style={{fontSize:11,color:"#9A3412"}}>{c.ph} · bloqué</p>
              </div>
              <button onClick={()=>basculerBlocageCompte&&basculerBlocageCompte(c.id)}
                style={{fontSize:11,fontWeight:700,color:C.green,background:C.greenL,border:"none",borderRadius:9,padding:"7px 12px",cursor:"pointer",fontFamily:"Plus Jakarta Sans",flexShrink:0}}>
                Débloquer
              </button>
            </div>
          ))}
        </div>
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

  const go=(s)=>{
    const roots=["splash","home"];
    if(roots.includes(s)){setHistory([s]);}
    else{setHistory(p=>[...p,s]);}
  };
  const goBack=()=>{
    setHistory(p=>{if(p.length<=1)return p;return p.slice(0,-1);});
  };

  /* ── ESSAI GRATUIT — 1 mois offert à la création du compte ──────────────
     Calculé à partir de creeLe (horodatage déjà posé sur chaque compte à
     l'inscription). Tant que l'essai est actif, l'accès Premium est
     accordé même si le forfait réel (plan) est resté "gratuit" — dès que
     l'essai expire, l'accès repasse automatiquement au forfait réel. ── */
  const DUREE_ESSAI_MS = 30*24*60*60*1000; // 30 jours
  const essaiInfo = (()=>{
    if(!userInfo.creeLe) return {actif:false, joursRestants:0};
    const ecoule = Date.now() - userInfo.creeLe;
    const restant = DUREE_ESSAI_MS - ecoule;
    if(restant<=0) return {actif:false, joursRestants:0};
    return {actif:true, joursRestants:Math.max(1,Math.ceil(restant/(24*60*60*1000)))};
  })();
  /* Le forfait EFFECTIF déterminant l'accès aux rubriques premium : un
     abonnement payant l'emporte toujours ; sinon, l'essai gratuit du
     premier mois donne un accès premium temporaire. ── */
  const planEffectif = plan==="premium" ? "premium" : (essaiInfo.actif ? "premium" : "gratuit");


  /* ── URGENCES CIBLÉES — Violence & Enlèvement, synchronisées toutes les
     3 secondes. Le téléphone du contact sonne et affiche l'écran d'urgence
     plein écran ; celui de la personne en danger, lui, ne signale jamais
     rien. Fonctionne en best-effort : hors connexion, l'app reste locale. ── */

  const [urgenceRecue,setUrgenceRecue]=useState(null);
  const urgencesSonneesRef=useRef(new Set());
  const arreteesLocalementRef=useRef(new Set()); // sirènes que CE contact a coupées
  const fermesDefRef=useRef(new Set());          // écrans d'alerte fermés définitivement ici
  const [histoPositions,setHistoPositions]=useState([]); // historique GPS reçu chez le contact

  useEffect(()=>{
    let actif=true;
    const synchroniser=async()=>{
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
    };
    synchroniser();
    const it=setInterval(synchroniser,3000);
    return ()=>{actif=false;clearInterval(it);};
  },[userInfo.ph]);

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
        if(der==="splash") return ["home"];
        return suivant;
      });
      try{ window.history.pushState({alerteci:true},""); }catch(e){}
    };
    window.addEventListener("popstate",onPop);
    return ()=>window.removeEventListener("popstate",onPop);
  },[userInfo.plan]);

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
     Chaque inscription est conservée ici avec son
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

  const onSignup=(info)=>{
    const compteComplet={...info, id:`acc-${Date.now()}`, creeLe:Date.now()};
    setComptesInscrits(prev=>[...prev, compteComplet]);
    setUserInfo(compteComplet);
    setPlan(info.plan);
    /* Inscription nationale : le compte est créé sur le serveur partagé. */
    cloudSignup(compteComplet).then((res)=>{
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
    setUserInfo({nm:"",ph:"",mail:"",commune:"",plan:"gratuit"});
    setPlan("gratuit");
    go("splash");
  };

  const onPaiementSuccess=()=>{
    setPlan("premium");
    setUserInfo(p=>({...p,plan:"premium"}));
    go("home");
  };

  const onAcces=()=>go("home");

  /* ── Blocage / déblocage d'un compte depuis le tableau de bord admin ────
     Bloque immédiatement l'accès : à la prochaine tentative de connexion
     ET à l'accès rapide (PIN) si la session est encore ouverte sur cet
     appareil. ── */
  const basculerBlocageCompte=(id)=>{
    setComptesInscrits(prev=>prev.map(c=>c.id===id?{...c,bloque:!c.bloque}:c));
  };

  const screens={
    splash:<Splash go={go} userInfo={userInfo} onAcces={onAcces} comptesInscrits={comptesInscrits} seDeconnecter={seDeconnecter}/>,
    login:<Login go={go} goBack={goBack} setPlan={setPlan} setUserInfo={setUserInfo} userInfo={userInfo} comptesInscrits={comptesInscrits}/>,
    admin:<AdminDashboard go={go} goBack={goBack} comptesInscrits={comptesInscrits} basculerBlocageCompte={basculerBlocageCompte}/>,
    home:<Home go={go} plan={planEffectif} userInfo={userInfo} essai={essaiInfo}/>,
    violence:<Violence go={go} goBack={goBack} userInfo={userInfo}/>,
    enlevement:<Enlevement go={go} goBack={goBack} userInfo={userInfo} partagesGps={partagesGps} demarrerPartageGps={demarrerPartageGps} arreterPartageGps={arreterPartageGps} majPositionGps={majPositionGps}/>,
    signup:<Signup go={go} goBack={goBack} onSignup={onSignup} userInfo={userInfo} comptesInscrits={comptesInscrits}/>,
    paiement:<Paiement go={go} goBack={goBack} onSuccess={onPaiementSuccess}/>,
    parametres:<Parametres go={go} goBack={goBack}/>,
    cgu:<Cgu go={go} goBack={goBack}/>,
    faq:<Faq go={go} goBack={goBack}/>,
    profil:<Profil go={go} goBack={goBack} userInfo={userInfo} setUserInfo={setUserInfo} plan={planEffectif} setPlan={setPlan} seDeconnecter={seDeconnecter}/>,
  };
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:CSS}}/>
      <div className="shell">
        <div className="sbar">
          <span><HeureLive/></span>
        </div>
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
        {screens[screen]}
      </div>
    </>
  );
}
