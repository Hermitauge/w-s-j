// stripeHandler.js
export class StripeHandler {
    constructor(publicKey, buttonSelector, priceSelector, shapeSelector, caratsSelector) {
        this.stripe = Stripe(publicKey);  // Initialize Stripe with the public key
        this.buttonSelector = buttonSelector;
        this.priceSelector = priceSelector;
        this.shapeSelector = shapeSelector;
        this.caratsSelector = caratsSelector;
        this.initializeButton();  // Set up the event listener on the buy button
    }

    initializeButton() {
        const buyButton = document.querySelector(this.buttonSelector);
        if (!buyButton) {
            console.error('Buy button not found');
            return;
        }

        buyButton.addEventListener('click', async () => {
            const price = document.querySelector(this.priceSelector)?.textContent;
            const shape = document.querySelector(this.shapeSelector)?.textContent;
            const carats = document.querySelector(this.caratsSelector)?.textContent;

            if (price && shape && carats) {
                this.handlePayment(price, shape, carats);
            } else {
                console.error('Missing product details');
            }
        });
    }

    async handlePayment(price, shape, carats) {
        try {
            // Replace with your API Gateway URL
            const response = await fetch('https://mwjw6060jh.execute-api.us-west-1.amazonaws.com/live/Stripe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ price, shape, carats }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to Stripe checkout
                await this.stripe.redirectToCheckout({ sessionId: data.sessionId });
            } else {
                console.error('Error from API:', data);
                alert('There was an error processing your payment. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your payment. Please try again.');
        }
    }
}
