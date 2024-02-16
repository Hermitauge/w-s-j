document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const allowMultipleItems = false; // Set to false to allow only one item in the cart
    loadCartItems();
    updateCartCount();

    document.body.addEventListener('click', function(event) {
        if (event.target.matches('[cart-data="add2cart"]')) {
            const collectionItem = event.target.closest('.collection-items');
            const itemData = {
                name: collectionItem.querySelector('[cart-data="cartName"]').textContent,
                price: collectionItem.querySelector('[cart-data="cartPrice"]').textContent,
                type: collectionItem.querySelector('[cart-data="cartDiamondType"]').textContent,
                img: collectionItem.querySelector('[cart-data="cartImage"]').src,
                certNumber: collectionItem.querySelector('[cart-data="cartCertNumber"]').textContent
            };

            const isItemInCart = cart.some(item => item.name === itemData.name);

            if (!isItemInCart) {
                if (!allowMultipleItems && cart.length > 0) {
                    alert("Only one Diamond is allowed in the cart.");
                } else {
                    cart.push(itemData);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                    updateCartCount();
                    document.getElementById('diamond-memo').textContent = itemData.name;
                    document.getElementById('popup-cart').classList.add('cd-cart--open');
                }
            }
        } else if (event.target.matches('.cart-remove')) {
            event.preventDefault();
            const itemIndex = event.target.dataset.index;
            removeFromCart(itemIndex);
        }
    });

    // New checkout button functionality
    const checkoutButton = document.querySelector('.checkout-button');
    checkoutButton.addEventListener('click', function() {
        const cartItems = document.querySelectorAll('.cart-item');
        const products = Array.from(cartItems).map(item => {
            return {
                productName: item.querySelector('[data-element="name"]').innerText,
                productPrice: item.querySelector('[data-element="price"]').innerText.replace(/\$|,|\s/g, ''),
                productDescription: item.querySelector('[data-element="description"]').innerText
            };
        });

        fetch('https://mwjw6060jh.execute-api.us-west-1.amazonaws.com/live/Stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products }),
        })
        .then(response => response.json())
        .then(data => {
            // Redirect to Stripe Checkout
            window.location.href = data.url;
        })
        .catch(error => console.error('Error:', error));
    });

    function loadCartItems() {
        cart.forEach((item, index) => updateCartDisplay(item, index));
    }

    function updateCartDisplay() {
        const cartBody = document.querySelector('#diamond');
        cartBody.innerHTML = ''; // Clear current cart display
        cart.forEach((item, index) => {
            const itemHtml = buildCartItemHtml(item, index);
            cartBody.insertAdjacentHTML('afterbegin', itemHtml);
        });
    }

    function buildCartItemHtml(item, index) {
        const defaultImgUrl = "https://assets-global.website-files.com/64f03a41e7effe6dcba1cc18/65ba91b89e93d4ab38b2bdf9_product-preview.png";
        const itemImageUrl = item.img || defaultImgUrl;

        return `
            <div class="cart-item" data-cart-index="${index}">
                <div class="cart-primaryfields">
                    <span class="cartspan-name" data-element="name">${item.name}</span>
                    <span class="cartspan-price" data-element="price">${item.price}</span>
                    <span class="cartspan-ringtype">${item.type}</span>
                </div>
                <div class="cart-2ndfields">
                    <div class="fields-container">
                        <div class="cart-img" style="background-image: url('${itemImageUrl}');"></div>
                        <div class="cart-extrainfo">
                            <div class="cart-extras" data-element="description">
                                <span>Certification</span>
                                <span class="torquise-span">${item.certNumber}</span>
                            </div>
                            <div class="cart-extras">
                                <a href="https://www.wsjewelers.com/diamonds/natural-diamonds" class="cart-change">Change</a>
                                <a href="#" class="cart-remove" data-index="${index}">Remove</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="div-line"></div>
            </div>`;
    }

    function removeFromCart(index) {
        index = parseInt(index);
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }

    function updateCartCount() {
        const countElement = document.querySelector('.w-commerce-commercecartopenlinkcount');
        if (countElement) {
            countElement.textContent = cart.length;
        }
    }

    // Trigger .cart-btn click when .add2cart-btn is clicked
    document.querySelectorAll('.add2cart-btn[cart-data="add2cart"]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('.cart-btn').click();
        });
    });
});
