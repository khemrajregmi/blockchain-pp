// Migration script to populate initial data for Playmate application
require('dotenv').config();

const mongoose = require("mongoose");

// Use environment variables for MongoDB connection
const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://mcplustexturepack:6BV8j5QJWAxy5va@cluster0.528peek.mongodb.net/?retryWrites=true&w=majority";

// Load all the models
require("./userDetails");
require("./teamDetails");
require("./teamMembers");
require("./sportsDetails");
require("./imageDetails");
require("./userFriends");
require("./eventDetails");
require("./userEvents");

const Sports = mongoose.model("SportsTypes");

// Connect to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to database");
    runMigrations();
  })
  .catch((e) => {
    console.log("Database connection error:", e);
    process.exit(1);
  });

// Initial sports data
const initialSportsData = [
  {
    name: "Football",
    description: "Association football, also known as soccer, is a team sport played between two teams of eleven players.",
    profilePic: "https://example.com/football.jpg"
  },
  {
    name: "Basketball",
    description: "Basketball is a team sport in which two teams of five players each attempt to score points by shooting a ball through a hoop.",
    profilePic: "https://example.com/basketball.jpg"
  },
  {
    name: "Tennis",
    description: "Tennis is a racket sport that can be played individually or between two teams of two players each.",
    profilePic: "https://example.com/tennis.jpg"
  },
  {
    name: "Cricket",
    description: "Cricket is a bat-and-ball game played between two teams of eleven players on a field.",
    profilePic: "https://example.com/cricket.jpg"
  },
  {
    name: "Baseball",
    description: "Baseball is a bat-and-ball game played between two teams of nine players each.",
    profilePic: "https://example.com/baseball.jpg"
  },
  {
    name: "Volleyball",
    description: "Volleyball is a team sport in which two teams of six players are separated by a net.",
    profilePic: "https://example.com/volleyball.jpg"
  },
  {
    name: "Rugby",
    description: "Rugby is a team sport played with an oval ball by two teams of fifteen players each.",
    profilePic: "https://example.com/rugby.jpg"
  },
  {
    name: "Hockey",
    description: "Hockey is a sport in which two teams play against each other by trying to maneuver a ball or puck into the opponent's goal.",
    profilePic: "https://example.com/hockey.jpg"
  }
];

async function runMigrations() {
  try {
    console.log("Starting migrations...");

    // Check if sports data already exists
    const existingSports = await Sports.find();
    
    if (existingSports.length === 0) {
      console.log("No sports data found. Creating initial sports data...");
      
      // Insert initial sports data
      await Sports.insertMany(initialSportsData);
      console.log(`✅ Successfully created ${initialSportsData.length} sports types`);
    } else {
      console.log(`ℹ️  Sports data already exists (${existingSports.length} records found)`);
      
      // Optionally add any missing sports
      for (const sport of initialSportsData) {
        const existingSport = await Sports.findOne({ name: sport.name });
        if (!existingSport) {
          await Sports.create(sport);
          console.log(`✅ Added missing sport: ${sport.name}`);
        }
      }
    }

    // Display current database collections and their counts
    console.log("\n📊 Current database status:");
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`   ${collection.name}: ${count} documents`);
    }

    console.log("\n🎉 Migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Migration interrupted');
  mongoose.connection.close();
  process.exit(0);
});
