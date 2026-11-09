// ===== Riquadro degli errori =====
// Deve restare in cima al file: un errore va mostrato sulla pagina, perché sul telefono non c'è una console.
// Gli stili sono scritti qui (e non con Tailwind o style.css) apposta: il riquadro deve funzionare
// anche quando il CDN di Tailwind o style.css non si caricano. È uno strumento di debug, non parte del design.
(function () {
  function mostraErrore(messaggio, file, riga, colonna) {
    let box = document.getElementById('riquadro-errori');
    if (!box) {
      box = document.createElement('div');
      box.id = 'riquadro-errori';
      box.setAttribute('role', 'alert');
      box.style.cssText = [
        'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:2147483647',
        'max-height:45dvh', 'overflow:auto',
        'padding:12px 16px calc(12px + env(safe-area-inset-bottom))',
        'background:#B00020', 'color:#FFFFFF',
        'font:14px/1.4 ui-monospace,Menlo,monospace', 'white-space:pre-wrap', 'word-break:break-word',
      ].join(';');
      (document.body || document.documentElement).appendChild(box);
    }
    const dove = file ? `\n${String(file).split('/').pop()}${riga ? `:${riga}` : ''}${colonna ? `:${colonna}` : ''}` : '';
    const voce = document.createElement('div');
    voce.style.cssText = 'padding:4px 0;border-top:1px solid rgba(255,255,255,.3)';
    voce.textContent = `⚠️ ${messaggio}${dove}`;
    box.appendChild(voce);
  }
  window.mostraErrore = mostraErrore;

  window.onerror = function (messaggio, file, riga, colonna) {
    mostraErrore(messaggio, file, riga, colonna);
  };

  window.addEventListener('unhandledrejection', function (evento) {
    const r = evento.reason;
    mostraErrore(`Promise rifiutata: ${r && r.message ? r.message : r}`, r && r.fileName, r && r.lineNumber);
  });

  // Risorse che non si caricano (script, CSS, immagini): gli eventi non risalgono, si intercettano in cattura
  window.addEventListener('error', function (evento) {
    const el = evento.target;
    if (el && el !== window && (el.src || el.href)) {
      mostraErrore(`Risorsa non caricata: <${el.tagName.toLowerCase()}>`, el.src || el.href);
    }
  }, true);
})();

// ===== Dati in localStorage =====
// Ogni lettura passa da qui: se i dati sono assenti o corrotti si torna ai valori di default.
function leggiDati(chiave, predefinito) {
  try {
    const grezzo = localStorage.getItem(chiave);
    return grezzo === null ? predefinito : JSON.parse(grezzo);
  } catch (errore) {
    console.warn(`Dati non leggibili per "${chiave}", uso i valori di default`, errore);
    return predefinito;
  }
}

function salvaDati(chiave, valore) {
  try {
    localStorage.setItem(chiave, JSON.stringify(valore));
    return true;
  } catch (errore) {
    console.warn(`Impossibile salvare "${chiave}"`, errore);
    return false;
  }
}

// ===== Routing basato sull'hash =====
// Ogni <section data-pagina> è una schermata e il suo id è il percorso.
// #home è visibile già nell'HTML: se il JavaScript si blocca, la pagina non resta bianca.
(function () {
  const PAGINA_INIZIALE = 'home';
  let pagine = [];
  let ordine = [];
  let paginaCorrente = null;

  function mostra() {
    const richiesta = location.hash.slice(1);
    const id = ordine.includes(richiesta) ? richiesta : PAGINA_INIZIALE;
    if (id === paginaCorrente) return;

    // Direzione dell'animazione: avanti entra da destra, indietro da sinistra
    const avanti = paginaCorrente === null || ordine.indexOf(id) > ordine.indexOf(paginaCorrente);

    pagine.forEach((p) => {
      const attiva = p.id === id;
      p.classList.toggle('hidden', !attiva);
      p.classList.toggle('flex', attiva);
      p.classList.remove('animate-entra-da-destra', 'animate-entra-da-sinistra');
      if (attiva) {
        void p.offsetWidth; // riavvia l'animazione
        p.classList.add(avanti ? 'animate-entra-da-destra' : 'animate-entra-da-sinistra');
      }
    });

    paginaCorrente = id;
    window.scrollTo(0, 0);
  }

  try {
    pagine = Array.from(document.querySelectorAll('[data-pagina]'));
    ordine = pagine.map((p) => p.id);
    window.addEventListener('hashchange', function () {
      try { mostra(); } catch (errore) { window.mostraErrore(errore.message, errore.fileName, errore.lineNumber); }
    });
    mostra();
  } catch (errore) {
    window.mostraErrore(`Avvio non riuscito: ${errore.message}`, errore.fileName, errore.lineNumber);
  }
})();
