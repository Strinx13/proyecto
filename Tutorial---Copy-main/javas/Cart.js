// Reemplaza 'your_public_key' con tu clave pública de Commerce.js
const commerce = new Commerce('pk_574919663617f04516faf34b4a1de7e4d0e411112f096', true);

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    // Añade el evento para vaciar el carrito
    document.getElementById('empty-cart')?.addEventListener('click', emptyCart);
    // Añade el evento para comprar
    document.getElementById('buy-cart')?.addEventListener('click', buyCart);
});

async function renderCart() {
    try {
        const cart = await commerce.cart.retrieve();
        console.log('Cart data:', cart); // Agregamos esta línea para depuración

        if (!cart || !cart.line_items) {
            throw new Error('Cart is empty or cart data is not available.');
        }

        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = `
            <section id="cart" class="section-p1">
                <table width="100%">
                    <thead>
                        <tr>
                            <td>Remove</td>
                            <td>Image</td>
                            <td>Product</td>
                            <td>Price</td>
                            <td>Quantity</td>
                            <td>Subtotal</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.line_items.map(item => renderCartItem(item)).join('')}
                    </tbody>
                </table>
            </section>
        `;
        updateCartCount(cart.total_items);
        updateCartTotals(cart);
    } catch (error) {
        console.error('Error rendering cart', error);
        Swal.fire('Error', error.message, 'error');
    }
}

function renderCartItem(item) {
    return `
        <tr>
            <td><a href="javascript:void(0)" onclick="removeFromCart('${item.id}')"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${item.image.url}" alt="${item.name}" style="width: 50px; height: auto;"></td>
            <td>${item.name}</td>
            <td>${item.price.formatted_with_symbol}</td>
            <td><input type="number" value="${item.quantity}" onchange="updateCartItem('${item.id}', this.value)"></td>
            <td>${item.line_total.formatted_with_symbol}</td>
        </tr>
    `;
}

async function updateCartItem(itemId, quantity) {
    if (quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    try {
        commerce.cart.update(itemId, { quantity });
        Swal.fire('Success', 'Cart updated!', 'success');
        renderCart();
    } catch (error) {
        console.error('Error updating cart item', error);
        Swal.fire('Error', 'Unable to update cart item', 'error');
    }
}

async function removeFromCart(itemId) {
    try {
        commerce.cart.remove(itemId);
        Swal.fire('Success', 'Item removed from cart!', 'success');
        renderCart();
    } catch (error) {
        console.error('Error removing item from cart', error);
        Swal.fire('Error', 'Unable to remove item from cart', 'error');
    }
}

function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    } else {
        console.error('Cart count element not found');
    }
}

function updateCartTotals(cart) {
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');

    if (subtotalElement && totalElement) {
        subtotalElement.textContent = cart.subtotal.formatted_with_symbol;
        totalElement.innerHTML = `<strong>${cart.subtotal.formatted_with_symbol}</strong>`;
    } else {
        console.error('Subtotal or total elements not found');
    }
}

function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value;

    commerce.cart.applyDiscount(couponCode)
        .then((response) => {
            Swal.fire('Success', 'Coupon applied!', 'success');
            renderCart();
        })
        .catch((error) => {
            console.error('Error applying coupon', error);
            Swal.fire('Error', 'Unable to apply coupon', 'error');
        });
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
