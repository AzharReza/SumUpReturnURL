import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.SUMUP_API_KEY;
const merchantCode = process.env.SUMUP_MERCHANT_CODE;
const url = 'https://api.sumup.com/v0.1/checkouts';

const payload = {
    checkout_reference: 'test-checkout-' + Date.now(),
    amount: 1000, // €10.00 in cents
    currency: 'EUR',
    description: 'Test Payment for €10',
    merchant_code: merchantCode,
    return_url: 'https://c746d99b21b5.ngrok-free.app/success',
};

async function testApi() {
    try {
        console.log('Request URL:', url);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        console.log('API Key prefix:', apiKey?.substring(0, 7));
        console.log('Merchant Code:', merchantCode);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Response Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('Raw Response Body:', responseText.substring(0, 500) + '...');

        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('Parsed JSON Response:', data);
        } else {
            console.error('Non-OK Response (Error):', response.statusText, responseText);
        }
    } catch (error) {
        console.error('Fetch Error:', error.message);
        console.error('Full Error:', error);
    }
}

testApi();