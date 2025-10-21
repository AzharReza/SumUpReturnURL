import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3017;

const SUMUP_CLIENT_ID = process.env.SUMUP_CLIENT_ID;
const SUMUP_CLIENT_SECRET = process.env.SUMUP_CLIENT_SECRET;
const SUMUP_MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE;
const FRONT_URL = process.env.FRONT_URL;

// Helper: Get OAuth Access Token
async function getAccessToken() {
    const response = await fetch('https://api.sumup.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: SUMUP_CLIENT_ID,
            client_secret: SUMUP_CLIENT_SECRET,
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data.access_token;
}

// Route: Create Checkout
app.get('/create-checkout', async (req, res) => {
    try {
        const amount = parseFloat(req.query.amount) || 10.0; // default 10 EUR
        const token = await getAccessToken();

        const checkoutBody = {
            checkout_reference: 'checkout-' + Date.now(),
            amount,
            currency: 'EUR',
            description: `Payment of €${amount}`,
            merchant_code: SUMUP_MERCHANT_CODE,
            return_url: `${FRONT_URL}/success`,
        };

        const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutBody),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(data));

        res.json({
            message: 'Checkout created',
            checkout_url: data.checkout_url,
            checkout_id: data.id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: Get Checkout Status
app.get('/checkout-status/:id', async (req, res) => {
    try {
        const checkoutId = req.params.id;
        const token = await getAccessToken();

        const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(data));

        res.json({
            message: 'Checkout status retrieved',
            id: data.id,
            status: data.status,
            transaction_code: data.transaction_code,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});













// import dotenv from 'dotenv';
// import { SumUp } from '@sumup/sdk';
//
// dotenv.config();
//
// // Initialize SumUp with correct configuration
// const sumup = new SumUp({
//     credentials: {
//         accessToken: process.env.SUMUP_API_KEY,
//     },
//     options: {
//         sandbox: true, // This automatically uses sandbox URLs
//     },
// });
//
// async function createCheckout() {
//     try {
//         const checkout = await sumup.checkouts.create({
//             checkout_reference: 'test-checkout-' + Date.now(),
//             amount: 10.00, // Use decimal format for amounts
//             currency: 'EUR',
//             description: 'Test Payment for €10',
//             merchant_code: process.env.SUMUP_MERCHANT_CODE,
//             return_url: `${process.env.FRONT_URL}/success`,
//         });
//
//         console.log('Checkout created successfully:', {
//             id: checkout.id,
//             reference: checkout.checkout_reference,
//             amount: checkout.amount,
//             status: checkout.status,
//             checkout_url: checkout.checkout_url, // This is important for redirecting users
//         });
//
//         return checkout;
//     } catch (error) {
//         console.error('Error creating checkout:', error.message);
//         console.error('Full error details:', error);
//         throw error;
//     }
// }
//
// async function getCheckoutStatus(checkoutId) {
//     try {
//         const checkout = await sumup.checkouts.retrieve(checkoutId);
//         console.log('Checkout status:', {
//             id: checkout.id,
//             status: checkout.status,
//             transaction_code: checkout.transaction_code,
//         });
//         return checkout;
//     } catch (error) {
//         console.error('Error retrieving checkout:', error.message);
//         throw error;
//     }
// }
//
// async function runTest() {
//     try {
//         console.log('Creating checkout...');
//         const checkout = await createCheckout();
//
//         console.log('\nCheckout created!');
//         console.log('Redirect user to:', checkout.checkout_url);
//         console.log('Or use the embedded checkout iframe');
//
//         // For testing, you can check the status after a delay
//         console.log('\nWaiting 10 seconds before checking status...');
//         await new Promise(resolve => setTimeout(resolve, 10000));
//
//         await getCheckoutStatus(checkout.id);
//
//     } catch (error) {
//         console.error('Test failed:', error);
//     }
// }
//
// runTest();