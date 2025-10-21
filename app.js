import fetch from 'node-fetch';

async function createCheckout(retries = 3, delay = 1000) {
    const url = 'https://api.sumup.com/v0.1/checkouts';
    const body = {
        checkout_reference: 'CO74645345',
        amount: 10,
        currency: 'EUR',
        merchant_code: 'MBDQ4KSJ',
        description: 'Sample one-time payment',
    };
    const headers = {
        'Authorization': 'Bearer sup_sk_22VrWyDuMwDQR8kO3p67r2iTAV4DETm6v',
        'Content-Type': 'application/json',
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`API Error: ${JSON.stringify(data)}`);
            }

            console.log('✅ Checkout created successfully:', data);
            return data;

        } catch (error) {
            console.error(`⚠️ Attempt ${attempt} failed:`, error.message);

            // If last attempt, throw
            if (attempt === retries) {
                throw new Error(`All ${retries} attempts failed: ${error.message}`);
            }

            // Wait before retrying (exponential backoff)
            await new Promise(res => setTimeout(res, delay * attempt));
        }
    }
}

// Run the function
createCheckout().catch(err => console.error('❌ Final Error:', err.message));
