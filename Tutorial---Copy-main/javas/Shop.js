const Toast = Swal.mixin({
    toast: true,
    position: "center-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});


const commerce = new Commerce('pk_574919663617f04516faf34b4a1de7e4d0e411112f096', true);

document.addEventListener('DOMContentLoaded', () => {
    const page = getPageNumberFromURL() || 1;
    renderProducts(page);
    setupPagination();
});

async function renderProducts(page) {
    try {
        const perPage = 12;
        const products = await commerce.products.list({ limit: perPage, page });
        console.log('Products data:', products); // Para depuración

        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = products.data.map(product => renderProductItem(product)).join('');

        // Añadir los event listeners para los botones de "Add to Cart"
        const cartButtons = document.querySelectorAll('.cart');
        cartButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                event.stopPropagation();
                event.preventDefault();
                const productId = button.getAttribute('data-product-id');
                 addToCart(productId);
            });
        });

        updatePagination(products.meta.pagination);
    } catch (error) {
        console.error('Error fetching products', error);
    }
}

function renderProductItem(product) {
    return `
        <div class="pro" onclick="window.location.href='sproduct.html?product_id=${product.id}';">
            <img src="${product.image.url}" alt="${product.name}">
            <div class="des">
                <span>${product.categories[0]?.name || 'Uncategorized'}</span>
                <h5>${product.name}</h5>
                <div class="star">
                   ${renderStars()}
                </div>
                <h4>${product.price.formatted_with_symbol}</h4>
            </div>
            <a href="#" class="cart" data-product-id="${product.id}"><i class="fal fa-shopping-cart"></i></a>
        </div>
    `;
}

function renderStars() {
    return `
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
    `;
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const page = parseInt(event.target.textContent);
            if (!isNaN(page)) {
                renderProducts(page);
                updateURL(page);
            }
        }
    });
}

function updatePagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;

    paginationContainer.innerHTML = '';

    if (currentPage > 1) {
        paginationContainer.innerHTML += `<a href="#">${currentPage - 1}</a>`;
    }

    paginationContainer.innerHTML += `<a href="#" class="active">${currentPage}</a>`;

    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `<a href="#">${currentPage + 1}</a>`;
    }

    paginationContainer.innerHTML += `<a href="#"><i class="fal fa-long-arrow-alt-right"></i></a>`;
}

function getPageNumberFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page'));
}

function updateURL(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
}

async function addToCart(productId) {
    try {
        commerce.cart.add(productId, 1);
        Toast.fire({
            icon: "success",
            title: "Se ha agregado al carrito"
        });
    } catch (error) {
        console.error('Error adding to cart', error);
        Swal.fire('Error', 'Unable to add product to cart', 'error');
    }
}
