document.addEventListener('DOMContentLoaded', function() {
  // ==================== Кнопка "Наверх" ====================
  const backToTopButton = document.createElement('button');
  backToTopButton.className = 'back-to-top';
  backToTopButton.innerHTML = '↑';
  backToTopButton.title = 'Наверх';
  backToTopButton.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(backToTopButton);
  
  window.addEventListener('scroll', function() {
    backToTopButton.classList.toggle('show', window.pageYOffset > 300);
  });
  
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==================== Анимация элементов ====================
  const animateElements = () => {
    document.querySelectorAll('section, .image-container, .advantage, .form-group').forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150 * index);
    });
  };
  setTimeout(animateElements, 500);

  // ==================== PWA Функционал ====================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('ServiceWorker успешно зарегистрирован:', registration.scope);
        
        // Автоматическая проверка обновлений
        registration.addEventListener('updatefound', () => {
          console.log('Обнаружено обновление Service Worker');
        });
        
        // Проверка обновлений при фокусе на вкладке
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) registration.update();
        });
        
      } catch (err) {
        console.error('Ошибка регистрации ServiceWorker:', err);
      }
    });
  }

  // ==================== Установка PWA ====================
  let deferredPrompt;
  const installButton = document.createElement('button');
  installButton.className = 'install-btn';
  installButton.textContent = 'Установить приложение';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: #E63946;
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 1000;
    display: none;
  `;
  document.body.appendChild(installButton);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
    
    installButton.onclick = async () => {
      installButton.style.display = 'none';
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Пользователь ${outcome === 'accepted' ? 'принял' : 'отклонил'} установку`);
      } catch (err) {
        console.error('Ошибка установки:', err);
      }
      deferredPrompt = null;
    };
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA успешно установлено');
    installButton.style.display = 'none';
    // Можно показать сообщение об успешной установке
  });

  // ==================== Проверка PWA режима ====================
  const checkPWAStatus = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Запущено в PWA режиме');
      // Можно скрыть установочную кнопку
      installButton.style.display = 'none';
    }
  };
  
  // Проверяем при загрузке и при изменении режима
  checkPWAStatus();
  window.matchMedia('(display-mode: standalone)').addListener(checkPWAStatus);
});

// ==================== Оптимизация производительности ====================
// Отложенная загрузка не критичных ресурсов
window.addEventListener('load', function() {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // Загрузка дополнительных ресурсов
    });
  }
});
