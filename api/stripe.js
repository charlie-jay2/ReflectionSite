const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const querystring = require('querystring');

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        try {
            const { token, discordUsername } = JSON.parse(event.body);

            if (!token || !discordUsername) {
                throw new Error("Missing required fields: token or discordUsername.");
            }

            // Create a payment intent and charge the card
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 800, // The amount in cents (800 = £8.00)
                currency: 'gbp',
                payment_method: token,
                confirmation_method: 'manual',
                confirm: true,
                description: `Payment from ${discordUsername}`,
            });

            // Check the payment status
            if (paymentIntent.status === 'succeeded') {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ success: true }),
                };
            } else if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: true,
                        requiresAction: true,
                        paymentIntentClientSecret: paymentIntent.client_secret,
                    }),
                };
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ success: false, message: 'Payment failed' }),
                };
            }
        } catch (error) {
            console.error('Stripe error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, message: error.message }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
        };
    }
};
