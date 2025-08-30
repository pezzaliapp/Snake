# Snake — PezzaliAPP

Un **Snake** moderno, minimale e open‑source in una **singola cartella** (HTML/CSS/JS + PWA).  
Funziona **offline**, supporta **mobile** (swipe + pad) e **desktop** (frecce/WASD).

## ✨ Funzioni
- Modalità **Classica** (muri = KO) e **Avvolgente** (tele‑trasporto ai bordi)
- Griglie: 16×16, 20×20, 24×24
- Velocità iniziale selezionabile + **accelerazione** ogni 4 mele
- **Record** persistente in `localStorage`
- **PWA**: installabile su smartphone/desktop, offline‑first

## ▶️ Avvio locale
Apri `index.html` in un browser moderno.  
Per testare il Service Worker, avvia un server statico (es. `python -m http.server`).

## 📦 Struttura
```
Snake/
  index.html
  script.js
  manifest.json
  sw.js
  icons/
    icon-192.png
    icon-512.png
```

## 🚀 Pubblicazione su GitHub
1. Crea una repository su GitHub (es. **Snake** o **SnakeXapp**).
2. In locale:
   ```bash
   git init
   git add .
   git commit -m "feat: Snake PWA v1.0.0"
   git branch -M main
   git remote add origin https://github.com/<tuo-utente>/<repo>.git
   git push -u origin main
   ```
3. Attiva **GitHub Pages** (Branch: `main`, cartella `/root`).

## 🧪 Controlli rapidi
- **Mobile**: prova swipe e pad; ruota lo schermo → il campo si adatta.
- **Desktop**: frecce o **WASD**; **spazio** per pausa.
- Modalità **Avvolgente** → attraversa il bordo ed esci dal lato opposto.

## 📄 Licenza
MIT © 2025 — PezzaliAPP
