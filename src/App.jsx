import { useState, useEffect, useRef } from "react";

/* ─── FONTS & RESET ─────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Outfit:wght@300;400;500;600&display=swap');`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; }
body {
  font-family: 'Outfit', sans-serif;
  background: #0f0e0c;
  color: #f2ede4;
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

:root {
  --bg:       #0f0e0c;
  --surface:  #1a1916;
  --raised:   #232119;
  --border:   #2e2b24;
  --muted:    #7a7568;
  --text:     #f2ede4;
  --sub:      #a09890;
  --terra:    #d4622a;
  --terra2:   #e8845a;
  --gold:     #c9a84c;
  --sage:     #7aab7d;
  --safe-top: env(safe-area-inset-top, 44px);
  --safe-bot: env(safe-area-inset-bottom, 20px);
}

/* ── SCROLLBAR HIDE ── */
::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }

/* ── SHELL ── */
.shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

/* ── STATUS BAR SPACER ── */
.status-bar {
  height: var(--safe-top);
  background: var(--surface);
  flex-shrink: 0;
}

/* ── TOP BAR ── */
.topbar {
  background: var(--surface);
  padding: 0.75rem 1.25rem 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border);
}
.topbar-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text);
}
.topbar-logo span { color: var(--terra2); font-style: italic; }
.topbar-right { display: flex; gap: 0.6rem; align-items: center; }
.icon-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--raised);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  color: var(--sub);
  transition: background 0.15s;
  flex-shrink: 0;
}
.icon-btn:active { background: var(--terra); color: white; }

/* ── SCROLL AREA ── */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

/* ── BOTTOM NAV ── */
.bottom-nav {
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  padding-bottom: var(--safe-bot);
  flex-shrink: 0;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.65rem 0 0.5rem;
  cursor: pointer;
  transition: color 0.15s;
  gap: 0.2rem;
  color: var(--muted);
  border: none;
  background: none;
  font-family: 'Outfit', sans-serif;
}
.nav-item.active { color: var(--terra2); }
.nav-icon { font-size: 1.3rem; line-height: 1; }
.nav-label { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

/* ── HERO BANNER ── */
.hero-banner {
  background: linear-gradient(160deg, #1e1b14 0%, #2a1f13 50%, #1a1610 100%);
  padding: 1.75rem 1.25rem 1.5rem;
  position: relative;
  overflow: hidden;
}
.hero-banner::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(212,98,42,0.18) 0%, transparent 70%);
  pointer-events: none;
}
.hero-eyebrow {
  font-size: 0.62rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--terra2);
  font-weight: 600;
  margin-bottom: 0.6rem;
}
.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 0.6rem;
}
.hero-title em { color: var(--terra2); font-style: italic; }
.hero-sub {
  font-size: 0.8rem;
  color: var(--sub);
  line-height: 1.65;
  margin-bottom: 1.25rem;
}
.trust-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.trust-pill {
  font-size: 0.62rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--muted);
  letter-spacing: 0.06em;
  font-weight: 500;
  white-space: nowrap;
}
.trust-pill.green { border-color: var(--sage); color: var(--sage); }

/* ── SEARCH BOX ── */
.search-wrap { padding: 1rem 1.25rem 0.5rem; }
.search-box {
  background: var(--raised);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  gap: 0.6rem;
}
.search-icon { color: var(--muted); font-size: 0.9rem; flex-shrink: 0; }
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  padding: 0.75rem 0;
}
.search-input::placeholder { color: var(--muted); }

/* ── FILTER SCROLL ── */
.filter-scroll {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  overflow-x: auto;
}
.filter-pill {
  white-space: nowrap;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--raised);
  color: var(--sub);
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}
.filter-pill.active {
  background: var(--terra);
  border-color: var(--terra);
  color: white;
}

/* ── SECTION LABEL ── */
.section-label {
  padding: 0.25rem 1.25rem 0.75rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
}
.section-count { font-size: 0.72rem; color: var(--muted); }

