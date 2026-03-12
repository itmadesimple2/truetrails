import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const ADMIN_ID = "7c786021-d4f8-4ba1-924c-8eecc4f119ea";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Outfit:wght@300;400;500;600&display=swap');`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; }
body { font-family: 'Outfit', sans-serif; background: #0f0e0c; color: #f2ede4; min-height: 100vh; max-width: 430px; margin: 0 auto; position: relative; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
:root { --bg:#0f0e0c; --surface:#1a1916; --raised:#232119; --border:#2e2b24; --muted:#7a7568; --text:#f2ede4; --sub:#a09890; --terra:#d4622a; --terra2:#e8845a; --gold:#c9a84c; --sage:#7aab7d; --safe-top:env(safe-area-inset-top,44px); --safe-bot:env(safe-area-inset-bottom,20px); }
::-webkit-scrollbar { display:none; } * { scrollbar-width:none; }
.shell { display:flex; flex-direction:column; height:100dvh; overflow:hidden; }
.status-bar { height:var(--safe-top); background:var(--surface); flex-shrink:0; }
.topbar { background:var(--surface); padding:0.75rem 1.25rem 0.9rem; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; border-bottom:1px solid var(--border); }
.topbar-logo { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; letter-spacing:0.02em; color:var(--text); }
.topbar-logo span { color:var(--terra2); font-style:italic; }
.topbar-right { display:flex; gap:0.6rem; align-items:center; }
.icon-btn { width:36px; height:36px; border-radius:50%; background:var(--raised); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1rem; color:var(--sub); transition:background 0.15s; flex-shrink:0; }
.icon-btn:active { background:var(--terra); color:white; }
.scroll-area { flex:1; overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; }
.bottom-nav { background:var(--surface); border-top:1px solid var(--border); display:flex; padding-bottom:var(--safe-bot); flex-shrink:0; }
.nav-item { flex:1; display:flex; flex-direction:column; align-items:center; padding:0.65rem 0 0.5rem; cursor:pointer; gap:0.2rem; color:var(--muted); border:none; background:none; font-family:'Outfit',sans-serif; transition:color 0.15s; }
.nav-item.active { color:var(--terra2); }
.nav-icon { font-size:1.3rem; line-height:1; }
.nav-label { font-size:0.6rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; }
.hero-banner { background:linear-gradient(160deg,#1e1b14 0%,#2a1f13 50%,#1a1610 100%); padding:1.75rem 1.25rem 1.5rem; position:relative; overflow:hidden; }
.hero-banner::before { content:''; position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle,rgba(212,98,42,0.18) 0%,transparent 70%); pointer-events:none; }
.hero-eyebrow { font-size:0.62rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--terra2); font-weight:600; margin-bottom:0.6rem; }
.hero-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; line-height:1.15; color:var(--text); margin-bottom:0.6rem; }
.hero-title em { color:var(--terra2); font-style:italic; }
.hero-sub { font-size:0.8rem; color:var(--sub); line-height:1.65; margin-bottom:1.25rem; }
.trust-pills { display:flex; gap:0.5rem; flex-wrap:wrap; }
.trust-pill { font-size:0.62rem; padding:0.25rem 0.6rem; border:1px solid var(--border); border-radius:20px; color:var(--muted); letter-spacing:0.06em; font-weight:500; white-space:nowrap; }
.trust-pill.green { border-color:var(--sage); color:var(--sage); }
.search-wrap { padding:1rem 1.25rem 0.5rem; }
.search-box { background:var(--raised); border:1.5px solid var(--border); border-radius:12px; display:flex; align-items:center; padding:0 1rem; gap:0.6rem; }
.search-icon { color:var(--muted); font-size:0.9rem; flex-shrink:0; }
.search-input { flex:1; background:none; border:none; outline:none; font-family:'Outfit',sans-serif; font-size:0.9rem; color:var(--text); padding:0.75rem 0; }
.search-input::placeholder { color:var(--muted); }
.filter-scroll { display:flex; gap:0.5rem; padding:0.75rem 1.25rem; overflow-x:auto; }
.filter-pill { white-space:nowrap; padding:0.4rem 0.9rem; border-radius:20px; border:1.5px solid var(--border); background:var(--raised); color:var(--sub); font-family:'Outfit',sans-serif; font-size:0.75rem; font-weight:500; cursor:pointer; flex-shrink:0; transition:all 0.15s; }
.filter-pill.active { background:var(--terra); border-color:var(--terra); color:white; }
.section-label { padding:0.25rem 1.25rem 0.75rem; display:flex; align-items:baseline; justify-content:space-between; }
.section-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:600; color:var(--text); }
.section-count { font-size:0.72rem; color:var(--muted); }
.dest-list { padding:0 1.25rem 1.5rem; display:flex; flex-direction:column; gap:0.85rem; }
.dest-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; cursor:pointer; display:flex; transition:border-color 0.2s; }
.dest-card:active { border-color:var(--terra); transform:scale(0.985); }
.dest-emoji-col { width:80px; flex-shrink:0; background:var(--raised); display:flex; align-items:center; justify-content:center; font-size:2.2rem; }
.dest-body { padding:0.9rem; flex:1; min-width:0; }
.dest-region { font-size:0.6rem; text-transform:uppercase; letter-spacing:0.15em; color:var(--terra2); font-weight:600; margin-bottom:0.2rem; }
.dest-name { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:var(--text); margin-bottom:0.3rem; line-height:1.2; }
.dest-meta { display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; }
.stars { color:var(--gold); font-size:0.75rem; letter-spacing:0.03em; }
.review-ct { font-size:0.7rem; color:var(--muted); }
.dest-snippet { font-size:0.75rem; color:var(--sub); line-height:1.55; }
.dest-tags { display:flex; gap:0.3rem; flex-wrap:wrap; margin-top:0.5rem; }
.tag { font-size:0.58rem; padding:0.15rem 0.45rem; background:var(--raised); border-radius:4px; color:var(--muted); letter-spacing:0.06em; text-transform:uppercase; font-weight:500; }
.detail-topbar { background:var(--surface); padding:0.75rem 1.25rem; display:flex; align-items:center; gap:0.75rem; border-bottom:1px solid var(--border); flex-shrink:0; }
.back-btn { background:var(--raised); border:1px solid var(--border); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text); font-size:1rem; flex-shrink:0; }
.back-btn:active { background:var(--terra); border-color:var(--terra); }
.detail-topbar-title { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.detail-hero { background:linear-gradient(160deg,#211d14,#2e2318); padding:1.5rem 1.25rem 1.25rem; border-bottom:1px solid var(--border); }
.detail-region { font-size:0.62rem; text-transform:uppercase; letter-spacing:0.18em; color:var(--terra2); font-weight:600; margin-bottom:0.3rem; }
.detail-title { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:700; color:var(--text); line-height:1.1; margin-bottom:0.75rem; }
.detail-stats { display:flex; gap:1.25rem; align-items:center; }
.stat-item { display:flex; flex-direction:column; gap:0.15rem; }
.stat-value { font-size:1.2rem; font-weight:700; color:var(--text); }
.stat-label { font-size:0.62rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.08em; }
.stat-stars { color:var(--gold); font-size:0.9rem; }
.ai-box { margin:1rem 1.25rem; background:var(--raised); border:1px solid var(--border); border-left:3px solid var(--terra); border-radius:12px; padding:1rem 1.1rem; }
.ai-label { font-size:0.58rem; text-transform:uppercase; letter-spacing:0.2em; color:var(--terra2); font-weight:700; margin-bottom:0.6rem; }
.ai-text { font-size:0.82rem; color:var(--sub); line-height:1.75; }
.ai-gen-btn { width:100%; background:var(--terra); color:white; border:none; border-radius:8px; padding:0.65rem; font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:600; cursor:pointer; margin-top:0.5rem; }
.ai-gen-btn:active { background:var(--terra2); }
.dot-row { display:flex; gap:4px; align-items:center; }
.dot-row span { width:5px; height:5px; background:var(--terra2); border-radius:50%; animation:dp 1.2s infinite; }
.dot-row span:nth-child(2) { animation-delay:0.2s; }
.dot-row span:nth-child(3) { animation-delay:0.4s; }
@keyframes dp { 0%,80%,100%{opacity:0.2;transform:scale(0.7)}40%{opacity:1;transform:scale(1)} }
.rfil-wrap { padding:0.25rem 1.25rem 0.75rem; border-bottom:1px solid var(--border); }
.rfil-row { display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:0.1rem; }
.reviews-wrap { padding:1rem 1.25rem 6rem; display:flex; flex-direction:column; gap:0.85rem; }
.review-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.1rem; }
.rc-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; }
.rc-left { display:flex; gap:0.65rem; align-items:center; }
.avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:700; color:white; flex-shrink:0; }
.rc-name { font-size:0.88rem; font-weight:600; color:var(--text); margin-bottom:0.15rem; }
.rc-meta { font-size:0.68rem; color:var(--muted); display:flex; gap:0.3rem; flex-wrap:wrap; }
.rc-right { text-align:right; }
.rc-stars { color:var(--gold); font-size:0.85rem; }
.rc-date { font-size:0.65rem; color:var(--muted); margin-top:0.15rem; }
.rc-title { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; color:var(--text); margin-bottom:0.5rem; line-height:1.3; }
.rc-body { font-size:0.8rem; color:var(--sub); line-height:1.7; }
.rc-footer { display:flex; gap:0.5rem; align-items:center; margin-top:0.75rem; flex-wrap:wrap; }
.verified-badge { font-size:0.62rem; color:var(--sage); font-weight:600; letter-spacing:0.07em; text-transform:uppercase; display:flex; align-items:center; gap:0.3rem; }
.v-dot { width:5px; height:5px; background:var(--sage); border-radius:50%; }
.style-badge { font-size:0.6rem; padding:0.15rem 0.45rem; background:var(--raised); border-radius:4px; color:var(--muted); text-transform:uppercase; letter-spacing:0.07em; font-weight:600; }
.yt-link { font-size:0.72rem; color:var(--terra2); font-weight:600; text-decoration:none; display:flex; align-items:center; gap:0.25rem; margin-top:0.5rem; }
.sheet-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:300; display:flex; flex-direction:column; justify-content:flex-end; backdrop-filter:blur(4px); }
.sheet { background:var(--surface); border-radius:20px 20px 0 0; border-top:1px solid var(--border); max-height:92dvh; overflow-y:auto; padding:0 1.25rem 2rem; -webkit-overflow-scrolling:touch; }
.sheet-handle { width:40px; height:4px; background:var(--border); border-radius:2px; margin:0.9rem auto 1.25rem; }
.sheet-title { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700; color:var(--text); margin-bottom:0.25rem; }
.sheet-sub { font-size:0.78rem; color:var(--muted); line-height:1.6; margin-bottom:1.5rem; }
.form-label { display:block; font-size:0.65rem; text-transform:uppercase; letter-spacing:0.12em; font-weight:600; color:var(--sub); margin-bottom:0.4rem; }
.form-group { margin-bottom:1.1rem; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
.form-input,.form-select,.form-textarea { width:100%; padding:0.7rem 0.9rem; background:var(--raised); border:1.5px solid var(--border); border-radius:10px; font-family:'Outfit',sans-serif; font-size:0.88rem; color:var(--text); outline:none; transition:border-color 0.2s; -webkit-appearance:none; }
.form-input:focus,.form-select:focus,.form-textarea:focus { border-color:var(--terra); }
.form-select { background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7568' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 0.9rem center; padding-right:2.2rem; }
.form-textarea { resize:none; min-height:110px; }
.star-row { display:flex; gap:0.5rem; }
.star-tap { font-size:1.8rem; background:none; border:none; cursor:pointer; color:var(--border); padding:0; line-height:1; transition:color 0.1s,transform 0.1s; }
.star-tap.lit { color:var(--gold); }
.star-tap:active { transform:scale(1.2); }
.submit-btn { width:100%; background:var(--terra); color:white; border:none; border-radius:12px; padding:0.95rem; font-family:'Outfit',sans-serif; font-size:0.95rem; font-weight:600; cursor:pointer; margin-top:0.75rem; letter-spacing:0.02em; transition:background 0.2s; }
.submit-btn:active { background:var(--terra2); }
.submit-btn:disabled { opacity:0.4; cursor:not-allowed; }
.fab { position:fixed; bottom:calc(70px + var(--safe-bot) + 1rem); right:1.25rem; width:52px; height:52px; background:var(--terra); border:none; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.4rem; color:white; cursor:pointer; box-shadow:0 4px 20px rgba(212,98,42,0.45); z-index:100; transition:transform 0.15s; }
.fab:active { transform:scale(0.92); }
.toast { position:fixed; bottom:calc(80px + var(--safe-bot)); left:1.25rem; right:1.25rem; background:var(--sage); color:white; border-radius:12px; padding:0.85rem 1.1rem; font-size:0.83rem; font-weight:500; display:flex; align-items:center; gap:0.6rem; z-index:500; animation:toastIn 0.3s ease; }
@keyframes toastIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
.empty { text-align:center; padding:3rem 1.5rem; color:var(--muted); }
.empty-icon { font-size:2.5rem; opacity:0.4; margin-bottom:0.75rem; }
.empty-text { font-size:0.83rem; line-height:1.6; }
.loading-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem; gap:1rem; color:var(--muted); font-size:0.82rem; }
.profile-wrap { padding:1.5rem 1.25rem 6rem; }
.profile-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:1.5rem; margin-bottom:1.25rem; }
.profile-top { display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem; padding-bottom:1.25rem; border-bottom:1px solid var(--border); }
.profile-avatar { width:58px; height:58px; background:var(--terra); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700; color:white; flex-shrink:0; }
.profile-name { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:var(--text); }
.profile-sub { font-size:0.75rem; color:var(--muted); margin-top:0.2rem; }
.info-row { display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border); }
.info-row:last-child { border-bottom:none; }
.info-key { font-size:0.72rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--muted); font-weight:600; }
.info-val { font-size:0.85rem; color:var(--sub); font-weight:500; }
.section-head { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:var(--text); margin-bottom:0.75rem; }
.no-sponsorship-badge { background:linear-gradient(135deg,var(--raised),#1f1c13); border:1px solid var(--terra); border-radius:12px; padding:1rem 1.1rem; display:flex; gap:0.75rem; align-items:flex-start; margin-bottom:1.5rem; }
.nsb-icon { font-size:1.4rem; flex-shrink:0; }
.nsb-title { font-size:0.82rem; font-weight:600; color:var(--terra2); margin-bottom:0.2rem; }
.nsb-text { font-size:0.75rem; color:var(--muted); line-height:1.6; }
.slide-up { animation:slideUp 0.28s cubic-bezier(0.22,1,0.36,1) both; }
@keyframes slideUp { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
.dest-hero-img { width:80px; flex-shrink:0; object-fit:cover; height:100%; min-height:90px; }
.dest-hero-placeholder { width:80px; flex-shrink:0; min-height:90px; display:flex; align-items:center; justify-content:center; font-size:2.2rem; background:var(--raised); }
.detail-hero-img { width:100%; height:180px; object-fit:cover; display:block; }
.detail-hero-img-wrap { position:relative; }
.suggest-photo-btn { position:absolute; bottom:0.6rem; right:0.6rem; background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:0.35rem 0.65rem; font-size:0.68rem; color:white; font-family:'Outfit',sans-serif; font-weight:600; cursor:pointer; backdrop-filter:blur(4px); }
.suggest-tab-row { display:flex; gap:0; margin-bottom:1.25rem; border:1.5px solid var(--border); border-radius:10px; overflow:hidden; }
.suggest-tab { flex:1; padding:0.6rem; background:var(--raised); border:none; font-family:'Outfit',sans-serif; font-size:0.78rem; font-weight:600; color:var(--muted); cursor:pointer; }
.suggest-tab.active { background:var(--terra); color:white; }
.suggest-pending { background:var(--raised); border:1px solid var(--border); border-radius:10px; padding:0.75rem 1rem; margin-top:0.5rem; }
.suggest-pending-title { font-size:0.8rem; font-weight:600; color:var(--text); margin-bottom:0.2rem; }
.suggest-pending-meta { font-size:0.68rem; color:var(--muted); }
.suggest-btn { display:flex; align-items:center; gap:0.5rem; background:var(--raised); border:1.5px solid var(--border); border-radius:10px; padding:0.6rem 1rem; font-family:'Outfit',sans-serif; font-size:0.78rem; font-weight:600; color:var(--sub); cursor:pointer; margin:0 1.25rem 0.75rem; width:calc(100% - 2.5rem); }
.suggest-btn:active { border-color:var(--terra); color:var(--terra); }
.admin-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; margin-bottom:0.85rem; }
.admin-card-img { width:100%; height:140px; object-fit:cover; display:block; }
.admin-card-img-placeholder { width:100%; height:80px; background:var(--raised); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:0.78rem; }
.admin-card-body { padding:0.85rem; }
.admin-card-title { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; color:var(--text); margin-bottom:0.25rem; }
.admin-card-meta { font-size:0.68rem; color:var(--muted); margin-bottom:0.6rem; }
.admin-card-desc { font-size:0.75rem; color:var(--sub); line-height:1.6; margin-bottom:0.75rem; }
.admin-btn-row { display:flex; gap:0.5rem; }
.admin-btn { flex:1; padding:0.55rem; border-radius:8px; border:none; font-family:'Outfit',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; }
.admin-btn.approve { background:var(--sage); color:white; }
.admin-btn.reject { background:var(--raised); border:1px solid var(--border); color:var(--muted); }
.admin-section-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:var(--text); margin:1.25rem 0 0.75rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border); }
.admin-empty { font-size:0.78rem; color:var(--muted); text-align:center; padding:1.5rem; }
.admin-badge { display:inline-block; font-size:0.6rem; padding:0.15rem 0.45rem; border-radius:4px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; margin-left:0.5rem; }
.admin-badge.photo { background:rgba(122,171,125,0.2); color:var(--sage); }
.admin-badge.destination { background:rgba(201,168,76,0.2); color:var(--gold); }
.admin-badge.experience { background:rgba(232,132,90,0.2); color:var(--terra2); }
.carousel-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:600; display:flex; flex-direction:column; }
.carousel-topbar { display:flex; align-items:center; justify-content:space-between; padding:calc(var(--safe-top) + 0.75rem) 1.25rem 0.75rem; flex-shrink:0; }
.carousel-counter { font-size:0.8rem; color:rgba(255,255,255,0.6); font-weight:500; }
.carousel-close { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.1); border:none; color:white; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.carousel-img-wrap { flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; }
.carousel-img { max-width:100%; max-height:100%; object-fit:contain; user-select:none; }
.carousel-nav { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.15); border:none; color:white; width:44px; height:44px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
.carousel-nav.prev { left:1rem; }
.carousel-nav.next { right:1rem; }
.carousel-info { padding:1rem 1.25rem calc(var(--safe-bot) + 1rem); flex-shrink:0; }
.carousel-name { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:white; margin-bottom:0.25rem; }
.carousel-meta { font-size:0.75rem; color:rgba(255,255,255,0.5); margin-bottom:0.5rem; }
.carousel-caption { font-size:0.82rem; color:rgba(255,255,255,0.75); line-height:1.65; }
.carousel-dots { display:flex; gap:0.4rem; justify-content:center; padding:0.75rem 0 0; }
.carousel-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.3); transition:background 0.2s; }
.carousel-dot.active { background:var(--terra2); }
.review-photo-strip { display:flex; gap:0.5rem; margin-top:0.75rem; overflow-x:auto; }
.review-photo-thumb { width:72px; height:72px; border-radius:8px; object-fit:cover; flex-shrink:0; cursor:pointer; border:2px solid transparent; transition:border-color 0.15s; }
.review-photo-thumb:active { border-color:var(--terra2); }
.error-msg { margin:1rem 1.25rem; background:#3a1a1a; border:1px solid #6a2a2a; border-radius:10px; padding:0.85rem; font-size:0.8rem; color:#f08080; }
.auth-overlay { position:fixed; inset:0; background:var(--bg); z-index:700; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem 1.5rem; }
.auth-logo { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; color:var(--text); margin-bottom:0.35rem; }
.auth-logo span { color:var(--terra2); font-style:italic; }
.auth-tagline { font-size:0.78rem; color:var(--muted); margin-bottom:2.5rem; text-align:center; line-height:1.6; }
.auth-card { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:1.75rem 1.5rem; width:100%; max-width:360px; }
.auth-title { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700; color:var(--text); margin-bottom:0.25rem; }
.auth-sub { font-size:0.78rem; color:var(--muted); margin-bottom:1.5rem; line-height:1.6; }
.auth-divider { display:flex; align-items:center; gap:0.75rem; margin:1.25rem 0; }
.auth-divider-line { flex:1; height:1px; background:var(--border); }
.auth-divider-text { font-size:0.68rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.1em; }
.social-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:0.65rem; padding:0.8rem; border-radius:12px; border:1.5px solid var(--border); background:var(--raised); color:var(--text); font-family:'Outfit',sans-serif; font-size:0.88rem; font-weight:500; cursor:pointer; margin-bottom:0.65rem; transition:border-color 0.15s; }
.social-btn:active { border-color:var(--terra); }
.social-icon { font-size:1.1rem; }
.auth-switch { text-align:center; margin-top:1.25rem; font-size:0.78rem; color:var(--muted); }
.auth-switch-btn { color:var(--terra2); background:none; border:none; font-family:'Outfit',sans-serif; font-size:0.78rem; font-weight:600; cursor:pointer; padding:0; }
.auth-error { background:#3a1a1a; border:1px solid #6a2a2a; border-radius:8px; padding:0.65rem 0.85rem; font-size:0.75rem; color:#f08080; margin-bottom:1rem; }
.auth-success { background:#1a3a1f; border:1px solid #2a6a30; border-radius:8px; padding:0.65rem 0.85rem; font-size:0.75rem; color:#7adb84; margin-bottom:1rem; }
.guest-btn { width:100%; background:none; border:none; color:var(--muted); font-family:'Outfit',sans-serif; font-size:0.78rem; cursor:pointer; padding:1rem 0 0; text-decoration:underline; }
.sign-out-btn { width:100%; background:var(--raised); border:1px solid var(--border); border-radius:12px; padding:0.75rem; font-family:'Outfit',sans-serif; font-size:0.85rem; font-weight:500; color:var(--muted); cursor:pointer; margin-top:1rem; }
.sign-out-btn:active { border-color:var(--terra); color:var(--terra); }
.username-input-wrap { position:relative; }
.username-prefix { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:var(--muted); font-size:0.88rem; pointer-events:none; }
.username-input { padding-left:1.5rem !important; }
.username-status { font-size:0.7rem; margin-top:0.3rem; font-weight:600; }
.username-status.ok { color:var(--sage); }
.username-status.err { color:var(--terra2); }
.username-status.checking { color:var(--muted); }
.username-setup-overlay { position:fixed; inset:0; background:var(--bg); z-index:800; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem 1.5rem; }
.profile-avatar-wrap { position:relative; width:80px; height:80px; flex-shrink:0; }
.profile-avatar-img { width:80px; height:80px; border-radius:50%; object-fit:cover; border:2px solid var(--border); }
.profile-avatar-edit { position:absolute; bottom:0; right:0; width:26px; height:26px; border-radius:50%; background:var(--terra); border:2px solid var(--surface); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:0.7rem; }
.review-avatar-img { width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid var(--border); flex-shrink:0; }
.auth-required { background:var(--raised); border:1px solid var(--border); border-radius:16px; margin:1.5rem 1.25rem; padding:1.5rem; text-align:center; }
.auth-required-icon { font-size:2rem; margin-bottom:0.75rem; }
.auth-required-title { font-family:'Cormorant Garamond',serif; font-size:1.1rem; font-weight:600; color:var(--text); margin-bottom:0.4rem; }
.auth-required-text { font-size:0.78rem; color:var(--muted); line-height:1.6; margin-bottom:1.25rem; }
.auth-required-btn { display:inline-block; background:var(--terra); color:white; border:none; border-radius:10px; padding:0.65rem 1.5rem; font-family:'Outfit',sans-serif; font-size:0.85rem; font-weight:600; cursor:pointer; }
`;

const AGE_OPTS   = ["All ages","Under 35","35–49","50–54","55–64","65+"];
const NAT_OPTS   = ["All origins","Australian","New Zealander","British","American","Canadian","German","French","Other"];
const STYLE_OPTS = ["All styles","Solo","Couple","Family","Group"];
const AVATAR_COLORS = ["#d4622a","#7aab7d","#c9a84c","#5e7fa8","#8c6e8c"];

function avatarColor(i) { return AVATAR_COLORS[i.charCodeAt(0) % AVATAR_COLORS.length]; }
function Stars({ n, size="0.85rem" }) {
  return <span style={{color:"#c9a84c",fontSize:size,letterSpacing:"0.03em"}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-AU",{month:"short",year:"numeric"});
}

/* ── AI SUMMARY ── */
function AISummary({ location, reviews, ageFilter, natFilter }) {
  const [state, setState] = useState("idle");
  const [text, setText]   = useState("");
  const generate = async () => {
    setState("loading");
    const fd = [ageFilter!=="All ages"?`aged ${ageFilter}`:null, natFilter!=="All origins"?`from ${natFilter}`:null].filter(Boolean).join(", ");
    const ex = reviews.slice(0,6).map(r=>`[${r.nationality}, ${r.age}, ${r.travel_style}] ${r.title}: ${r.body}`).join("\n\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a no-sponsored-content travel advisor. Based on these verified traveller reviews of "${location.name}"${fd?` from reviewers ${fd}`:""}, write a 3-sentence honest summary: what they loved, honest warnings, and one insider tip. Be specific.\n\n${ex}`}]})});
      const data = await res.json();
      setText(data.content?.find(b=>b.type==="text")?.text||"Unable to generate.");
      setState("done");
    } catch { setText("Could not connect. Please try again."); setState("done"); }
  };
  return (
    <div className="ai-box">
      <div className="ai-label">◆ AI Honest Summary</div>
      {state==="idle" && <><div className="ai-text" style={{opacity:0.6,marginBottom:"0.5rem"}}>Synthesise what reviewers honestly say — no marketing language.</div><button className="ai-gen-btn" onClick={generate}>Generate Summary</button></>}
      {state==="loading" && <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}><div className="dot-row"><span/><span/><span/></div><span style={{fontSize:"0.78rem",color:"var(--muted)"}}>Analysing…</span></div>}
      {state==="done" && <><div className="ai-text">{text}</div><button onClick={generate} style={{marginTop:"0.75rem",background:"none",border:"1px solid var(--border)",color:"var(--muted)",padding:"0.4rem 0.8rem",fontSize:"0.7rem",cursor:"pointer",borderRadius:"6px",fontFamily:"'Outfit',sans-serif"}}>↺ Regenerate</button></>}
    </div>
  );
}

