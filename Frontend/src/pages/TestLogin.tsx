import React, { useEffect } from 'react';

export function TestLogin() {
  useEffect(() => {
    // Token for john.doe@example.com
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzUyNTkwMzU2LCJleHAiOjE3NTI2MDQ3NTZ9.9wAxcExisLTv02FT__hotzSJjOKwESFrgZZZnMDplIs';
    
    localStorage.setItem('token', token);
    console.log('Token set:', token);
    
    // Redirect to dashboard after a brief delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Setting up test user...</h1>
      <p>You will be redirected to the dashboard shortly.</p>
      <p>Test user: John Doe (john.doe@example.com)</p>
      <p>Has: 1 team, 1 event, 1 friend</p>
    </div>
  );
}
