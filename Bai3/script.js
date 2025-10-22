// Tìm kiếm, toggle form thêm sản phẩm và thêm sản phẩm mới vào DOM

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productsGrid = document.querySelector('.products-grid');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAdd = document.getElementById('cancelAdd');

function filterProducts(query) {
    const q = (query || '').trim().toLowerCase();
    const items = document.querySelectorAll('.product-item');
    items.forEach(item => {
        const nameEl = item.querySelector('.product-name');
        const name = nameEl ? nameEl.textContent.toLowerCase() : '';
        item.style.display = (!q || name.includes(q)) ? '' : 'none';
    });
}

if (searchInput) {
    searchInput.addEventListener('keyup', (e) => filterProducts(e.target.value));
}
if (searchBtn) {
    searchBtn.addEventListener('click', () => filterProducts(searchInput.value));
}

if (addProductBtn && addProductForm) {
    addProductBtn.addEventListener('click', () => {
        const added = addProductForm.classList.toggle('hidden');
        addProductForm.setAttribute('aria-hidden', added ? 'true' : 'false');
        if (!added) {
            const nameField = document.getElementById('p-name');
            if (nameField) nameField.focus();
        } else {
            addProductForm.reset();
        }
    });
}

if (cancelAdd) {
    cancelAdd.addEventListener('click', () => {
        addProductForm.classList.add('hidden');
        addProductForm.setAttribute('aria-hidden', 'true');
        addProductForm.reset();
    });
}

if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('p-name').value.trim();
        const price = document.getElementById('p-price').value.trim();
        const image = document.getElementById('p-img').value.trim();
        const desc = document.getElementById('p-desc').value.trim();

        if (!name || !price || !image) {
            alert('Vui lòng điền đầy đủ tên, giá và URL ảnh.');
            return;
        }

        const article = document.createElement('article');
        article.className = 'card product-item';

        const media = document.createElement('div');
        media.className = 'media';
        const img = document.createElement('img');
        img.src = image;
        img.alt = name;
        media.appendChild(img);

        const body = document.createElement('div');
        body.className = 'card-body';
        const h3 = document.createElement('h3');
        h3.className = 'product-name';
        h3.textContent = name;
        const pDesc = document.createElement('p');
        pDesc.textContent = desc || '';
        const pPrice = document.createElement('p');
        pPrice.className = 'price';
        const strong = document.createElement('strong');
        strong.textContent = price;
        pPrice.appendChild(strong);

        body.appendChild(h3);
        body.appendChild(pDesc);
        body.appendChild(pPrice);

        article.appendChild(media);
        article.appendChild(body);

        productsGrid.appendChild(article);

        addProductForm.reset();
        addProductForm.classList.add('hidden');
        addProductForm.setAttribute('aria-hidden', 'true');

        filterProducts(searchInput ? searchInput.value : '');
    });
}