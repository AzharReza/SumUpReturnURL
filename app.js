import fetch from 'node-fetch';

async function createCheckout() {
    try {
        const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sup_sk_22VrWyDuMwDQR8kO3p67r2iTAV4DETm6v',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                checkout_reference: 'CO746453',
                amount: 10,
                currency: 'EUR',
                merchant_code: 'MBDQ4KSJ',
                description: 'Sample one-time payment',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error creating checkout: ${JSON.stringify(data)}`);
        }

        console.log('Checkout created successfully:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

createCheckout();
