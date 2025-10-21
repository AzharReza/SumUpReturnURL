import dns from 'node:dns';

dns.resolve('api.sumup.com', 'A', (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Error:', err);
        return;
    }
    console.log('Resolved IPs:', addresses);
});