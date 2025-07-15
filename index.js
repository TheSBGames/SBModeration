require("dotenv").config();
require("./keep_alive"); // Keep-alive web server

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

// Collections
client.commands = new Collection();       // Slash commands
client.prefixCommands = new Collection(); // Prefix commands
client.cooldowns = new Collection();      // Cooldowns

// Load handlers
["commandHandler", "eventHandler"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Login
client.login(process.env.TOKEN);