/* ── DESTINATION CARDS ── */
.dest-list { padding: 0 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.85rem; }
.dest-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  transition: border-color 0.2s;
  active: transform 0.1s;
}
.dest-card:active { border-color: var(--terra); transform: scale(0.985); }
.dest-emoji-col {
  width: 80px;
  flex-shrink: 0;
  background: var(--raised);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
}
.dest-body { padding: 0.9rem; flex: 1; min-width: 0; }
.dest-region {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--terra2);
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.dest-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.3rem;
  line-height: 1.2;
}
.dest-meta { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
.stars { color: var(--gold); font-size: 0.75rem; letter-spacing: 0.03em; }
.review-ct { font-size: 0.7rem; color: var(--muted); }
.dest-snippet { font-size: 0.75rem; color: var(--sub); line-height: 1.55; }
.dest-tags { display: flex; gap: 0.3rem; flex-wrap: wrap; margin-top: 0.5rem; }
.tag {
  font-size: 0.58rem;
  padding: 0.15rem 0.45rem;
  background: var(--raised);
  border-radius: 4px;
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 500;
}

/* ── DETAIL SCREEN ── */
.detail-topbar {
  background: var(--surface);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.back-btn {
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--text);
  font-size: 1rem;
  flex-shrink: 0;
}
.back-btn:active { background: var(--terra); border-color: var(--terra); }
.detail-topbar-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── DETAIL HERO ── */
.detail-hero {
  background: linear-gradient(160deg, #211d14, #2e2318);
  padding: 1.5rem 1.25rem 1.25rem;
  border-bottom: 1px solid var(--border);
}
.detail-region {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--terra2);
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.detail-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.1;
  margin-bottom: 0.75rem;
}
.detail-stats { display: flex; gap: 1.25rem; align-items: center; }
.stat-item { display: flex; flex-direction: column; gap: 0.15rem; }
.stat-value { font-size: 1.2rem; font-weight: 700; color: var(--text); }
.stat-label { font-size: 0.62rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
.stat-stars { color: var(--gold); font-size: 0.9rem; }

/* ── AI BOX ── */
.ai-box {
  margin: 1rem 1.25rem;
  background: var(--raised);
  border: 1px solid var(--border);
  border-left: 3px solid var(--terra);
  border-radius: 12px;
  padding: 1rem 1.1rem;
}
.ai-label {
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--terra2);
  font-weight: 700;
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.ai-text { font-size: 0.82rem; color: var(--sub); line-height: 1.75; }
.ai-gen-btn {
  width: 100%;
  background: var(--terra);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.65rem;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.04em;
  margin-top: 0.5rem;
}
.ai-gen-btn:active { background: var(--terra2); }
.dot-row { display: flex; gap: 4px; align-items: center; }
.dot-row span {
  width: 5px; height: 5px;
  background: var(--terra2);
  border-radius: 50%;
  animation: dp 1.2s infinite;
}
.dot-row span:nth-child(2) { animation-delay: 0.2s; }
.dot-row span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dp { 0%,80%,100% { opacity: 0.2; transform: scale(0.7); } 40% { opacity: 1; transform: scale(1); } }

/* ── REVIEW FILTER BAR ── */
.rfil-wrap {
  padding: 0.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--border);
}
.rfil-row { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.1rem; }

/* ── REVIEW CARDS ── */
.reviews-wrap { padding: 1rem 1.25rem 6rem; display: flex; flex-direction: column; gap: 0.85rem; }
.review-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.1rem;
}
.rc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.rc-left { display: flex; gap: 0.65rem; align-items: center; }
.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.rc-name { font-size: 0.88rem; font-weight: 600; color: var(--text); margin-bottom: 0.15rem; }
.rc-meta { font-size: 0.68rem; color: var(--muted); display: flex; gap: 0.3rem; flex-wrap: wrap; }
.rc-right { text-align: right; }
.rc-stars { color: var(--gold); font-size: 0.85rem; }
.rc-date { font-size: 0.65rem; color: var(--muted); margin-top: 0.15rem; }
.rc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}
.rc-body { font-size: 0.8rem; color: var(--sub); line-height: 1.7; }
.rc-footer { display: flex; gap: 0.5rem; align-items: center; margin-top: 0.75rem; flex-wrap: wrap; }
.verified-badge {
  font-size: 0.62rem;
  color: var(--sage);
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  display: flex; align-items: center; gap: 0.3rem;
}
.v-dot { width: 5px; height: 5px; background: var(--sage); border-radius: 50%; }
.style-badge {
  font-size: 0.6rem;
  padding: 0.15rem 0.45rem;
  background: var(--raised);
  border-radius: 4px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 600;
}
.yt-link {
  font-size: 0.72rem;
  color: var(--terra2);
  font-weight: 600;
  text-decoration: none;
  display: flex; align-items: center; gap: 0.25rem;
  margin-top: 0.5rem;
}

