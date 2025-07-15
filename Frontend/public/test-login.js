console.log('Setting up test user token...');

// Token for test@example.com
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTI1OTA4MjcsImV4cCI6MTc1MjYwNTIyN30.gnBfaREWjJPSN5p1wXTEGQLKYrt-LtYf3S9hzsciO8E';

localStorage.setItem('token', token);

console.log('Token set! You can now navigate to /dashboard');
console.log('Test user: Test User (test@example.com)');
console.log('Has: 1 team, 1 event, 1 friend');

// Redirect to dashboard
window.location.href = '/dashboard';
