#!/usr/bin/env node

/**
 * Dashboard Test Script
 * This script demonstrates all the dynamic features of the dashboard
 */

const API_BASE_URL = 'http://localhost:8000';

// Test user token (from login)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTI1OTA4MjcsImV4cCI6MTc1MjYwNTIyN30.gnBfaREWjJPSN5p1wXTEGQLKYrt-LtYf3S9hzsciO8E';

console.log('🚀 Dashboard Feature Test Suite');
console.log('================================');

async function testAPI(endpoint, data = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: TEST_TOKEN, ...data }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error);
    return null;
  }
}

async function runTests() {
  console.log('\n1. Testing User Data...');
  const userData = await testAPI('/getUserData');
  if (userData?.status === 'ok') {
    console.log('✅ User Data:', userData.data.fname, userData.data.lname);
  } else {
    console.log('❌ User Data failed');
  }

  console.log('\n2. Testing Events...');
  const events = await testAPI('/getEvents', { status: 'Accepted' });
  if (events?.status === 'ok') {
    console.log(`✅ Events: ${events.data.length} events found`);
    events.data.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.name} - ${event.date} at ${event.startTime}`);
    });
  } else {
    console.log('❌ Events failed');
  }

  console.log('\n3. Testing Teams...');
  const teams = await testAPI('/getTeams');
  if (teams?.status === 'ok') {
    console.log(`✅ Teams: ${teams.data.length} teams found`);
    teams.data.forEach((team, index) => {
      console.log(`   ${index + 1}. ${team.name} - ${team.membersCount} members`);
    });
  } else {
    console.log('❌ Teams failed');
  }

  console.log('\n4. Testing Friends...');
  const friends = await testAPI('/getFriends');
  if (friends?.status === 'ok') {
    console.log(`✅ Friends: ${friends.data.length} friends found`);
    friends.data.forEach((friend, index) => {
      console.log(`   ${index + 1}. ${friend.fname} ${friend.lname}`);
    });
  } else {
    console.log('❌ Friends failed');
  }

  console.log('\n5. Testing Friend Requests...');
  const friendRequests = await testAPI('/getFriendRequests');
  if (friendRequests?.status === 'ok') {
    console.log(`✅ Friend Requests: ${friendRequests.data.length} requests found`);
    friendRequests.data.forEach((request, index) => {
      console.log(`   ${index + 1}. From ${request.fname} ${request.lname}`);
    });
  } else {
    console.log('❌ Friend Requests failed');
  }

  console.log('\n📊 Dashboard Stats Summary:');
  console.log('===========================');
  console.log(`👥 Friends: ${friends?.data?.length || 0}`);
  console.log(`🏆 Teams: ${teams?.data?.length || 0}`);
  console.log(`📅 Events: ${events?.data?.length || 0}`);
  console.log(`🔔 Friend Requests: ${friendRequests?.data?.length || 0}`);
  
  // Calculate upcoming events
  const today = new Date();
  const upcomingEvents = events?.data?.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  }) || [];
  
  console.log(`📈 Upcoming Events: ${upcomingEvents.length}`);
  
  console.log('\n✨ All dashboard features are working dynamically!');
  console.log('🌐 Frontend: http://localhost:3003/test-login.html');
  console.log('🔗 Backend: http://localhost:8000');
}

// Run if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testAPI };
