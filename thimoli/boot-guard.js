// A failed download must not leave a blank screen or erase local progress.
window.addEventListener('load', () => {
  const app = document.getElementById('app');
  if (!app || app.children.length) return;
  const language = ['en','de'].includes(document.documentElement.lang) ? document.documentElement.lang : 'fr';
  const copy = {
    fr: ['Le chargement a été interrompu', 'Vérifie ta connexion puis réessaie. Tes données locales ne sont pas effacées.', 'Réessayer', 'Contacter Thimoli'],
    en: ['Loading was interrupted', 'Check your connection and try again. Your local data has not been erased.', 'Try again', 'Contact Thimoli'],
    de: ['Das Laden wurde unterbrochen', 'Prüfe deine Verbindung und versuche es erneut. Deine lokalen Daten wurden nicht gelöscht.', 'Erneut versuchen', 'Thimoli kontaktieren']
  }[language];
  const section = document.createElement('section'); section.className = 'app-view'; section.setAttribute('role','alert');
  const heading=document.createElement('h1'); heading.textContent=copy[0];
  const body=document.createElement('p'); body.textContent=copy[1];
  const retry=document.createElement('button'); retry.type='button'; retry.className='primary'; retry.textContent=copy[2]; retry.addEventListener('click',()=>location.reload());
  const contact=document.createElement('a'); contact.href='mailto:contact.thimoli@gmail.com'; contact.textContent=copy[3];
  section.append(heading,body,retry,contact); app.append(section);
});
