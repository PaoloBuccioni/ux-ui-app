# Cock Rating — regole del progetto

Prototipo statico (esame UX/UI Design, NABA): a metà tra un gestionale del pollaio e un social tra allevatori. Pubblicato su GitHub Pages: https://paolobuccioni.github.io/ux-ui-app/

## Dispositivo di riferimento

Tutta l'app è pensata per lo schermo di un **iPhone 13 mini** (viewport 375 × 812 punti CSS, con notch e home indicator) e deve funzionare bene anche sugli altri telefoni, più piccoli o più grandi. Ogni schermata va progettata e verificata prima a 375 × 812, poi controllata su larghezze diverse (da 320 a circa 430 px) senza scroll orizzontale né contenuti tagliati.

## Regole

- Sito completamente statico per GitHub Pages: niente React, TypeScript, JSX, bundler o passaggi di build. Solo HTML, JavaScript vanilla e Tailwind via CDN.
- Struttura: `index.html` + `app.js` + `style.css`. Se il professore richiede un file unico, li accorperemo alla consegna.
- Navigazione tra schermate con routing basato sull'hash (`#home`, `#pollaio`, `#profilo-gallina`…), così il gesto "indietro" del telefono funziona e ogni schermata ha un link diretto.
- Dati del gestionale salvati in `localStorage`; la parte social usa dati finti scritti nel codice.
- Mobile first: altezze in `dvh`, safe area con `env(safe-area-inset-*)`, input con font-size di almeno 16px, aree toccabili di almeno 44px.
- Colori, font e spaziature definiti come design token nella configurazione di Tailwind (blocco `tailwind.config` in `index.html`), mai valori scritti a mano sui singoli elementi.
- Percorsi sempre relativi: il sito vive in `/ux-ui-app/`, non nella root del dominio.
- Commit frequenti, uno per ogni modifica sensata, con messaggi in italiano che dicano cosa cambia. Push alla fine di ogni blocco di lavoro o quando richiesto.
