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

## Il problema della pagina bianca

Su GitHub Pages un errore che in locale non si vede spesso produce una pagina completamente bianca. Il caso tipico: un file servito che il browser non sa eseguire, o un singolo errore JavaScript durante l'avvio che impedisce di mostrare qualsiasi schermata. Sul telefono non c'è una console in cui leggere l'errore, quindi la pagina bianca non dice niente. Per questo ogni scelta va fatta in modo che il problema non nasca e che, se nasce, si veda.

### Cause da escludere sempre
1. File non eseguibili dal browser: mai .tsx, .jsx, .ts, `import React`, né import di pacchetti per nome (`import x from 'libreria'`). Solo JavaScript che il browser esegue così com'è.
2. Percorsi assoluti: il sito vive in /ux-ui-app/, quindi `/app.js` punta alla root del dominio e restituisce 404. Usa sempre percorsi relativi (`app.js`, `./img/gallina.png`), anche in manifest, icone e link.
3. Maiuscole e minuscole: il filesystem del Mac non le distingue, il server di GitHub Pages sì. `App.js` richiamato come `app.js` funziona in locale e si rompe online. Nomi di file e cartelle tutti minuscoli, con trattini, e riferimenti che corrispondono carattere per carattere.
4. Jekyll: GitHub Pages ignora file e cartelle che iniziano con underscore. Nella root deve sempre esserci un file `.nojekyll` vuoto.
5. Schermate nascoste per default: se tutte le schermate partono con `hidden` e solo il JavaScript ne mostra una, basta un errore all'avvio per lasciare la pagina vuota. Con hash vuoto o non riconosciuto il router deve sempre ripiegare su #home, e l'avvio va protetto con try/catch.
6. Dati corrotti in localStorage: ogni lettura passa per una funzione che fa JSON.parse dentro try/catch e, in caso di errore, torna ai dati di default invece di bloccare l'app.
7. Cache: se un giorno aggiungiamo un service worker, deve usare una strategia network-first e avere una versione da cambiare a ogni rilascio, altrimenti il telefono continua a mostrare una build vecchia o rotta. Finché non serve, niente service worker.

### Rendere visibili gli errori
In cima ad app.js metti un gestore per window.onerror e unhandledrejection che mostri un riquadro rosso fisso in basso nella pagina con messaggio, file e riga. Così un errore si legge anche dal telefono invece di trasformarsi in una pagina bianca.

### Verifica prima di ogni push
- Controlla con grep che non ci siano estensioni .tsx/.jsx/.ts, import di pacchetti per nome o percorsi che iniziano con "/".
- Verifica che ogni file richiamato in HTML, JS, CSS e manifest esista con lo stesso identico nome, maiuscole comprese (confronta con `git ls-files`).
- Se node è disponibile, esegui `node --check app.js`.
- Avvia un server locale dalla cartella che CONTIENE il progetto (`python3 -m http.server 8000`), così l'app risponde su http://localhost:8000/ux-ui-app/ e riproduce lo stesso sottopercorso di GitHub Pages. Controlla con curl che la pagina e tutte le risorse rispondano 200. Non aprire mai index.html con file://, perché il comportamento non è lo stesso.
  - Nota: in locale la cartella del progetto si chiama `git_project`, non `ux-ui-app`. Per riprodurre lo stesso percorso si serve una cartella temporanea che contiene un collegamento simbolico `ux-ui-app` → cartella del progetto (es. `ln -s "<percorso progetto>" <tmp>/ux-ui-app` e `python3 -m http.server 8000` da `<tmp>`).
- Dimmi l'indirizzo locale, così posso controllare io nel browser che non ci siano errori in console.

### Verifica dopo ogni push
Aspetta che la build di Pages finisca (`gh api repos/PaoloBuccioni/ux-ui-app/pages/builds/latest`). Poi controlla con curl che https://paolobuccioni.github.io/ux-ui-app/ e le sue risorse rispondano 200 con la versione appena pubblicata. Se qualcosa non torna, risolvilo prima di passare ad altro.
