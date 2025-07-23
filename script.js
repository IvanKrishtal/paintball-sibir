document.addEventListener('DOMContentLoaded', function() {
  // Анимация элементов
  document.querySelectorAll('section, .image-container').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  // PWA Установка
  let deferredPrompt;
  const installBtn = document.createElement('button');
  installBtn.className = 'install-btn';
  installBtn.textContent = 'Установить приложение';
  document.body.appendChild(installBtn);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
    
    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Приложение установлено');
      }
      deferredPrompt = null;
    });
  });

  // Регистрация Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker зарегистрирован'))
        .catch(err => console.log('Ошибка:', err));
    });
  }
});
