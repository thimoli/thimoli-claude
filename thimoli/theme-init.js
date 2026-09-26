// Apply before CSS paints, without modifying learning progress or settings.
(() => {
  let preference = 'light';
  try { preference = JSON.parse(localStorage.getItem('thimoli-v1.1-premium-state') || '{}').settings?.theme || 'light'; } catch (_) {}
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    const theme = preference === 'dark' || (preference === 'system' && media.matches) ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111c23' : '#fff9f2');
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme);
  };
  apply();
  media.addEventListener?.('change', () => {
    try { preference = JSON.parse(localStorage.getItem('thimoli-v1.1-premium-state') || '{}').settings?.theme || 'light'; } catch (_) {}
    if (preference === 'system') apply();
  });
})();
