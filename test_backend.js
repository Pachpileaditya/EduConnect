const http = require('http');

// Test if backend is running
const testBackend = () => {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/login',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Backend Status: ${res.statusCode}`);
    if (res.statusCode === 405) {
      console.log('✅ Backend is running! (Method not allowed is expected for GET on login endpoint)');
    } else {
      console.log('❌ Backend is not responding correctly');
    }
  });

  req.on('error', (e) => {
    console.log('❌ Backend is not running or not accessible');
    console.log('Error:', e.message);
  });

  req.end();
};

console.log('Testing backend connection...');
testBackend();



