// Routing basato sull'hash: ogni <section data-pagina> è una schermata, il suo id è il percorso.
(function () {
  const PAGINA_INIZIALE = 'pagina-1';
  const pagine = Array.from(document.querySelectorAll('[data-pagina]'));
  const ordine = pagine.map((p) => p.id);
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

  window.addEventListener('hashchange', mostra);
  mostra();
})();
