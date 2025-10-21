import fetch from 'node-fetch';

async function updateCheckout(checkoutId) {
    try {
        const url = `https://api.sumup.com/v0.1/checkouts/${checkoutId}`;

        const body = {
            checkout_reference: 'CO746453451761047582736',
            amount: 10.1,
            currency: 'EUR',
            merchant_code: 'MH4H92C7',
            description: 'Purchase',
            return_url: 'http://example.com',
            status: 'PENDING',
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer sup_sk_22VrWyDuMwDQR8kO3p67r2iTAV4DETm6v',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error updating checkout: ${JSON.stringify(data)}`);
        }

        console.log('Checkout updated successfully:', data);

        // If checkout_url is present, you can use it
        console.log('Checkout URL:', data.checkout_url || `https://payment.sumup.com/checkout/v1/${checkoutId}`);

        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
updateCheckout('ae679fa5-462b-42cb-9f38-7c68e7fb03e5');
