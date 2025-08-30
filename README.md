Perfetto 🙌 Ecco il README.md aggiornato con un bel badge “Play Online” subito sotto al titolo:

# 🐍🍎 Snake — PezzaliAPP

[![Play Online](https://img.shields.io/badge/Play%20Online-Snake-green?style=for-the-badge&logo=apple)](https://www.alessandropezzali.it/Snake/)
[![Fork on GitHub](https://img.shields.io/badge/Fork%20me%20on-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/pezzaliapp/Snake.git)

![Icona Snake](icons/icon-192.png)

Un **Snake Game** moderno, elegante e open-source.  
Sviluppato come **PWA**: funziona **offline**, è **installabile** su desktop e mobile, con controlli ottimizzati per **tastiera**, **swipe** e **pad touch**.

---

## 🎮 Funzionalità

- 🟢 **Serpente verde** in stile classico  
- 🍎 **Mela rossa** come obiettivo da mangiare  
- 🧱 Modalità **Classica** (muri = KO)  
- 🔄 Modalità **Avvolgente** (passi attraverso i bordi)  
- 📏 Griglie disponibili: **16×16**, **20×20**, **24×24**  
- ⚡ Velocità iniziale selezionabile + **accelerazione progressiva**  
- 🏆 **Record salvato** in LocalStorage  
- 📱 **Touch support**: swipe + pad su mobile  
- 💻 **Desktop support**: frecce, WASD, spazio (pausa)  
- 📦 **PWA installabile**: gioca anche offline  

---

## 📸 Anteprima

<p align="center">
  <img src="icons/icon-512.png" alt="Snake Icon" width="160">
</p>

---

## 🚀 Avvio locale

Clona la repo e apri `index.html` in un browser moderno.

```bash
git clone https://github.com/pezzaliapp/Snake.git
cd Snake

Per testare il Service Worker (offline mode), avvia un server statico:

python -m http.server

Apri http://localhost:8000.

⸻

🕹️ Comandi
	•	⬆️⬇️⬅️➡️ / WASD → Muovi il serpente
	•	␣ (spazio) → Pausa
	•	📱 Mobile → Swipe o pulsanti pad

⸻

📂 Struttura

Snake/
  index.html
  script.js
  manifest.json
  sw.js
  icons/
    icon-192.png
    icon-512.png
    favicon.png
    favicon.ico


⸻

📄 Licenza

MIT © 2025 — PezzaliAPP
Sviluppato con ❤️ per rendere open-source anche il divertimento.

⸻


Vuoi che ti prepari anche una **cover grafica orizzontale** (tipo banner 1280×640) con il titolo *Snake — PezzaliAPP*, icona e sfondo scuro, da usare come intestazione della repo?
