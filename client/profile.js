// Функциональность для страницы профиля
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка данных профиля
    loadProfileData();
    
    // Инициализация модального окна
    initEditModal();
    
    // Обработчики для смены аватара и обложки
    initImageUpload();
    
    // Функциональность постов в профиле
    initProfilePosts();
});

// Загрузка данных профиля из localStorage
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    
    // Заполняем данные на странице
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-bio').textContent = profileData.bio;
    document.getElementById('info-work').textContent = profileData.work;
    document.getElementById('info-education').textContent = profileData.education;
    document.getElementById('info-city').textContent = profileData.city;
    document.getElementById('info-birthday').textContent = profileData.birthday;
    
    // Обновляем увлечения
    updateHobbies(profileData.hobbies);
    
    // Обновляем статистику
    updateStats(profileData.stats);
    
    // Загружаем аватар и обложку
    if (profileData.avatar) {
        document.getElementById('profile-avatar').src = profileData.avatar;
        document.getElementById('user-avatar').src = profileData.avatar;
    }
    
    if (profileData.cover) {
        document.getElementById('cover-image').style.backgroundImage = `url(${profileData.cover})`;
    }
}

// Данные профиля по умолчанию
function getDefaultProfileData() {
    return {
        name: 'Иван Иванов',
        bio: 'Frontend разработчик · Люблю путешествия и технологии',
        work: 'Frontend Developer в IT Company',
        education: 'Университет IT',
        city: 'Москва, Россия',
        birthday: '15 мая 1995',
        hobbies: ['Программирование', 'Фотография', 'Путешествия', 'Гейминг', 'Музыка'],
        stats: {
            posts: 24,
            friends: 156,
            likes: 842
        },
        avatar: '../assets/avatar.jpg',
        cover: '../assets/default-cover.jpg'
    };
}

// Обновление увлечений
function updateHobbies(hobbies) {
    const hobbiesContainer = document.getElementById('hobbies-list');
    hobbiesContainer.innerHTML = '';
    
    hobbies.forEach(hobby => {
        const hobbyElement = document.createElement('span');
        hobbyElement.className = 'hobby-tag';
        hobbyElement.textContent = hobby;
        hobbiesContainer.appendChild(hobbyElement);
    });
}

// Обновление статистики
function updateStats(stats) {
    document.getElementById('posts-count').textContent = stats.posts;
    document.getElementById('friends-count').textContent = stats.friends;
    document.getElementById('likes-count').textContent = stats.likes;
}

// Инициализация модального окна редактирования
function initEditModal() {
    const editProfileBtn = document.getElementById('edit-profile');
    const editModal = document.getElementById('edit-profile-modal');
    const closeModalBtn = document.getElementById('close-edit-modal');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const saveProfileBtn = document.getElementById('save-profile');
    
    // Открытие модального окна
    editProfileBtn.addEventListener('click', function() {
        const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
        
        // Заполняем форму текущими данными
        document.getElementById('edit-name').value = profileData.name;
        document.getElementById('edit-bio').value = profileData.bio;
        document.getElementById('edit-work').value = profileData.work;
        document.getElementById('edit-education').value = profileData.education;
        document.getElementById('edit-city').value = profileData.city;
        document.getElementById('edit-birthday').value = formatDateForInput(profileData.birthday);
        document.getElementById('edit-hobbies').value = profileData.hobbies.join(', ');
        
        editModal.style.display = 'flex';
    });
    
    // Закрытие модального окна
    function closeModal() {
        editModal.style.display = 'none';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    
    // Клик вне модального окна
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeModal();
        }
    });
    
    // Сохранение профиля
    saveProfileBtn.addEventListener('click', function() {
        saveProfileChanges();
        closeModal();
    });
}

// Форматирование даты для input[type="date"]
function formatDateForInput(dateString) {
    // Простая реализация - в реальном приложении нужно использовать библиотеку для дат
    if (dateString.includes('мая')) {
        return '1995-05-15'; // Пример для даты по умолчанию
    }
    return '';
}

