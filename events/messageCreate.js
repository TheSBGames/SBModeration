const { Events, EmbedBuilder } = require('discord.js');
const leveling = require('../utils/leveling');
const automod = require('../utils/automod');
const autoresponder = require('../utils/autoresponder');
const modmailSchema = require('../models/modmail');
const chatgptChannelSchema = require('../models/chatgptChannels');
const { askChatGPT } = require('../utils/ask-gpt');
const xpHandler = require('../components/leveling/xpHandler');

xpHandler(client, message);
module.exports = {
  name: Events.MessageCreate,

  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const { guild, member, content } = message;

    // 🔒 ModMail incoming from DM
    if (message.channel.type === 1) {
      const modmailData = await modmailSchema.findOne({ userId: message.author.id });
      if (!modmailData) return;

      const guild = client.guilds.cache.get(modmailData.guildId);
      const modmailChannel = guild.channels.cache.get(modmailData.channelId);

      if (!modmailChannel) return;

      const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(message.content || '*(no content)*')
        .setColor(0x00BFFF)
        .setFooter({ text: `User ID: ${message.author.id}` });

      await modmailChannel.send({ embeds: [embed] });
      return;
    }

    // ⚙️ Automoderation
    await automod(message);

    // 🆙 Leveling system
    await leveling(message);

    // 🤖 Autoresponder
    await autoresponder(message);

    // 💬 ChatGPT Channel Auto-Response
    const chatGPTConfig = await chatgptChannelSchema.findOne({ guildId: guild.id });
    if (
      chatGPTConfig &&
      chatGPTConfig.channels.includes(message.channel.id) &&
      !message.content.startsWith('/')
    ) {
      const response = await askChatGPT(content, message.author.id);
      if (response) {
        message.channel.sendTyping();
        return message.reply({ content: response });
      }
    }
  },
};
