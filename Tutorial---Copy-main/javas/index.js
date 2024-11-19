const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
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
    fetchProducts();
    renderCart();

    // Añade el evento para vaciar el carrito
    document.getElementById('empty-cart')?.addEventListener('click', emptyCart);
    // Añade el evento para comprar
    document.getElementById('buy-cart')?.addEventListener('click', buyCart);
});

async function fetchProducts() {
    try {
        const { data: products } = await commerce.products.list();
        const featuredProductsContainer = document.getElementById('featured-products-container');
        const newArrivalsContainer = document.getElementById('new-arrivals-container');
        featuredProductsContainer.innerHTML = products.slice(0, 4).map(product => renderProduct(product)).join('');
        newArrivalsContainer.innerHTML = products.slice(4, 8).map(product => renderProduct(product)).join('');

        // Añadir los event listeners para los botones de "Add to Cart"
        const cartButtons = document.querySelectorAll('.cart');
        cartButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const productId = button.getAttribute('data-product-id');
                await addToCart(productId);
            });
        });
    } catch (error) {
        console.error('Error fetching products', error);
    }
}

function renderProduct(product) {
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

async function addToCart(productId) {
    try {
        commerce.cart.add(productId, 1);
        Toast.fire({
            icon: "success",
            title: "Se ha agregado al carrito"
        });
        renderCart();
    } catch (error) {
        console.error('Error adding to cart', error);
        Swal.fire('Error', 'Unable to add product to cart', 'error');
    }
}

function renderCart() {
    // Aquí puedes implementar la lógica para actualizar la UI del carrito si es necesario
}

function emptyCart() {
    commerce.cart.empty()
        .then((response) => {
            Swal.fire('Success', 'Cart has been emptied!', 'success');
            renderCart();
        })
        .catch((error) => {
            console.error('Error emptying cart', error);
            Swal.fire('Error', 'Unable to empty cart', 'error');
        });
}

function buyCart() {
    // Implementa aquí la lógica para proceder a la compra
    Swal.fire('Feature Coming Soon', 'Checkout process is coming soon!', 'info');
}
