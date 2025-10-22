// Tìm kiếm, toggle form thêm sản phẩm và thêm sản phẩm mới vào DOM với validate

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const productsGrid = document.querySelector('.products-grid');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAdd = document.getElementById('cancelAdd');
const errorMsg = document.getElementById('errorMsg');

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
        const hidden = addProductForm.classList.toggle('hidden');
        addProductForm.setAttribute('aria-hidden', hidden ? 'true' : 'false');
        // nếu mở thì focus, nếu đóng thì reset lỗi
        if (!hidden) {
            const nameField = document.getElementById('p-name');
            if (nameField) nameField.focus();
            if (errorMsg) { errorMsg.style.display = 'none'; errorMsg.textContent = ''; }
        } else {
            addProductForm.reset();
            if (errorMsg) { errorMsg.style.display = 'none'; errorMsg.textContent = ''; }
        }
    });
}

if (cancelAdd) {
    cancelAdd.addEventListener('click', () => {
        addProductForm.classList.add('hidden');
        addProductForm.setAttribute('aria-hidden', 'true');
        addProductForm.reset();
        if (errorMsg) { errorMsg.style.display = 'none'; errorMsg.textContent = ''; }
    });
}

if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameEl = document.getElementById('p-name');
        const priceEl = document.getElementById('p-price');
        const imgEl = document.getElementById('p-img');
        const descEl = document.getElementById('p-desc');

        const name = nameEl ? nameEl.value.trim() : '';
        const priceRaw = priceEl ? priceEl.value : '';
        const image = imgEl ? imgEl.value.trim() : '';
        const desc = descEl ? descEl.value.trim() : '';

        // Validate
        const price = Number(priceRaw);
        if (!name) {
            showError('Tên sản phẩm không được để trống.');
            return;
        }
        if (priceRaw === '' || isNaN(price) || price <= 0) {
            showError('Giá phải là số hợp lệ lớn hơn 0.');
            return;
        }
        if (!image) {
            showError('Vui lòng nhập URL ảnh.');
            return;
        }

        // format giá hiển thị (ví dụ thêm dấu phẩy)
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(price) + '₫';

        // Tạo phần tử sản phẩm mới (giống cấu trúc card)
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
        strong.textContent = formattedPrice;
        pPrice.appendChild(strong);

        body.appendChild(h3);
        body.appendChild(pDesc);
        body.appendChild(pPrice);

        article.appendChild(media);
        article.appendChild(body);

        // Thêm lên đầu danh sách
        if (productsGrid) {
            productsGrid.prepend(article);
        }

        // Reset, ẩn form, xóa lỗi
        addProductForm.reset();
        addProductForm.classList.add('hidden');
        addProductForm.setAttribute('aria-hidden', 'true');
        if (errorMsg) { errorMsg.style.display = 'none'; errorMsg.textContent = ''; }

        // Đảm bảo tìm kiếm sẽ thấy sản phẩm mới
        filterProducts(searchInput ? searchInput.value : '');
    });
}

function showError(text) {
    if (!errorMsg) {
        alert(text);
        return;
    }
    errorMsg.textContent = text;
    errorMsg.style.display = 'block';
}