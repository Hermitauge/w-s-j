// stripeHandler.js
export class StripeHandler {
    constructor(publicKey) {
        this.stripe = Stripe(publicKey);  // Initialize Stripe with the public key
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
