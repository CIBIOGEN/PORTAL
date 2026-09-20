// js/login.js — lógica del carnet virtual (perfil + muro) con localStorage
(() => {
    const form = document.getElementById('login-form');
    const avatarInput = document.getElementById('avatar');
    const clearBtn = document.getElementById('clear');
    if (!form) return;

    function loadUser() {
        try { return JSON.parse(localStorage.getItem('cibiogen_user')); }
        catch (e) { return null; }
    }

    function saveUser(u) { localStorage.setItem('cibiogen_user', JSON.stringify(u)); }

    function showProfile() {
        const u = loadUser();
        if (!u) return;
        document.getElementById('profile-name').textContent = u.name || 'Usuario';
        document.getElementById('profile-email').textContent = u.email || '';
        document.getElementById('profile-avatar').src = u.avatar || 'img/Libro1.jpg';
        document.getElementById('profile-view').style.display = 'block';
        document.getElementById('welcome').style.display = 'none';
        renderPosts(u.posts || []);
    }

    function renderPosts(posts) {
        const container = document.getElementById('posts');
        container.innerHTML = '';
        (posts || []).slice().reverse().forEach(p => {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `
                <div class="post-text">${escapeHtml(p.text)}</div>
                <div class="post-date">${new Date(p.t).toLocaleString()}</div>`;
            container.appendChild(div);
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function fileToDataURL(file) {
        return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = rej;
            r.readAsDataURL(file);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        let avatar = null;
        if (avatarInput.files && avatarInput.files[0]) {
            avatar = await fileToDataURL(avatarInput.files[0]);
        }
        saveUser({ name, email, avatar, posts: [] });
        showProfile();
    });

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('cibiogen_user');
        location.reload();
    });

    document.getElementById('post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const textInput = document.getElementById('post-text');
        const text = textInput.value.trim();
        if (!text) return;
        const u = loadUser() || { posts: [] };
        u.posts = u.posts || [];
        u.posts.push({ text, t: Date.now() });
        saveUser(u);
        textInput.value = '';
        renderPosts(u.posts);
    });

    clearBtn.addEventListener('click', () => {
        localStorage.removeItem('cibiogen_user');
        location.reload();
    });

    const existing = loadUser();
    if (existing) {
        document.getElementById('name').value = existing.name || '';
        document.getElementById('email').value = existing.email || '';
        showProfile();
    }
})();