// Lưu/Load sản phẩm bằng localStorage, render DOM, tìm kiếm và form thêm sản phẩm
// Có animation: form mở/đóng bằng max-height và sản phẩm ẩn/hiện bằng lớp fade

const PRODUCTS_KEY = 'products_v1';
const productsGrid = document.querySelector('.products-grid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelAdd = document.getElementById('cancelAdd');
const errorMsg = document.getElementById('errorMsg');

let products = [];

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

function saveProducts() {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function fmtPrice(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

// Tạo 1 card DOM từ đối tượng product
function createProductCard(p) {
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

  return article;
}

function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  products.forEach(p => {
    const card = createProductCard(p);
    productsGrid.appendChild(card);
  });
  // áp dụng filter hiện có
  filterProducts((searchInput && searchInput.value) || '');
}

// Animation helpers cho item
function hideItemWithAnimation(item) {
  if (!item) return;
  // nếu đã hidden thì skip
  if (item.style.display === 'none') return;
  item.classList.add('fade-out');
  // sau khi animation kết thúc, ẩn hoàn toàn
  const t = parseFloat(getComputedStyle(item).transitionDuration) || 0.28;
  setTimeout(() => {
    item.style.display = 'none';
    item.classList.remove('fade-out');
  }, (t * 1000) + 30);
}

function showItemWithAnimation(item) {
  if (!item) return;
  // nếu đang hiển thị thì skip
  if (item.style.display !== 'none' && item.style.display !== '') {
    item.style.display = '';
  }
  item.style.display = '';
  item.classList.add('fade-in');
  // force reflow rồi remove class để chạy transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      item.classList.remove('fade-in');
    });
  });
}

// Lọc sản phẩm với animation
function filterProducts(query) {
  const q = (query || '').trim().toLowerCase();
  const items = document.querySelectorAll('.product-item');
  items.forEach(item => {
    const nameEl = item.querySelector('.product-name');
    const name = nameEl ? nameEl.textContent.toLowerCase() : '';
    const match = (!q || name.includes(q));
    const currentlyHidden = getComputedStyle(item).display === 'none';
    if (match) {
      if (currentlyHidden) showItemWithAnimation(item);
      else {
        // ensure visible and clear classes
        item.style.display = '';
        item.classList.remove('fade-out', 'fade-in');
      }
    } else {
      if (!currentlyHidden) hideItemWithAnimation(item);
    }
  });
}

function showError(text) {
  if (!errorMsg) { alert(text); return; }
  errorMsg.textContent = text;
  errorMsg.style.display = 'block';
}

function clearError() {
  if (!errorMsg) return;
  errorMsg.textContent = '';
  errorMsg.style.display = 'none';
}

// Form open/close animation using max-height
function openFormAnimated() {
  if (!addProductForm) return;
  addProductForm.classList.remove('hidden');
  // reset inline maxHeight then set to scrollHeight
  addProductForm.style.maxHeight = '0px';
  // wait frame
  requestAnimationFrame(() => {
    const h = addProductForm.scrollHeight;
    addProductForm.style.maxHeight = h + 'px';
    addProductForm.classList.add('open');
    addProductForm.setAttribute('aria-hidden', 'false');
  });
  clearError();
}

function closeFormAnimated() {
  if (!addProductForm) return;
  // set maxHeight to 0 to animate collapse
  addProductForm.style.maxHeight = '0px';
  addProductForm.setAttribute('aria-hidden', 'true');
  const onEnd = (ev) => {
    // chỉ xử lý transition của max-height
    if (ev && ev.propertyName && ev.propertyName !== 'max-height') return;
    addProductForm.classList.remove('open');
    addProductForm.classList.add('hidden');
    addProductForm.removeEventListener('transitionend', onEnd);
    // clear inline maxHeight for future calculations
    addProductForm.style.maxHeight = '';
  };
  addProductForm.addEventListener('transitionend', onEnd);
  addProductForm.reset();
  clearError();
}

function setupEvents() {
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => filterProducts(e.target.value));
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', () => filterProducts(searchInput.value));
  }

  if (addProductBtn && addProductForm) {
    addProductBtn.addEventListener('click', () => {
      const isHidden = addProductForm.classList.contains('hidden');
      if (isHidden) openFormAnimated();
      else closeFormAnimated();
      if (isHidden) {
        const nameField = document.getElementById('p-name');
        if (nameField) nameField.focus();
      }
    });
  }

  if (cancelAdd) {
    cancelAdd.addEventListener('click', () => {
      closeFormAnimated();
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
      if (!name) { showError('Tên sản phẩm không được để trống.'); return; }
      if (priceRaw === '' || isNaN(price) || price <= 0) { showError('Giá phải là số hợp lệ lớn hơn 0.'); return; }
      if (!image) { showError('Vui lòng nhập URL ảnh.'); return; }

      const newProduct = { name, price, desc, image };
      products.unshift(newProduct);
      saveProducts();

      // Thêm sản phẩm mới vào DOM ở đầu với animation
      if (productsGrid) {
        const card = createProductCard(newProduct);
        // chèn trước phần tử đầu tiên
        const first = productsGrid.firstChild;
        if (first) productsGrid.insertBefore(card, first);
        else productsGrid.appendChild(card);
        // visual: bắt đầu ở trạng thái fade-in
        card.classList.add('fade-in');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.classList.remove('fade-in');
          });
        });
      }

      // đóng form với animation
      closeFormAnimated();
      // áp dụng filter hiện có để đảm bảo khớp
      filterProducts((searchInput && searchInput.value) || '');
    });
  }
}

(function init() {
  loadProducts();
  renderProducts();
  setupEvents();
})();