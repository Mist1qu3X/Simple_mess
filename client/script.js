// Переключение темы
const themeToggle = document.getElementById('theme-toggle');
let themeIcon;

if (themeToggle) {
    themeIcon = themeToggle.querySelector('i');
}

// Проверяем сохраненную тему в localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
    updateThemeIcon();
}

// Обработчик переключения темы
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        // Сохраняем выбор темы
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark-theme');
        } else {
            localStorage.setItem('theme', '');
        }
        
        updateThemeIcon();
    });
}

// Обновление иконки темы
function updateThemeIcon() {
    if (!themeIcon) return;
    
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Переключить на светлую тему');
        }
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Переключить на тёмную тему');
        }
    }
}

// Обработка лайков
document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent);
            
            // Переключение состояний лайка
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                icon.classList.remove('fas');
                icon.classList.add('far');
                countSpan.textContent = count - 1;
                this.style.color = '';
            } else {
                this.classList.add('active');
                icon.classList.remove('far');
                icon.classList.add('fas');
                countSpan.textContent = count + 1;
                
                // Анимация "пульсации"
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Обработка кнопки публикации (только на главной)
    const publishBtn = document.querySelector('.publish-btn');
    const postText = document.querySelector('.post-text');
    
    if (publishBtn && postText) {
        publishBtn.addEventListener('click', () => {
            if (postText.value.trim() !== '') {
                alert('Пост опубликован!');
                postText.value = '';
            } else {
                alert('Введите текст поста');
            }
        });
        
        // Enter для публикации
        postText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                publishBtn.click();
            }
        });
    }
    
    // Обработка кнопок "Написать" на странице друзей
    const friendActions = document.querySelectorAll('.friend-action');
    friendActions.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const friendName = this.closest('.friend-card').querySelector('h3').textContent;
            alert(`Открывается чат с ${friendName}`);
        });
    });
    
    // Обработка кликов по чатам
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(chat => {
        chat.addEventListener('click', function() {
            const chatName = this.querySelector('h3').textContent;
            alert(`Открывается чат с ${chatName}`);
            
            // Убираем бейдж при открытии чата
            const badge = this.querySelector('.chat-badge');
            if (badge) {
                badge.remove();
            }
        });
    });
    
    // Поиск друзей
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const friendCards = document.querySelectorAll('.friend-card');
            
            friendCards.forEach(card => {
                const friendName = card.querySelector('h3').textContent.toLowerCase();
                if (friendName.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Переход на страницу профиля при клике на аватар
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            // Определяем правильный путь к профилю в зависимости от текущей страницы
            let profilePath = 'pages/profile.html';
            
            // Если мы уже в папке pages, путь будет другим
            if (window.location.pathname.includes('/pages/') || 
                window.location.href.includes('/pages/')) {
                profilePath = 'profile.html';
            }
            
            window.location.href = profilePath;
        });
        
        // Добавляем курсор-указатель
        userAvatar.style.cursor = 'pointer';
        
        // Добавляем подсказку при наведении
        userAvatar.title = 'Мой профиль';
    }
    
    // Активная навигация
    updateActiveNavigation();
});

// Функция для обновления активной навигации
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        const tabHref = tab.getAttribute('href');
        
        // Для главной страницы
        if (currentPage === 'index.html' && (tabHref === 'index.html' || tabHref === '../index.html')) {
            tab.classList.add('active');
        }
        // Для страницы друзей
        else if (currentPage === 'friends.html' && tabHref === 'friends.html') {
            tab.classList.add('active');
        }
        // Для страницы чатов
        else if (currentPage === 'chats.html' && tabHref === 'chats.html') {
            tab.classList.add('active');
        }
        // Для страницы профиля
        else if (currentPage === 'profile.html' && tabHref === 'profile.html') {
            tab.classList.add('active');
        }
        // Для случаев когда мы на главной, а ссылка ведет на pages/...
        else if (currentPage === 'index.html' && tabHref.includes('pages/')) {
            tab.classList.remove('active');
        }
        else {
            tab.classList.remove('active');
        }
    });
}

// Анимация появления элементов при загрузке
window.addEventListener('load', () => {
    const postCards = document.querySelectorAll('.post-card');
    const friendCards = document.querySelectorAll('.friend-card');
    const chatItems = document.querySelectorAll('.chat-item');
    
    // Анимация для постов
    postCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Анимация для карточек друзей
    friendCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Анимация для чатов
    chatItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Обработка ошибок изображений
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff';
            this.alt = 'Изображение не загружено';
        });
    });
});

// Плавный скролл для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Добавляем класс при скролле для навигации
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', () => {
    console.log('СоцСеть загружена!');
    
    // Проверяем поддержку localStorage
    if (typeof(Storage) === "undefined") {
        console.warn('LocalStorage не поддерживается, тема не будет сохраняться');
    }
});

// Функция для показа уведомлений (используется в profile.js)
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем анимации для уведомлений в CSS, если их еще нет
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .navbar.scrolled {
            background-color: var(--nav-bg);
            backdrop-filter: blur(20px);
        }
        
        /* Кастомный скроллбар */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent);
        }
    `;
    document.head.appendChild(style);
}

// Функция для загрузки данных пользователя (используется в разных местах)
function getUserData() {
    return JSON.parse(localStorage.getItem('userData')) || {
        name: 'Пользователь',
        avatar: 'https://ui-avatars.com/api/?name=Пользователь&background=6366f1&color=fff'
    };
}

// Функция для обновления аватара в навигации
function updateNavigationAvatar(avatarUrl) {
    const navAvatars = document.querySelectorAll('.nav-controls .user-avatar');
    navAvatars.forEach(avatar => {
        avatar.src = avatarUrl;
    });
}

// Утилита для форматирования даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Вчера';
    } else if (diffDays < 7) {
        return `${diffDays} дней назад`;
    } else {
        return date.toLocaleDateString('ru-RU');
    }
}

// Функция для проверки авторизации (можно расширить)
function checkAuth() {
    const userData = localStorage.getItem('userData');
    if (!userData && window.location.pathname.includes('pages/')) {
        // Если пользователь не авторизован и пытается зайти на защищенную страницу
        // window.location.href = '../index.html';
    }
}

// Вызываем проверку авторизации при загрузке
document.addEventListener('DOMContentLoaded', checkAuth);