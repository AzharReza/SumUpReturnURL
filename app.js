import dotenv from 'dotenv';
import { SumUp } from '@sumup/sdk';

dotenv.config();

// Initialize SumUp with correct configuration
const sumup = new SumUp({
    credentials: {
        accessToken: process.env.SUMUP_API_KEY,
    },
    options: {
        sandbox: true, // This automatically uses sandbox URLs
    },
});

async function createCheckout() {
    try {
        const checkout = await sumup.checkouts.create({
            checkout_reference: 'test-checkout-' + Date.now(),
            amount: 10.00, // Use decimal format for amounts
            currency: 'EUR',
            description: 'Test Payment for €10',
            merchant_code: process.env.SUMUP_MERCHANT_CODE,
            return_url: `${process.env.FRONT_URL}/success`,
        });

        console.log('Checkout created successfully:', {
            id: checkout.id,
            reference: checkout.checkout_reference,
            amount: checkout.amount,
            status: checkout.status,
            checkout_url: checkout.checkout_url, // This is important for redirecting users
        });

        return checkout;
    } catch (error) {
        console.error('Error creating checkout:', error.message);
        console.error('Full error details:', error);
        throw error;
    }
}

async function getCheckoutStatus(checkoutId) {
    try {
        const checkout = await sumup.checkouts.retrieve(checkoutId);
        console.log('Checkout status:', {
            id: checkout.id,
            status: checkout.status,
            transaction_code: checkout.transaction_code,
        });
        return checkout;
    } catch (error) {
        console.error('Error retrieving checkout:', error.message);
        throw error;
    }
}

async function runTest() {
    try {
        console.log('Creating checkout...');
        const checkout = await createCheckout();

        console.log('\nCheckout created!');
        console.log('Redirect user to:', checkout.checkout_url);
        console.log('Or use the embedded checkout iframe');

        // For testing, you can check the status after a delay
        console.log('\nWaiting 10 seconds before checking status...');
        await new Promise(resolve => setTimeout(resolve, 10000));

        await getCheckoutStatus(checkout.id);

    } catch (error) {
        console.error('Test failed:', error);
    }
}

runTest();