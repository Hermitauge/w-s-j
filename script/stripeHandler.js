document.addEventListener('DOMContentLoaded', function() {
    const purchaseButton = document.querySelector('.purchase-diamond');
    purchaseButton.addEventListener('click', function() {
        const productName = document.querySelector('[data-element="name"]').innerText;
        const productPrice = document.querySelector('[data-element="price"]').innerText.replace('$', '');

        fetch('https://mwjw6060jh.execute-api.us-west-1.amazonaws.com/live/Stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: productName,
                productPrice: productPrice,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Redirect to Stripe Checkout
            window.location.href = data.url;
        })
        .catch(error => console.error('Error:', error));
    });
});