// Inform, never reload automatically: an answer in progress must stay intact.
(() => {
  const messages = {
    fr: 'Connexion interrompue. Tu peux continuer ce qui est déjà chargé ; certains sons et textes peuvent être indisponibles.',
    en: 'Connection lost. You can continue with content already loaded; some audio and texts may be unavailable.',
    de: 'Verbindung unterbrochen. Bereits geladene Inhalte kannst du weiter nutzen; manche Audios und Texte sind möglicherweise nicht verfügbar.'
  };
  let banner;
  function update() {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'connection-notice';
      banner.setAttribute('role', 'status');
      banner.setAttribute('aria-live', 'polite');
      document.body.append(banner);
    }
    banner.hidden = navigator.onLine !== false;
    banner.textContent = messages[document.documentElement.lang] || messages.fr;
  }
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  window.addEventListener('DOMContentLoaded', () => {
    update();
    new MutationObserver(update).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  });
})();
