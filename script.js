document.addEventListener('DOMContentLoaded', function() {
  // Кнопка "Наверх"
  const backToTopButton = document.createElement('button');
  backToTopButton.className = 'back-to-top';
  backToTopButton.innerHTML = '↑';
  backToTopButton.title = 'Наверх';
  backToTopButton.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(backToTopButton);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });
  
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Анимация элементов при загрузке
  const animateOnLoad = () => {
    const elements = document.querySelectorAll('section, .image-container, .advantage, .form-group');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150 * index);
    });
  };

  setTimeout(animateOnLoad, 500);

  // Регистрация Service Worker для PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker зарегистрирован успешно:', registration.scope);
          
          // Проверка обновлений каждые 24 часа
          setInterval(() => {
            registration.update().then(() => {
              console.log('Проверка обновлений ServiceWorker');
            });
          }, 86400000);
        })
        .catch(err => {
          console.log('Ошибка регистрации ServiceWorker:', err);
        });
    });
  }

  // Отображение установки PWA
  let deferredPrompt;
  const installButton = document.createElement('button');
  installButton.className = 'install-btn';
  installButton.textContent = 'Установить приложение';
  installButton.style.display = 'none';
  document.body.appendChild(installButton);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', () => {
      installButton.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Пользователь установил PWA');
        } else {
          console.log('Пользователь отказался от установки');
        }
        deferredPrompt = null;
      });
    });
  });

  // Проверка режима PWA
  window.addEventListener('appinstalled', () => {
    console.log('Приложение успешно установлено');
    installButton.style.display = 'none';
  });

  // Проверка, открыто ли приложение как PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Запущено как PWA');
  }
});