/* ── SUGGEST SHEET ── */
function SuggestSheet({ location, user, onClose }) {
  const [type, setType] = useState("experience"); // experience | destination
  const [form, setForm] = useState({ title:"", description:"", region:"", tags:"" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.title.length>2 && form.description.length>20 && (type==="experience" || form.region.length>2);

  const submit = async () => {
    setSaving(true); setError(null);
    const { data:profile } = await supabase.from("profiles").select("username,display_name").eq("id",user.id).single();
    const username = profile?.username ? "@"+profile.username : profile?.display_name || user.email;
    const payload = {
      user_id: user.id,
      username,
      type,
      location_id: type==="experience" ? location.id : null,
      location_name: type==="experience" ? location.name : form.title,
      region: form.region || location.region,
      title: form.title,
      description: form.description,
      tags: form.tags ? form.tags.split(",").map(t=>t.trim()).filter(Boolean) : [],
      status: "pending"
    };
    const { error } = await supabase.from("suggestions").insert([payload]);
    setSaving(false);
    if (error) setError(error.message);
    else setDone(true);
  };

  if (done) return (
    <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet" style={{textAlign:"center",padding:"2rem 1.25rem"}}>
        <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🙌</div>
        <div className="sheet-title">Thanks for the suggestion!</div>
        <div className="sheet-sub">Our team will review it and add it to TrueTrails if approved. We'll let you know.</div>
        <button className="submit-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );

  return (
    <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.9rem 0 0.5rem"}}>
          <div style={{width:"40px",height:"4px",background:"var(--border)",borderRadius:"2px",margin:"0 auto"}}/>
          <button onClick={onClose} style={{background:"var(--raised)",border:"1px solid var(--border)",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--muted)",fontSize:"0.9rem",flexShrink:0,position:"absolute",right:"1.25rem"}}>✕</button>
        </div>
        <div className="sheet-title">Suggest Something</div>
        <div className="sheet-sub">Help grow TrueTrails with destinations and experiences the community will love.</div>
        <div className="suggest-tab-row">
          <button className={`suggest-tab ${type==="experience"?"active":""}`} onClick={()=>setType("experience")}>✨ Experience at {location.name}</button>
          <button className={`suggest-tab ${type==="destination"?"active":""}`} onClick={()=>setType("destination")}>🗺️ New Destination</button>
        </div>
        {type==="experience" ? (
          <>
            <div className="form-group"><label className="form-label">Experience Name</label><input className="form-input" placeholder="e.g. Sunrise hike to Mueller Hut" value={form.title} onChange={e=>set("title",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe the experience — what makes it special, best time to do it, tips for travellers your age…" value={form.description} onChange={e=>set("description",e.target.value)} rows={4}/></div>
            <div className="form-group"><label className="form-label">Tags <span style={{color:"var(--muted)",fontWeight:400}}>(comma separated)</span></label><input className="form-input" placeholder="e.g. Hiking, Sunrise, Moderate difficulty" value={form.tags} onChange={e=>set("tags",e.target.value)}/></div>
          </>
        ) : (
          <>
            <div className="form-group"><label className="form-label">Destination Name</label><input className="form-input" placeholder="e.g. Fiordland National Park" value={form.title} onChange={e=>set("title",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Region / Country</label><input className="form-input" placeholder="e.g. South Island, NZ" value={form.region} onChange={e=>set("region",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Why it belongs on TrueTrails</label><textarea className="form-textarea" placeholder="What makes this destination special for travellers 50+? What should people know before they go?" value={form.description} onChange={e=>set("description",e.target.value)} rows={4}/></div>
            <div className="form-group"><label className="form-label">Tags <span style={{color:"var(--muted)",fontWeight:400}}>(comma separated)</span></label><input className="form-input" placeholder="e.g. Nature, Hiking, Wildlife" value={form.tags} onChange={e=>set("tags",e.target.value)}/></div>
          </>
        )}
        {error && <div className="auth-error">⚠️ {error}</div>}
        <button className="submit-btn" onClick={submit} disabled={!valid||saving}>{saving?"Submitting…":"Submit Suggestion"}</button>
      </div>
    </div>
  );
}

/* ── PHOTO SUGGEST SHEET ── */
function PhotoSuggestSheet({ location, user, onClose }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!imageFile) return;
    setSaving(true); setError(null);
    const { data:profile } = await supabase.from("profiles").select("username,display_name").eq("id",user.id).single();
    const username = profile?.username ? "@"+profile.username : profile?.display_name || user.email;
    const ext = imageFile.name.split(".").pop();
    const path = `location-photos/${location.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("review-images").upload(path, imageFile, { contentType: imageFile.type });
    if (upErr) { setError(upErr.message); setSaving(false); return; }
    const { data: urlData } = supabase.storage.from("review-images").getPublicUrl(path);
    const { error: dbErr } = await supabase.from("location_photos").insert([{
      location_id: location.id, user_id: user.id, username, photo_url: urlData.publicUrl, status: "pending"
    }]);
    setSaving(false);
    if (dbErr) setError(dbErr.message);
    else setDone(true);
  };

  if (done) return (
    <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet" style={{textAlign:"center",padding:"2rem 1.25rem"}}>
        <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📸</div>
        <div className="sheet-title">Photo submitted!</div>
        <div className="sheet-sub">Thanks! Our team will review your photo and use it as the hero image for {location.name} if it's a great fit.</div>
        <button className="submit-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );

  return (
    <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.9rem 0 0.5rem"}}>
          <div style={{width:"40px",height:"4px",background:"var(--border)",borderRadius:"2px",margin:"0 auto"}}/>
          <button onClick={onClose} style={{background:"var(--raised)",border:"1px solid var(--border)",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--muted)",fontSize:"0.9rem",flexShrink:0,position:"absolute",right:"1.25rem"}}>✕</button>
        </div>
        <div className="sheet-title">Suggest a Photo</div>
        <div className="sheet-sub">Upload your best shot of <strong style={{color:"var(--terra2)"}}>{location.name}</strong>. If selected, it'll become the hero image for this destination.</div>
        <div className="form-group">
          <input type="file" accept="image/*" id="loc-photo-upload" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){setImageFile(f);setImagePreview(URL.createObjectURL(f))}}}/>
          <label htmlFor="loc-photo-upload" style={{display:"block",cursor:"pointer",borderRadius:"12px",overflow:"hidden",border:"2px dashed var(--border)"}}>
            {imagePreview
              ? <img src={imagePreview} style={{width:"100%",maxHeight:"220px",objectFit:"cover",display:"block"}}/>
              : <div style={{padding:"2.5rem",textAlign:"center",color:"var(--muted)",fontSize:"0.82rem"}}>📷 Tap to choose your best photo of {location.name}</div>
            }
          </label>
          {imagePreview && <div style={{fontSize:"0.68rem",color:"var(--muted)",marginTop:"0.4rem",textAlign:"center"}}>Looks great! Tap Submit to send for review.</div>}
        </div>
        {error && <div className="auth-error">⚠️ {error}</div>}
        <button className="submit-btn" onClick={submit} disabled={!imageFile||saving}>{saving?"Uploading…":"Submit Photo"}</button>
      </div>
    </div>
  );
}

/* ── IMAGE CAROUSEL ── */
function ImageCarousel({ images, startIndex=0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const cur = images[idx];
  const prev = () => setIdx(i => (i-1+images.length)%images.length);
  const next = () => setIdx(i => (i+1)%images.length);

  // Swipe support
  const touchStart = useRef(null);
  const onTouchStart = e => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  return (
    <div className="carousel-overlay" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="carousel-topbar">
        <div className="carousel-counter">{idx+1} / {images.length}</div>
        <button className="carousel-close" onClick={onClose}>✕</button>
      </div>
      <div className="carousel-img-wrap">
        <img key={idx} className="carousel-img" src={cur.image_url} alt={cur.title}/>
        {images.length > 1 && <>
          <button className="carousel-nav prev" onClick={prev}>‹</button>
          <button className="carousel-nav next" onClick={next}>›</button>
        </>}
      </div>
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_,i) => <div key={i} className={`carousel-dot ${i===idx?"active":""}`} onClick={()=>setIdx(i)}/>)}
        </div>
      )}
      <div className="carousel-info">
        <div className="carousel-name">{cur.name}</div>
        <div className="carousel-meta">{cur.nationality} · {cur.age} · {cur.travel_style}</div>
        <div className="carousel-caption">{cur.title}</div>
      </div>
    </div>
  );
}

/* ── REVIEW SHEET ── */
function ReviewSheet({ location, onClose, onSubmit, user }) {
  const [profileData, setProfileData] = useState(null);
  const [form, setForm] = useState({name:"",age:"",nationality:"",travelStyle:"Couple",rating:0,title:"",body:"",youtube:"",imageUrl:"",avatarUrl:""});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageMode, setImageMode] = useState("upload");
  const [hover, setHover] = useState(0);
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const [submitError, setSubmitError] = useState(null);

  // Load profile and pre-fill form
  useEffect(()=>{
    if (!user) return;
    (async()=>{
      const {data} = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfileData(data);
        const displayName = data.username ? "@"+data.username : data.display_name || "";
        setForm(f=>({...f,
          name: displayName || f.name,
          age: data.age || f.age,
          nationality: data.nationality || f.nationality,
          travelStyle: data.travel_style || f.travelStyle,
          avatarUrl: data.avatar_url || "",
        }));
      }
    })();
  },[user?.id]);

  const profileComplete = profileData && profileData.age && profileData.nationality && (profileData.username || profileData.display_name);
  const valid = form.name && form.age && form.nationality && form.rating>0 && form.title && form.body.length>30;
  const submit = async () => {
    if (!valid) return;
    setSaving(true);
    setSubmitError(null);
    const initials = form.name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    let finalImageUrl = form.imageUrl || null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("review-images").upload(path, imageFile, { contentType: imageFile.type });
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("review-images").getPublicUrl(path);
        finalImageUrl = urlData.publicUrl;
      }
    }
    const payload = {location_id:location.id,name:form.name,initials,age:form.age,nationality:form.nationality,travel_style:form.travelStyle,rating:form.rating,title:form.title,body:form.body,youtube:form.youtube||null,image_url:finalImageUrl,avatar_url:form.avatarUrl||null,verified:false};
    const result = await supabase.from("reviews").insert([payload]);
    setSaving(false);
    if (!result.error) {
      onSubmit();
      onClose();
    } else {
      setSubmitError(result.error?.message || result.error?.code || JSON.stringify(result.error) || "Unknown error");
    }
  };
  return (
    <div className="sheet-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.9rem 0 0.5rem"}}>
          <div style={{width:"40px",height:"4px",background:"var(--border)",borderRadius:"2px",margin:"0 auto"}}/>
          <button onClick={onClose} style={{background:"var(--raised)",border:"1px solid var(--border)",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--muted)",fontSize:"0.9rem",flexShrink:0,position:"absolute",right:"1.25rem"}}>✕</button>
        </div>
        <div className="sheet-title">Write a Review</div>
        <div className="sheet-sub">Reviewing <strong style={{color:"var(--terra2)"}}>{location.name}</strong> — honest experiences only.</div>
        {profileComplete ? (
          <div style={{background:"var(--raised)",border:"1px solid var(--border)",borderRadius:"12px",padding:"0.75rem 1rem",marginBottom:"0.5rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
            {form.avatarUrl
              ? <img src={form.avatarUrl} style={{width:"36px",height:"36px",borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid var(--border)"}} onError={e=>e.target.style.display="none"}/>
              : <div className="avatar" style={{background:"var(--terra)",width:"36px",height:"36px",fontSize:"0.8rem",flexShrink:0}}>{form.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
            }
            <div>
              <div style={{fontSize:"0.85rem",fontWeight:600,color:"var(--text)"}}>{form.name}</div>
              <div style={{fontSize:"0.72rem",color:"var(--muted)"}}>{form.age} · {form.nationality}</div>
            </div>
          </div>
        ) : (
          <div className="form-row">
            <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="e.g. Margaret T." value={form.name} onChange={e=>set("name",e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Age Group</label><select className="form-select" value={form.age} onChange={e=>set("age",e.target.value)}><option value="">Select…</option>{["Under 35","35–49","50–54","55–64","65+"].map(a=><option key={a}>{a}</option>)}</select></div>
          </div>
        )}
        {!profileComplete && (
          <div className="form-group"><label className="form-label">Nationality</label><select className="form-select" value={form.nationality} onChange={e=>set("nationality",e.target.value)}><option value="">Select…</option>{NAT_OPTS.slice(1).map(n=><option key={n}>{n}</option>)}</select></div>
        )}
        <div className="form-group"><label className="form-label">Travel Style</label><select className="form-select" value={form.travelStyle} onChange={e=>set("travelStyle",e.target.value)}>{STYLE_OPTS.slice(1).map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Your Rating</label><div className="star-row">{[1,2,3,4,5].map(n=><button key={n} className={`star-tap ${n<=(hover||form.rating)?"lit":""}`} onClick={()=>set("rating",n)} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)}>★</button>)}</div></div>
        <div className="form-group"><label className="form-label">Review Title</label><input className="form-input" placeholder="Sum up your honest experience" value={form.title} onChange={e=>set("title",e.target.value)}/></div>
        <div className="form-group"><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"0.4rem"}}><label className="form-label" style={{marginBottom:0}}>Your Review</label><span style={{fontSize:"0.65rem",color:form.body.length>=30?"var(--sage)":"var(--terra2)",fontWeight:600}}>{form.body.length>=30?"✓ Good length":`${30-form.body.length} more chars needed`}</span></div><textarea className="form-textarea" placeholder="Share what you genuinely experienced — good and bad. Practical details other travellers your age would value." value={form.body} onChange={e=>set("body",e.target.value)} rows={5}/></div>
        <div className="form-group">
          <label className="form-label">Photo (optional)</label>
          <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.6rem"}}>
            <button type="button" onClick={()=>setImageMode("upload")} style={{flex:1,padding:"0.45rem",borderRadius:"8px",border:`1.5px solid ${imageMode==="upload"?"var(--terra)":"var(--border)"}`,background:imageMode==="upload"?"var(--terra)":"var(--raised)",color:imageMode==="upload"?"white":"var(--muted)",fontSize:"0.75rem",fontFamily:"'Outfit',sans-serif",cursor:"pointer",fontWeight:600}}>📷 Upload photo</button>
            <button type="button" onClick={()=>setImageMode("link")} style={{flex:1,padding:"0.45rem",borderRadius:"8px",border:`1.5px solid ${imageMode==="link"?"var(--terra)":"var(--border)"}`,background:imageMode==="link"?"var(--terra)":"var(--raised)",color:imageMode==="link"?"white":"var(--muted)",fontSize:"0.75rem",fontFamily:"'Outfit',sans-serif",cursor:"pointer",fontWeight:600}}>🔗 Paste link</button>
          </div>
          {imageMode==="upload" ? (
            <div>
              <input type="file" accept="image/*" id="img-upload" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){setImageFile(f);setImagePreview(URL.createObjectURL(f))}}}/>
              <label htmlFor="img-upload" style={{display:"block",padding:"0.7rem",background:"var(--raised)",border:"1.5px dashed var(--border)",borderRadius:"10px",textAlign:"center",cursor:"pointer",fontSize:"0.8rem",color:"var(--muted)"}}>
                {imagePreview ? <img src={imagePreview} style={{width:"100%",maxHeight:"140px",objectFit:"cover",borderRadius:"6px"}}/> : "Tap to choose a photo from your camera roll"}
              </label>
            </div>
          ) : (
            <input className="form-input" placeholder="https://photos.google.com/… or any image URL" value={form.imageUrl} onChange={e=>set("imageUrl",e.target.value)}/>
          )}
        </div>
        <div className="form-group"><label className="form-label">YouTube / Video Link (optional)</label><input className="form-input" placeholder="https://youtube.com/…" value={form.youtube} onChange={e=>set("youtube",e.target.value)}/></div>
        {submitError && <div style={{background:"#3a1a1a",border:"1px solid #8a3030",borderRadius:"10px",padding:"0.85rem",fontSize:"0.78rem",color:"#f08080",marginTop:"0.75rem",wordBreak:"break-all"}}>⚠️ Error: {submitError}</div>}<button className="submit-btn" disabled={!valid||saving} onClick={submit}>{saving?"Saving…":"Submit Honest Review"}</button>
      </div>
    </div>
  );
}

/* ── DETAIL SCREEN ── */
function DetailScreen({ location, onBack, user, onSignIn }) {
  const [reviews,setReviews]   = useState([]);
  const [loading,setLoading]   = useState(true);
  const [ageF,setAgeF]         = useState("All ages");
  const [natF,setNatF]         = useState("All origins");
  const [styleF,setStyleF]     = useState("All styles");
  const [showSheet,setShowSheet] = useState(false);
  const [toast,setToast]       = useState(false);
  const [stats,setStats]       = useState({avg_rating:location.avg_rating, review_count:location.review_count});
  const [carousel,setCarousel]   = useState(null);
  const [showSuggest,setShowSuggest] = useState(false);
  const [showPhotoSuggest,setShowPhotoSuggest] = useState(false);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const {data} = await supabase.from("reviews").select("*").eq("location_id",location.id).order("created_at",{ascending:false});
      setReviews(data||[]);
      setLoading(false);
    })();
  },[location.id]);

  const filtered = reviews.filter(r=>(ageF==="All ages"||r.age===ageF)&&(natF==="All origins"||r.nationality===natF)&&(styleF==="All styles"||r.travel_style===styleF));
  const loadReviews = async () => {
    const {data} = await supabase.from("reviews").select("*").eq("location_id",location.id).order("created_at",{ascending:false});
    setReviews(data||[]);
  };
  const loadStats = async () => {
    const {data} = await supabase.from("locations").select("avg_rating,review_count").eq("id",location.id).single();
    if (data) setStats({avg_rating:data.avg_rating, review_count:data.review_count});
  };
  const handleSubmit = async () => { await Promise.all([loadReviews(), loadStats()]); setToast(true); setTimeout(()=>setToast(false),3500); };

  return (
    <>
      <div className="detail-topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="detail-topbar-title">{location.name}</div>
        <button className="icon-btn" onClick={()=>setShowSheet(true)}>✏️</button>
      </div>
      <div className="scroll-area">
        {location.hero_image_url && (
          <div className="detail-hero-img-wrap">
            <img className="detail-hero-img" src={location.hero_image_url} alt={location.name} onError={e=>e.target.parentElement.style.display="none"}/>
            {user && <button className="suggest-photo-btn" onClick={()=>setShowPhotoSuggest(true)}>📷 Suggest better photo</button>}
          </div>
        )}
        {!location.hero_image_url && user && (
          <div style={{padding:"0.5rem 1.25rem 0"}}><button className="suggest-btn" onClick={()=>setShowPhotoSuggest(true)}>📷 Add a photo for this destination</button></div>
        )}
        <div className="detail-hero">
          <div className="detail-region">{location.region}</div>
          <div className="detail-title">{location.name}</div>
          <div className="detail-stats">
            <div className="stat-item"><div className="stat-stars"><Stars n={Math.round(stats.avg_rating)} size="1rem"/></div><div className="stat-label">{stats.avg_rating} avg</div></div>
            <div className="stat-item"><div className="stat-value">{stats.review_count}</div><div className="stat-label">Reviews</div></div>
            <div className="dest-tags" style={{marginTop:0}}>{(location.tags||[]).map(t=><span key={t} className="tag">{t}</span>)}</div>
          </div>
        </div>
        {!loading && filtered.length>0 && <AISummary location={location} reviews={filtered} ageFilter={ageF} natFilter={natF}/>}
        <div className="rfil-wrap">
          <div className="rfil-row">{AGE_OPTS.map(a=><button key={a} className={`filter-pill ${ageF===a?"active":""}`} onClick={()=>setAgeF(a)}>{a}</button>)}</div>
          <div className="rfil-row" style={{marginTop:"0.4rem"}}>{NAT_OPTS.map(n=><button key={n} className={`filter-pill ${natF===n?"active":""}`} onClick={()=>setNatF(n)}>{n}</button>)}</div>
          <div className="rfil-row" style={{marginTop:"0.4rem"}}>{STYLE_OPTS.map(s=><button key={s} className={`filter-pill ${styleF===s?"active":""}`} onClick={()=>setStyleF(s)}>{s}</button>)}</div>
        </div>
        <div style={{padding:"0.75rem 1.25rem 0.25rem"}}><div className="section-label" style={{padding:0}}><span className="section-title">Reviews</span><span className="section-count">{filtered.length} of {reviews.length}</span></div></div>
        {loading ? (
          <div className="loading-wrap"><div className="dot-row"><span/><span/><span/></div><span>Loading reviews…</span></div>
        ) : filtered.length===0 ? (
          <div className="empty"><div className="empty-icon">🔍</div><div className="empty-text">No reviews match your filters.<br/>Try broadening your selection.</div></div>
        ) : (
          <div className="reviews-wrap">
            {filtered.map(r=>(
              <div key={r.id} className="review-card slide-up">
                <div className="rc-header">
                  <div className="rc-left"><div style={{position:"relative",flexShrink:0}}>{r.avatar_url ? <img className="review-avatar-img" src={r.avatar_url} alt={r.initials} onError={e=>{e.target.style.display="none"}}/> : <div className="avatar" style={{background:avatarColor(r.initials)}}>{r.initials}</div>}{r.image_url&&<img src={r.image_url} style={{position:"absolute",bottom:"-2px",right:"-2px",width:"22px",height:"22px",borderRadius:"50%",objectFit:"cover",border:"2px solid var(--surface)"}} onError={e=>e.target.style.display="none"}/>}</div><div><div className="rc-name">{r.name}</div><div className="rc-meta"><span>{r.nationality}</span><span>·</span><span>{r.age}</span><span>·</span><span>{r.travel_style}</span></div></div></div>
                  <div className="rc-right"><div className="rc-stars"><Stars n={r.rating}/></div><div className="rc-date">{formatDate(r.created_at)}</div></div>
                </div>
                <div className="rc-title">{r.title}</div>
                <div className="rc-body">{r.body}</div>
                {r.image_url && (
                  <div className="review-photo-strip">
                    <img className="review-photo-thumb" src={r.image_url} alt="Review photo"
                      onClick={()=>setCarousel({images:filtered.filter(x=>x.image_url), startIndex:filtered.filter(x=>x.image_url).findIndex(x=>x.id===r.id)})}
                      onError={e=>e.target.style.display="none"}/>
                  </div>
                )}
                {r.youtube && <a className="yt-link" href={r.youtube} target="_blank" rel="noopener noreferrer">▶ Watch video review →</a>}
                <div className="rc-footer">{r.verified&&<span className="verified-badge"><span className="v-dot"/>Verified Visit</span>}<span className="style-badge">{r.travel_style}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
      {user && <button className="suggest-btn" onClick={()=>setShowSuggest(true)}>💡 Suggest a new destination or experience</button>}
      <button className="fab" onClick={()=>{ if(user) setShowSheet(true); else onSignIn(); }} title={user?"Write a review":"Sign in to write a review"}>+</button>
      {showSheet && <ReviewSheet location={location} onClose={()=>setShowSheet(false)} onSubmit={handleSubmit} user={user}/>}
      {toast && <div className="toast">✓ Your review has been saved!</div>}
      {carousel && <ImageCarousel images={carousel.images} startIndex={carousel.startIndex} onClose={()=>setCarousel(null)}/>}
      {showSuggest && <SuggestSheet location={location} user={user} onClose={()=>setShowSuggest(false)}/>}
      {showPhotoSuggest && <PhotoSuggestSheet location={location} user={user} onClose={()=>setShowPhotoSuggest(false)}/>}
    </>
  );
}

/* ── EXPLORE SCREEN ── */
function ExploreScreen({ onSelectLocation, user, onSignIn, authReady }) {
  const [locations,setLocations] = useState([]);
  const [loading,setLoading]     = useState(true);
  const [error,setError]         = useState(null);
  const [search,setSearch]       = useState("");
  const [ageF,setAgeF]           = useState("All ages");
  const [natF,setNatF]           = useState("All origins");

  useEffect(()=>{
    const SUPABASE_URL = 'https://hqbvbuhkkytzxkhpxkyw.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnZidWhra3l0enhraHB4a3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTk2NDYsImV4cCI6MjA4ODc3NTY0Nn0.L92vm6m7d8oyB8rz2Y6ly-j8IL4iAvrktR9Ch5mqFAA';
    fetch(`${SUPABASE_URL}/rest/v1/locations?select=*&order=avg_rating.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) { setLocations(data); setError(null); }
      else setError("No locations returned from database.");
      setLoading(false);
    })
    .catch(e => { setError("Network error: " + e.message); setLoading(false); });
  },[]);

  const results = locations.filter(l=>
    l.name.toLowerCase().includes(search.toLowerCase())||
    l.region.toLowerCase().includes(search.toLowerCase())||
    (l.tags||[]).some(t=>t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="scroll-area">
      <div className="hero-banner">
        <div className="hero-eyebrow">Verified · Independent · Trusted</div>
        <div className="hero-title">Travel reviews you can <em>actually</em> trust</div>
        <div className="hero-sub">No paid placements. No sponsored content. Filter by age and nationality to hear from people who travel like you.</div>
        <div className="trust-pills"><span className="trust-pill green">✓ No sponsorships</span><span className="trust-pill green">✓ Verified visits</span><span className="trust-pill">Filter by age</span><span className="trust-pill">AI summaries</span></div>
      </div>
      <div className="search-wrap"><div className="search-box"><span className="search-icon">🔍</span><input className="search-input" placeholder="Search destinations…" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<span onClick={()=>setSearch("")} style={{color:"var(--muted)",cursor:"pointer",fontSize:"0.85rem"}}>✕</span>}</div></div>
      <div className="filter-scroll">{AGE_OPTS.map(a=><button key={a} className={`filter-pill ${ageF===a?"active":""}`} onClick={()=>setAgeF(a)}>{a}</button>)}</div>
      <div className="filter-scroll" style={{paddingTop:0}}>{NAT_OPTS.map(n=><button key={n} className={`filter-pill ${natF===n?"active":""}`} onClick={()=>setNatF(n)}>{n}</button>)}</div>
      <div className="section-label"><span className="section-title">Destinations</span><span className="section-count">{results.length} places</span></div>
      {error && <div className="error-msg">⚠️ {error}</div>}
      {loading ? (
        <div className="loading-wrap"><div className="dot-row"><span/><span/><span/></div><span>Loading destinations…</span></div>
      ) : results.length===0 ? (
        <div className="empty"><div className="empty-icon">🗺️</div><div className="empty-text">No destinations match your search.</div></div>
      ) : (
        <div className="dest-list">
          {results.map(loc=>(
            <div key={loc.id} className="dest-card slide-up" onClick={()=>onSelectLocation(loc)}>
              <div className="dest-emoji-col">{loc.emoji}</div>
              <div className="dest-body">
                <div className="dest-region">{loc.region}</div>
                <div className="dest-name">{loc.name}</div>
                <div className="dest-meta"><span className="stars"><Stars n={Math.round(loc.avg_rating)}/></span><span className="review-ct">{loc.review_count} reviews</span></div>
                <div className="dest-snippet">{loc.snippet}</div>
                <div className="dest-tags">{(loc.tags||[]).map(t=><span key={t} className="tag">{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AUTH SCREEN ── */
function AuthScreen({ onClose }) {
  const [mode, setMode]       = useState("signin"); // signin | signup | check_email
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const handleGoogle = async () => {
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "https://truetrails.netlify.app" }
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleEmail = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true); setError(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.href } });
      if (error) setError(error.message);
      else { setMode("check_email"); setSuccess("Check your email for a confirmation link!"); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onClose();
    }
    setLoading(false);
  };

  if (mode === "check_email") return (
    <div className="auth-overlay">
      <div className="auth-logo">True<span>Trails</span></div>
      <div className="auth-card" style={{textAlign:"center"}}>
        <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📧</div>
        <div className="auth-title">Check your email</div>
        <div className="auth-sub">We sent a confirmation link to <strong style={{color:"var(--terra2)"}}>{email}</strong>. Click it to activate your account then come back here to sign in.</div>
        <button className="submit-btn" onClick={()=>setMode("signin")}>Back to Sign In</button>
      </div>
      <button className="guest-btn" onClick={onClose}>Continue as guest</button>
    </div>
  );

  return (
    <div className="auth-overlay">
      <div className="auth-logo">True<span>Trails</span></div>
      <div className="auth-tagline">Honest travel reviews — no sponsorships, no paid placements.</div>
      <div className="auth-card">
        <div className="auth-title">{mode==="signin"?"Welcome back":"Create account"}</div>
        <div className="auth-sub">{mode==="signin"?"Sign in to write reviews and save favourites.":"Join TrueTrails — it's free and takes 30 seconds."}</div>
        {error && <div className="auth-error">⚠️ {error}</div>}
        <button className="social-btn" onClick={handleGoogle} disabled={loading}>
          <span className="social-icon">🇬</span> Continue with Google
        </button>
        <div className="auth-divider"><div className="auth-divider-line"/><span className="auth-divider-text">or</span><div className="auth-divider-line"/></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        <button className="submit-btn" onClick={handleEmail} disabled={loading}>{loading?"Please wait…":mode==="signin"?"Sign In":"Create Account"}</button>
        <div className="auth-switch">
          {mode==="signin"?"Don't have an account? ":"Already have an account? "}
          <button className="auth-switch-btn" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setError(null);}}>
            {mode==="signin"?"Sign up free":"Sign in"}
          </button>
        </div>
      </div>
      <button className="guest-btn" onClick={onClose}>Continue as guest →</button>
    </div>
  );
}

/* ── USERNAME CHECKER ── */
async function checkUsername(username) {
  if (!username || username.length < 3) return { ok:false, msg:"At least 3 characters required." };
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return { ok:false, msg:"Only letters, numbers and underscores." };
  // Check uniqueness
  const { data } = await supabase.from("profiles").select("id").eq("username", username).maybeSingle();
  if (data) return { ok:false, msg:"That username is already taken." };
  // AI moderation
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:50,
        messages:[{ role:"user", content:`Is the username "${username}" appropriate for a family-friendly travel review platform? Reply with only "APPROVED" or "REJECTED: <brief reason>".` }]
      })
    });
    const json = await res.json();
    const reply = json.content?.[0]?.text?.trim() || "APPROVED";
    if (reply.startsWith("REJECTED")) return { ok:false, msg: "Username not allowed: " + reply.replace("REJECTED:","").trim() };
  } catch(e) { /* if AI check fails, allow through */ }
  return { ok:true, msg:"✓ Username available!" };
}

/* ── PROFILE SCREEN ── */
function ProfileScreen({ user, onSignIn }) {
  const [profile, setProfile] = useState({ username:"", display_name:"", age:"", nationality:"", travel_style:"Couple", youtube:"", avatar_url:"" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState(null); // {ok, msg}
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debounceRef = useRef(null);

  useEffect(()=>{
    if (!user) return;
    (async()=>{
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile({ username:data.username||"", display_name:data.display_name||"", age:data.age||"", nationality:data.nationality||"", travel_style:data.travel_style||"Couple", youtube:data.youtube||"", avatar_url:data.avatar_url||"" });
        setUsernameInput(data.username||"");
      }
    })();
  },[user?.id]);

  const handleUsernameChange = (val) => {
    setUsernameInput(val);
    setUsernameStatus(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val) return;
    // Skip check if unchanged from saved
    if (val === profile.username) { setUsernameStatus({ok:true, msg:"✓ Your current username."}); return; }
    setCheckingUsername(true);
    debounceRef.current = setTimeout(async()=>{
      const result = await checkUsername(val);
      setUsernameStatus(result);
      setCheckingUsername(false);
    }, 700);
  };

  const saveProfile = async () => {
    if (!user) return;
    if (usernameInput && usernameInput !== profile.username && (!usernameStatus || !usernameStatus.ok)) return;
    setSaving(true);
    let avatarUrl = profile.avatar_url;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: upErr } = await supabase.storage.from("review-images").upload(path, avatarFile, { contentType: avatarFile.type, upsert: true });
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("review-images").getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }
    }
    const updates = { id:user.id, email:user.email, ...profile, avatar_url:avatarUrl, username:usernameInput||null, updated_at:new Date().toISOString() };
    await supabase.from("profiles").upsert(updates);
    setProfile(p=>({...p, username:usernameInput, avatar_url:avatarUrl}));
    setAvatarFile(null);
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2500);
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  if (!user) return (
    <div className="scroll-area"><div className="profile-wrap">
      <div className="auth-required">
        <div className="auth-required-icon">👤</div>
        <div className="auth-required-title">Create a free account</div>
        <div className="auth-required-text">Sign up to write reviews, upload photos, save favourites and build your reviewer profile.</div>
        <button className="auth-required-btn" onClick={onSignIn}>Sign up or Sign in</button>
      </div>
      <div className="no-sponsorship-badge"><div className="nsb-icon">🛡️</div><div><div className="nsb-title">No-Sponsorship Pledge</div><div className="nsb-text">TrueTrails members pledge to never accept payment, free stays, or incentives in exchange for reviews.</div></div></div>
    </div></div>
  );

  const displayHandle = profile.username ? "@"+profile.username : profile.display_name || "Set your username";
  const initials = (profile.display_name||user.email||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div className="scroll-area"><div className="profile-wrap">
      <div className="section-head" style={{marginBottom:"1rem"}}>My Profile</div>
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar-wrap">
            {(avatarPreview || profile.avatar_url)
              ? <img className="profile-avatar-img" src={avatarPreview||profile.avatar_url} alt="avatar" onError={e=>e.target.style.display="none"}/>
              : <div className="profile-avatar">{initials}</div>
            }
            <label htmlFor="avatar-upload" className="profile-avatar-edit" title="Change photo">✏️</label>
            <input type="file" id="avatar-upload" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){setAvatarFile(f);setAvatarPreview(URL.createObjectURL(f))}}}/>
          </div>
          <div>
            <div className="profile-name">{displayHandle}</div>
            <div className="profile-sub">{user.email}</div>
            {(avatarPreview) && <div style={{fontSize:"0.68rem",color:"var(--terra2)",marginTop:"0.2rem"}}>New photo ready — tap Save Profile</div>}
          </div>
        </div>
      </div>
      <div className="no-sponsorship-badge"><div className="nsb-icon">🛡️</div><div><div className="nsb-title">No-Sponsorship Pledge</div><div className="nsb-text">You have pledged to never accept payment, free stays, or incentives in exchange for reviews on TrueTrails.</div></div></div>
      <div className="section-head">Edit Profile</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.9rem"}}>
        <div className="form-group">
          <label className="form-label">Username <span style={{color:"var(--muted)",fontWeight:400}}>(shown on reviews)</span></label>
          <div className="username-input-wrap">
            <span className="username-prefix">@</span>
            <input className="form-input username-input" placeholder="e.g. adventurer_tony" value={usernameInput} onChange={e=>handleUsernameChange(e.target.value.toLowerCase().replace(/\s/g,"_"))}/>
          </div>
          {checkingUsername && <div className="username-status checking">Checking…</div>}
          {!checkingUsername && usernameStatus && <div className={`username-status ${usernameStatus.ok?"ok":"err"}`}>{usernameStatus.msg}</div>}
          <div style={{fontSize:"0.68rem",color:"var(--muted)",marginTop:"0.3rem"}}>Letters, numbers and underscores only. This is what other travellers will see.</div>
        </div>
        <div className="form-group"><label className="form-label">Display Name <span style={{color:"var(--muted)",fontWeight:400}}>(optional)</span></label><input className="form-input" placeholder="e.g. Margaret T." value={profile.display_name} onChange={e=>setProfile(p=>({...p,display_name:e.target.value}))}/></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Age Group</label><select className="form-select" value={profile.age} onChange={e=>setProfile(p=>({...p,age:e.target.value}))}><option value="">Select…</option>{["Under 35","35–49","50–54","55–64","65+"].map(a=><option key={a}>{a}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Nationality</label><select className="form-select" value={profile.nationality} onChange={e=>setProfile(p=>({...p,nationality:e.target.value}))}><option value="">Select…</option>{NAT_OPTS.slice(1).map(n=><option key={n}>{n}</option>)}</select></div>
        </div>
        <div className="form-group"><label className="form-label">Travel Style</label><select className="form-select" value={profile.travel_style} onChange={e=>setProfile(p=>({...p,travel_style:e.target.value}))}>{STYLE_OPTS.slice(1).map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="form-group"><label className="form-label">YouTube / Blog URL (optional)</label><input className="form-input" placeholder="https://…" value={profile.youtube} onChange={e=>setProfile(p=>({...p,youtube:e.target.value}))}/></div>
        {saved && <div className="auth-success">✓ Profile saved!</div>}
        <button className="submit-btn" onClick={saveProfile} disabled={saving||checkingUsername}>{saving?"Saving…":"Save Profile"}</button>
        <button className="sign-out-btn" onClick={signOut}>Sign out</button>
      </div>
    </div></div>
  );
}

/* ── ADMIN SCREEN ── */
function AdminScreen({ user }) {
  const [photos, setPhotos]       = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [msg, setMsg]             = useState(null);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("location_photos").select("*, locations(name)").eq("status","pending").order("created_at",{ascending:false}),
      supabase.from("suggestions").select("*").eq("status","pending").order("created_at",{ascending:false})
    ]);
    setPhotos(p||[]); setSuggestions(s||[]);
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  const approvePhoto = async (photo) => {
    await supabase.from("location_photos").update({status:"approved"}).eq("id",photo.id);
    await supabase.from("locations").update({hero_image_url:photo.photo_url}).eq("id",photo.location_id);
    setMsg("✓ Photo approved and set as hero image!");
    setTimeout(()=>setMsg(null),3000);
    load();
  };

  const rejectPhoto = async (id) => {
    await supabase.from("location_photos").update({status:"rejected"}).eq("id",id);
    load();
  };

  const approveSuggestion = async (id) => {
    await supabase.from("suggestions").update({status:"approved"}).eq("id",id);
    setMsg("✓ Suggestion approved!");
    setTimeout(()=>setMsg(null),3000);
    load();
  };

  const rejectSuggestion = async (id) => {
    await supabase.from("suggestions").update({status:"rejected"}).eq("id",id);
    load();
  };

  if (!user || user.id !== ADMIN_ID) return (
    <div className="scroll-area"><div className="profile-wrap">
      <div className="auth-required"><div className="auth-required-icon">🔒</div><div className="auth-required-title">Admin only</div></div>
    </div></div>
  );

  return (
    <div className="scroll-area"><div className="profile-wrap">
      <div className="section-head" style={{marginBottom:"0.25rem"}}>Admin Panel</div>
      {msg && <div className="auth-success" style={{marginBottom:"1rem"}}>✓ {msg}</div>}
      {loading ? <div className="loading-wrap"><div className="dot-row"><span/><span/><span/></div></div> : <>
        <div className="admin-section-title">📷 Photo Suggestions <span style={{fontSize:"0.8rem",color:"var(--muted)",fontFamily:"'Outfit',sans-serif",fontWeight:400}}>({photos.length} pending)</span></div>
        {photos.length===0 ? <div className="admin-empty">No pending photos</div> : photos.map(p=>(
          <div key={p.id} className="admin-card">
            <img className="admin-card-img" src={p.photo_url} alt="suggested" onError={e=>e.target.style.display="none"}/>
            <div className="admin-card-body">
              <div className="admin-card-title">{p.locations?.name}</div>
              <div className="admin-card-meta">By {p.username} · {new Date(p.created_at).toLocaleDateString()}</div>
              <div className="admin-btn-row">
                <button className="admin-btn approve" onClick={()=>approvePhoto(p)}>✓ Approve as hero</button>
                <button className="admin-btn reject" onClick={()=>rejectPhoto(p.id)}>✕ Reject</button>
              </div>
            </div>
          </div>
        ))}
        <div className="admin-section-title">💡 Suggestions <span style={{fontSize:"0.8rem",color:"var(--muted)",fontFamily:"'Outfit',sans-serif",fontWeight:400}}>({suggestions.length} pending)</span></div>
        {suggestions.length===0 ? <div className="admin-empty">No pending suggestions</div> : suggestions.map(s=>(
          <div key={s.id} className="admin-card">
            <div className="admin-card-body">
              <div className="admin-card-title">{s.title}<span className={`admin-badge ${s.type}`}>{s.type}</span></div>
              <div className="admin-card-meta">By {s.username} · {s.region} · {new Date(s.created_at).toLocaleDateString()}</div>
              <div className="admin-card-desc">{s.description}</div>
              {s.tags?.length>0 && <div className="dest-tags" style={{marginBottom:"0.75rem"}}>{s.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>}
              <div className="admin-btn-row">
                <button className="admin-btn approve" onClick={()=>approveSuggestion(s.id)}>✓ Approve</button>
                <button className="admin-btn reject" onClick={()=>rejectSuggestion(s.id)}>✕ Reject</button>
              </div>
            </div>
          </div>
        ))}
      </>}
    </div></div>
  );
}

