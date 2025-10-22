// Lưu/Load sản phẩm bằng localStorage, render DOM, tìm kiếm và form thêm sản phẩm

const PRODUCTS_KEY = 'products_v1';
const productsGrid = document.querySelector('.products-grid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAdd = document.getElementById('cancelAdd');
const errorMsg = document.getElementById('errorMsg');

let products = [];

// Mẫu mặc định
const defaultProducts = [
  {
    name: 'Không gia đình',
    price: 120000,
    desc: 'Một cuốn sách truyền cảm hứng về hành trình trưởng thành.',
    image: 'https://upload.wikimedia.org/wikipedia/vi/f/fa/Kh%C3%B4ng_gia_%C4%91%C3%ACnh_1_%28s%C3%A1ch%29.jpg'
  },
  {
    name: 'Số đỏ',
    price: 95000,
    desc: 'Hướng dẫn phát triển kỹ năng giao tiếp và quản lý thời gian.',
    image: 'https://ntthnue.edu.vn/uploads/Images/2013/10/198.jpg'
  },
  {
    name: 'Meow',
    price: 150000,
    desc: 'Mewo meow meow meow meow meow',
    image: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1720557968i/216298765.jpg'
  }
];

// Load từ localStorage hoặc khởi tạo mặc định
function loadProducts() {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (raw) {
    try {
      products = JSON.parse(raw);
      if (!Array.isArray(products)) throw new Error('invalid');
    } catch (e) {
      products = defaultProducts.slice();
      saveProducts();
    }
  } else {
    products = defaultProducts.slice();
    saveProducts();
  }
}

// Lưu vào localStorage
function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// Format giá hiển thị
function fmtPrice(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

// Render toàn bộ products vào .products-grid
function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  products.forEach(p => {
    const article = document.createElement('article');
    article.className = 'card product-item';

    const media = document.createElement('div');
    media.className = 'media';
    const img = document.createElement('img');
    img.src = p.image || '';
    img.alt = p.name || '';
    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 'card-body';
    const h3 = document.createElement('h3');
    h3.className = 'product-name';
    h3.textContent = p.name || '';
    const pDesc = document.createElement('p');
    pDesc.textContent = p.desc || '';
    const pPrice = document.createElement('p');
    pPrice.className = 'price';
    const strong = document.createElement('strong');
    strong.textContent = fmtPrice(Number(p.price) || 0);
    pPrice.appendChild(strong);

    body.appendChild(h3);
    body.appendChild(pDesc);
    body.appendChild(pPrice);

    article.appendChild(media);
    article.appendChild(body);

    productsGrid.appendChild(article);
  });
  // Sau khi render, áp dụng filter hiện có (nếu có từ khóa)
  filterProducts((searchInput && searchInput.value) || '');
}

// Filter DOM items theo query (case-insensitive)
function filterProducts(query) {
  const q = (query || '').trim().toLowerCase();
  const items = document.querySelectorAll('.product-item');
  items.forEach(item => {
    const nameEl = item.querySelector('.product-name');
    const name = nameEl ? nameEl.textContent.toLowerCase() : '';
    item.style.display = (!q || name.includes(q)) ? '' : 'none';
  });
}

// Hiển thị lỗi dưới form
function showError(text) {
  if (!errorMsg) {
    alert(text);
    return;
  }
  errorMsg.textContent = text;
  errorMsg.style.display = 'block';
}

// Xóa lỗi
function clearError() {
  if (!errorMsg) return;
  errorMsg.textContent = '';
  errorMsg.style.display = 'none';
}

// Setup event handlers
function setupEvents() {
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => filterProducts(e.target.value));
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', () => filterProducts(searchInput.value));
  }

  if (addProductBtn && addProductForm) {
    addProductBtn.addEventListener('click', () => {
      const wasHidden = addProductForm.classList.contains('hidden');
      addProductForm.classList.toggle('hidden');
      addProductForm.setAttribute('aria-hidden', wasHidden ? 'false' : 'true');
      if (wasHidden) {
        clearError();
        const nameField = document.getElementById('p-name');
        if (nameField) nameField.focus();
      } else {
        addProductForm.reset();
        clearError();
      }
    });
  }

  if (cancelAdd) {
    cancelAdd.addEventListener('click', () => {
      addProductForm.classList.add('hidden');
      addProductForm.setAttribute('aria-hidden', 'true');
      addProductForm.reset();
      clearError();
    });
  }

  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const nameEl = document.getElementById('p-name');
      const priceEl = document.getElementById('p-price');
      const imgEl = document.getElementById('p-img');
      const descEl = document.getElementById('p-desc');

      const name = nameEl ? nameEl.value.trim() : '';
      const priceRaw = priceEl ? priceEl.value : '';
      const image = imgEl ? imgEl.value.trim() : '';
      const desc = descEl ? descEl.value.trim() : '';

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

      const newProduct = {
        name,
        price,
        desc,
        image
      };

      // Thêm lên đầu danh sách
      products.unshift(newProduct);
      saveProducts();
      renderProducts();

      addProductForm.reset();
      addProductForm.classList.add('hidden');
      addProductForm.setAttribute('aria-hidden', 'true');
      clearError();
    });
  }
}

// Khởi tạo
(function init() {
  loadProducts();
  renderProducts();
  setupEvents();
})();