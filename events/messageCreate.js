const { Events, PermissionsBitField } = require("discord.js");
const Level = require("../models/Level");
const AutoResponder = require("../models/AutoResponder");
const AutoModSettings = require("../models/AutoMod");
const ChatGPTChannel = require("../models/ChatGPTChannel");
const handleAutomod = require("../utils/automodHandler");
const { generateGPTReply } = require("../utils/chatgpt");
const prefix = "&"; // Default prefix (can be dynamic per guild if desired)

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    // Ignore bot and system messages
    if (message.author.bot || message.system) return;

    // --------- AUTORESPONDER ---------
    const responders = await AutoResponder.find({ guildId: message.guild?.id });
    for (const res of responders) {
      if (message.content.toLowerCase().includes(res.trigger.toLowerCase())) {
        message.channel.send(res.response);
        break;
      }
    }

    // --------- AUTOMOD ---------
    if (message.guild) {
      const settings = await AutoModSettings.findOne({ guildId: message.guild.id });
      if (settings) {
        const bypassRole = message.member.roles.cache.find(role => role.name === settings.bypassRole);
        const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
        if (!bypassRole && !isAdmin) {
          await handleAutomod(message, settings, client);
        }
      }
    }

    // --------- LEVELING SYSTEM (messages) ---------
    if (message.guild) {
      let data = await Level.findOne({ guildId: message.guild.id, userId: message.author.id });
      if (!data) {
        data = new Level({ guildId: message.guild.id, userId: message.author.id, xp: 0, level: 1 });
      }
      data.xp += Math.floor(Math.random() * 10) + 5;
      const needed = data.level * 100;
      if (data.xp >= needed) {
        data.level++;
        data.xp = 0;
        message.channel.send(`${message.author}, you leveled up to **Level ${data.level}**! 🎉`);
      }
      await data.save();
    }

    // --------- CHATGPT CHANNELS (no prefix needed) ---------
    if (message.guild) {
      const chatChannels = await ChatGPTChannel.find({ guildId: message.guild.id });
      const isGPTChannel = chatChannels.some(c => c.channelId === message.channel.id);
      if (isGPTChannel) {
        await message.channel.sendTyping();
        const reply = await generateGPTReply(message.content, message.author.id);
        return message.reply({ content: reply });
      }
    }

    // --------- PREFIX COMMANDS ---------
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    const command = client.prefixCommands.get(cmdName);
    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (err) {
      console.error(`❌ Command Error: ${err}`);
      message.reply("There was an error executing that command.");
    }
  }
};
