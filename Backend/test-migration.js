// Simple test script to verify migration results
require('dotenv').config();

const mongoose = require("mongoose");

// Use environment variables for MongoDB connection
const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://mcplustexturepack:6BV8j5QJWAxy5va@cluster0.528peek.mongodb.net/?retryWrites=true&w=majority";

// Load all the models
require("./sportsDetails");

const Sports = mongoose.model("SportsTypes");

async function testMigration() {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🔗 Connected to database");

    // Test 1: Check if sports data exists
    const sports = await Sports.find();
    console.log(`\n📊 Sports in database: ${sports.length}`);
    
    sports.forEach((sport, index) => {
      console.log(`   ${index + 1}. ${sport.name} - ${sport.description.substring(0, 50)}...`);
    });

    // Test 2: Check for specific sports
    const expectedSports = ['Football', 'Basketball', 'Tennis', 'Cricket'];
    console.log('\n✅ Verifying expected sports exist:');
    
    for (const sportName of expectedSports) {
      const sport = await Sports.findOne({ name: sportName });
      if (sport) {
        console.log(`   ✓ ${sportName} found (ID: ${sport._id})`);
      } else {
        console.log(`   ✗ ${sportName} NOT found`);
      }
    }

    // Test 3: Database collections summary
    console.log('\n📋 Database collections summary:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`   ${collection.name}: ${count} documents`);
    }

    console.log('\n🎉 Migration verification completed successfully!');

  } catch (error) {
    console.error('❌ Migration verification failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testMigration();