// Сохранение изменений профиля
function saveProfileChanges() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    
    // Обновляем данные из формы
    profileData.name = document.getElementById('edit-name').value;
    profileData.bio = document.getElementById('edit-bio').value;
    profileData.work = document.getElementById('edit-work').value;
    profileData.education = document.getElementById('edit-education').value;
    profileData.city = document.getElementById('edit-city').value;
    profileData.birthday = formatDateForDisplay(document.getElementById('edit-birthday').value);
    profileData.hobbies = document.getElementById('edit-hobbies').value.split(',').map(h => h.trim()).filter(h => h);
    
    // Сохраняем в localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Обновляем отображение
    loadProfileData();
    
    // Показываем уведомление
    showNotification('Профиль успешно обновлен!');
}

// Форматирование даты для отображения
function formatDateForDisplay(dateString) {
    if (!dateString) return '15 мая 1995';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// Инициализация загрузки изображений
function initImageUpload() {
    const editAvatarBtn = document.getElementById('edit-avatar');
    const editCoverBtn = document.getElementById('edit-cover');
    
    editAvatarBtn.addEventListener('click', function() {
        // В реальном приложении здесь был бы код для выбора файла
        const newAvatarUrl = prompt('Введите URL нового аватара (оставьте пустым для сброса):');
        if (newAvatarUrl !== null) {
            updateAvatar(newAvatarUrl || '../assets/avatar.jpg');
        }
    });
    
    editCoverBtn.addEventListener('click', function() {
        // В реальном приложении здесь был бы код для выбора файла
        const newCoverUrl = prompt('Введите URL новой обложки (оставьте пустым для сброса):');
        if (newCoverUrl !== null) {
            updateCover(newCoverUrl || '../assets/default-cover.jpg');
        }
    });
}

// Обновление аватара
function updateAvatar(url) {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    profileData.avatar = url;
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    document.getElementById('profile-avatar').src = url;
    document.getElementById('user-avatar').src = url;
    
    showNotification('Аватар успешно обновлен!');
}

// Обновление обложки
function updateCover(url) {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    profileData.cover = url;
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    document.getElementById('cover-image').style.backgroundImage = `url(${url})`;
    showNotification('Обложка успешно обновлена!');
}

// Инициализация постов в профиле
function initProfilePosts() {
    const publishBtn = document.getElementById('profile-publish');
    const postText = document.getElementById('profile-post-text');
    
    // Загружаем существующие посты
    loadProfilePosts();
    
    // Публикация нового поста
    publishBtn.addEventListener('click', function() {
        if (postText.value.trim() !== '') {
            createNewPost(postText.value);
            postText.value = '';
        } else {
            alert('Введите текст поста');
        }
    });
    
    // Enter для публикации
    postText.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            publishBtn.click();
        }
    });
}

// Загрузка постов профиля
function loadProfilePosts() {
    const postsContainer = document.getElementById('profile-posts');
    const posts = JSON.parse(localStorage.getItem('profilePosts')) || [];
    
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="empty-state">У вас пока нет публикаций</div>';
        return;
    }
    
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
            <img src="${post.avatar}" alt="Аватар" class="user-avatar">
            <div class="post-user">
                <h3>${post.author}</h3>
                <span>${post.time}</span>
            </div>
        </div>
        <div class="post-content">
            <p>${post.text}</p>
            ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Изображение поста"></div>` : ''}
        </div>
        <div class="post-actions">
            <button class="action-btn like-btn"><i class="far fa-heart"></i> <span>${post.likes}</span></button>
            <button class="action-btn comment-btn"><i class="far fa-comment"></i> <span>${post.comments}</span></button>
            <button class="action-btn share-btn"><i class="far fa-share-square"></i> <span>Поделиться</span></button>
        </div>
    `;
    
    return postElement;
}

// Создание нового поста
function createNewPost(text) {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    const posts = JSON.parse(localStorage.getItem('profilePosts')) || [];
    
    const newPost = {
        id: Date.now(),
        author: profileData.name,
        avatar: profileData.avatar,
        text: text,
        time: 'Только что',
        likes: 0,
        comments: 0,
        image: null // Можно добавить функциональность загрузки изображений
    };
    
    posts.unshift(newPost);
    localStorage.setItem('profilePosts', JSON.stringify(posts));
    
    // Обновляем статистику
    profileData.stats.posts += 1;
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Перезагружаем посты и статистику
    loadProfilePosts();
    updateStats(profileData.stats);
    
    showNotification('Пост опубликован!');
}

// Показ уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
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

// Добавляем анимации для уведомлений в CSS
const style = document.createElement('style');
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
`;
document.head.appendChild(style);