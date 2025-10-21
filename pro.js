import fetch from 'node-fetch';

async function updateCheckout(checkoutId) {
    try {
        const url = `https://api.sumup.com/v0.1/checkouts/${checkoutId}`;

        const body = {
            checkout_reference: 'CO746453451761048954993',
            amount: 10.1,
            currency: 'EUR',
            merchant_code: 'MDC6SX3K',
            // merchant_code: 'MH4H92C7',
            description: 'Purchase',
            return_url: 'http://example.com',
            status: 'PENDING',
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                // 'Authorization': 'Bearer sup_sk_22VrWyDuMwDQR8kO3p67r2iTAV4DETm6v',
                'Authorization': 'Bearer sup_sk_qdnGVGuhF4yLIYNAdkSRcXluAmnIqLbK4',
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
updateCheckout('69b54e0e-dc01-49c0-bd79-8e79c62cc80a');
