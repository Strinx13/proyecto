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
    const productId = getProductIdFromURL();
    if (productId) {
        renderProductDetails(productId);
    } else {
        console.error('No product ID found in URL');
    }
});

async function renderProductDetails(productId) {
    try {
        const product = await commerce.products.retrieve(productId);
        console.log('Product data:', product); // Para depuración

        if (!product) {
            throw new Error('Product not found');
        }

        const productDetailSection = document.getElementById('prodetails');

        productDetailSection.innerHTML = `
            <div class="single-pro-image">
                <img src="${product.image ? product.image.url : 'img/products/default.jpg'}" width="100%" id="MainImg" alt="${product.name || 'Product'}">
            </div>
            <div class="single-pro-details">
                <h6>${product.category ? product.category.name : 'Category'}</h6>
                <h4>${product.name || 'Product Name'}</h4>
                <h2>${product.price ? product.price.formatted_with_symbol : 'Price'}</h2>
                <select>
                    <option>Select Size</option>
                    <option>XL</option>
                    <option>XXL</option>
                    <option>Small</option>
                    <option>Large</option>
                </select>
                <input type="number" value="1" id="product-quantity">
                <button class="normal add-to-cart">Add To Cart</button>
                <h4>Product Details</h4>
                <span>${product.description || 'No description available'}</span>
            </div>
        `;

        const addToCartButton = productDetailSection.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', () => {
            const quantity = document.getElementById('product-quantity').value;
            addToCart(productId, quantity);
        });
    } catch (error) {
        console.error('Error fetching product details', error);
        Swal.fire('Error', 'There was an error fetching product details. Please try again.', 'error');
    }
}

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product_id');
}

async function addToCart(productId, quantity) {
    try {
        const cart = commerce.cart.add(productId, parseInt(quantity));
        console.log('Cart:', cart);
        Toast.fire({
            icon: "success",
            title: "Se ha agregado al carrito"
        });
    } catch (error) {
        console.error('Error adding product to cart', error);
        Swal.fire('Error', 'There was an error adding the product to the cart. Please try again.', 'error');
    }
}
