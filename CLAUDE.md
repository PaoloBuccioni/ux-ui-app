# Cock Rating — regole del progetto

Prototipo statico (esame UX/UI Design, NABA): a metà tra un gestionale del pollaio e un social tra allevatori. Pubblicato su GitHub Pages: https://paolobuccioni.github.io/ux-ui-app/

## Regole

- Sito completamente statico per GitHub Pages: niente React, TypeScript, JSX, bundler o passaggi di build. Solo HTML, JavaScript vanilla e Tailwind via CDN.
- Struttura: `index.html` + `app.js` + `style.css`. Se il professore richiede un file unico, li accorperemo alla consegna.
- Navigazione tra schermate con routing basato sull'hash (`#home`, `#pollaio`, `#profilo-gallina`…), così il gesto "indietro" del telefono funziona e ogni schermata ha un link diretto.
- Dati del gestionale salvati in `localStorage`; la parte social usa dati finti scritti nel codice.
- Mobile first: altezze in `dvh`, safe area con `env(safe-area-inset-*)`, input con font-size di almeno 16px, aree toccabili di almeno 44px.
- Colori, font e spaziature definiti come design token nella configurazione di Tailwind (blocco `tailwind.config` in `index.html`), mai valori scritti a mano sui singoli elementi.
- Percorsi sempre relativi: il sito vive in `/ux-ui-app/`, non nella root del dominio.
- Commit frequenti, uno per ogni modifica sensata, con messaggi in italiano che dicano cosa cambia. Push alla fine di ogni blocco di lavoro o quando richiesto.
