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
                checkout_reference: 'CO74645345' + Date.now(),
                amount: 10,
                currency: 'EUR',
                merchant_code: 'MBDQ4KSJ',
                description: 'Sample one-time payment',
                return_url: 'https://yourdomain.com/thankyou', // Required for checkout_url
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error creating checkout: ${JSON.stringify(data)}`);
        }

        // ✅ This is the payment URL
        console.log('Checkout created successfully:');
        console.log('Checkout DATA:', data);
        console.log('Checkout URL:', data.checkout_url);

        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

createCheckout();
