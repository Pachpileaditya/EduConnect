const http = require('http');

// Test backend connectivity
const testBackend = () => {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/test',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`✅ Backend Status: ${res.statusCode}`);
      console.log(`✅ Response: ${data}`);
    });
  });

  req.on('error', (e) => {
    console.log('❌ Backend Error:', e.message);
  });

  req.end();
};

console.log('Testing backend connection...');
testBackend();