/* ── ROOT ── */
export default function App() {
  const [tab,setTab]                 = useState("explore");
  const [selectedLoc,setSelectedLoc] = useState(null);
  const [user,setUser]               = useState(null);
  const [authReady,setAuthReady]     = useState(false);
  const [showAuth,setShowAuth]       = useState(false);
  const isAdmin = user?.id === ADMIN_ID;

  useEffect(()=>{
    // onAuthStateChange fires first with the session from the URL hash (OAuth redirect)
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, session)=>{
      setUser(session?.user||null);
      setShowAuth(false);
      setAuthReady(true);
      if (window.location.hash && window.location.hash.includes("access_token")) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      // Auto-save Google avatar on first sign-in
      if (session?.user) {
        const googleAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        if (googleAvatar) {
          supabase.from("profiles").select("avatar_url").eq("id", session.user.id).single().then(({data})=>{
            if (!data?.avatar_url) {
              supabase.from("profiles").upsert({ id:session.user.id, email:session.user.email, avatar_url:googleAvatar });
            }
          });
        }
      }
    });
    // Also check for existing session (non-redirect case)
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user||null);
      setAuthReady(true);
    });
    return ()=>subscription.unsubscribe();
  },[]);

  const handleSelect = loc => { setSelectedLoc(loc); setTab("detail"); };
  const handleBack   = ()  => { setSelectedLoc(null); setTab("explore"); };

  if (!authReady) return <><style>{FONTS+CSS}</style><div className="shell"><div className="status-bar"/><div className="loading-wrap" style={{height:"100dvh"}}><div className="dot-row"><span/><span/><span/></div></div></div></>;

  return (
    <>
      <style>{FONTS+CSS}</style>
      <div className="shell">
        <div className="status-bar"/>
        {tab!=="detail" && (
          <div className="topbar">
            <div className="topbar-logo">True<span>Trails</span></div>
            <div className="topbar-right">
              {user
                ? <button className="icon-btn" onClick={()=>setTab("profile")} title="Profile">👤</button>
                : <button className="icon-btn" onClick={()=>setShowAuth(true)} style={{fontSize:"0.65rem",fontWeight:700,color:"var(--terra2)",width:"auto",padding:"0 0.75rem",borderRadius:"20px",whiteSpace:"nowrap"}}>Sign in</button>
              }
            </div>
          </div>
        )}
        {tab==="explore" && <ExploreScreen onSelectLocation={handleSelect} user={user} onSignIn={()=>setShowAuth(true)} authReady={authReady}/>}
        {tab==="detail"  && selectedLoc && <DetailScreen location={selectedLoc} onBack={handleBack} user={user} onSignIn={()=>setShowAuth(true)}/>}
        {tab==="profile" && <ProfileScreen user={user} onSignIn={()=>setShowAuth(true)}/>}
        {tab!=="detail" && <div className="bottom-nav">{[{id:"explore",icon:"🗺️",label:"Explore"},{id:"profile",icon:"👤",label:"Profile"}].map(n=><button key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}><span className="nav-icon">{n.icon}</span><span className="nav-label">{n.label}</span></button>)}</div>}
      </div>
      {showAuth && <AuthScreen onClose={()=>setShowAuth(false)}/>}
    </>
  );
}