/* ── WRITE REVIEW SHEET ── */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  z-index: 300;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  backdrop-filter: blur(4px);
}
.sheet {
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  border-top: 1px solid var(--border);
  max-height: 92dvh;
  overflow-y: auto;
  padding: 0 1.25rem 2rem;
  -webkit-overflow-scrolling: touch;
}
.sheet-handle {
  width: 40px; height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 0.9rem auto 1.25rem;
}
.sheet-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.25rem;
}
.sheet-sub { font-size: 0.78rem; color: var(--muted); line-height: 1.6; margin-bottom: 1.5rem; }
.form-label {
  display: block;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  color: var(--sub);
  margin-bottom: 0.4rem;
}
.form-group { margin-bottom: 1.1rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: var(--raised);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
  -webkit-appearance: none;
}
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--terra); }
.form-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237a7568' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.9rem center; padding-right: 2.2rem; }
.form-textarea { resize: none; min-height: 110px; }
.star-row { display: flex; gap: 0.5rem; }
.star-tap {
  font-size: 1.8rem;
  background: none; border: none;
  cursor: pointer;
  color: var(--border);
  padding: 0;
  line-height: 1;
  transition: color 0.1s, transform 0.1s;
}
.star-tap.lit { color: var(--gold); }
.star-tap:active { transform: scale(1.2); }
.submit-btn {
  width: 100%;
  background: var(--terra);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.95rem;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.75rem;
  letter-spacing: 0.02em;
  transition: background 0.2s;
}
.submit-btn:active { background: var(--terra2); }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── FAB ── */
.fab {
  position: fixed;
  bottom: calc(70px + var(--safe-bot) + 1rem);
  right: 1.25rem;
  width: 52px; height: 52px;
  background: var(--terra);
  border: none;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(212,98,42,0.45);
  z-index: 100;
  transition: transform 0.15s;
}
.fab:active { transform: scale(0.92); }

/* ── SUCCESS TOAST ── */
.toast {
  position: fixed;
  bottom: calc(80px + var(--safe-bot));
  left: 1.25rem; right: 1.25rem;
  background: var(--sage);
  color: white;
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  font-size: 0.83rem;
  font-weight: 500;
  display: flex; align-items: center; gap: 0.6rem;
  z-index: 500;
  animation: toastIn 0.3s ease;
}
@keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* ── EMPTY ── */
.empty { text-align: center; padding: 3rem 1.5rem; color: var(--muted); }
.empty-icon { font-size: 2.5rem; opacity: 0.4; margin-bottom: 0.75rem; }
.empty-text { font-size: 0.83rem; line-height: 1.6; }

