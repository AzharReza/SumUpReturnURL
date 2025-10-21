import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import dns from 'node:dns';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS

const app = express();
const port = process.env.PORT || 3017;

const SUMUP_CLIENT_ID = process.env.SUMUP_CLIENT_ID;
const SUMUP_CLIENT_SECRET = process.env.SUMUP_CLIENT_SECRET;
const SUMUP_MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE;
const FRONT_URL = process.env.FRONT_URL;

// Log environment variables for debugging
console.log('Environment variables:', {
    clientId: SUMUP_CLIENT_ID ? 'Loaded' : 'Missing',
    clientSecret: SUMUP_CLIENT_SECRET ? 'Loaded' : 'Missing',
    merchantCode: SUMUP_MERCHANT_CODE,
    frontUrl: FRONT_URL,
});

// Helper: Get OAuth Access Token
async function getAccessToken() {
    try {
        console.log('Fetching access token with Client ID:', SUMUP_CLIENT_ID?.substring(0, 5) + '...');
        const response = await fetch('https://api.sumup.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: SUMUP_CLIENT_ID,
                client_secret: SUMUP_CLIENT_SECRET,
            }),
        });
        const responseText = await response.text();
        console.log('Token Response Status:', response.status);
        console.log('Token Response Body:', responseText.substring(0, 500) + '...');

        if (!response.ok) throw new Error(`Token fetch failed: ${responseText}`);
        const data = JSON.parse(responseText);
        return data.access_token;
    } catch (error) {
        console.error('Token Fetch Error:', error.message);
        throw error;
    }
}

// Route: Create Checkout
app.get('/create-checkout', async (req, res) => {
    try {
        const amount = parseInt((parseFloat(req.query.amount) || 10.0) * 100); // Convert to cents
        const token = await getAccessToken();

        const checkoutBody = {
            checkout_reference: 'checkout-' + Date.now(),
            amount,
            currency: 'EUR',
            description: `Payment of €${amount / 100}`,
            merchant_code: SUMUP_MERCHANT_CODE,
            return_url: `${FRONT_URL}/success`,
        };

        console.log('Checkout Payload:', JSON.stringify(checkoutBody, null, 2));

        const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutBody),
        });

        const responseText = await response.text();
        console.log('Checkout Response Status:', response.status);
        console.log('Checkout Response Body:', responseText.substring(0, 500) + '...');

        if (!response.ok) throw new Error(`Checkout failed: ${responseText}`);

        const data = JSON.parse(responseText);
        res.json({
            message: 'Checkout created',
            checkout_url: data.checkout_url,
            checkout_id: data.id,
        });
    } catch (error) {
        console.error('Error:', error.message);
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

        const responseText = await response.text();
        console.log('Status Response Status:', response.status);
        console.log('Status Response Body:', responseText.substring(0, 500) + '...');

        if (!response.ok) throw new Error(`Status fetch failed: ${responseText}`);

        const data = JSON.parse(responseText);
        res.json({
            message: 'Checkout status retrieved',
            id: data.id,
            status: data.status,
            transaction_code: data.transaction_code,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});