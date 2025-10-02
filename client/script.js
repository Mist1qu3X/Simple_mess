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

// API функции
const API_BASE = '';

// Загрузка постов
async function loadPosts() {
    try {
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            postsContainer.innerHTML = '<div class="loading">Загрузка постов...</div>';
        }

        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Ошибка загрузки постов');
        
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Ошибка загрузки постов:', error);
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            postsContainer.innerHTML = '<div class="error">Не удалось загрузить посты</div>';
        }
    }
}

// Отображение постов
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="empty-state">Пока нет постов</div>';
        return;
    }

    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Создание элемента поста
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${post.author?.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}" alt="Аватар" class="user-avatar">
            <div class="post-user">
                <h3>${post.author?.name || 'Пользователь'}</h3>
                <span>${formatPostDate(post.createdAt)}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
        </div>
        <div class="post-actions">
            <button class="action-btn like-btn"><i class="far fa-heart"></i> <span>${post.likes || 0}</span></button>
            <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${post.comments || 0}</span></button>
            <button class="action-btn share-btn"><i class="far fa-share-square"></i> <span>Поделиться</span></button>
        </div>
    `;
    
    return postElement;
}

// Создание нового поста
async function createPost(content) {
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                authorId: 1 // Временное значение, пока нет системы авторизации
            })
        });
        
        if (response.ok) {
            return true;
        }
        throw new Error('Ошибка создания поста');
    } catch (error) {
        console.error('Ошибка создания поста:', error);
        return false;
    }
}

// Загрузка пользователей (для страницы друзей)
async function loadUsers() {
    try {
        const friendsContainer = document.getElementById('friends-container');
        if (friendsContainer) {
            friendsContainer.innerHTML = '<div class="loading">Загрузка друзей...</div>';
        }

        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Ошибка загрузки пользователей');
        
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        const friendsContainer = document.getElementById('friends-container');
        if (friendsContainer) {
            friendsContainer.innerHTML = '<div class="error">Не удалось загрузить список друзей</div>';
        }
    }
}

// Отображение пользователей
function displayUsers(users) {
    const friendsContainer = document.getElementById('friends-container');
    if (!friendsContainer) return;

    if (users.length === 0) {
        friendsContainer.innerHTML = '<div class="empty-state">Пока нет друзей</div>';
        return;
    }

    friendsContainer.innerHTML = '';
    users.forEach(user => {
        const userElement = createUserElement(user);
        friendsContainer.appendChild(userElement);
    });
}

// Создание элемента пользователя
function createUserElement(user) {
    const userElement = document.createElement('div');
    userElement.className = 'friend-card';
    userElement.innerHTML = `
        <img src="${user.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}" alt="Аватар ${user.name}" class="user-avatar">
        <div class="friend-info">
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <span>Online</span>
        </div>
        <button class="friend-action">Написать</button>
    `;
    
    return userElement;
}

// Форматирование даты поста
function formatPostDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU');
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Основная инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Обработка лайков
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) {
            const button = e.target.closest('.like-btn');
            const icon = button.querySelector('i');
            const countSpan = button.querySelector('span');
            let count = parseInt(countSpan.textContent);
            
            if (button.classList.contains('active')) {
                button.classList.remove('active');
                icon.classList.remove('fas');
                icon.classList.add('far');
                countSpan.textContent = count - 1;
                button.style.color = '';
            } else {
                button.classList.add('active');
                icon.classList.remove('far');
                icon.classList.add('fas');
                countSpan.textContent = count + 1;
                
                button.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }
        }
    });
    
    // Публикация поста на главной
    const publishBtn = document.getElementById('publish-btn');
    const postText = document.getElementById('post-text');
    
    if (publishBtn && postText) {
        publishBtn.addEventListener('click', async () => {
            if (postText.value.trim() !== '') {
                const success = await createPost(postText.value.trim());
                if (success) {
                    postText.value = '';
                    showNotification('Пост опубликован!', 'success');
                    loadPosts(); // Перезагружаем посты
                } else {
                    showNotification('Ошибка публикации', 'error');
                }
            } else {
                showNotification('Введите текст поста', 'error');
            }
        });
        
        postText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                publishBtn.click();
            }
        });
    }
    
    // Поиск друзей
    const searchInput = document.getElementById('search-friends');
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
    
    // Обработка кнопок "Написать"
    document.addEventListener('click', function(e) {
        if (e.target.closest('.friend-action')) {
            const button = e.target.closest('.friend-action');
            const friendName = button.closest('.friend-card').querySelector('h3').textContent;
            showNotification(`Открывается чат с ${friendName}`, 'info');
        }
    });
    
    // Переход на профиль
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            let profilePath = 'pages/profile.html';
            
            if (window.location.pathname.includes('/pages/')) {
                profilePath = 'profile.html';
            }
            
            window.location.href = profilePath;
        });
        
        userAvatar.style.cursor = 'pointer';
        userAvatar.title = 'Мой профиль';
    }
    
    // Загрузка данных в зависимости от страницы
    if (document.getElementById('posts-container')) {
        loadPosts(); // Главная страница
    }
    
    if (document.getElementById('friends-container')) {
        loadUsers(); // Страница друзей
    }
    
    // Активная навигация
    updateActiveNavigation();
});

// Обновление активной навигации
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        const tabHref = tab.getAttribute('href');
        
        if (currentPage === 'index.html' && (tabHref === 'index.html' || tabHref === '../index.html')) {
            tab.classList.add('active');
        } else if (currentPage === 'friends.html' && tabHref === 'friends.html') {
            tab.classList.add('active');
        } else if (currentPage === 'chats.html' && tabHref === 'chats.html') {
            tab.classList.add('active');
        } else if (currentPage === 'profile.html' && tabHref === 'profile.html') {
            tab.classList.add('active');
        } else if (currentPage === 'index.html' && tabHref.includes('pages/')) {
            tab.classList.remove('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Анимации при загрузке
window.addEventListener('load', () => {
    const postCards = document.querySelectorAll('.post-card');
    const friendCards = document.querySelectorAll('.friend-card');
    
    postCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    friendCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Добавляем стили для уведомлений и состояний загрузки
if (!document.querySelector('#dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
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
        
        .loading, .error, .empty-state {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
            background: var(--bg-secondary);
            border-radius: 1rem;
            margin: 1rem 0;
        }
        
        .error {
            color: #ef4444;
            border: 1px solid #ef4444;
        }
        
        .navbar.scrolled {
            background-color: var(--nav-bg);
            backdrop-filter: blur(20px);
        }
        
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

console.log('Social Network initialized');