/* ── PROFILE SCREEN ── */
.profile-wrap { padding: 1.5rem 1.25rem 6rem; }
.profile-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}
.profile-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border); }
.profile-avatar {
  width: 58px; height: 58px;
  background: var(--terra);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem; font-weight: 700; color: white; flex-shrink: 0;
}
.profile-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: var(--text); }
.profile-sub { font-size: 0.75rem; color: var(--muted); margin-top: 0.2rem; }
.info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
.info-row:last-child { border-bottom: none; }
.info-key { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 600; }
.info-val { font-size: 0.85rem; color: var(--sub); font-weight: 500; }
.section-head {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem; font-weight: 600;
  color: var(--text);
  margin-bottom: 0.75rem;
}
.no-sponsorship-badge {
  background: linear-gradient(135deg, var(--raised), #1f1c13);
  border: 1px solid var(--terra);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  display: flex; gap: 0.75rem; align-items: flex-start;
}
.nsb-icon { font-size: 1.4rem; flex-shrink: 0; }
.nsb-title { font-size: 0.82rem; font-weight: 600; color: var(--terra2); margin-bottom: 0.2rem; }
.nsb-text { font-size: 0.75rem; color: var(--muted); line-height: 1.6; }

/* ── SLIDE IN ANIMATION ── */
.slide-up { animation: slideUp 0.28s cubic-bezier(0.22,1,0.36,1) both; }
@keyframes slideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ─── DATA ──────────────────────────────────────────────────────────────── */

const LOCATIONS = [
  { id: 1, name: "Aoraki / Mt Cook", region: "South Island, NZ", emoji: "🏔️", tags: ["Hiking", "Stargazing", "Alpine"], avgRating: 4.8, reviewCount: 47, snippet: "Dramatic alpine scenery with world-class stargazing. Allow more time than you think." },
  { id: 2, name: "Kyoto Old Town", region: "Kansai, Japan", emoji: "⛩️", tags: ["Culture", "History", "Food"], avgRating: 4.6, reviewCount: 83, snippet: "Temples and gardens that reward slow exploration. Best in shoulder season." },
  { id: 3, name: "Cinque Terre", region: "Liguria, Italy", emoji: "🌊", tags: ["Coastal", "Walking", "Food"], avgRating: 4.4, reviewCount: 112, snippet: "Spectacular coastline, but very crowded in peak summer." },
  { id: 4, name: "Daintree Rainforest", region: "Queensland, AU", emoji: "🌿", tags: ["Nature", "Wildlife", "Walking"], avgRating: 4.7, reviewCount: 38, snippet: "Ancient rainforest unlike anywhere on earth. Guided tours add enormous value." },
  { id: 5, name: "Torres del Paine", region: "Patagonia, Chile", emoji: "🦅", tags: ["Hiking", "Wilderness", "Photography"], avgRating: 4.9, reviewCount: 29, snippet: "Bucket-list trekking. Weather changes fast — build in flexible days." },
  { id: 6, name: "Luang Prabang", region: "Northern Laos", emoji: "🛕", tags: ["Culture", "Slow Travel"], avgRating: 4.5, reviewCount: 55, snippet: "One of the most serene towns in Asia. The alms-giving ceremony is moving." },
];

const SEED_REVIEWS = {
  1: [
    { id: 101, name: "Margaret T.", initials: "MT", age: "55–64", nationality: "Australian", travelStyle: "Couple", rating: 5, date: "Feb 2025", title: "Simply breathtaking — worth every step", body: "We spent four nights at The Hermitage and did the Hooker Valley Track twice. The walk is well-graded and manageable for fit 60-somethings. Don't rush the glacier viewing — clouds lift by mid-morning. The lodge dinners are exceptional.", verified: true },
    { id: 102, name: "David K.", initials: "DK", age: "50–54", nationality: "New Zealander", travelStyle: "Solo", rating: 5, date: "Jan 2025", title: "Best stargazing on the planet, full stop", body: "I came for the Dark Sky Reserve. Worth every cent for the guided session at the observatory — book ahead, it sells out weeks in advance. Bring layers even in summer.", verified: true },
    { id: 103, name: "Susan W.", initials: "SW", age: "65+", nationality: "British", travelStyle: "Couple", rating: 4, date: "Mar 2024", title: "Magnificent but plan for the altitude and pace", body: "Absolutely stunning landscape. We are both late 60s and found the shorter walks very doable. The Tasman Glacier viewpoint is a must. The road in is long and winding; if you're prone to carsickness, take the coach.", verified: true },
  ],
  2: [
    { id: 201, name: "Patricia N.", initials: "PN", age: "55–64", nationality: "Australian", travelStyle: "Couple", rating: 5, date: "Apr 2025", title: "A city that rewards slow exploration", body: "We spent eight days, which sounds long but felt exactly right. The trick is leaving the main tourist circuit — Arashiyama bamboo grove at 6am before anyone arrives is extraordinary. Avoid Golden Week entirely.", verified: true },
    { id: 202, name: "Robert H.", initials: "RH", age: "50–54", nationality: "New Zealander", travelStyle: "Solo", rating: 4, date: "Nov 2024", title: "Culturally rich but crowded at peak sites", body: "Third visit and still discovering new places. The lesser-known temples north of the main circuit are far more peaceful. Food quality is extraordinary even at modest price points.", verified: true },
  ],
  3: [
    { id: 301, name: "Anne B.", initials: "AB", age: "55–64", nationality: "Australian", travelStyle: "Couple", rating: 4, date: "Sep 2024", title: "Magical — go in shoulder season", body: "We visited late September and it was still busy but manageable. The inter-village hiking trails are the real star. Bring comfortable shoes; the paths are steep and uneven.", verified: true },
  ],
  4: [
    { id: 401, name: "Graham F.", initials: "GF", age: "55–64", nationality: "Australian", travelStyle: "Couple", rating: 5, date: "Jul 2024", title: "World's oldest rainforest lives up to its reputation", body: "Stayed at a small eco-lodge for four nights. The guided night walk revealed an entirely different ecosystem. Heat and humidity are intense — plan walks for early morning.", verified: true },
  ],
};

const AGE_OPTS = ["All ages", "Under 35", "35–49", "50–54", "55–64", "65+"];
const NAT_OPTS = ["All origins", "Australian", "New Zealander", "British", "American", "Canadian", "German", "French", "Other"];
const STYLE_OPTS = ["All styles", "Solo", "Couple", "Family", "Group"];
const AVATAR_COLORS = ["#d4622a", "#7aab7d", "#c9a84c", "#5e7fa8", "#8c6e8c"];

function avatarColor(initials) {
  return AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
}
function Stars({ n, size = "0.85rem" }) {
  return <span style={{ color: "#c9a84c", fontSize: size, letterSpacing: "0.03em" }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

/* ─── AI SUMMARY ─────────────────────────────────────────────────────────── */
function AISummary({ location, reviews, ageFilter, natFilter }) {
  const [state, setState] = useState("idle"); // idle | loading | done
  const [text, setText] = useState("");

  const generate = async () => {
    setState("loading");
    const filterDesc = [
      ageFilter !== "All ages" ? `aged ${ageFilter}` : null,
      natFilter !== "All origins" ? `from ${natFilter}` : null,
    ].filter(Boolean).join(", ");
    const excerpts = reviews.slice(0, 6).map(r =>
      `[${r.nationality}, ${r.age}, ${r.travelStyle}] ${r.title}: ${r.body}`
    ).join("\n\n");
    const prompt = `You are a no-sponsored-content travel advisor. Based on these verified traveller reviews of "${location.name}"${filterDesc ? ` from reviewers ${filterDesc}` : ""}, write a 3-sentence honest summary covering: what they genuinely loved, any honest warnings, and one insider tip promotional sites would never mention. Be specific and direct.\n\nREVIEWS:\n${excerpts}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      setText(data.content?.find(b => b.type === "text")?.text || "Unable to generate.");
      setState("done");
    } catch {
      setText("Could not connect. Please try again.");
      setState("done");
    }
  };

  return (
    <div className="ai-box">
      <div className="ai-label">◆ AI Honest Summary</div>
      {state === "idle" && (
        <>
          <div className="ai-text" style={{ marginBottom: "0.5rem", opacity: 0.6 }}>
            Synthesise what {ageFilter !== "All ages" || natFilter !== "All origins" ? "filtered " : ""}reviewers honestly say — no marketing language.
          </div>
          <button className="ai-gen-btn" onClick={generate}>Generate Summary</button>
        </>
      )}
      {state === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.25rem 0" }}>
          <div className="dot-row"><span /><span /><span /></div>
          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Analysing reviews…</span>
        </div>
      )}
      {state === "done" && (
        <>
          <div className="ai-text">{text}</div>
          <button onClick={generate} style={{ marginTop: "0.75rem", background: "none", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.4rem 0.8rem", fontSize: "0.7rem", cursor: "pointer", borderRadius: "6px", fontFamily: "'Outfit', sans-serif" }}>↺ Regenerate</button>
        </>
      )}
    </div>
  );
}

/* ─── REVIEW SHEET ───────────────────────────────────────────────────────── */
function ReviewSheet({ location, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", age: "", nationality: "", travelStyle: "Couple", rating: 0, title: "", body: "", youtube: "" });
  const [hover, setHover] = useState(0);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.age && form.nationality && form.rating > 0 && form.title && form.body.length > 30;

  const submit = () => {
    if (!valid) return;
    const initials = form.name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    onSubmit({ id: Date.now(), ...form, initials, date: new Date().toLocaleDateString("en-AU", { month: "short", year: "numeric" }), verified: false });
    onClose();
  };

  return (
    <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-title">Write a Review</div>
        <div className="sheet-sub">Reviewing <strong style={{ color: "var(--terra2)" }}>{location.name}</strong> — honest experiences only, no promotional content accepted.</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input className="form-input" placeholder="e.g. Margaret T." value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Age Group</label>
            <select className="form-select" value={form.age} onChange={e => set("age", e.target.value)}>
              <option value="">Select…</option>
              {["Under 35","35–49","50–54","55–64","65+"].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nationality</label>
            <select className="form-select" value={form.nationality} onChange={e => set("nationality", e.target.value)}>
              <option value="">Select…</option>
              {NAT_OPTS.slice(1).map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Travel Style</label>
            <select className="form-select" value={form.travelStyle} onChange={e => set("travelStyle", e.target.value)}>
              {STYLE_OPTS.slice(1).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your Rating</label>
          <div className="star-row">
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`star-tap ${n <= (hover || form.rating) ? "lit" : ""}`}
                onClick={() => set("rating", n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}>★</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Review Title</label>
          <input className="form-input" placeholder="Sum up your honest experience" value={form.title} onChange={e => set("title", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Your Review</label>
          <textarea className="form-textarea" placeholder="Share what you genuinely experienced — good and bad. Include practical details other travellers your age would value." value={form.body} onChange={e => set("body", e.target.value)} rows={5} />
        </div>

        <div className="form-group">
          <label className="form-label">YouTube / Video Link (optional)</label>
          <input className="form-input" placeholder="https://youtube.com/…" value={form.youtube} onChange={e => set("youtube", e.target.value)} />
        </div>

        <button className="submit-btn" disabled={!valid} onClick={submit}>Submit Honest Review</button>
      </div>
    </div>
  );
}

/* ─── DETAIL SCREEN ──────────────────────────────────────────────────────── */
function DetailScreen({ location, onBack }) {
  const [allReviews, setAllReviews] = useState(SEED_REVIEWS[location.id] || []);
  const [ageF, setAgeF] = useState("All ages");
  const [natF, setNatF] = useState("All origins");
  const [styleF, setStyleF] = useState("All styles");
  const [showSheet, setShowSheet] = useState(false);
  const [toast, setToast] = useState(false);

  const filtered = allReviews.filter(r =>
    (ageF === "All ages" || r.age === ageF) &&
    (natF === "All origins" || r.nationality === natF) &&
    (styleF === "All styles" || r.travelStyle === styleF)
  );

  const handleSubmit = (rev) => {
    setAllReviews(p => [rev, ...p]);
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  return (
    <>
      {/* topbar */}
      <div className="detail-topbar">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="detail-topbar-title">{location.name}</div>
        <button className="icon-btn" onClick={() => setShowSheet(true)}>✏️</button>
      </div>

      <div className="scroll-area">
        {/* hero */}
        <div className="detail-hero">
          <div className="detail-region">{location.region}</div>
          <div className="detail-title">{location.name}</div>
          <div className="detail-stats">
            <div className="stat-item">
              <div className="stat-stars"><Stars n={Math.round(location.avgRating)} size="1rem" /></div>
              <div className="stat-label">{location.avgRating} avg</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{allReviews.length}</div>
              <div className="stat-label">Reviews</div>
            </div>
            <div className="dest-tags" style={{ marginTop: 0 }}>
              {location.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <AISummary location={location} reviews={filtered.length ? filtered : allReviews} ageFilter={ageF} natFilter={natF} />

        {/* filter bar */}
        <div className="rfil-wrap">
          <div className="rfil-row">
            {AGE_OPTS.map(a => <button key={a} className={`filter-pill ${ageF === a ? "active" : ""}`} onClick={() => setAgeF(a)}>{a}</button>)}
          </div>
          <div className="rfil-row" style={{ marginTop: "0.4rem" }}>
            {NAT_OPTS.map(n => <button key={n} className={`filter-pill ${natF === n ? "active" : ""}`} onClick={() => setNatF(n)}>{n}</button>)}
          </div>
          <div className="rfil-row" style={{ marginTop: "0.4rem" }}>
            {STYLE_OPTS.map(s => <button key={s} className={`filter-pill ${styleF === s ? "active" : ""}`} onClick={() => setStyleF(s)}>{s}</button>)}
          </div>
        </div>

        {/* reviews */}
        <div style={{ padding: "0.75rem 1.25rem 0.25rem" }}>
          <div className="section-label" style={{ padding: 0 }}>
            <span className="section-title">Reviews</span>
            <span className="section-count">{filtered.length} of {allReviews.length}</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">No reviews match your filters.<br />Try broadening your selection.</div>
          </div>
        ) : (
          <div className="reviews-wrap">
            {filtered.map(r => (
              <div key={r.id} className="review-card slide-up">
                <div className="rc-header">
                  <div className="rc-left">
                    <div className="avatar" style={{ background: avatarColor(r.initials) }}>{r.initials}</div>
                    <div>
                      <div className="rc-name">{r.name}</div>
                      <div className="rc-meta">
                        <span>{r.nationality}</span><span>·</span>
                        <span>{r.age}</span><span>·</span>
                        <span>{r.travelStyle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rc-right">
                    <div className="rc-stars"><Stars n={r.rating} /></div>
                    <div className="rc-date">{r.date}</div>
                  </div>
                </div>
                <div className="rc-title">{r.title}</div>
                <div className="rc-body">{r.body}</div>
                {r.youtube && <a className="yt-link" href={r.youtube} target="_blank" rel="noopener noreferrer">▶ Watch video review →</a>}
                <div className="rc-footer">
                  {r.verified && <span className="verified-badge"><span className="v-dot" />Verified Visit</span>}
                  <span className="style-badge">{r.travelStyle}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => setShowSheet(true)}>+</button>

      {showSheet && <ReviewSheet location={location} onClose={() => setShowSheet(false)} onSubmit={handleSubmit} />}
      {toast && <div className="toast">✓ Your review has been added — thank you!</div>}
    </>
  );
}

/* ─── EXPLORE SCREEN ─────────────────────────────────────────────────────── */
function ExploreScreen({ onSelectLocation }) {
  const [search, setSearch] = useState("");
  const [ageF, setAgeF] = useState("All ages");
  const [natF, setNatF] = useState("All origins");

  const results = LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.region.toLowerCase().includes(search.toLowerCase()) ||
    l.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="scroll-area">
      <div className="hero-banner">
        <div className="hero-eyebrow">Verified · Independent · Trusted</div>
        <div className="hero-title">Travel reviews you can <em>actually</em> trust</div>
        <div className="hero-sub">No paid placements. No sponsored content. Filter by age and nationality to hear from people who travel like you.</div>
        <div className="trust-pills">
          <span className="trust-pill green">✓ No sponsorships</span>
          <span className="trust-pill green">✓ Verified visits</span>
          <span className="trust-pill">Filter by age</span>
          <span className="trust-pill">AI summaries</span>
        </div>
      </div>

      <div className="search-wrap">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search destinations…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <span onClick={() => setSearch("")} style={{ color: "var(--muted)", cursor: "pointer", fontSize: "0.85rem" }}>✕</span>}
        </div>
      </div>

      <div className="filter-scroll">
        {AGE_OPTS.map(a => <button key={a} className={`filter-pill ${ageF === a ? "active" : ""}`} onClick={() => setAgeF(a)}>{a}</button>)}
      </div>
      <div className="filter-scroll" style={{ paddingTop: 0 }}>
        {NAT_OPTS.map(n => <button key={n} className={`filter-pill ${natF === n ? "active" : ""}`} onClick={() => setNatF(n)}>{n}</button>)}
      </div>

      <div className="section-label">
        <span className="section-title">Destinations</span>
        <span className="section-count">{results.length} places</span>
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🗺️</div>
          <div className="empty-text">No destinations match your search.</div>
        </div>
      ) : (
        <div className="dest-list">
          {results.map(loc => (
            <div key={loc.id} className="dest-card slide-up" onClick={() => onSelectLocation(loc)}>
              <div className="dest-emoji-col">{loc.emoji}</div>
              <div className="dest-body">
                <div className="dest-region">{loc.region}</div>
                <div className="dest-name">{loc.name}</div>
                <div className="dest-meta">
                  <span className="stars"><Stars n={Math.round(loc.avgRating)} /></span>
                  <span className="review-ct">{loc.reviewCount} reviews</span>
                </div>
                <div className="dest-snippet">{loc.snippet}</div>
                <div className="dest-tags">{loc.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PROFILE SCREEN ─────────────────────────────────────────────────────── */
function ProfileScreen() {
  return (
    <div className="scroll-area">
      <div className="profile-wrap">
        <div className="section-head" style={{ marginBottom: "1rem" }}>My Reviewer Profile</div>

        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">MT</div>
            <div>
              <div className="profile-name">Margaret T.</div>
              <div className="profile-sub">Member since 2024 · 3 reviews</div>
            </div>
          </div>
          {[["Age Group","55–64"],["Nationality","Australian"],["Travel Style","Couple"],["YouTube / Blog","Not linked yet"]].map(([k,v]) => (
            <div key={k} className="info-row">
              <span className="info-key">{k}</span>
              <span className="info-val">{v}</span>
            </div>
          ))}
        </div>

        <div className="no-sponsorship-badge" style={{ marginBottom: "1.5rem" }}>
          <div className="nsb-icon">🛡️</div>
          <div>
            <div className="nsb-title">No-Sponsorship Pledge</div>
            <div className="nsb-text">You have pledged to never accept payment, free stays, or incentives in exchange for reviews on TrueTrails. This badge is shown on every review you write.</div>
          </div>
        </div>

        <div className="section-head">Edit Profile</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input className="form-input" defaultValue="Margaret T." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age Group</label>
              <select className="form-select" defaultValue="55–64">
                {["Under 35","35–49","50–54","55–64","65+"].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nationality</label>
              <select className="form-select" defaultValue="Australian">
                {NAT_OPTS.slice(1).map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Travel Style</label>
            <select className="form-select" defaultValue="Couple">
              {STYLE_OPTS.slice(1).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">YouTube / Blog URL (optional)</label>
            <input className="form-input" placeholder="https://…" />
          </div>
          <button className="submit-btn">Save Profile</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("explore");
  const [selectedLoc, setSelectedLoc] = useState(null);

  const handleSelect = (loc) => { setSelectedLoc(loc); setTab("detail"); };
  const handleBack = () => { setSelectedLoc(null); setTab("explore"); };

  const NAV = [
    { id: "explore", icon: "🗺️", label: "Explore" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="shell">
        <div className="status-bar" />

        {/* top bar — shown on explore & profile, replaced on detail */}
        {tab !== "detail" && (
          <div className="topbar">
            <div className="topbar-logo">True<span>Trails</span></div>
            <div className="topbar-right">
              <button className="icon-btn">🔔</button>
              <button className="icon-btn">⚙️</button>
            </div>
          </div>
        )}

        {/* screens */}
        {tab === "explore" && <ExploreScreen onSelectLocation={handleSelect} />}
        {tab === "detail" && selectedLoc && <DetailScreen location={selectedLoc} onBack={handleBack} />}
        {tab === "profile" && <ProfileScreen />}

        {/* bottom nav — hide on detail */}
        {tab !== "detail" && (
          <div className="bottom-nav">
            {NAV.map(n => (
              <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
