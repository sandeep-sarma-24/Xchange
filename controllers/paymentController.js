// paymentController.js
const Stripe = require('stripe');
const stripe = Stripe('your_stripe_secret_key'); // Replace with your Stripe secret key

const createCheckoutSession = async (req, res) => {
    try {
        // You might want to replace this with actual data from req.body or your application's logic
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Ticket Purchase',
                    },
                    unit_amount: 2000, // Replace with the actual amount, in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://your-domain.com/success', // Replace with your success URL
            cancel_url: 'https://your-domain.com/cancel', // Replace with your cancel URL
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error in createCheckoutSession:', error);
        res.status(400).send('Error creating checkout session');
    }
};

module.exports = { createCheckoutSession };
